export type ConnectionType = "ServiceBusConnectionString";

export interface IConnection {
    type: ConnectionType;
    name: string;
    data: string;
}
