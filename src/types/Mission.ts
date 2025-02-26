export interface Mission {
    id: string;
    owner: string;
    leader: string;
    currentStep: string;
    members?: string[];
}