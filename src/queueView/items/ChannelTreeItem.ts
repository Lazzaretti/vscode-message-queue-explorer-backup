import * as vscode from "vscode";
import * as path from "path";
import { MQTreeItem } from "./MQTreeItem";
import {
  ChannelStatus,
  ChannelType,
} from "../../logic/connections/models/IChannel";

export class ChannelTreeItem extends MQTreeItem {
  constructor(
    public name: string,
    public status: ChannelStatus,
    public channelType: ChannelType,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public deadLetterMessageCount?: number,
    public totalMessageCount?: number
  ) {
    const label = `${name} (${totalMessageCount === undefined ? '' : totalMessageCount}/${
      deadLetterMessageCount === undefined ? '' : deadLetterMessageCount
    })`;
    super(label, collapsibleState);

    this.tooltip = `type: ${channelType}, status: ${status}`;
    this.description = "";
  }

  iconPath = {
    light: path.join(
      __filename,
      "..",
      "..",
      "resources",
      "light",
      "dependency.svg"
    ),
    dark: path.join(
      __filename,
      "..",
      "..",
      "resources",
      "dark",
      "dependency.svg"
    ),
  };

  contextValue = "ChannelTreeItem";
}
