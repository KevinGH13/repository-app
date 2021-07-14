import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Util } from '../util/util';
import { ResponseModel } from '../models/response-model';
import { catchError } from 'rxjs/operators';

@Injectable()
export class UsersService {

    private util: Util = new Util();

    constructor(private httpClient: HttpClient) { }

    getUsers(): Observable<ResponseModel> {
        return this.httpClient.get<ResponseModel>(this.util.baseUrl + '/Usuarios/GetAll', { headers: this.util.getHeaderToken() })
            .pipe(catchError(error => {
                return throwError(error);
            }));
    }

    getRoles(): Observable<ResponseModel> {
        return this.httpClient.get<ResponseModel>(this.util.baseUrl + '/Roles/GetAll', { headers: this.util.getHeaderToken() })
            .pipe(catchError(error => {
                return throwError(error);
            }));
    }

    getEstadosUsuario(): Observable<ResponseModel> {
        return this.httpClient.get<ResponseModel>(this.util.baseUrl + '/EstadosUsuarios/GetAll', { headers: this.util.getHeaderToken() })
            .pipe(catchError(error => {
                return throwError(error);
            }));
    }

    addEditUser(modeloUser: any, operacion: string): Observable<ResponseModel> {
        const action = operacion === 'ADD' ? 'Create' : 'Update';
        const model = this.buildModelUser(modeloUser);
        return this.httpClient
            .post<ResponseModel>(this.util.baseUrl + '/Usuarios/' + action, model, { headers: this.util.getHeaderToken() })
            .pipe(catchError(error => {
                return throwError(error);
            }));
    }

    deleteUser(modeloUser: any): Observable<ResponseModel> {
        const model = this.buildModelUser(modeloUser);
        return this.httpClient
            .post<ResponseModel>(this.util.baseUrl + '/Usuarios/Delete', model, { headers: this.util.getHeaderToken() })
            .pipe(catchError(error => {
                return throwError(error);
            }));
    }

    buildModelUser(modeloUser: any) {
        return {
            Codigo: modeloUser.codigo,
            Nombres: modeloUser.nombres,
            Apellidos: modeloUser.apellidos,
            Correo: modeloUser.correo,
            RolCodigo: 'Default',
            EsuCodigo: 'Default',
            Contrasena: 'DefaultPass'
        };
    }
}
