import { Instruction } from "./Instructions";
import { Target } from "./Target";

export interface Mh {
    targets: Target[];
    instructions: Instruction[];
}