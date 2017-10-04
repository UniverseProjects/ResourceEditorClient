import {Injectable} from '@angular/core';
import {Directory} from '../swagger/model/Directory';
import {Subject} from 'rxjs/Subject';
import {LoaderService} from './loader.service';
import {TreeApi} from '../swagger/api/TreeApi';
import {ResourceLibraryWithChildren} from '../swagger/model/ResourceLibraryWithChildren';
import {AlertService} from './alert.service';
import {ExplorerService} from './explorer.service';

@Injectable()
export class DirectoryService {

  private directoryTreeReloaded_ = new Subject<Directory>();
  /** Subscribe to this to be notified when the directory tree is reloaded */
  readonly directoryTreeReloaded$ = this.directoryTreeReloaded_.asObservable();

  private directoryChanged_ = new Subject<Directory>();
  /** Subscribe to this to be notified when the current directory changes */
  readonly directoryChanged$ = this.directoryChanged_.asObservable();

  private rootDirectory: Directory;
  private currentDirectory: Directory;
  private directoriesByPath = new Map<string, Directory>();
  private parentDirectoriesByChild = new Map<Directory, Directory>();

  constructor(
    private loaderService: LoaderService,
    private alertService: AlertService,
    private treeApi: TreeApi,
    private explorerService: ExplorerService,
  ) {}

  changeDirectory(treePath: string) {
    const directory = this.directoriesByPath.get(treePath);
    if (!directory) {
      throw new Error('Directory not found for tree path: ' + treePath);
    }
    this.changeDirectoryInternal(directory);
  }

  changeDirectoryToParent() {
    if (this.currentDirectory.treePath === this.rootDirectory.treePath) {
      this.alertService.warn('Can\'t go one level up from root directory');
      return;
    }
    const parentDirectory = this.parentDirectoriesByChild.get(this.currentDirectory);
    if (!parentDirectory) {
      throw new Error('Parent directory not found for: ' + this.currentDirectory.treePath);
    }
    this.changeDirectoryInternal(parentDirectory);
  }

  getCurrentDirectory(): Directory {
    return this.currentDirectory;
  }

  getCurrentDirectoryPath(): string {
    return this.currentDirectory.treePath;
  }

  reloadDirectoryTree(): void {
    const operation = this.loaderService.startOperation('Loading directory tree');
    this.treeApi.getTree(this.explorerService.getSelectedLibraryId())
      .toPromise()
      .then((resourceLibrary: ResourceLibraryWithChildren) => {
        operation.stop();
        this.refreshData(resourceLibrary);
      }, (rejectReason) => {
        operation.stop();
        this.alertService.error('Failed to load directories (' + rejectReason + ')');
        this.refreshData();
      });
  }

  private refreshData(resourceLibrary?: ResourceLibraryWithChildren) {
    // Here we create a surrogate root directory to contain the top-level directories in the resource library.
    // If no data is given (likely due to API error), create an empty root directory.
    this.rootDirectory = {
      name: 'root',
      treePath: '/',
      parent: null,
      children: resourceLibrary ? resourceLibrary.children.map((child) => child) : [],
    };

    this.directoriesByPath.clear();
    this.parentDirectoriesByChild.clear();
    this.processTree(this.rootDirectory);

    this.directoryTreeReloaded_.next(this.rootDirectory);
  }

  private processTree(directory: Directory) {
    const treePath = directory.treePath;
    if (this.directoriesByPath.has(treePath)) {
      throw new Error('Duplicate tree path: ' + treePath);
    }
    this.directoriesByPath.set(treePath, directory);
    if (directory.children) {
      directory.children.forEach((child) => {
        this.parentDirectoriesByChild.set(child, directory);
        this.processTree(child)
      });
    }
  }

  private changeDirectoryInternal(directory: Directory) {
    this.currentDirectory = directory;
    this.directoryChanged_.next(directory);
  }

}
