import {Component, OnInit} from '@angular/core';
import {TreeApi} from '../swagger/api/TreeApi';
import {AlertService} from '../services/alert.service';
import {LoaderService} from '../services/loader.service';
import {ContentType, ExplorerService} from '../services/explorer.service';
import {ApiHelper} from '../common/api.helper';

@Component({
  selector: 'app-directories',
  styles: [`
    .current-dir-title {
      font-size: 18px;
      font-weight: bold;
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
      <div class="current-dir-title">Current directory: {{currentDirectory}}</div>
      <div class="dir-control">
        <label class="btn btn-primary" (click)="deleteCurrentDirectory()">Delete directory</label>
      </div>
        <label class="btn btn-primary" (click)="createDirectory()">Create new directory</label>
        <input type="text" [(ngModel)]="newDirectoryName"/>
      <div class="dir-control">
        <label class="btn btn-primary" (click)="createDirectory()">New directory</label>
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
        this.loadDirectories(this.explorerService.getCurrentDirectory());
        this.active = true;
      } else {
        this.loadDirectories(null);
        this.active = false;
      }
    });
  }

  deleteCurrentDirectory() {
    this.alertService.warn('Deletion of directories not yet supported');
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
    const currentDir = this.explorerService.getCurrentDirectory();

    const OPNAME = 'Creating directory';
    this.loaderService.startOperation(OPNAME);
    this.treeApi.createDirectory(libraryId, currentDir, this.newDirectoryName)
      .toPromise()
      .then(response => {
        this.loaderService.stopOperation(OPNAME);
        this.explorerService.reloadDirectoryTree();
      }, rejectReason => {
        this.loaderService.stopOperation(OPNAME);
        this.alertService.error('Failed to create new directory (' + rejectReason + ')');
      })
      .catch(ApiHelper.handleError);
  }

  private loadDirectories(directory: string): void {
    if (!directory) {
      this.currentDirectory = null;
      return;
    }

    this.currentDirectory = directory;
  }

}
