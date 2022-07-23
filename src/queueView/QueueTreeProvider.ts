import * as vscode from "vscode";
import { ConnectionFacade } from "../facade/ConnectionFacade";
import { IConnectionItem } from "../facade/models/IConnectionItem";
import ConnectionItem from "./items/ConnectionItem";
import { MQItem } from "./items/MQItem";
import { QueueTreeItem } from "./items/QueueTreeItem";

export class QueueTreeProvider
  implements vscode.TreeDataProvider<MQItem>
{
  public static readonly viewId = "message-queue-explorer.queueTreeView";
  private _onDidChangeTreeData: vscode.EventEmitter<
  MQItem | undefined | void
  > = new vscode.EventEmitter<MQItem | undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<MQItem | undefined | void> =
    this._onDidChangeTreeData.event;

  constructor(private connectionFacade:ConnectionFacade) {}

  refresh(): void {
		this._onDidChangeTreeData.fire();
	}

  getTreeItem(element: QueueTreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: QueueTreeItem): Thenable<MQItem[]> {
    if (element) {
      return Promise.resolve([
        new QueueTreeItem(
          "test elem",
          vscode.TreeItemCollapsibleState.None
        ),
      ]);
    } else {
      const connections = this.connectionFacade.getConnections();
      return Promise.resolve(connections.map(c => this.mapItem(c)));
    }
  }

  mapItem(item: IConnectionItem): MQItem {
    return new ConnectionItem(item.name,  vscode.TreeItemCollapsibleState.Collapsed);
  }
}
