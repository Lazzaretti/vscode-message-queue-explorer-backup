import { ServiceBusClient } from "@azure/service-bus";
import { window, commands, ExtensionContext } from "vscode";
import * as vscode from 'vscode';

export async function createConnectionQuickPick() {
  const selection = await window.showQuickPick([
    {
      label: "Service Bus with Connection String",
      execute: async () => {
        const connectionString = await window.showInputBox({
          title: "Add ServiceBus Connection by Connection String",
          placeHolder: "ServiceBus Connection String",
        });
        if (connectionString) {
            vscode.window.withProgress({title: 'try to connect..',location: vscode.ProgressLocation.Notification,}, async () => {
            try{
                const serviceBusClient = new ServiceBusClient(connectionString);
                const name = serviceBusClient.fullyQualifiedNamespace;
                await serviceBusClient.close();
                vscode.window.showInformationMessage(`connected successful to ${name}`);
            }
            catch{
                vscode.window.showErrorMessage("failed to connect");
            }
        });
        }
      },
    },
  ]);
  selection?.execute();
}
