import { Injectable } from '@angular/core';
import { Util } from '../util/util';
import { HttpClient } from '@angular/common/http';
import { ResponseModel } from '../models/response-model';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class SedesService {

  util: Util = new Util();

  constructor(private httpClient: HttpClient) { }

  getSedes(): Observable<ResponseModel> {
      return this.httpClient.
          get<ResponseModel>(this.util.baseUrl + '/Sedes/GetAll');
  }

  addEditSede(modeloSede: any, operacion: string): Observable<ResponseModel> {
      const action = operacion === 'ADD' ? 'Create' : 'Update';
      const model = this.buildModelSede(modeloSede);
      return this.httpClient
          .post<ResponseModel>(this.util.baseUrl + '/Sedes/' + action, model, { headers: this.util.getHeaderToken() })
          .pipe(catchError(error => {
              return throwError(error);
          }));
  }

  deleteSede(modeloSede: any): Observable<ResponseModel> {
      const model = this.buildModelSede(modeloSede);
      return this.httpClient
          .post<ResponseModel>(this.util.baseUrl + '/Sedes/Delete', model, { headers: this.util.getHeaderToken() })
          .pipe(catchError(error => {
              return throwError(error);
          }));
  }

  buildModelSede(modeloSede: any) {
      return {
          Codigo: modeloSede.codigo,
          Nombre: modeloSede.nombre
      };
  }
}
