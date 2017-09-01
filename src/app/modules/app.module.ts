import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {TreeModule} from 'angular-tree-component';
import {AlertModule} from 'ngx-bootstrap';
import {LoadingModule} from 'ngx-loading';

import {AppRoutingModule} from './app-routing.module';

import {LibraryService} from '../services/library.service';
import {AlertService} from '../services/alert.service';
import {LoaderService} from '../services/loader.service';

import {AppComponent} from '../components/app.component';
import {ExplorerComponent} from '../components/explorer.component';
import {ImagesComponent} from '../components/images.component';
import {AlertComponent} from '../components/alert.component';
import {LoaderComponent} from '../components/loader.component';



@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        AppRoutingModule,
        TreeModule,
        AlertModule.forRoot(),
        LoadingModule,
    ],
    declarations: [
        AppComponent,
        ExplorerComponent,
        ImagesComponent,
        AlertComponent,
        LoaderComponent,
    ],
    providers: [
        LibraryService,
        AlertService,
        LoaderService,
    ],
    bootstrap: [
        AppComponent,
    ],
})
export class AppModule {
}
