// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { FPTAppMapper } from './app/FPTAppMapper';
import { DotNetCoreFPTApp } from './app/DotNetCoreFPTApp';
import { promisify } from 'util';
import { exec } from 'child_process';
import * as path from "path";
import { ILevel } from './models/ILevel';
import {Marked} from "marked-ts";
import { ViewModel } from './ViewModel';
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
	let vm = new ViewModel(context,core);
	vm.startApp();
}

// this method is called when your extension is deactivated
export function deactivate() { }
