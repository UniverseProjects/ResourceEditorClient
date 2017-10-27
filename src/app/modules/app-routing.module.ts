import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {ExplorerComponent} from '../components/explorer.component';
import {SandboxComponent} from '../components/sandbox.component';

const routes: Routes = [
    {path: '', redirectTo: '/explorer', pathMatch: 'full'},
    {path: 'explorer', component: ExplorerComponent},
    {path: 'sandbox', component: SandboxComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
