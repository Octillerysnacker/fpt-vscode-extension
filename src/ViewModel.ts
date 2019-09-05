import { ExtensionContext } from "vscode";
import { FPTAppMapper } from "./app/FPTAppMapper";
import * as vscode from "vscode";
import { ILevel } from "./models/ILevel";
import * as path from "path";
import { Marked } from "marked-ts";

export class ViewModel {
    private context: ExtensionContext;
    private core: FPTAppMapper;
    constructor(context: ExtensionContext, core: FPTAppMapper) {
        this.context = context;
        this.core = core;
        this.registerCommands();
    }
    public startApp = async () => {
        let fptDotJson: vscode.TextDocument | undefined;
        try {
            let rootFolderPath: vscode.Uri;
            if (vscode.workspace.workspaceFolders !== undefined) {
                rootFolderPath = vscode.workspace.workspaceFolders[0].uri;

                fptDotJson = await vscode.workspace.openTextDocument(path.join(rootFolderPath.path, "fpt.json"));
                let fptSettings = JSON.parse(fptDotJson.getText());
                let user = this.getCurrentUser();
                if (fptSettings.level !== undefined && typeof fptSettings.level === "string" && user !== undefined) {
                    this.openInstructions(fptSettings.level, user);
                }
            }
        } catch (e) {
            console.error(e);
        }
    }
    private registerCommands = () => {
            this.registerCommand("fpt.openLevel", this.openLevelProjectFolder);
            this.registerCommand("fpt.userFacing.openLevel", this.openLevelProjectFolderUserFacing);
            this.registerCommand("fpt.openInstructions",this.openInstructions);
            this.registerCommand("fpt.userFacing.openInstructions",this.openInstructionsUserFacing);
            this.registerCommand("fpt.verify",this.verify);
            
    }
    public openLevelProjectFolder = async (levelId: string, user: string) => {
        let path = await this.core.openLevel(levelId, user);
        vscode.commands.executeCommand("vscode.openFolder", vscode.Uri.file(path));
    }
    public openLevelProjectFolderUserFacing = async () => {
        let levelId = await this.quickPickLevel();
        let user = await this.quickInputUsername();
        if (levelId !== undefined && user !== undefined) {
            await this.openLevelProjectFolder(levelId, user);
        }
    }
    public openInstructionsUserFacing = async () => {
        let levelId = await this.quickPickLevel();
        let user = await this.quickInputUsername();
        if (levelId !== undefined && user !== undefined) {
            await this.openInstructions(levelId, user);
        }
    }
    public openInstructions = async (levelId: string, user: string) => {
        let path = this.core.getInstructions(levelId);

        let panel = vscode.window.createWebviewPanel("FPT", "Instructions", vscode.ViewColumn.Two,{enableCommandUris:true});

        let html = `
        <!DOCTYPE html>
        <body>
        ${Marked.parse((await vscode.workspace.openTextDocument(await path)).getText())}
        <a href='command:fpt.verify?${encodeURIComponent(JSON.stringify([levelId, user]))}'>Verify Code</a>
        </body>
        `;

        panel.webview.html = html;
    }
    public quickPickLevel = async (placeHolder: string = "Choose a level") => {
        let levels = await this.core.getLevels();
        let items = levels.map((value: ILevel): vscode.QuickPickItem => {
            return {
                label: value.Name,
                detail: value.Id
            };
        });
        let item = await vscode.window.showQuickPick(items, { canPickMany: false, placeHolder: placeHolder });
        if (item !== undefined && item.detail !== undefined) {
            return item.detail;
        }
    }
    public quickInputUsername = async () => {
        let user = await vscode.window.showInputBox({ prompt: "Enter username" });
        await this.context.globalState.update("user", user);
        return user;
    }
    public getCurrentUser = () => {
        return this.context.globalState.get<string>("user");
    }
    public verify = async (levelId: string, user: string) => {
        let result = await this.core.verify(levelId,user);
        if(result.Success){
            let message = "Congratulations! Your code passed.";
            console.log(message);
            vscode.window.showInformationMessage(message);
        }else{
            result.Diagnostics.forEach(diagnostic => {
                console.error(diagnostic.Message);
                vscode.window.showErrorMessage(diagnostic.Message);
            });
        }
    }
    private registerCommand = (command: string, callback: (...args : any[]) => any) => {
        this.context.subscriptions.push(vscode.commands.registerCommand(command,callback));
    }
}