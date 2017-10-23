import {Component, OnDestroy, OnInit} from '@angular/core';
import {PathUtil} from '../common/path.util';
import {SpriteType} from '../swagger/model/SpriteType';
import {ApiHelper} from '../common/api.helper';
import {LoaderService} from '../services/loader.service';
import {ExplorerService, ExplorerView} from '../services/explorer.service';
import {DirectoryService} from '../services/directory.service';
import {SpriteTypeApi} from '../swagger/api/SpriteTypeApi';
import {AlertService} from '../services/alert.service';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn} from '@angular/forms';
import {C} from '../common/common';
import {Subscription} from 'rxjs/Subscription';


@Component({
  selector: 'sprite-type-editor',
  styles: [`
    .field-label {
    }
  `],
  template: `
    <div class="sprite-type-editor-container" *ngIf="active">
      <form novalidate [formGroup]="form" (submit)="submit()">
        <div class="form-row">
          <div class="form-group col-lg-12">
            <label for="name" class="field-label">Sprite type name</label>
            <input id="name" name="name" formControlName="name" class="form-control" type="text"
                   [class.is-invalid]="isInvalid('name')" placeholder="Enter a unique name for this sprite type"/>
            <div class="invalid-feedback" *ngIf="isInvalid('name')">{{getErrorMessage('name')}}</div>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group col-lg-12">
            <label for="imagePath" class="field-label">Image path</label>
            <input id="imagePath" name="imagePath" formControlName="imagePath" class="form-control" type="text"
                   [class.is-invalid]="isInvalid('imagePath')" placeholder="Enter the image path"/>
            <div class="invalid-feedback" *ngIf="isInvalid('imagePath')">{{getErrorMessage('imagePath')}}</div>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group col-xs-12 col-sm-6 col-md-3">
            <label for="areaX" class="field-label">Area x-coordinate</label>
            <input id="areaX" name="areaX" formControlName="areaX" class="form-control" type="number" (change)="forceValidation('areaWidth')"
                   [class.is-invalid]="isInvalid('areaX')" placeholder="X-coordinate"/>
            <div class="invalid-feedback" *ngIf="isInvalid('areaX')">{{getErrorMessage('areaX')}}</div>
          </div>
          <div class="form-group col-xs-12 col-sm-6 col-md-3">
            <label for="areaY" class="field-label">Area y-coordinate</label>
            <input id="areaY" name="areaY" formControlName="areaY" class="form-control" type="number" (change)="forceValidation('areaHeight')"
                   [class.is-invalid]="isInvalid('areaY')" placeholder="Y-coordinate"/>
            <div class="invalid-feedback" *ngIf="isInvalid('areaY')">{{getErrorMessage('areaY')}}</div>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group col-xs-12 col-sm-6 col-md-3">
            <label for="areaWidth" class="field-label">Area width</label>
            <input id="areaWidth" name="areaWidth" formControlName="areaWidth" class="form-control" type="number"
                   [class.is-invalid]="isInvalid('areaWidth')" placeholder="Width"/>
            <div class="invalid-feedback" *ngIf="isInvalid('areaWidth')">{{getErrorMessage('areaWidth')}}</div>
          </div>
          <div class="form-group col-xs-12 col-sm-6 col-md-3">
            <label for="areaHeight" class="field-label">Area height</label>
            <input id="areaHeight" name="areaHeight" formControlName="areaHeight" class="form-control" type="number"
                   [class.is-invalid]="isInvalid('areaHeight')" placeholder="Height"/>
            <div class="invalid-feedback" *ngIf="isInvalid('areaHeight')">{{getErrorMessage('areaHeight')}}</div>
          </div>
        </div>
        <div class="form-row" style="padding-top: 10px;">
          <div class="form-group col-md-12">
            <button type="submit" class="btn btn-outline-success">
              Create sprite type
            </button>
            <button type="button" class="btn btn-outline-secondary" (click)="cancel()">Cancel</button>
          </div>
        </div>
      </form>
    </div>
  `,
})
export class SpriteTypeEditorComponent implements OnInit, OnDestroy {
  active = false;
  form: FormGroup;

  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private loaderService: LoaderService,
    private alertService: AlertService,
    private explorerService: ExplorerService,
    private directoryService: DirectoryService,
    private spriteTypeApi: SpriteTypeApi,
  ) {}

  ngOnInit() {
    this.subscriptions.push(this.explorerService.openView$.subscribe((view) => {
      this.active = view === ExplorerView.SPRITE_TYPE_EDIT;
    }));
    this.subscriptions.push(this.explorerService.reloadView$.subscribe((view) => {
      if (view === ExplorerView.SPRITE_TYPE_EDIT) {
        this.reloadContent();
      }
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions.length = 0;
  }

  clear() {
    this.form.reset();
  }

  reloadContent() {
    let name = null;
    let imagePath = null;
    let areaWidth = null;
    let areaHeight = null;
    let maxW = 9999;
    let maxH = 9999;

    const img = this.explorerService.getSelectedImage();
    if (img) {
      name = PathUtil.trimExtension(img.name);
      imagePath = img.treePath;
    }

    const info = this.explorerService.getSelectedImageInfo();
    if (info) {
      maxW = info.naturalWidth;
      maxH = info.naturalHeight;
      areaWidth = maxW;
      areaHeight = maxH;
    }

    this.form = this.fb.group({
      name: [name, SpriteTypeEditorComponent.validateName],
      imagePath: [imagePath, SpriteTypeEditorComponent.validateImagePath],
      areaX: [0, SpriteTypeEditorComponent.validateRange(()=>{return 0}, ()=>{return maxW})],
      areaY: [0, SpriteTypeEditorComponent.validateRange(()=>{return 0}, ()=>{return maxH})],
      areaWidth: [areaWidth, SpriteTypeEditorComponent.validateRange(()=>{return 0}, ()=>{return this.diff(maxW, 'areaX')})],
      areaHeight: [areaHeight, SpriteTypeEditorComponent.validateRange(()=>{return 0}, ()=>{return this.diff(maxH, 'areaY')})],
    });
  }

  private diff(ceiling: number, floorInputName: string): number {
    let floor: number = 0;
    if (this.form) {
      let value = this.form.get(floorInputName).value;
      if (C.defined(value)) {
        floor = value;
      }
    }
    return Math.max(0, ceiling - floor);
  }

  private static validateName(control: AbstractControl): ValidationErrors {
    let val = control.value;
    if (C.emptyStr(val)) {
      return SpriteTypeEditorComponent.createErrorObject('Sprite name is required');
    }
    return null;
  }

  private static validateImagePath(control: AbstractControl): ValidationErrors {
    let val = control.value;
    if (C.emptyStr(val)) {
      return SpriteTypeEditorComponent.createErrorObject('Image path is required');
    }
    if (!PathUtil.isValid(val)) {
      return SpriteTypeEditorComponent.createErrorObject('Invalid image path');
    }
    return null;
  }

  private static validateRange(minF: () => number, maxF: () => number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors => {
      const val = control.value;
      if (!C.defined(val)) {
        return SpriteTypeEditorComponent.createErrorObject('Value is required');
      }
      const min = minF();
      const max = maxF();
      if (val < min || val > max) {
        return SpriteTypeEditorComponent.createErrorObject('Value must be in the ['+min+'..'+max+'] range');
      }
      return null;
    }
  }

  private static createErrorObject(errorMessage: string): ValidationErrors {
    return {"customValidator": {errorMessage: errorMessage}};
  }

  getErrorMessage(controlSelector: string): string {
    let control = this.getControl(controlSelector);
    let error = control.getError('customValidator');
    return error ? error.errorMessage : (control.invalid ? 'Invalid value' : null);
  }

  getControl(controlSelector: string): AbstractControl {
    let control = this.form.get(controlSelector);
    if (!control) {
      throw new Error('Form control not found for selector: ' + controlSelector);
    }
    return control;
  }

  isInvalid(controlSelector: string): boolean {
    let control = this.getControl(controlSelector);
    return control.invalid && !control.pristine;
  }

  forceValidation(controlSelector: string) {
    let control = this.form.get(controlSelector);
    control.markAsTouched();
    control.markAsDirty();
    control.updateValueAndValidity({
      emitEvent: true,
    });
  }

  cancel() {
    this.clear();
    this.explorerService.openLastView();
  }

  submit() {
    if (this.form.invalid) {
      this.alertService.warn('Please fix validation errors');
      return;
    }
    this.createSpriteType();
  }

  createSpriteType() {
    let libraryId = this.explorerService.getSelectedLibraryId();
    let directoryPath = this.directoryService.getCurrentDirectoryPath();
    let name = this.form.get('name').value;
    let treePath = PathUtil.combine(directoryPath, name);

    let newSpriteType: SpriteType = {
      name: name,
      treePath: treePath,
      parent: directoryPath,
      imagePath: this.form.get('imagePath').value,
      areaX: this.form.get('areaX').value,
      areaY: this.form.get('areaY').value,
      areaWidth: this.form.get('areaWidth').value,
      areaHeight: this.form.get('areaHeight').value,
    };

    const operation = this.loaderService.startOperation('Creating sprite type');
    this.spriteTypeApi.createSpriteType(libraryId, ApiHelper.path(treePath), newSpriteType)
      .toPromise()
      .then(() => {
        operation.stop();
        this.alertService.success('Sprite type created successfully');
        this.clear();
        this.explorerService.openAndReloadView(ExplorerView.SPRITE_TYPE_LIST);
      }, rejectReason => {
        operation.stop();
        this.alertService.error('Failed to create sprite type (' + rejectReason + ')');
      });
  }

}

