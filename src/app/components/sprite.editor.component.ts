import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {PathUtil} from '../common/path.util';
import {SpriteType} from '../swagger/model/SpriteType';
import {ApiHelper} from '../common/api.helper';
import {LoaderService} from '../services/loader.service';
import {ExplorerService} from '../services/explorer.service';
import {DirectoryService} from '../services/directory.service';
import {SpriteTypeApi} from '../swagger/api/SpriteTypeApi';
import {AlertService} from '../services/alert.service';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn} from '@angular/forms';
import {C} from '../common/common';

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
            <input id="name" name="name" formControlName="name" class="form-control" type="text"
                   [class.is-invalid]="isInvalid('name')" placeholder="Enter a unique name for this sprite"/>
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
            <input id="areaX" name="areaX" formControlName="areaX" class="form-control" type="number"
                   [class.is-invalid]="isInvalid('areaX')" placeholder="X-coordinate"/>
            <div class="invalid-feedback" *ngIf="isInvalid('areaX')">{{getErrorMessage('areaX')}}</div>
          </div>
          <div class="form-group col-xs-12 col-sm-6 col-md-3">
            <label for="areaY" class="field-label">Area y-coordinate</label>
            <input id="areaY" name="areaY" formControlName="areaY" class="form-control" type="number"
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
            <button type="button" class="btn btn-outline-success"
                    mwlConfirmationPopover placement="right"
                    title="Are you sure?" message="Proceed with sprite creation?"
                    [disabled]="spriteForm.invalid"
                    (confirm)="createSprite()">Create sprite
            </button>
            <button type="button" class="btn btn-outline-secondary" (click)="cancel()">Cancel</button>
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

  constructor(
    private fb: FormBuilder,
    private loaderService: LoaderService,
    private alertService: AlertService,
    private explorerService: ExplorerService,
    private directoryService: DirectoryService,
    private spriteTypeApi: SpriteTypeApi,
  ) {}

  ngOnInit() {
    // TODO: default values temporarily hard-coded for a particular image
    const W = 241; const H = 209;

    this.spriteForm = this.fb.group({
      name: ['foo', SpriteEditorComponent.validateName],
      imagePath: ['/sandbox/foo.png', SpriteEditorComponent.validateImagePath],
      areaX: [0, SpriteEditorComponent.validateRange(0, W)],
      areaY: [0, SpriteEditorComponent.validateRange(0, H)],
      areaWidth: [W, SpriteEditorComponent.validateRange(0, W)],
      areaHeight: [H, SpriteEditorComponent.validateRange(0, H)],
    });
  }

  clear() {
    this.spriteForm.reset();
  }

  private static validateName(control: AbstractControl): ValidationErrors {
    let val = control.value;
    if (C.emptyStr(val)) {
      return SpriteEditorComponent.createErrorObject('Sprite name is required');
    }
    return null;
  }

  private static validateImagePath(control: AbstractControl): ValidationErrors {
    let val = control.value;
    if (C.emptyStr(val)) {
      return SpriteEditorComponent.createErrorObject('Image path is required');
    }
    if (!PathUtil.isValid(val)) {
      return SpriteEditorComponent.createErrorObject('Invalid image path');
    }
    return null;
  }

  private static validateRange(min: number, max: number): ValidatorFn {
    if (!C.defined(min) || !C.defined(max) || min > max) {
      throw new Error('Invalid range bounds: ' + min + ', ' + max);
    }
    return (control: AbstractControl): ValidationErrors => {
      let val = control.value;
      if (!C.defined(val)) {
        return SpriteEditorComponent.createErrorObject('Value is required');
      }
      if (val < min || val > max) {
        return SpriteEditorComponent.createErrorObject('Value must be in the ['+min+'..'+max+'] range');
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
    let control = this.spriteForm.get(controlSelector);
    if (!control) {
      throw new Error('Form control not found for selector: ' + controlSelector);
    }
    return control;
  }

  isInvalid(controlSelector: string): boolean {
    let control = this.getControl(controlSelector);
    return control.invalid && !control.pristine;
  }

  cancel() {
    this.onCancel.emit();
  }

  createSprite() {
    if (this.spriteForm.invalid) {
      this.alertService.warn('Please fix validation errors');
      return;
    }

    let libraryId = this.explorerService.getSelectedLibraryId();
    let directoryPath = this.directoryService.getCurrentDirectoryPath();
    let spriteName = this.spriteForm.value.name;
    let treePath = PathUtil.combine(directoryPath, spriteName);

    let newSprite: SpriteType = {
      name: spriteName,
      treePath: treePath,
      parent: directoryPath,
      tags: null,
      imagePath: this.spriteForm.value.treePath,
      image: null,
      areaX: this.spriteForm.value.areaX,
      areaY: this.spriteForm.value.areaY,
      areaWidth: this.spriteForm.value.areaWidth,
      areaHeight: this.spriteForm.value.areaHeight,
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
