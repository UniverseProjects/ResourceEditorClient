import {Component, OnInit} from '@angular/core';
import {LibraryService} from '../services/library.service';
import {AlertService} from '../services/alert.service';
import {LoaderService} from '../services/loader.service';
import {ContentType, ExplorerService} from '../services/explorer.service';
import {AnimatedSprite} from '../models/animated.sprite';

@Component({
  selector: 'app-animated-sprites',
  styles: [``],
  template: `
    <div class="app-animated-sprites-container" *ngIf="active">
      <!--<h3>Animated Sprites</h3>-->
      <app-thumbnails [imageUrls]="thumbnailUrls" (onSelected)="onThumbnailSelected($event)"></app-thumbnails>
    </div>
  `,
})
export class AnimatedSpritesComponent implements OnInit {
  active = false;
  animatedSprites: AnimatedSprite[] = [];
  thumbnailUrls: string[] = [];

  constructor(
    private libraryService: LibraryService,
    private alertService: AlertService,
    private loaderService: LoaderService,
    private explorerService: ExplorerService,
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

  private loadAnimatedSprites(directory: string): void {
    if (!directory) {
      this.animatedSprites.length = 0;
      this.thumbnailUrls.length = 0;
      return;
    }

    const OPNAME = 'Loading animated sprites in directory ' + directory;
    this.loaderService.startOperation(OPNAME);
    this.libraryService.getAnimatedSprites(directory).then(animatedSprites => {
      this.animatedSprites = animatedSprites;
      this.thumbnailUrls = animatedSprites.map(sprite => sprite.gcsUrl);

      this.loaderService.stopOperation(OPNAME);
    }, (rejectReason) => {
      this.alertService.error('Failed to load animated sprites (' + rejectReason + ')');
      this.loaderService.stopOperation(OPNAME);
    });
  }

  onThumbnailSelected(selectedIndex: number): void {
    console.log('Selected thumbnail index: ' + selectedIndex);
  }
}
