import { ConnectionType } from "../../logic/store/IConnection";

export type ProviderType = "ServiceBus";

export interface IConnectionItem {
    type: ProviderType;
    name: string;
}