export interface RankNode {
    id: string | number;
    label: string;
    children?: RankNode[];
}
