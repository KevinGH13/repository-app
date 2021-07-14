import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Util } from '../util/util';
import { Observable } from 'rxjs';
import { ResponseModel } from '../models/response-model';

@Injectable()
export class MetadataService {

  util: Util = new Util();

  constructor(private httpClient: HttpClient) { }

  getResourcesByCod(codigo: string): Observable<ResponseModel> {
    const httParams = new HttpParams()
      .append('codigo', codigo);

    return this.httpClient.post<ResponseModel>(this.util.baseUrl + '/Recursos/SearchByCod', {}, { params: httParams });
  }
}
