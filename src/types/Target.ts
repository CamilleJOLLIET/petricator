export interface Targets {
    targets: Target[];
}

export interface Target {
    id: string;
    name: string;
    position: string;
    details?: string;
}