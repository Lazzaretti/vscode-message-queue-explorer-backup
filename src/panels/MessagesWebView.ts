import exp = require("constants");
import * as vscode from "vscode";
import { ConnectionFacade } from "../facade/ConnectionFacade";
import { getUri } from "../helpers";
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

  constructor(private connectionFacade: ConnectionFacade, private extensionUri: vscode.Uri) {}

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

    const toolkitUri = getUri(webview, this.extensionUri, [
      "node_modules",
      "@vscode",
      "webview-ui-toolkit",
      "dist",
      "toolkit.js", // A toolkit.min.js file is also available
    ]);
    const styleUri = getUri(webview, this.extensionUri, ["webview-ui", "style.css"]);

    const content = this.messages.map(
      (m) => /*html*/ `
        <div class="msg">
          <vscode-text-field class="msg-header" value="${this.escapeToString(m.messageId)}" disabled>messageId</vscode-text-field>
          <vscode-text-field class="msg-header" value="${this.escapeToString(m.contentType)}" disabled>contentType</vscode-text-field>
          <vscode-text-field class="msg-header" value="${this.escapeToString(m.subject)}" disabled>subject</vscode-text-field>
          ${this.getActionsHtml(m)}
          <vscode-text-field class="msg-body" value="${this.escapeToString(m.body)}" disabled>body</vscode-text-field>
        </div>
      `
    ).join('');

    webview.html = /*html*/ `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <script type="module" src="${toolkitUri}"></script>
          <title>${title}</title>
          <link rel="stylesheet" href="${styleUri}">
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

  private getActionsHtml(m: IMessage){
    return '';
    // return `<vscode-button class="msg-action">Requeue</vscode-button>`;
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
