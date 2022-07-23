import { ConnectionPool } from "../logic/connections/ConnectionPool";
import { ConnectionType, IConnection } from "../logic/store/IConnection";
import { Store } from "../logic/store/Store";
import { IConnectionItem, ProviderType } from "./models/IConnectionItem";
import { assertUnreachable } from "../helpers";
import { IChannel } from "../logic/connections/models/IChannel";
import { IMessage } from "../logic/models/IMessage";

export class ConnectionFacade {
  constructor(private store: Store, private connectionPool: ConnectionPool) {}

  async getChannelsByConnectionId(id: string): Promise<IChannel[]> {
    const activeConnection = this.connectionPool.getByConnectionId(id);
    return await activeConnection.getChannels();
  }

  getMessages(connectionId: string, name: string, queueSubType: string): IMessage[] {
    return [{body: "test"}];
  }

  getConnections(): IConnectionItem[] {
    const items = this.store.getConnections();
    return items.map((c) => ({
      id: c.id,
      name: c.name,
      providerType: this.mapType(c.type),
      conectionType: c.type,
    }));
  }

  private mapType(connectionType: ConnectionType): ProviderType {
    switch (connectionType) {
      case "ServiceBusConnectionString":
        return "ServiceBus";
    }
    return assertUnreachable(connectionType);
  }
}
