import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Directory} from '../swagger/model/Directory';

export enum ContentType {
  IMAGES,
  SPRITES,
  ANIMATED_SPRITES,
  DIRECTORIES
}

@Injectable()
export class ExplorerService {

  private selectedLibraryId = 5764201201008640;

  private currentDirectory: Directory = null;
  private changeDirectory_ = new Subject<Directory>();
  changeDirectory$ = this.changeDirectory_.asObservable();

  private reloadDirectoryTree_ = new Subject<any>();
  readonly reloadDirectoryTree$ = this.reloadDirectoryTree_.asObservable();

  private reloadContent_ = new Subject<ContentType>();
  readonly reloadContent$ = this.reloadContent_.asObservable();

  getSelectedLibraryId(): number {
    return this.selectedLibraryId;
  }

  changeDirectory(directory: Directory) {
    this.currentDirectory = directory;
    this.changeDirectory_.next(directory);
  }

  getCurrentDirectory(): Directory {
    return this.currentDirectory;
  }

  getCurrentDirectoryPath(): string {
    return this.currentDirectory.treePath;
  }

  reloadDirectoryTree(): void {
    this.reloadDirectoryTree_.next();
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

  reloadDirectories(): void {
    this.reloadContent_.next(ContentType.DIRECTORIES);
  }

}
