import { Media } from "../../../src/types/anilist/MediaListCollections";
import { StatusTypes } from "../../../src/types/anilist/StatusTypes";

export const BasicMediaList: Media[] = [
    {
        id: 1,
        title: {
            english: "Frieren: Beyond Journey's End",
            romaji: "Sousou no Frieren"
        },
        status: StatusTypes.Completed
    },
    {
        id: 2,
        title: {
            english: "The Apothecary Diaries",
            romaji: "Kusuriya no Hitorigoto"
        },
        status: StatusTypes.Completed
    },
    {
        id: 3,
        title: { english: "Jujutsu Kaisen", romaji: "Jujutsu Kaisen" },
        status: StatusTypes.Completed
    },
    {
        id: 4,
        title: { english: "BOCCHI THE ROCK", romaji: "ぼっち・ざ・ろっく！" },
        status: StatusTypes.Completed
    },
    {
        id: 5,
        title: {
            english: "Tensura",
            romaji: "Tensei Shitara Suraimu Datta Ken"
        },
        status: StatusTypes.Completed
    },
    {
        id: 6,
        title: { english: "The Saga of Tanya the Evil", romaji: "Youjo Senki" },
        status: StatusTypes.Completed
    }
];

export function ShuffleMediaList(media: Media[]): Media[] {
    // Source - https://stackoverflow.com/a/12646864
    // Posted by Laurens Holst, modified by community. See post 'Timeline' for change history
    // Retrieved 2026-09-06, License - CC BY-SA 4.0
    for (let i = media.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [media[i], media[j]] = [media[j], media[i]];
    }

    return media;
}
