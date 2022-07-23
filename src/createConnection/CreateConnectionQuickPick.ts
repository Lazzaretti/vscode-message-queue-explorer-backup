import { window, commands, ExtensionContext } from 'vscode';

export async function createConnectionQuickPick(){

    const selection = await window.showQuickPick([
        {
            label: 'Service Bus',
            execute: () => window.showInputBox({placeHolder: "connectionString"}),
        }
    ]);
    selection?.execute();
}
