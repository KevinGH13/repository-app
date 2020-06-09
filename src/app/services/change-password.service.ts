import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Util } from '../util/util';
import { ResponseModel } from '../models/response-model';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class ChangePasswordService {

  util: Util = new Util();

  constructor(private httpClient: HttpClient, private router: Router) { }

  changePassword(modelCambioContrasena: any): Observable<ResponseModel> {
    return this.httpClient.post<ResponseModel>(this.util.baseUrl + '/Login/ChangePassword',
           this.buildModelLogin(modelCambioContrasena), { headers: this.util.getHeaderToken() });
  }

  buildModelLogin(modelCambioContrasena: any) {
    return {
      ContrasenaActual: modelCambioContrasena.actualPassword,
      ContrasenaNueva: modelCambioContrasena.newPassword,
    };
  }

}

