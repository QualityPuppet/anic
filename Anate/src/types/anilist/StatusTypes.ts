// oxlint-disable typescript/no-duplicate-enum-values
// I'm using a duplicate enum value on purpose.
export enum StatusTypes {
    Completed = "COMPLETED",
    // Are these the same thing? Yes.
    // Am I stupid enough for CURRENT to confuse me? also yes.
    Current = "CURRENT",
    In_Progress = "CURRENT",
    Dropped = "DROPPED",
    Paused = "PAUSED",
    Planning = "PLANNING",
    Repeating = "REPEATING"
}
