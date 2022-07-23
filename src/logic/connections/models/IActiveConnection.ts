import { IMessage } from "../../models/IMessage";
import { IChannel, QueueSubType } from "./IChannel";
import { ISavableResponse } from "./ISavableResponse";

export interface IActiveConnection {
  getSaveableConnection(): Promise<ISavableResponse>;
  peekMessages(queueName: string, queueSubType: QueueSubType, amount?: number): Promise<IMessage[]>;
  getChannels(): Promise<IChannel[]>;
  close(): Promise<void>;
}
