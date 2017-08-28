import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {TreeModule} from 'angular-tree-component';
import {AlertModule} from 'ngx-bootstrap';

import {AppRoutingModule} from './app-routing.module';

import {LibraryService} from '../services/library.service';

import {AppComponent} from '../components/app.component';
import {ExplorerComponent} from '../components/explorer.component';
import {ImagesComponent} from '../components/images.component';
import {AlertComponent} from '../components/alert.component';
import {AlertService} from '../services/alert.service';



@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        AppRoutingModule,
        TreeModule,
        AlertModule.forRoot()
    ],
    declarations: [
        AppComponent,
        ExplorerComponent,
        ImagesComponent,
        AlertComponent,
    ],
    providers: [
        LibraryService,
        AlertService,
    ],
    bootstrap: [
        AppComponent,
    ],
})
export class AppModule {
}
