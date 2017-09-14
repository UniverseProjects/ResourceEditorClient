import {Component, OnInit} from '@angular/core';
import {TreeApi} from '../swagger/api/TreeApi';
import {AlertService} from '../services/alert.service';
import {LoaderService} from '../services/loader.service';
import {ContentType, ExplorerService} from '../services/explorer.service';

@Component({
  selector: 'app-directories',
  styles: [`
    .current-dir-title {
      font-size: 18px;
      font-weight: bold;
    }
    .dir-option {
      padding-top: 10px;
    }
  `],
  template: `
    <div class="app-directories-container" *ngIf="active">
      <!--<h3>Directories</h3>-->
      <div class="current-dir-title">Current directory: {{currentDirectory}}</div>
      <div class="dir-option">
        <label class="btn btn-primary" (click)="deleteCurrentDirectory()">Delete directory</label>
      </div>
      <div class="dir-option">
        <label class="btn btn-primary" (click)="createDirectory()">Create new directory</label>
        <input type="text" [(ngModel)]="newDirectoryName"/>
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
    this.alertService.warn('Creation of directories not yet supported ('+this.newDirectoryName+')');
  }

  private loadDirectories(directory: string): void {
    if (!directory) {
      this.currentDirectory = null;
      return;
    }

    this.currentDirectory = directory;
  }

}
