import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {PathUtil} from '../common/path.util';
import {Image} from '../swagger/model/Image';
import {SpriteType} from '../swagger/model/SpriteType';
import {ApiHelper} from '../common/api.helper';
import {LoaderService} from '../services/loader.service';
import {ExplorerService} from '../services/explorer.service';
import {DirectoryService} from '../services/directory.service';
import {SpriteTypeApi} from '../swagger/api/SpriteTypeApi';
import {AlertService} from '../services/alert.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-sprite-editor',
  styles: [`  
    .field-label {
      
    }
  `],
  template: `
    <div class="sprite-editor-container">
      <form novalidate [formGroup]="spriteForm">
          <div class="form-row">
            <div class="form-group col-lg-12">
              <label for="name" class="field-label">Sprite name</label>
              <input id="name" name="name" formControlName="name" class="form-control" [class.is-invalid]="invalidName()" type="text" placeholder="Enter a unique name for this sprite"/>
              <div class="invalid-feedback" *ngIf="invalidName()">Please enter a valid name</div>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group col-lg-12">
              <label for="imagePath" class="field-label">Image path</label>
              <input id="imagePath" name="imagePath" formControlName="imagePath" class="form-control" [class.is-invalid]="invalidImagePath()" type="text" placeholder="Enter the image path"/>
              <div class="invalid-feedback" *ngIf="invalidImagePath()">Please enter a valid image path</div>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group col-xs-12 col-sm-6 col-md-3">
              <label for="areaX" class="field-label">Area x-coordinate</label>
              <input id="areaX" name="areaX" formControlName="areaX" class="form-control" [class.is-invalid]="invalidAreaX()" type="number" placeholder="X-coordinate"/>
            </div>
            <div class="form-group col-xs-12 col-sm-6 col-md-3">
              <label for="areaY" class="field-label">Area y-coordinate</label>
              <input id="areaY" name="areaY" formControlName="areaY" class="form-control" [class.is-invalid]="invalidAreaY()" type="number" placeholder="Y-coordinate"/>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group col-xs-12 col-sm-6 col-md-3">
              <label for="areaWidth" class="field-label">Area width</label>
              <input id="areaWidth" name="areaWidth" formControlName="areaWidth" class="form-control" [class.is-invalid]="invalidAreaWidth()" type="number" placeholder="Width"/>
            </div>
            <div class="form-group col-xs-12 col-sm-6 col-md-3">
              <label for="areaHeight" class="field-label">Area height</label>
              <input id="areaHeight" name="areaHeight" formControlName="areaHeight" class="form-control" [class.is-invalid]="invalidAreaHeight()" type="number" placeholder="Height"/>
            </div>
          </div>
          <div class="form-row" style="padding-top: 10px;">
            <div class="form-group col-md-12">
              <button class="btn btn-outline-success"
                      mwlConfirmationPopover placement="right" title="Are you sure?"
                      message="Proceed with sprite creation?"
                      (confirm)="createSprite()">Create sprite
              </button>
              <button class="btn btn-outline-secondary" (click)="cancel()">Cancel</button>
            </div>
          </div>
      </form>
    </div>
  `,
})
export class SpriteEditorComponent implements OnInit {

  @Output() onSpriteCreated = new EventEmitter();
  @Output() onCancel = new EventEmitter();

  spriteForm: FormGroup;

  name: string;
  imagePath: string;
  areaX: number;
  areaY: number;
  areaWidth: number;
  areaHeight: number;

  constructor(
    private fb: FormBuilder,
    private loaderService: LoaderService,
    private alertService: AlertService,
    private explorerService: ExplorerService,
    private directoryService: DirectoryService,
    private spriteTypeApi: SpriteTypeApi,
  ) {}

  ngOnInit() {
    this.clear();

    this.spriteForm = this.fb.group({
      name: [null, [Validators.required]],
      imagePath: [null, [Validators.required]],
      areaX: [0, [Validators.required, Validators.min(0), Validators.max(1000)]],
      areaY: [0, [Validators.required, Validators.min(0), Validators.max(1000)]],
      areaWidth: [null, [Validators.required, Validators.min(0), Validators.max(1000)]],
      areaHeight: [null, [Validators.required, Validators.min(0), Validators.max(1000)]],
    });
  }

  clear() {
    this.imagePath = null;
    this.areaX = null;
    this.areaY = null;
    this.areaWidth = null;
    this.areaHeight = null;
  }

  invalidName() {
    let name = this.spriteForm.get('name');
    return name.touched && name.hasError('required');
  }

  invalidImagePath() {
    let imagePath = this.spriteForm.get('imagePath');
    return imagePath.touched && imagePath.hasError('required');
  }

  invalidAreaX() {
    let areaX = this.spriteForm.get('areaX');
    return areaX.touched && (areaX.hasError('required') || areaX.hasError('min') || areaX.hasError('max'));
  }

  invalidAreaY() {
    let areaY = this.spriteForm.get('areaY');
    return areaY.touched && (areaY.hasError('required') || areaY.hasError('min') || areaY.hasError('max'));
  }

  invalidAreaWidth() {
    let areaWidth = this.spriteForm.get('areaWidth');
    return areaWidth.touched && (areaWidth.hasError('required') || areaWidth.hasError('min') || areaWidth.hasError('max'));
  }

  invalidAreaHeight() {
    let areaHeight = this.spriteForm.get('areaHeight');
    return areaHeight.touched && (areaHeight.hasError('required') || areaHeight.hasError('min') || areaHeight.hasError('max'));
  }

  cancel() {
    this.onCancel.emit();
  }

  createSprite() {
    let libraryId = this.explorerService.getSelectedLibraryId();
    let directoryPath = this.directoryService.getCurrentDirectoryPath();
    let spriteName = this.name;
    let treePath = PathUtil.combine(directoryPath, spriteName);

    let image: Image = null;

    let newSprite: SpriteType = {
      name: spriteName,
      treePath: treePath,
      parent: directoryPath,
      tags: null,
      imagePath: image.treePath,
      image: image,
      areaX: this.areaX,
      areaY: this.areaY,
      areaWidth: this.areaWidth,
      areaHeight: this.areaHeight,
      markers: null,
    };

    const operation = this.loaderService.startOperation('Creating sprite');
    this.spriteTypeApi.createSpriteType(libraryId, ApiHelper.path(treePath), newSprite)
      .toPromise()
      .then(() => {
        operation.stop();
        this.alertService.success('Sprite created successfully');
        this.onSpriteCreated.emit();
      }, rejectReason => {
        operation.stop();
        this.alertService.error('Failed to create sprite (' + rejectReason + ')');
      });

  }

}
