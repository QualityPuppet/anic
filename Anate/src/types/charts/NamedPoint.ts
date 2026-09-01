import type { Point } from "chart.js";

export interface NamedPoint extends Point {
    name: string
}