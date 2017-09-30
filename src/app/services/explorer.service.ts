import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';

export enum ContentType {
  DIRECTORY,
  IMAGES,
  SPRITES,
  ANIMATED_SPRITES,
}

@Injectable()
export class ExplorerService {

  private selectedLibraryId = 5764201201008640;

  private reloadContent_ = new Subject<ContentType>();
  readonly reloadContent$ = this.reloadContent_.asObservable();

  getSelectedLibraryId(): number {
    return this.selectedLibraryId;
  }

  reloadDirectory(): void {
    this.reloadContent_.next(ContentType.DIRECTORY);
  }

  reloadImages(): void {
    this.reloadContent_.next(ContentType.IMAGES);
  }

  reloadSprites(): void {
    this.reloadContent_.next(ContentType.SPRITES);
  }

  reloadAnimatedSprites(): void {
    this.reloadContent_.next(ContentType.ANIMATED_SPRITES);
  }

}
