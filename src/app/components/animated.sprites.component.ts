import {Component, OnInit} from '@angular/core';
import {AlertService} from '../services/alert.service';
import {LoaderService} from '../services/loader.service';
import {ContentType, ExplorerService} from '../services/explorer.service';
import {AnimatedSpriteTypeApi} from '../swagger/api/AnimatedSpriteTypeApi';
import {AnimatedSpriteType} from '../swagger/model/AnimatedSpriteType';
import {ApiHelper} from '../common/api.helper';

@Component({
  selector: 'app-animated-sprites',
  styles: [``],
  template: `
    <div class="app-animated-sprites-container" *ngIf="active">
      <!--<h3>Animated Sprites</h3>-->
      <app-thumbnails [imageUrls]="thumbnailUrls" (onSelected)="onThumbnailSelected($event)"></app-thumbnails>
    </div>
  `,
  providers: [
    AnimatedSpriteTypeApi,
  ],
})
export class AnimatedSpritesComponent implements OnInit {
  active = false;
  animatedSprites: AnimatedSpriteType[] = [];
  thumbnailUrls: string[] = [];

  constructor(
    private alertService: AlertService,
    private loaderService: LoaderService,
    private explorerService: ExplorerService,
    private animatedSpriteTypeApi: AnimatedSpriteTypeApi,
  ) { }

  ngOnInit(): void {
    this.explorerService.reloadContent$.subscribe((contentType) => {
      if (contentType === ContentType.ANIMATED_SPRITES) {
        this.loadAnimatedSprites(this.explorerService.getCurrentDirectory());
        this.active = true;
      } else {
        this.loadAnimatedSprites(null);
        this.active = false;
      }
    });
  }

  onThumbnailSelected(selectedIndex: number): void {
    console.log('Selected thumbnail index: ' + selectedIndex);
  }

  private loadAnimatedSprites(directory: string): void {
    if (!directory) {
      this.animatedSprites.length = 0;
      this.thumbnailUrls.length = 0;
      return;
    }

    console.log('Loading animated sprites in directory: ' + directory);
    directory = ApiHelper.verifyPath(directory);

    const OPNAME = 'Loading animated sprites';
    this.loaderService.startOperation(OPNAME);
    this.animatedSpriteTypeApi.findAnimatedSpriteType(this.explorerService.getSelectedLibraryId(), directory)
      .toPromise()
      .then(response => {
        this.animatedSprites = response.values;
        this.thumbnailUrls = this.animatedSprites.map(sprite => sprite.frames[0].spriteType.image.gcsUrl);
        this.loaderService.stopOperation(OPNAME);
      }, (rejectReason) => {
        this.alertService.error('Failed to load animated sprites (' + rejectReason + ')');
        this.loaderService.stopOperation(OPNAME);
      })
      .catch(ApiHelper.handleError);
  }

}
