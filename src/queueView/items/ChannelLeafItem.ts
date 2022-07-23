import * as vscode from "vscode";
import { ChannelType, QueueSubType } from "../../logic/connections/models/IChannel";
import { MQTreeItem } from "./MQTreeItem";

export class ChannelLeafItem extends MQTreeItem {
  constructor(
    public readonly channelType: ChannelType,
    public readonly queueSubType: QueueSubType,
    public readonly name: string
  ) {
    super(queueSubType, vscode.TreeItemCollapsibleState.None);
  }
}
