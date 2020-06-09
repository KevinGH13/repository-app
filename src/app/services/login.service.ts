import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Util } from '../util/util';
import { ResponseModel } from '../models/response-model';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class LoginService {

  util: Util = new Util();

  constructor(private httpClient: HttpClient, private router: Router) { }

  login(modelLogin: any): Observable<ResponseModel> {
    return this.httpClient.post<ResponseModel>(this.util.baseUrl + '/Login/Login', this.buildModelLogin(modelLogin));
  }

  buildModelLogin(modelLogin: any) {
    return {
      Correo: modelLogin.email,
      Contrasena: modelLogin.password
    };
  }

  setToken(infoToken: any) {
    localStorage.setItem('token', infoToken.token);
    localStorage.setItem('expToken', infoToken.expiration);
    this.router.navigate(['/home']);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getExpirationToken() {
    return localStorage.getItem('expToken');
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('expToken');
    this.router.navigate(['/home']);
  }

  isAuthenticate(): boolean {
    const exp = this.getExpirationToken();
    if (!exp) {
      return false;
    }

    const dateNow = new Date().getTime();
    const dateExo = new Date(exp).getTime();
    if (dateNow >= dateExo) {
      return false;
    } else {
      return true;
    }
  }

}
