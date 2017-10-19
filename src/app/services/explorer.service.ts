import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {C} from '../common/common';

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

  reloadContent(contentType: ContentType) {
    if (!C.defined(contentType)) {
      throw new Error('Content-type must be provided');
    }
    this.reloadContent_.next(contentType);
  }

}
