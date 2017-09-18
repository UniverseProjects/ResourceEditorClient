import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ITreeState, TreeComponent, TreeModel, TreeNode} from 'angular-tree-component';
import {AlertService} from '../services/alert.service';
import {LoaderService} from '../services/loader.service';
import {ExplorerService} from '../services/explorer.service';
import {TreeApi} from '../swagger/api/TreeApi';
import {Directory} from '../swagger/model/Directory';
import {ResourceLibraryWithChildren} from '../swagger/model/ResourceLibraryWithChildren';
import {ApiHelper} from '../common/api.helper';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-directory-tree',
  styles: [`
    .tree-container {
      background-color: #DDDDDD;
      width: 225px;
      min-height: 500px;
      max-height: 750px;
      padding: 2px 0 2px 10px;
      display: inline-block;
      vertical-align: top;
    }
  `],
  template: `
    <div class="tree-container">
      <tree-root #tree [(state)]="state" [nodes]="treeNodes" (activate)="onActivate()" (deactivate)="onDeactivate()"></tree-root>
    </div>`,
  providers: [
    TreeApi,
  ],
})
export class DirectoryTreeComponent implements OnInit, OnDestroy {

  @ViewChild('tree') treeComponent: TreeComponent;

  state: ITreeState;
  treeModel: TreeModel;
  treeNodes = [];
  lastActiveNode: TreeNode = null;
  lastActivateEventTime: number = 0;

  private readonly LS_ACTIVE_NODE = 'active.tree.node';

  private subscription: Subscription;

  constructor(
    private explorerService: ExplorerService,
    private alertService: AlertService,
    private loaderService: LoaderService,
    private treeApi: TreeApi,
  ) {}

  ngOnInit(): void {
    this.treeModel = this.treeComponent.treeModel;

    this.subscription = this.explorerService.reloadDirectoryTree$.subscribe(() => {
      this.reloadDirectoryTree();
    });

    this.reloadDirectoryTree();
  }

  ngOnDestroy(): void {
    // always clean-up subscriptions when a component is destroyed
    this.subscription.unsubscribe();
  }

  onActivate(): void {
    const activeNode: TreeNode = this.treeModel.getActiveNode();
    const path = activeNode.id; // <-- the node id stores the directory path in this implementation
    if (Date.now() - this.lastActivateEventTime < 500) {
      return; // the event sometimes fires more than once... ignore the duplicate
    }
    this.lastActivateEventTime = Date.now();
    this.lastActiveNode = activeNode;
    localStorage.setItem(this.LS_ACTIVE_NODE, path);

    this.explorerService.changeDirectory(path);
  }

  onDeactivate(): void {
    if (!this.treeModel.getActiveNode()) {
      // If there's no active node at this point, it means that the user clicked on the active node causing it to deactivate;
      // In this case, do a content-refresh on that node by re-activating it.
      this.treeModel.setActiveNode(this.lastActiveNode, true);
    }
  }

  private reloadDirectoryTree(): void {
    const OPNAME = 'Loading directories';
    this.loaderService.startOperation(OPNAME);
    this.treeApi.getTree(this.explorerService.getSelectedLibraryId())
      .toPromise()
      .then((resourceLibrary: ResourceLibraryWithChildren) => {
        this.treeNodes.length = 0; // empty the array
        this.treeNodes.push(this.createRootNode(resourceLibrary));
        this.treeModel.update();

        this.loaderService.stopOperation(OPNAME);

        this.reactivateLastNode();
      }, (rejectReason) => {
        this.treeNodes.length = 0; // empty the array
        this.treeNodes.push(this.createRootNode());
        this.treeModel.update();

        this.alertService.error('Failed to load directories (' + rejectReason + ')');
        this.loaderService.stopOperation(OPNAME);
      });
  }

  private createRootNode(resourceLibrary?: ResourceLibraryWithChildren) {
    return {
      id: '/',
      name: 'root',
      children: resourceLibrary ? resourceLibrary.children.map((child) => this.createTreeNode(child)) : [],
    }
  }

  private createTreeNode(directory: Directory): any {
    return {
      id: directory.treePath,
      name: directory.name,
      children: directory.children.map((child) => this.createTreeNode(child)),
    };
  }

  private reactivateLastNode(): void {
    const lastActiveNodeId = localStorage.getItem(this.LS_ACTIVE_NODE);
    if (!lastActiveNodeId) {
      return;
    }
    const node = this.treeModel.getNodeById(lastActiveNodeId);
    if (!node) {
      console.warn("Last-active node is no longer present in the tree: " + lastActiveNodeId);
      return;
    }
    const root = this.treeModel.getFirstRoot();
    this.expandPath(root, node);
    this.treeModel.setActiveNode(node, true);
  }

  private expandPath(source: TreeNode, dest: TreeNode): void {
    if (source === dest) {
      return; // we're done
    }
    this.treeModel.setExpandedNode(source, true);
    source.children.forEach(child => {
      if (dest.isDescendantOf(child)) {
        this.expandPath(child, dest)
      }
    });
  }

}
