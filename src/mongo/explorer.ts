import { TreeDataProvider, Command, Event, EventEmitter, Disposable, TreeItem, ExtensionContext } from 'vscode';
import { Model, Server, Database, IMongoResource } from './mongo';

export class MongoExplorer implements TreeDataProvider<IMongoResource> {

	private _disposables: Map<IMongoResource, Disposable[]> = new Map<IMongoResource, Disposable[]>();

	private _onDidChange: EventEmitter<IMongoResource> = new EventEmitter<IMongoResource>();
	readonly onDidChange: Event<IMongoResource> = this._onDidChange.event;

	constructor(private model: Model, private extensionContext: ExtensionContext) {
		this.model.onChange(() => this._onDidChange.fire());
	}

	getTreeItem(node: IMongoResource): TreeItem {
		return node;
	}

	getChildren(node: IMongoResource): Thenable<IMongoResource[]> {
		node = node ? node : this.model;
		const disposables = this._disposables.get(node);
		if (disposables) {
			for (const disposable of disposables) {
				disposable.dispose();
			}
		}
		return node.getChildren().then(children => {
			this._disposables.set(node, children.map(child => {
				if (child.onChange) {
					return child.onChange(() => this._onDidChange.fire(child));
				}
				return new Disposable(() => { });
			}));
			return children;
		});
	}

	refresh(): void {
		this._onDidChange.fire();
	}
}