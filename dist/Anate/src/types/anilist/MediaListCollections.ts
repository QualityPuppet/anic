import { EnumType, jsonToGraphQLQuery, VariableType } from "json-to-graphql-query";
import { StatusTypes } from "./StatusTypes";
import localforage from "localforage";

export interface IMediaListCollection {
    lists: MediaList[]
}

// why everything is so damned nested is beyond me :(
export interface MediaList {
    name: string;
    entries: Entry[];
}

export interface Entry {
    media: Media
}

export interface Media {
    id: number
    title: Title
    status: string
}

export interface Title {
    english: string;
    romaji: string;
}

export class MediaListCollection implements IMediaListCollection {
    username: string;
    lists: MediaList[] = [];
    private storeKey = () => "listStore:" + this.username;

    constructor(username: string) {
        this.lists = [];
        this.username = username;
    }

    async saveLocal() {
        localforage.setItem(this.storeKey(), this.lists)
    }

    async getLocal(loadFromRemoteFallback = true): Promise<MediaList[]> {
        const local: MediaList[] | null = await localforage.getItem(this.storeKey());
        if (!local) {
            if (!loadFromRemoteFallback) {
                return [];
            }

            const list = await this.getLists();
            await localforage.setItem(this.storeKey(), list);
            return list;
        }
        if (this.lists.length == 0) {
            this.lists = local;
        }
        return local;
    }

    async getLists() {
        if (this.lists.length == 0){
            this.lists = await this.populateLists();
        }
        return this.lists;
    }

    async getFlatList(local: boolean = false) {
        return local ? MediaListCollection.flattenLists(await this.getLocal()) : MediaListCollection.flattenLists(await this.getLists())
    }

    static flattenLists = (lists: MediaList[]) =>
        lists.flatMap((l) => {
            l.entries.map((e) => {
                e.media.status = l.name
            })
            return l.entries;
        })
    

    private async populateLists() {
            // Interactive reference - https://anilist.co/graphiql - IMPORTANT, BECAUSE GRAPHQL IS CONFUSING
            const queryObj = {
                query: {
                    __variables: { username: 'String' },
                    MediaListCollection: {
                        __args: {
                            userName: new VariableType('username'),
                            type: new EnumType('ANIME'),
                            status_in: [
                                new EnumType(StatusTypes.Completed),
                                new EnumType(StatusTypes.Current)
                            ]
                        },
                        lists: {
                            // this is the name of the list, which in this case is divided into statuses
                            name: true,
                            // The data we pull back for each show
                            // Media is nested because it's the actual show data, which is an entirely different object.
                            // the personal data like status and score is held at the "entries" level, except for status, apparently, which is
                            // deprecated. probably due to the top level status.
                            entries: {
                                media: {
                                    id: true,
                                    title: { english: true, romaji: true },
                                    episodes: true
                                }
                            }
                        }
                    }
                }
            };

            const payload = {
                query: jsonToGraphQLQuery(queryObj), // Automatically turns it into a valid string
                variables: { username: this.username }
            };

            const shows = await fetch('https://graphql.anilist.co', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            return (await shows.json()).data.MediaListCollection.lists as MediaList[];
    }
}

