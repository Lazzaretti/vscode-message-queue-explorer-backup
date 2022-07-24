import exp = require("constants");
import * as vscode from "vscode";
import { ConnectionFacade } from "../facade/ConnectionFacade";
import { QueueSubType } from "../logic/connections/models/IChannel";
import { IMessage } from "../logic/models/IMessage";

export interface IMessagesPanelArgs {
  connectionId: string;
  name: string;
  queueSubType: QueueSubType;
}

export class MessagesWebView {
  public static readonly viewId = "message-queue-explorer.messages";

  private panel?: vscode.WebviewPanel;
  private args?: IMessagesPanelArgs;
  private disposables: vscode.Disposable[] = [];
  private messages: IMessage[] = [];
  private isLoading = true;

  constructor(private connectionFacade: ConnectionFacade) {}

  public open(args: IMessagesPanelArgs) {
    this.args = args;
    this.panel = vscode.window.createWebviewPanel(
      MessagesWebView.viewId,
      "Messages",
      vscode.ViewColumn.One,
      {
        enableScripts: true,
      }
    );

    this.updateView();

    this.panel.onDidDispose(() => this.dispose(), null, this.disposables);

    this.panel.webview.onDidReceiveMessage((data) => {
      switch (data.type) {
        case "colorSelected": {
          vscode.window.activeTextEditor?.insertSnippet(
            new vscode.SnippetString(`#${data.value}`)
          );
          break;
        }
      }
    });

    this.loadMessages();
  }

  private async loadMessages() {
    if (!this.args) {
      return;
    }

    this.messages = await this.connectionFacade.getMessages(
      this.args.connectionId,
      this.args.name,
      this.args.queueSubType
    );

    this.isLoading = false;
    this.updateView();
  }

  private updateView() {
    if (!this.panel || !this.args) {
      return;
    }

    const title = `Message Queue ${this.args.name}`;
    this.panel.title = title;
    const webview = this.panel.webview;

    const content = this.messages.map(
      (m) => /*html*/ `
        <div class="messageId">${this.escapeToString(m.messageId)}</div>
        <div class="contentType">${this.escapeToString(m.contentType)}</div>
        <div class="subject">${this.escapeToString(m.subject)}</div>
        <div class="body">${this.escapeToString(m.body)}</div>
      `
    ).join('');

    webview.html = /*html*/ `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${title}</title>
        </head>
        <body>
          <h1>${title}</h1>
          ${this.isLoading ? "<h2>loading...</h2>" : ""}
          <article>
            ${content}
          </article>
        </body>
      </html>
    `;
  }

  private escapeToString(input?: any): string {
    if (!input) {
      return "";
    }
    if(typeof input !== 'string'){
      input = JSON.stringify(input);
    }
    return input
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  public dispose() {
    this.panel?.dispose();

    while (this.disposables.length) {
      const x = this.disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  }
}
