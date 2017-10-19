import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';

export enum ContentType {
  DIRECTORY,
  IMAGES,
  SPRITE_TYPES,
  ANIMATED_SPRITE_TYPES,
}

@Injectable()
export class ExplorerService {

  private selectedLibraryId = 5764201201008640;

  private reloadContent_ = new Subject<ContentType>();
  readonly reloadContent$ = this.reloadContent_.asObservable();

  getSelectedLibraryId(): number {
    return this.selectedLibraryId;
  }

  reloadDirectory() {
    this.reloadContent_.next(ContentType.DIRECTORY);
  }

  reloadImages() {
    this.reloadContent_.next(ContentType.IMAGES);
  }

  reloadSpriteTypes() {
    this.reloadContent_.next(ContentType.SPRITE_TYPES);
  }

  reloadAnimatedSpriteTypes() {
    this.reloadContent_.next(ContentType.ANIMATED_SPRITE_TYPES);
  }

}
