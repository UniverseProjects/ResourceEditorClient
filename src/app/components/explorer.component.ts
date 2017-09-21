import {Component, OnInit} from '@angular/core';
import {ContentType, ExplorerService} from '../services/explorer.service';

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
        <label class="btn btn-primary" [(ngModel)]="contentTypeStr" (click)="onClickContentType()" btnRadio="DIRECTORY">Directory</label>
        <label class="btn btn-primary" [(ngModel)]="contentTypeStr" (click)="onClickContentType()" btnRadio="IMAGES">Images</label>
        <label class="btn btn-primary" [(ngModel)]="contentTypeStr" (click)="onClickContentType()" btnRadio="SPRITES">Sprites</label>
        <label class="btn btn-primary" [(ngModel)]="contentTypeStr" (click)="onClickContentType()" btnRadio="ANIMATED_SPRITES">Animated Sprites</label>
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

  private readonly LS_CONTENT_TYPE = 'active.content.type';

  contentTypeStr = 'DIRECTORY';

  constructor(private explorerService: ExplorerService) {
  }

  ngOnInit(): void {
    const lastContentTypeStr = localStorage.getItem(this.LS_CONTENT_TYPE);
    if (lastContentTypeStr) {
      this.contentTypeStr = lastContentTypeStr;
    }
    this.explorerService.changeDirectory$.subscribe(() => {
      this.reloadContent();
    });
  }

  onClickContentType(): void {
    this.reloadContent();
  }

  private reloadContent(): void {
    const contentType = ContentType[this.contentTypeStr];

    if (contentType === undefined || contentType === null) {
      throw new Error('Invalid enum string value: ' + this.contentTypeStr);
    } else if (contentType === ContentType.IMAGES) {
      this.explorerService.reloadImages();
    } else if (contentType === ContentType.SPRITES) {
      this.explorerService.reloadSprites();
    } else if (contentType === ContentType.ANIMATED_SPRITES) {
      this.explorerService.reloadAnimatedSprites();
    } else if (contentType === ContentType.DIRECTORY) {
      this.explorerService.reloadDirectory();
    } else {
      throw new Error('Unhandled case: ' + this.contentTypeStr);
    }

    localStorage.setItem(this.LS_CONTENT_TYPE, this.contentTypeStr);
  }
}
