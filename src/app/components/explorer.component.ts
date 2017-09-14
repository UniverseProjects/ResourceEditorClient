import {Component, OnInit} from '@angular/core';
import {ExplorerService} from '../services/explorer.service';

@Component({
  selector: 'app-explorer',
  styles: [`
    .directory-content {
      width: 700px;
      padding: 0 10px;
      display: inline-block;
      vertical-align: top;
    }
    .btn-group {
      padding-bottom: 15px;
    }
    .items-container {
    }
  `],
  template: `
    <app-directory-tree></app-directory-tree>
    <div class="directory-content">
      <div class="btn-group">
        <label class="btn btn-primary" [(ngModel)]="contentType" (click)="onClickContentType()" btnRadio="Images">Images</label>
        <label class="btn btn-primary" [(ngModel)]="contentType" (click)="onClickContentType()" btnRadio="Sprites">Sprites</label>
        <label class="btn btn-primary" [(ngModel)]="contentType" (click)="onClickContentType()" btnRadio="Animated Sprites">Animated Sprites</label>
        <label class="btn btn-primary" [(ngModel)]="contentType" (click)="onClickContentType()" btnRadio="Directories">Directories</label>
      </div>
      <div>
        <div class="items-container">
          <app-images></app-images>
        </div>
        <div class="items-container">
          <app-sprites></app-sprites>
        </div>
        <div class="items-container">
          <app-animated-sprites></app-animated-sprites>
        </div>
        <div class="items-container">
          <app-directories></app-directories>
        </div>
      </div>
    </div>
  `,
})
export class ExplorerComponent implements OnInit {
  public contentType = 'Images';

  constructor(
    private explorerService: ExplorerService
  ) { }

  ngOnInit(): void {
    this.explorerService.changeDirectory$.subscribe(() => {
      this.reloadContent();
    });
  }

  onClickContentType(): void {
    this.reloadContent();
  }

  private reloadContent(): void {
    if (this.contentType === 'Images') {
      this.explorerService.reloadImages();
    } else if (this.contentType === 'Sprites') {
      this.explorerService.reloadSprites();
    } else if (this.contentType === 'Animated Sprites') {
      this.explorerService.reloadAnimatedSprites();
    } else if (this.contentType === 'Directories') {
      this.explorerService.reloadDirectories();
    } else {
      throw new Error('Unhandled case: ' + this.contentType);
    }
  }
}
