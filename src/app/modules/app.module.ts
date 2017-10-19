import 'rxjs/add/operator/toPromise';

import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
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
import {ImagesViewComponent} from '../components/images.view.component';
import {AlertComponent} from '../components/alert.component';
import {LoaderComponent} from '../components/loader.component';
import {DirectoryTreeComponent} from '../components/directory.tree.component';
import {ThumbnailsComponent} from '../components/thumbnails.component';
import {SpriteTypesViewComponent} from '../components/sprites.view.component';
import {AnimatedSpriteTypesViewComponent} from '../components/animated.sprites.view.component';
import {PropertiesComponent} from '../components/properties.component';
import {DirectoryViewComponent} from '../components/directory.view.component';
import {ConfirmationPopoverModule} from 'angular-confirmation-popover';
import {DirectoryService} from '../services/directory.service';
import {TreeApi} from '../swagger/api/TreeApi';
import {ImageApi} from '../swagger/api/ImageApi';
import {SpriteTypeApi} from '../swagger/api/SpriteTypeApi';
import {AnimatedSpriteTypeApi} from '../swagger/api/AnimatedSpriteTypeApi';
import {ImageFrameComponent} from '../components/image.frame.component';
import {SpriteTypeEditorComponent} from '../components/sprite.editor.component';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        AppRoutingModule,
        TreeModule,
        AlertModule.forRoot(), // Bootstrap
        ButtonsModule.forRoot(),
        LoadingModule,
        ConfirmationPopoverModule.forRoot({
          confirmButtonType: 'danger',
          cancelButtonType: 'secondary',
        }),
    ],
    declarations: [
        AppComponent,
        DirectoryTreeComponent,
        ThumbnailsComponent,
        AlertComponent,
        LoaderComponent,
        ImageFrameComponent,
        PropertiesComponent,
        ImagesViewComponent,
        SpriteTypesViewComponent,
        SpriteTypeEditorComponent,
        AnimatedSpriteTypesViewComponent,
        DirectoryViewComponent,
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
