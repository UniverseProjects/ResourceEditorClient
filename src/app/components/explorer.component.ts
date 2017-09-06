import {Component, OnInit} from '@angular/core';
import {ExplorerService} from '../services/explorer.service';

@Component({
  selector: 'app-explorer',
  styles: [`
    .directory-content {
      width: 500px;
      padding: 0 10px;
      display: inline-block;
      vertical-align: top;
    }
    .btn-group {
      padding-bottom: 15px;
    }
    .items-container {
    }
    .error-message {
      color: red;
      font-weight: bold;
      font-size: 24px;
    }
  `],
  template: `
    <app-directory-tree></app-directory-tree>
    <div class="directory-content">
      <div class="btn-group">
        <label class="btn btn-primary" [(ngModel)]="contentType" (click)="onClickContentType()" btnRadio="Images">Images</label>
        <label class="btn btn-primary" [(ngModel)]="contentType" (click)="onClickContentType()" btnRadio="Sprites">Sprites</label>
        <label class="btn btn-primary" [(ngModel)]="contentType" (click)="onClickContentType()" btnRadio="Animated Sprites">Animated Sprites</label>
      </div>
      <div>
        <div class="items-container">
          <app-images></app-images>
        </div>
        <div class="items-container">
          <app-sprites></app-sprites>
        </div>
        <div class="items-container">
          <span class="error-message" *ngIf="contentType === 'Animated Sprites'">Animated sprites not implemented yet :(</span>
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
      // console.log('Reloading images...');
      this.explorerService.reloadImages();
    } else if (this.contentType === 'Sprites') {
      // console.log('Reloading sprites...');
      this.explorerService.reloadSprites();
    } else if (this.contentType === 'Animated Sprites') {
      // console.log('Reloading animated sprites...');
      this.explorerService.reloadAnimatedSprites();
    } else {
      throw new Error('Unhandled case: ' + this.contentType);
    }
  }
}
