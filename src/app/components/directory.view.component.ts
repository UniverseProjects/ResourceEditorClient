import {Component, OnDestroy, OnInit} from '@angular/core';
import {TreeApi} from '../swagger/api/TreeApi';
import {AlertService} from '../services/alert.service';
import {LoaderService} from '../services/loader.service';
import {ExplorerView, ExplorerService} from '../services/explorer.service';
import {ApiHelper} from '../common/api.helper';
import {PathUtil} from '../common/path.util';
import {DirectoryService} from '../services/directory.service';
import {Subscription} from 'rxjs/Subscription';
import {Directory} from '../swagger/model/Directory';

@Component({
  selector: 'directory-view',
  styles: [`
    .row {
      padding-bottom: 10px;
    }
  `],
  template: `
    <div class="directory-view-container" *ngIf="active">
      <div class="row">
        <div class="input-group col-lg-8">
          <input class="form-control" type="text" placeholder="New child directory name..." [(ngModel)]="newDirectoryName" (keyup.enter)="createDirectory()"/>
          <div class="input-group-btn">
            <button class="btn btn-outline-success" (click)="createDirectory()">Create</button>
          </div>
        </div>  
      </div>
      <div class="row">
        <div class="input-group col-lg-8">
          <button class="btn btn-outline-danger"
                  mwlConfirmationPopover placement="right" title="Are you sure?"
                  message="Do you really want to delete the current directory?"
                  (confirm)="deleteCurrentDirectory()">Delete this directory
          </button>
        </div>
      </div>
    </div>
  `,
})
export class DirectoryViewComponent implements OnInit, OnDestroy {
  active = false;
  currentDirectory: Directory;
  newDirectoryName: string;

  private subscriptions: Subscription[] = [];

  constructor(
    private alertService: AlertService,
    private loaderService: LoaderService,
    private explorerService: ExplorerService,
    private directoryService: DirectoryService,
    private treeApi: TreeApi,
  ) { }

  ngOnInit() {
    this.subscriptions.push(this.explorerService.openView$.subscribe((view) => {
      if (view === ExplorerView.DIRECTORY) {
        this.active = true;
      } else {
        this.clear();
        this.active = false;
      }
    }));

    this.subscriptions.push(this.explorerService.reloadView$.subscribe((view) => {
      if (view === ExplorerView.DIRECTORY && this.active) {
        this.reloadContent();
      }
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions.length = 0;
  }

  deleteCurrentDirectory() {
    if (this.currentDirectory.treePath === '/') {
      this.alertService.warn('Can\'t delete the root directory');
      return;
    }
    if (this.currentDirectory.children.length > 0) {
      this.alertService.warn('Can\'t delete a directory with child directories');
      return;
    }

    const libraryId = this.explorerService.getSelectedLibraryId();
    const currentDirPath = this.currentDirectory.treePath;

    const operation = this.loaderService.startOperation('Deleting directory');
    this.treeApi.deleteDirectory(libraryId, ApiHelper.path(currentDirPath))
      .toPromise()
      .then(() => {
        operation.stop();
        this.alertService.success('Directory deleted: ' + currentDirPath);
        this.directoryService.changeDirectoryToParent();
        this.directoryService.reloadDirectoryTree();
      }, rejectReason => {
        operation.stop();
        this.alertService.error('Failed to delete current directory (' + rejectReason + ')');
      });
  }

  createDirectory() {
    let directoryName = this.newDirectoryName;
    if (!directoryName || !directoryName.trim()) {
      this.alertService.warn('Please enter a directory name');
      return;
    }
    directoryName = directoryName.trim();
    if (!/^[a-zA-Z0-9_\-]+$/g.test(directoryName)) {
      this.alertService.warn('Invalid directory name: ' + directoryName);
      return;
    }
    if (this.directoryService.doesCurrentDirectoryContain(directoryName)) {
      this.alertService.warn('Directory with name \"' + directoryName + '\" already exists here');
      return;
    }

    const libraryId = this.explorerService.getSelectedLibraryId();
    const newDirPath = PathUtil.combine(this.currentDirectory.treePath, directoryName);

    const operation = this.loaderService.startOperation('Creating directory');
    this.treeApi.createDirectory(libraryId, ApiHelper.path(newDirPath))
      .toPromise()
      .then(() => {
        operation.stop();
        this.alertService.success('Directory created: ' + newDirPath);
        this.directoryService.reloadDirectoryTree();
        this.newDirectoryName = null;
      }, rejectReason => {
        operation.stop();
        this.alertService.error('Failed to create new directory (' + rejectReason + ')');
      });
  }

  private clear() {
    this.currentDirectory = null;
    this.newDirectoryName = null;
  }

  private reloadContent() {
    this.clear();
    this.currentDirectory = this.directoryService.getCurrentDirectory();
  }

}
