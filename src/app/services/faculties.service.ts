import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Util } from '../util/util';
import { Observable, throwError } from 'rxjs';
import { ResponseModel } from '../models/response-model';
import { catchError } from 'rxjs/operators';

@Injectable()
export class FacultiesService {

    util: Util = new Util();

    constructor(private httpClient: HttpClient) { }

    getFaculties(): Observable<ResponseModel> {
        return this.httpClient.
            get<ResponseModel>(this.util.baseUrl + '/AreasConocimiento/GetAll');
    }

    addEditFacultie(modeloFacultad: any, operacion: string): Observable<ResponseModel> {
        const action = operacion === 'ADD' ? 'Create' : 'Update';
        const model = this.buildModelFacultie(modeloFacultad);
        return this.httpClient
            .post<ResponseModel>(this.util.baseUrl + '/AreasConocimiento/' + action, model, { headers: this.util.getHeaderToken() })
            .pipe(catchError(error => {
                return throwError(error);
            }));
    }

    deleteFacultie(modeloFacultad: any): Observable<ResponseModel> {
        const model = this.buildModelFacultie(modeloFacultad);
        return this.httpClient
            .post<ResponseModel>(this.util.baseUrl + '/AreasConocimiento/Delete', model, { headers: this.util.getHeaderToken() })
            .pipe(catchError(error => {
                return throwError(error);
            }));
    }

    buildModelFacultie(modeloFacultad: any) {
        return {
            Codigo: modeloFacultad.codigo,
            Nombre: modeloFacultad.nombre
        };
    }
}
