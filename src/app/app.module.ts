import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbPaginationModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { Meta } from '@angular/platform-browser';

// Routes
import { AppRoutingModule } from './app-routing.module';

// Services
import { FacultiesService } from './services/faculties.service';
import { ResourcesService } from '../app/services/resources.service';
import { UsersService } from './services/users.service';
import { TiposDocumentosService } from './services/tipos-documentos.service';
import { ParametrosGeneralesService } from './services/parametros-generales.service';
import { EstadosUsuarioService } from './services/estados-usuarios.service';
import { RolesService } from './services/roles-service';
import { LoginService } from './services/login.service';
import { AuthGuardService } from './services/auth-guard.service';
import { SedesService } from './services/sedes.service';
import { ChangePasswordService } from './services/change-password.service';
import { ProgramsService } from './services/programs.service';
import { MetadataService } from './services/metadata.service';
import { ColletionsService } from './services/colletions.service';

// Components
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { ResourcesComponent } from './components/resources/resources.component';
import { UsersComponent } from './components/users/users.component';
import { LoginComponent } from './components/login/login.component';
import { ParametrosGeneralesComponent } from './components/parametros-generales/parametros-generales.component';
import { TipoDocumentosComponent } from './components/tipo-documentos/tipo-documentos.component';
import { FacultadesComponent } from './components/facultades/facultades.component';
import { EstadosUsuariosComponent } from './components/estados-usuarios/estados-usuarios.component';
import { RolesComponent } from './components/roles/roles.component';
import { SedesComponent } from './components/sedes/sedes.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { ProgramasComponent } from './components/programas/programas.component';
import { DiscoverComponent } from './components/discover/discover.component';
import { RecursoComponent } from './components/recurso/recurso.component';
import { MetadataComponent } from './components/metadata/metadata.component';
import { DatepickerComponent } from './components/datepicker/datepicker.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    ResourcesComponent,
    DiscoverComponent,
    UsersComponent,
    LoginComponent,
    ParametrosGeneralesComponent,
    TipoDocumentosComponent,
    FacultadesComponent,
    EstadosUsuariosComponent,
    RolesComponent,
    SedesComponent,
    ChangePasswordComponent,
    ProgramasComponent,
    RecursoComponent,
    MetadataComponent,
    DatepickerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxPaginationModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbPaginationModule,
    NgbAlertModule
  ],
  providers: [
    FacultiesService,
    ResourcesService,
    UsersService,
    TiposDocumentosService,
    ParametrosGeneralesService,
    EstadosUsuarioService,
    RolesService,
    LoginService,
    AuthGuardService,
    SedesService,
    ChangePasswordService,
    ProgramsService,
    MetadataService,
    ColletionsService,
    Meta
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
