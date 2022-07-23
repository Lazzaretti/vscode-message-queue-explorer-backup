import { IChannel } from "./IChannel";
import { ISavableResponse } from "./ISavableResponse";

export interface IActiveConnection {
  getSaveableConnection(): Promise<ISavableResponse>;
  getChannels(): Promise<IChannel[]>;
  close(): Promise<void>;
}
