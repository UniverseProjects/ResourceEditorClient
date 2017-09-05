import {Component} from '@angular/core';

@Component({
  selector: 'app-explorer',
  template: `
    <app-directory-tree></app-directory-tree>
    <div class="image-container">
      <app-images></app-images>
    </div>
  `,
  styles: [`
    .image-container {
      width: 500px;
      display: inline-block;
      vertical-align: top;
    }
  `],
})
export class ExplorerComponent {

}
