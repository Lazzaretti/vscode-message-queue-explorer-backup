import { ConnectionType, IConnection } from "../logic/store/IConnection";
import { Store } from "../logic/store/Store";
import { IConnectionItem, ProviderType } from "./models/IConnectionItem";

export class ConnectionFacade {
    constructor(private store: Store){}

    getConnections() : IConnectionItem[] {
        const items = this.store.getConnections();
        return items.map(c => ({name: c.name, type: this.mapType(c.type)}));
    }

    private mapType(connectionType: ConnectionType): ProviderType {
        switch (connectionType){
            case "ServiceBusConnectionString":
                return "ServiceBus";
        }
        return assertUnreachable(connectionType);
    }
}

function assertUnreachable(x: never): never {
    throw new Error("Didn't expect to get here");
}
