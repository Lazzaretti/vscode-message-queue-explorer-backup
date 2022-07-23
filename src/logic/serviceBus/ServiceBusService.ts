import { Store } from "../store/Store";
import { ServiceBusClient } from "@azure/service-bus";

export class ServiceBusService {
  constructor(private store: Store) {}

  async validateAndSaveConnection(connectionString: string): Promise<string> {
    const name = await this.validateConnection(connectionString);
    this.saveConnection(name, connectionString);
    return name;
  }

  private async validateConnection(connectionString: string): Promise<string> {
    const serviceBusClient = new ServiceBusClient(connectionString);
    const name = serviceBusClient.fullyQualifiedNamespace;
    await serviceBusClient.close();
    return name;
  }

  private saveConnection(name: string, connectionString: string) {
    this.store.saveNewConnection({
      type: "ServiceBusConnectionString",
      name: name,
      data: connectionString,
    });
  }
}
