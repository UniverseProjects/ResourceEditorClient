import {Component, OnInit, ViewChild} from '@angular/core';
import {ITreeState, TreeComponent, TreeModel, TreeNode} from 'angular-tree-component';
import {AlertService} from '../services/alert.service';
import {LoaderService} from '../services/loader.service';
import {ExplorerService} from '../services/explorer.service';
import {TreeApi} from '../swagger/api/TreeApi';
import {Directory} from '../swagger/model/Directory';
import {ResourceLibraryWithChildren} from '../swagger/model/ResourceLibraryWithChildren';

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
      <tree-root #tree [(state)]="state" [nodes]="treeNodes" (focus)="onFocus()"></tree-root>
    </div>`,
  providers: [
    TreeApi,
  ],
})
export class DirectoryTreeComponent implements OnInit {

  @ViewChild('tree') treeComponent: TreeComponent;

  state: ITreeState;
  treeModel: TreeModel;
  lastFocusedNodePath: any;
  treeNodes = [];

  constructor(
    private explorerService: ExplorerService,
    private alertService: AlertService,
    private loaderService: LoaderService,
    private treeApi: TreeApi,
  ) {}

  ngOnInit(): void {
    this.treeModel = this.treeComponent.treeModel;

    this.loadDirectoryTree();
  }

  onFocus(): void {
    const focusedNode: TreeNode = this.treeModel.getFocusedNode();
    const path = focusedNode.id; // <-- the node id stores the directory path in this implementation
    if (this.lastFocusedNodePath === path) {
      return; // at the time of this writing, the 'focus' event fires twice... ignore
    }
    this.lastFocusedNodePath = path;

    this.explorerService.changeDirectory(path);
  }

  private static handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message);
  }

  private loadDirectoryTree(): void {
    const OPNAME = 'Loading directories';

    this.loaderService.startOperation(OPNAME);
    this.treeApi.getTree(this.explorerService.getSelectedLibraryId())
      .toPromise()
      .then((resourceLibrary: ResourceLibraryWithChildren) => {
        const rootNode = this.toRootNode(resourceLibrary);

        this.treeNodes.length = 0; // empty the array
        this.treeNodes.push(rootNode);
        this.treeModel.update();
        this.loaderService.stopOperation(OPNAME);

        // load the contents of the root
        this.explorerService.changeDirectory('/');
      }, (rejectReason) => {
        this.alertService.error('Failed to load directories (' + rejectReason + ')');
        this.loaderService.stopOperation(OPNAME);
      })
      .catch(DirectoryTreeComponent.handleError);
  }

  toRootNode(resourceLibrary: ResourceLibraryWithChildren) {
    return {
      id: '/',
      name: 'root',
      children: resourceLibrary.children.map((child) => this.toTreeNode(child)),
    }
  }

  toTreeNode(directory: Directory): any {
    return {
      id: directory.treePath,
      name: directory.name,
      children: directory.children.map((child) => this.toTreeNode(child)),
    };
  }

}
