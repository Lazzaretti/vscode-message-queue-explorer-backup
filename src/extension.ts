// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { QueueTreeProvider } from './queueView/QueueTreeProvider';
import { createConnectionQuickPick } from './createConnection/CreateConnectionQuickPick';
import { Store } from './logic/store/Store';
import { ConnectionFacade } from './facade/ConnectionFacade';
import { ConnectionPool } from './logic/connections/ConnectionPool';
import { ConnectionFactory } from './logic/connections/ConnectionFactory';
import { MessagesWebView } from './panels/MessagesWebView';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const store = new Store(context.globalState);
	const connectionFactory = new ConnectionFactory(store);
	const connectionPool = new ConnectionPool(connectionFactory);
	const connectionFacade = new ConnectionFacade(store, connectionPool);

	const queueTreeProvider = new QueueTreeProvider(connectionFacade);
	vscode.window.registerTreeDataProvider(QueueTreeProvider.viewId, queueTreeProvider);

	vscode.commands.registerCommand(`${QueueTreeProvider.viewId}.refresh`, () => queueTreeProvider.refresh());

	context.subscriptions.push(vscode.commands.registerCommand('message-queue-explorer.addConnection', () => createConnectionQuickPick(store)));

	context.subscriptions.push(vscode.commands.registerCommand('message-queue-explorer.openQueue', (args) => {
		const panel = new MessagesWebView(connectionFacade);
		panel.open(args);
	}));

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "message-queue-explorer" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('message-queue-explorer.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from message-queue-explorer!');
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
