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
		const panel = new MessagesWebView(connectionFacade, context.extensionUri);
		panel.open(args);
	}));
}

// this method is called when your extension is deactivated
export function deactivate() {}
