// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { FPTAppMapper } from './FPTAppMapper';
import { DotNetCoreFPTApp } from './DotNetCoreFPTApp';
import { promisify } from 'util';
import { exec } from 'child_process';
import * as path from "path";
import { ILevel } from './ILevel';
import {Marked} from "marked-ts";
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "fpt-extension" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.helloWorld', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World!');
	});

	context.subscriptions.push(disposable);

	let core = new FPTAppMapper(new DotNetCoreFPTApp(promisify(exec),context.asAbsolutePath(path.join("core","FPT.Core.MainApp.dll")),context.extensionPath));
	context.subscriptions.push(
		vscode.commands.registerCommand("fpt.extension.userFacing.getLevels", async () =>{
			vscode.window.showInformationMessage(JSON.stringify(await core.getLevels()));
		}),
		vscode.commands.registerCommand("fpt.extension.userFacing.openLevel", async()=>{
			let levels = core.getLevels();
			let user = await vscode.window.showInputBox({prompt:"Enter username"});
			let items = (await levels).map((value:ILevel):vscode.QuickPickItem => {
				return {
					label:value.Name,
					detail:value.Id
				};
			});
			let item = await vscode.window.showQuickPick(items,{canPickMany: false,placeHolder:"Choose a level"});
			if(item !== undefined && item.detail !== undefined && user !== undefined){
				vscode.window.showInformationMessage(await core.openLevel(item.detail,user));
			}
		}),
		vscode.commands.registerCommand("fpt.extension.userFacing.getInstructions",async () =>{
			let levels = await core.getLevels();
			let items = levels.map((value:ILevel):vscode.QuickPickItem => {
				return {
					label:value.Name,
					detail:value.Id
				};
			});
			let item = await vscode.window.showQuickPick(items,{canPickMany : false,placeHolder: "Choose a level for instructions"});
			if(item !== undefined && item.detail !== undefined){
				let path = core.getInstructions(item.detail);
				let panel = vscode.window.createWebviewPanel("FPT","Instructions", vscode.ViewColumn.Two); 
				panel.webview.html = Marked.parse((await vscode.workspace.openTextDocument(await path)).getText());
			}
		}),
		vscode.commands.registerCommand("fpt.extension.userFacing.verify",async () =>{
			let user = await vscode.window.showInputBox({prompt: "Enter a user to verify:"});
			let levels = await core.getLevels();
			let items = levels.map((value:ILevel):vscode.QuickPickItem =>{
				return {
					label:value.Name,
					detail:value.Id
				};
			});
			let item = await vscode.window.showQuickPick(items,{canPickMany : false,placeHolder: "Choose a level for instructions"});
			if(item !== undefined && item.detail !== undefined && user !== undefined){
				let result = await core.verify(item.detail,user);
				vscode.window.showInformationMessage(JSON.stringify(result));
			}
		})
	);
}

// this method is called when your extension is deactivated
export function deactivate() { }
