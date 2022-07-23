import * as vscode from "vscode";
import { QueueTreeItem } from "./items/QueueTreeItem";

export class QueueTreeProvider
  implements vscode.TreeDataProvider<QueueTreeItem>
{
  public static readonly viewId = "message-queue-explorer.queueTreeView";
  private _onDidChangeTreeData: vscode.EventEmitter<
    QueueTreeItem | undefined | void
  > = new vscode.EventEmitter<QueueTreeItem | undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<QueueTreeItem | undefined | void> =
    this._onDidChangeTreeData.event;

  constructor() {}

  refresh(): void {
		this._onDidChangeTreeData.fire();
	}

  getTreeItem(element: QueueTreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: QueueTreeItem): Thenable<QueueTreeItem[]> {
    if (element) {
      return Promise.resolve([
        new QueueTreeItem(
          "test elem",
          "",
          vscode.TreeItemCollapsibleState.None,
          {
            command: "extension.openPackageOnNpm",
            title: "",
            arguments: [],
          }
        ),
      ]);
    } else {
      vscode.window.showInformationMessage("Workspace has no package.json");
      return Promise.resolve([
        new QueueTreeItem(
          "test",
          "",
          vscode.TreeItemCollapsibleState.Collapsed,
          {
            command: "extension.openPackageOnNpm",
            title: "",
            arguments: [],
          }
        ),
      ]);
    }
  }
}
