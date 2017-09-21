import {Component, OnInit} from '@angular/core';
import {TreeApi} from '../swagger/api/TreeApi';
import {AlertService} from '../services/alert.service';
import {LoaderService} from '../services/loader.service';
import {ContentType, ExplorerService} from '../services/explorer.service';
import {ApiHelper} from '../common/api.helper';
import {PathUtil} from '../common/path.util';

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
      width: 250px;
    }
  `],
  template: `
    <div class="app-directories-container" *ngIf="active">
      <!--<h3>Directories</h3>-->
      <div>
        <span class="current-dir-label">Current directory: </span>
        <span class="current-dir-value">{{currentDirectory}}</span>
      </div>
      <div class="dir-control">
        <button class="btn btn-danger" 
                mwlConfirmationPopover placement="right" title="Are you sure?"
                message="Do you really want to delete the current directory?"
                (confirm)="deleteCurrentDirectory()">Delete this directory</button>

      </div>
      <div class="dir-control">
        <button class="btn btn-primary" (click)="createDirectory()">Create new directory</button>
        <input class="new-dir-name" type="text" [(ngModel)]="newDirectoryName"/>
      </div>
    </div>
  `,
  providers: [
    TreeApi,
  ],
})
export class DirectoriesComponent implements OnInit {
  active = false;
  currentDirectory: string = null;
  newDirectoryName: string = null;

  constructor(
    private alertService: AlertService,
    private loaderService: LoaderService,
    private explorerService: ExplorerService,
    private treeApi: TreeApi,
  ) { }

  ngOnInit(): void {
    this.explorerService.reloadContent$.subscribe((contentType) => {
      if (contentType === ContentType.DIRECTORIES) {
        this.loadDirectories(this.explorerService.getCurrentDirectoryPath());
        this.active = true;
      } else {
        this.loadDirectories(null);
        this.active = false;
      }
    });
  }

  deleteCurrentDirectory() {
    const currentDir = this.explorerService.getCurrentDirectory();
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

    const OPNAME = 'Deleting directory';
    this.loaderService.startOperation(OPNAME);
    this.treeApi.deleteDirectory(libraryId, currentDirPath)
      .toPromise()
      .then(response => {
        this.loaderService.stopOperation(OPNAME);
        this.explorerService.reloadDirectoryTree();
      }, rejectReason => {
        this.loaderService.stopOperation(OPNAME);
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
    const currentDir = this.explorerService.getCurrentDirectoryPath();
    const newDirPath = ApiHelper.verifyPath(PathUtil.combine(currentDir, this.newDirectoryName));

    const OPNAME = 'Creating directory';
    this.loaderService.startOperation(OPNAME);
    this.treeApi.createDirectory(libraryId, newDirPath)
      .toPromise()
      .then(response => {
        this.loaderService.stopOperation(OPNAME);
        this.explorerService.reloadDirectoryTree();
      }, rejectReason => {
        this.loaderService.stopOperation(OPNAME);
        this.alertService.error('Failed to create new directory (' + rejectReason + ')');
      });
  }

  private loadDirectories(directory: string): void {
    if (!directory) {
      this.currentDirectory = null;
      return;
    }
    this.currentDirectory = directory;
  }

}
