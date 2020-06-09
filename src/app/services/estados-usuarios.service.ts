import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Util } from '../util/util';
import { Observable, throwError } from 'rxjs';
import { ResponseModel } from '../models/response-model';
import { catchError } from 'rxjs/operators';

@Injectable()
export class EstadosUsuarioService {

    util: Util = new Util();

    constructor(private httpClient: HttpClient) { }

    getEstadosUsuario(): Observable<ResponseModel> {
        return this.httpClient.
            get<ResponseModel>(this.util.baseUrl + '/EstadosUsuarios/GetAll', { headers: this.util.getHeaderToken() })
            .pipe(catchError(error => {
                return throwError(error);
            }));
    }

    addEditEstadoUsuario(modeloEstadoUsuario: any, operacion: string): Observable<ResponseModel> {
        const action = operacion === 'ADD' ? 'Create' : 'Update';
        const model = this.buildModelEstadoUsuario(modeloEstadoUsuario);
        return this.httpClient
            .post<ResponseModel>(this.util.baseUrl + '/EstadosUsuarios/' + action, model, { headers: this.util.getHeaderToken() })
            .pipe(catchError(error => {
                return throwError(error);
            }));
    }

    deleteEstadoUsuario(modeloEstadoUsuario: any): Observable<ResponseModel> {
        const model = this.buildModelEstadoUsuario(modeloEstadoUsuario);
        return this.httpClient
            .post<ResponseModel>(this.util.baseUrl + '/EstadosUsuarios/Delete', model, { headers: this.util.getHeaderToken() })
            .pipe(catchError(error => {
                return throwError(error);
            }));
    }

    buildModelEstadoUsuario(modeloEstadoUsuario: any) {
        return {
            Codigo: modeloEstadoUsuario.codigo,
            Nombre: modeloEstadoUsuario.nombre,
            IndActivo: modeloEstadoUsuario.indActivo
        };
    }
}
