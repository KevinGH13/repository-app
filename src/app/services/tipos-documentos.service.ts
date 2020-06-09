import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Util } from '../util/util';
import { Observable, throwError } from 'rxjs';
import { ResponseModel } from '../models/response-model';
import { catchError } from 'rxjs/operators';

@Injectable()
export class TiposDocumentosService {

    util: Util = new Util();

    constructor(private httpClient: HttpClient) { }

    getTipoRecursos(): Observable<ResponseModel> {
        return this.httpClient.
            get<ResponseModel>(this.util.baseUrl + '/TiposRecursos/GetAll');
    }

    addEditTipoRecurso(modeloTipoRecurso: any, operacion: string): Observable<ResponseModel> {
        const action = operacion === 'ADD' ? 'Create' : 'Update';
        const model = this.buildModelTipoRecurso(modeloTipoRecurso);
        return this.httpClient
            .post<ResponseModel>(this.util.baseUrl + '/TiposRecursos/' + action, model, { headers: this.util.getHeaderToken() })
            .pipe(catchError(error => {
                return throwError(error);
            }));
    }

    deleteTipoRecurso(modeloTipoRecurso: any): Observable<ResponseModel> {
        const model = this.buildModelTipoRecurso(modeloTipoRecurso);
        return this.httpClient
            .post<ResponseModel>(this.util.baseUrl + '/TiposRecursos/Delete', model, { headers: this.util.getHeaderToken() })
            .pipe(catchError(error => {
                return throwError(error);
            }));
    }

    buildModelTipoRecurso(modeloTipoRecurso: any) {
        return {
            Codigo: modeloTipoRecurso.codigo,
            Nombre: modeloTipoRecurso.nombre
        };
    }
}
