import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Util } from '../util/util';
import { Observable, throwError } from 'rxjs';
import { ResponseModel } from '../models/response-model';
import { catchError } from 'rxjs/operators';

@Injectable()
export class RolesService {

    util: Util = new Util();

    constructor(private httpClient: HttpClient) { }

    getRoles(): Observable<ResponseModel> {
        return this.httpClient.
            get<ResponseModel>(this.util.baseUrl + '/Roles/GetAll', { headers: this.util.getHeaderToken() })
            .pipe(catchError(error => {
                return throwError(error);
            }));
    }
}
