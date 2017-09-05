import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {ExplorerComponent} from '../components/explorer.component';

const routes: Routes = [
    {path: '', redirectTo: '/explorer', pathMatch: 'full'},
    {path: 'explorer', component: ExplorerComponent},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
