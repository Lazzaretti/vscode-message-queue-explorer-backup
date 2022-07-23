
import { window } from "vscode";
import * as vscode from 'vscode';
import { ServiceBusService } from "../logic/serviceBus/ServiceBusService";
import { Store } from "../logic/store/Store";

export async function createConnectionQuickPick(store: Store) {
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
                const service = new ServiceBusService(store);
                const name = await service.validateAndSaveConnection(connectionString);
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
