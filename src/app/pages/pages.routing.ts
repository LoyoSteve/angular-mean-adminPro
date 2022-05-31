import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "../guards/auth.guard";
import { AdminGuard } from "../pipes/admin.guard";
import { AccountSettingsComponent } from "./account-settings/account-settings.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { GlobalSearchComponent } from "./global-search/global-search.component";
import { Grafica1Component } from "./grafica1/grafica1.component";
import { HospitalesComponent } from "./mantenimiento/hospitales/hospitales.component";
import { MedicoEditComponent } from "./mantenimiento/medicos/medico-edit/medico-edit.component";
import { MedicosComponent } from "./mantenimiento/medicos/medicos.component";
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
            //search global
            { path: 'buscar/:searchTerm', component: GlobalSearchComponent, data: { title: 'Busquedas'}},
            //mantenimientos
            { path: 'usuarios', canActivate: [AdminGuard], component: UsuariosComponent, data: { title: 'Mantenimiento de usuarios'}},
            { path: 'hospitales', component: HospitalesComponent, data: { title: 'Mantenimiento de hospitales'}},
            { path: 'medicos', component: MedicosComponent, data: { title: 'Mantenimiento de medicos'}},
            { path: 'medicos/:id', component: MedicoEditComponent, data: { title: 'Formulario medicos'}},
        ]
    },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class PagesRoutingModule { }
