// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { DotNetCoreFPTAppMapper } from './DotNetCoreFPTAppMapper';
import * as path from 'path';
import { promisify } from 'util';
import { exec } from 'child_process';
import { parse } from 'url';
import { stringify } from 'querystring';
import { isWhitespace } from './FPTUtil';

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

	let promisifiedExec = promisify(exec);
	let mapper = new DotNetCoreFPTAppMapper(path.resolve("C:\\Users\\ottom\\Desktop\\vscode\\FPT\\FPT\\FPT.Core.MainApp\\bin\\Release\\netcoreapp2.2\\publish","FPT.Core.MainApp.dll"),promisifiedExec,context.extensionPath);

	context.subscriptions.push(
		vscode.commands.registerCommand('fpt.extension.getLevels',async () =>{
			try{
				vscode.window.showInformationMessage(JSON.stringify(await mapper.getLevels()));
			}catch(e){
				console.error(e);
			}
		}),
		vscode.commands.registerCommand("fpt.extension.openLevel",async ()=>{
			try{
				let levels  = mapper.getLevels();
				let user = await vscode.window.showInputBox({prompt:"Type username"});
				let items : vscode.QuickPickItem[] = (await levels).map((value):vscode.QuickPickItem=>{
					return {label:value.Name,detail:value.Id};
				});
				let level = await vscode.window.showQuickPick(items,{canPickMany:false,});
				if(level !== undefined && level.detail !== undefined && !isWhitespace(level.detail) && user !== undefined && !isWhitespace(user)){
					let projectFolder = await mapper.openLevel(level.detail,user);
					vscode.commands.executeCommand("vscode.openFolder",vscode.Uri.file(projectFolder));
				}else{
					vscode.window.showErrorMessage("Boi. Enter shit.");
				}
			}catch(e){
				console.error(e);
			}
		})
	);
}

// this method is called when your extension is deactivated
export function deactivate() {}
