import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ResourcesComponent } from './components/resources/resources.component';
import { UsersComponent } from './components/users/users.component';
import { LoginComponent } from './components/login/login.component';
import { TipoDocumentosComponent } from './components/tipo-documentos/tipo-documentos.component';
import { FacultadesComponent } from './components/facultades/facultades.component';
import { ParametrosGeneralesComponent } from './components/parametros-generales/parametros-generales.component';
import { EstadosUsuariosComponent } from './components/estados-usuarios/estados-usuarios.component';
import { RolesComponent } from './components/roles/roles.component';
import { AuthGuardService } from './services/auth-guard.service';
import { SedesComponent } from './components/sedes/sedes.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { ProgramasComponent } from './components/programas/programas.component';
import { DiscoverComponent } from './components/discover/discover.component';
import { RecursoComponent } from './components/recurso/recurso.component';
import { MetadataComponent } from './components/metadata/metadata.component';


const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'resources', component: ResourcesComponent },
  { path: 'resources/:id/:search/:title', component: ResourcesComponent },
  { path: 'recurso', component: RecursoComponent },
  { path: 'recurso/:id/:search', component: RecursoComponent },
  { path: 'metadata', component: MetadataComponent },
  { path: 'metadata/:id/', component: MetadataComponent },
  { path: 'discover', component: DiscoverComponent },
  { path: 'discover/:id/:search/:title', component: DiscoverComponent },
  { path: 'users', component: UsersComponent, canActivate: [AuthGuardService] },
  { path: 'login', component: LoginComponent },
  { path: 'tipos-documentos', component: TipoDocumentosComponent, canActivate: [AuthGuardService] },
  { path: 'facultades', component: FacultadesComponent, canActivate: [AuthGuardService] },
  { path: 'programas', component: ProgramasComponent, canActivate: [AuthGuardService] },
  { path: 'parametros-generales', component: ParametrosGeneralesComponent, canActivate: [AuthGuardService] },
  { path: 'estados-usuarios', component: EstadosUsuariosComponent, canActivate: [AuthGuardService] },
  { path: 'roles', component: RolesComponent, canActivate: [AuthGuardService] },
  { path: 'sedes', component: SedesComponent, canActivate: [AuthGuardService] },
  { path: 'changePassword', component: ChangePasswordComponent, canActivate: [AuthGuardService] },
  { path: '**', pathMatch: 'full', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
