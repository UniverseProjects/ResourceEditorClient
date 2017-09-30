import 'rxjs/add/operator/toPromise';

import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {TreeModule} from 'angular-tree-component';
import {AlertModule, ButtonsModule} from 'ngx-bootstrap';
import {LoadingModule} from 'ngx-loading';

import {AppRoutingModule} from './app-routing.module';

import {AlertService} from '../services/alert.service';
import {LoaderService} from '../services/loader.service';
import {ExplorerService} from '../services/explorer.service';

import {AppComponent} from '../components/app.component';
import {ExplorerComponent} from '../components/explorer.component';
import {ImagesComponent} from '../components/images.component';
import {AlertComponent} from '../components/alert.component';
import {LoaderComponent} from '../components/loader.component';
import {DirectoryTreeComponent} from '../components/directory.tree.component';
import {ThumbnailsComponent} from '../components/thumbnails.component';
import {SpritesComponent} from '../components/sprites.component';
import {AnimatedSpritesComponent} from '../components/animated.sprites.component';
import {PropertiesComponent} from '../components/properties.component';
import {DirectoryComponent} from '../components/directory.component';
import {ConfirmationPopoverModule} from 'angular-confirmation-popover';
import {DirectoryService} from '../services/directory.service';
import {TreeApi} from '../swagger/api/TreeApi';
import {ImageApi} from '../swagger/api/ImageApi';
import {SpriteTypeApi} from '../swagger/api/SpriteTypeApi';
import {AnimatedSpriteTypeApi} from '../swagger/api/AnimatedSpriteTypeApi';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        AppRoutingModule,
        TreeModule,
        AlertModule.forRoot(),
        ButtonsModule.forRoot(),
        LoadingModule,
        ConfirmationPopoverModule.forRoot({
          confirmButtonType: 'danger' // set defaults here
        }),
    ],
    declarations: [
        AppComponent,
        DirectoryTreeComponent,
        ThumbnailsComponent,
        AlertComponent,
        LoaderComponent,
        PropertiesComponent,
        ImagesComponent,
        SpritesComponent,
        AnimatedSpritesComponent,
        DirectoryComponent,
        ExplorerComponent,
    ],
    providers: [
        AlertService,
        LoaderService,
        ExplorerService,
        DirectoryService,
        TreeApi,
        ImageApi,
        SpriteTypeApi,
        AnimatedSpriteTypeApi,
    ],
    bootstrap: [
        AppComponent,
    ],
})
export class AppModule {
}
