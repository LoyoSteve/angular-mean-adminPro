import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "../guards/auth.guard";
import { AccountSettingsComponent } from "./account-settings/account-settings.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { Grafica1Component } from "./grafica1/grafica1.component";
import { UsuariosComponent } from "./mantenimiento/usuarios/usuarios.component";
import { PagesComponent } from "./pages.component";
import { ProfileComponent } from "./profile/profile.component";
import { ProgressComponent } from "./progress/progress.component";
import { PromisesComponent } from "./promises/promises.component";
import { RxjsComponent } from "./rxjs/rxjs.component";

const routes: Routes = [
    {
        path: 'dashboard',
        canActivate: [ AuthGuard ],
        component: PagesComponent,
        children: [
            { path: '', component: DashboardComponent, data: { title: 'Principal'} },
            { path: 'progress', component: ProgressComponent, data: { title: 'Progreso en barras'}},
            { path: 'grafica1', component: Grafica1Component, data: { title: 'Grafica #1'}},
            { path: 'account-settings', component: AccountSettingsComponent, data: { title: 'Configuración'}},
            { path: 'promesas', component: PromisesComponent, data: { title: 'Promesas'}},
            { path: 'rxjs', component: RxjsComponent, data: { title: 'RxJs'}},
            { path: 'profile', component: ProfileComponent, data: { title: 'Perfil de usuario'}},
            //mantenimientos
            { path: 'usuarios', component: UsuariosComponent, data: { title: 'Usuarios de aplicacion'}},
        ]
    },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class PagesRoutingModule { }
