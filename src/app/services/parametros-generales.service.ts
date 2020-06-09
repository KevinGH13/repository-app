import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Util } from '../util/util';
import { Observable, throwError } from 'rxjs';
import { ResponseModel } from '../models/response-model';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ParametrosGeneralesService {

    util: Util = new Util();

    constructor(private httpClient: HttpClient) { }

    getParametrosGenerales(): Observable<ResponseModel> {
        return this.httpClient.
            get<ResponseModel>(this.util.baseUrl + '/ParametrosGenerales/GetAll', { headers: this.util.getHeaderToken() })
            .pipe(catchError(error => {
                return throwError(error);
            }));
    }

    addEditParametroGeneral(modeloParametroGeneral: any, operacion: string, modeloOriginal: any): Observable<ResponseModel> {
        const modelo = this.buildModelParametroGeneral(modeloParametroGeneral);
        if (operacion === 'ADD') {
            return this.createParametroGeneral(modelo);
        } else {
            return this.editParametroGeneral(modelo, modeloOriginal);
        }
    }

    editParametroGeneral(modelo: any, modeloOriginal: any) {
        return this.httpClient
            .post<ResponseModel>(this.util.baseUrl + '/ParametrosGenerales/Update',
                { modelo, modeloOriginal }, { headers: this.util.getHeaderToken() })
            .pipe(catchError(error => {
                return throwError(error);
            }));
    }

    createParametroGeneral(modeloParametroGeneral: any) {
        return this.httpClient
            .post<ResponseModel>(this.util.baseUrl + '/ParametrosGenerales/Create', modeloParametroGeneral,
                { headers: this.util.getHeaderToken() })
            .pipe(catchError(error => {
                return throwError(error);
            }));
    }

    deleteParametroGeneral(modeloParametroGeneral: any): Observable<ResponseModel> {
        const model = this.buildModelParametroGeneral(modeloParametroGeneral);
        return this.httpClient
            .post<ResponseModel>(this.util.baseUrl + '/ParametrosGenerales/Delete', model, { headers: this.util.getHeaderToken() })
            .pipe(catchError(error => {
                return throwError(error);
            }));
    }

    buildModelParametroGeneral(modeloParametroGeneral: any) {
        return {
            Nombre: modeloParametroGeneral.nombre,
            Valor: modeloParametroGeneral.valor,
            FechaCreacion: modeloParametroGeneral.fechaCreacion ? new Date(modeloParametroGeneral.fechaCreacion) : new Date()
        };
    }
}
