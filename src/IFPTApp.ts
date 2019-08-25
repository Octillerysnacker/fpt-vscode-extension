export interface IFPTApp {
    runAsync(...command: string[]): Promise<any>;
}