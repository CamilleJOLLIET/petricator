import { Instruction } from "./Instruction";
import { Mission } from "./Mission";
import { Target } from "./Target";

export interface Mh {
    targets: Target[];
    instructions: Instruction[];
    missions: Mission[];
}