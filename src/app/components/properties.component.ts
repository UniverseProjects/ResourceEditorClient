import {Component, Input, OnChanges, SimpleChange, SimpleChanges} from '@angular/core';

@Component({
  selector: 'properties',
  styles: [`
    .property-name {
      font-weight: bold;
    }
  `],
  template: `    
    <div class="table-responsive">
      <table class="table table-striped">
        <tbody>
          <tr *ngFor="let property of _properties">
            <td class="property-name">{{property.name}}</td>
            <td>{{property.value}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
})
export class PropertiesComponent implements OnChanges {
  @Input() properties: Property[] = null;
  @Input() object: any = null;

  _properties: Property[] = [];

  ngOnChanges(changes: SimpleChanges) {
    const propertiesChange: SimpleChange = changes.properties;
    if (propertiesChange) {
      this._properties = [];

      const newProperties = propertiesChange.currentValue;
      if (newProperties) {
        this._properties = newProperties;
        return; // this takes precedence over the object input
      }
    }

    const objectChange: SimpleChange = changes.object;
    if (objectChange) {
      this._properties = [];

      const newObject = objectChange.currentValue;
      if (newObject) {
        let ownProps: string[] = [];
        for (let prop in newObject) {
          if (newObject.hasOwnProperty(prop)) {
            ownProps.push(prop);
          }
        }
        ownProps.sort(); // sort after collecting all the property names
        for (let p of ownProps) {
          this._properties.push(new Property(p, newObject[p]));
        }
        return;
      }
    }
  }
}
export class Property {
  name: string;
  value: any;
  constructor(name: string, value: any) {
    this.name = name;
    this.value = value;
  }
}
