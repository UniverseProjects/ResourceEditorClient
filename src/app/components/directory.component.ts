import {Component, OnDestroy, OnInit} from '@angular/core';
import {TreeApi} from '../swagger/api/TreeApi';
import {AlertService} from '../services/alert.service';
import {LoaderService} from '../services/loader.service';
import {ContentType, ExplorerService} from '../services/explorer.service';
import {ApiHelper} from '../common/api.helper';
import {PathUtil} from '../common/path.util';
import {DirectoryService} from '../services/directory.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-directories',
  styles: [`
    .current-dir-label {
      font-size: 18px;
    }
    .current-dir-value {
      font-size: 18px;
      font-weight: bold;
      font-family: "Courier New", Courier, monospace;
    }
    .dir-control {
      padding-top: 10px;
    }
    .new-dir-name {
      width: 300px;
    }
  `],
  template: `
    <div class="app-directories-container" *ngIf="active">
      <div>
        <span class="current-dir-label">Current directory: </span>
        <span class="current-dir-value">{{currentDirectory}}</span>
      </div>
      <div class="dir-control">
        <div class="input-group new-dir-name ">
          <input class="form-control" type="text" placeholder="New directory name..." [(ngModel)]="newDirectoryName" (keyup.enter)="createDirectory()"/>
          <div class="input-group-btn">
            <button class="btn btn-default" (click)="createDirectory()">Create</button>
          </div>
        </div>
      </div>
      <div class="dir-control">
        <button class="btn btn-danger"
                mwlConfirmationPopover placement="right" title="Are you sure?"
                message="Do you really want to delete the current directory?"
                (confirm)="deleteCurrentDirectory()">Delete this directory</button>
      </div>
    </div>
  `,
})
export class DirectoryComponent implements OnInit, OnDestroy {
  active = false;
  currentDirectory: string = null;
  newDirectoryName: string = null;

  private subscription: Subscription;

  constructor(
    private alertService: AlertService,
    private loaderService: LoaderService,
    private explorerService: ExplorerService,
    private directoryService: DirectoryService,
    private treeApi: TreeApi,
  ) { }

  ngOnInit(): void {
    this.subscription = this.explorerService.reloadContent$.subscribe((contentType) => {
      if (contentType === ContentType.DIRECTORY) {
        this.loadContent(this.directoryService.getCurrentDirectoryPath());
        this.active = true;
      } else {
        this.loadContent(null);
        this.active = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  deleteCurrentDirectory() {
    const currentDir = this.directoryService.getCurrentDirectory();
    if (currentDir.treePath === '/') {
      this.alertService.warn('Can\'t delete the root directory');
      return;
    }
    if (currentDir.children.length > 0) {
      this.alertService.warn('Can\'t delete a directory with child directories');
      return;
    }

    const currentDirPath = ApiHelper.verifyPath(currentDir.treePath);
    const libraryId = this.explorerService.getSelectedLibraryId();

    const operation = this.loaderService.startOperation('Deleting directory');
    this.treeApi.deleteDirectory(libraryId, currentDirPath)
      .toPromise()
      .then(() => {
        operation.stop();
        this.directoryService.changeDirectoryToParent();
        this.directoryService.reloadDirectoryTree();
      }, rejectReason => {
        operation.stop();
        this.alertService.error('Failed to delete current directory (' + rejectReason + ')');
      });
  }

  createDirectory() {
    if (!this.newDirectoryName || !this.newDirectoryName.trim()) {
      this.alertService.warn('Please enter a directory name');
      return;
    }
    if (!/^[a-zA-Z0-9_\-]+$/g.test(this.newDirectoryName)) {
      this.alertService.warn('Invalid directory name: ' + this.newDirectoryName);
      return;
    }

    const libraryId = this.explorerService.getSelectedLibraryId();
    const currentDir = this.directoryService.getCurrentDirectoryPath();
    const newDirPath = ApiHelper.verifyPath(PathUtil.combine(currentDir, this.newDirectoryName));

    const operation = this.loaderService.startOperation('Creating directory');
    this.treeApi.createDirectory(libraryId, newDirPath)
      .toPromise()
      .then(() => {
        operation.stop();
        this.directoryService.reloadDirectoryTree();
        this.newDirectoryName = null;
      }, rejectReason => {
        operation.stop();
        this.alertService.error('Failed to create new directory (' + rejectReason + ')');
      });
  }

  private loadContent(directory: string): void {
    if (!directory) {
      this.currentDirectory = null;
      return;
    }
    this.currentDirectory = directory;
  }

}
