import * as vscode from "vscode";
import * as path from "path";
import { MQTreeItem } from "./MQTreeItem";

export class ConnectionTreeItem extends MQTreeItem {
  constructor(
    public readonly connectionId: string,
    public readonly name: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState
  ) {
	const label = `${name}`;
    super(label, collapsibleState);

	this.iconPath = new vscode.ThemeIcon('plug');
    this.tooltip = label;
    this.description = "";
  }

  contextValue = "ConnectionItem";
}
