import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Util } from '../util/util';
import { Observable, throwError } from 'rxjs';
import { ResponseModel } from '../models/response-model';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ProgramsService {

    util: Util = new Util();

    constructor(private httpClient: HttpClient) { }

    getPrograms(): Observable<ResponseModel> {
        return this.httpClient.
            get<ResponseModel>(this.util.baseUrl + '/ProgramasAcademicos/GetAll');
    }

    addEditProgram(modeloPrograma: any, operacion: string): Observable<ResponseModel> {
        const action = operacion === 'ADD' ? 'Create' : 'Update';
        const model = this.buildModelProgram(modeloPrograma);
        return this.httpClient
            .post<ResponseModel>(this.util.baseUrl + '/ProgramasAcademicos/' + action, model, { headers: this.util.getHeaderToken() })
            .pipe(catchError(error => {
                return throwError(error);
            }));
    }

    deleteProgram(modeloPrograma: any): Observable<ResponseModel> {
        const model = this.buildModelProgram(modeloPrograma);
        return this.httpClient
            .post<ResponseModel>(this.util.baseUrl + '/ProgramasAcademicos/Delete', model, { headers: this.util.getHeaderToken() })
            .pipe(catchError(error => {
                return throwError(error);
            }));
    }

    buildModelProgram(modeloPrograma: any) {
        return {
            Codigo: modeloPrograma.codigo,
            CodigoPrograma: modeloPrograma.codigoPrograma,
            Nombre: modeloPrograma.nombre
        };
    }
}
