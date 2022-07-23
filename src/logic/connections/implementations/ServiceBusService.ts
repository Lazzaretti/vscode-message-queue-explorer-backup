import { PagedAsyncIterableIterator, PageSettings } from "@azure/core-paging";
import {
  EntitiesResponse,
  QueueProperties,
  ServiceBusAdministrationClient,
  ServiceBusClient,
  TopicProperties,
} from "@azure/service-bus";
import { IActiveConnection } from "../models/IActiveConnection";
import { IChannel } from "../models/IChannel";
import { ISavableResponse } from "../models/ISavableResponse";

export class ServiceBusService implements IActiveConnection {
  private serviceBusClient: ServiceBusClient;
  private serviceBusAdminClient: ServiceBusAdministrationClient;

  constructor(private connectionString: string) {
    this.serviceBusClient = new ServiceBusClient(this.connectionString);
    try {
      this.serviceBusAdminClient = new ServiceBusAdministrationClient(
        this.connectionString
      );
    } catch {
      throw new Error(
        "Managment right is needed -> otherwise queue list is not possible"
      );
    }
  }

  async getSaveableConnection(): Promise<ISavableResponse> {
    const name = this.serviceBusClient.fullyQualifiedNamespace;
    return { name, data: this.connectionString };
  }

  async getChannels(): Promise<IChannel[]> {
    const queuePromise: Promise<IChannel[]> = this.getItemsFromIterator(
      this.serviceBusAdminClient.listQueues()
    ).then((l) =>
      l.map((q) => ({ name: q.name, status: q.status, channelType: "Queue" }))
    );
    const topicPromise: Promise<IChannel[]> = this.getItemsFromIterator(
      this.serviceBusAdminClient.listTopics()
    ).then((l) =>
      l.map(
        (t) =>
          <IChannel>{ name: t.name, status: t.status, channelType: "Topic" }
      )
    );
    const promises = await Promise.all([queuePromise, topicPromise]);
    const channels = promises.flatMap((x) => x);
    await this.updateChannelsRuntimeProperties(channels);
    return channels;
  }

  private async updateChannelsRuntimeProperties(channels: IChannel[]) {
    const queuePromise = channels
      .filter((c) => c.channelType === "Queue")
      .map((q) =>
        this.serviceBusAdminClient
          .getQueueRuntimeProperties(q.name)
          .then((p) => {
            q.deadLetterMessageCount = p.deadLetterMessageCount;
            q.totalMessageCount = p.totalMessageCount;
          })
      );
    const topicPromise = channels
      .filter((c) => c.channelType === "Topic")
      .map((q) =>
        this.serviceBusAdminClient
          .getTopicRuntimeProperties(q.name)
          .then((p) => {
            q.totalMessageCount = p.scheduledMessageCount;
          })
      );
    const promises = await Promise.all([queuePromise, topicPromise]);
    const flatPromises = promises.flatMap((x) => x);
    await Promise.all(flatPromises);
  }

  private async getItemsFromIterator<T extends object>(
    iterator: PagedAsyncIterableIterator<T, EntitiesResponse<T>, PageSettings>
  ): Promise<T[]> {
    const item = await iterator.next();
    if (item.done) {
      return [];
    }
    return [item.value, ...(await this.getItemsFromIterator(iterator))];
  }

  async close() {
    await this.serviceBusClient.close();
  }
}
