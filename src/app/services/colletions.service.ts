import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Util } from '../util/util';
import { Observable } from 'rxjs';
import { ResponseModel } from '../models/response-model';

@Injectable()
export class ColletionsService {

    util: Util = new Util();

    constructor(private httpClient: HttpClient) { }

    getColletions(): Observable<ResponseModel> {
        return this.httpClient.
            get<ResponseModel>(this.util.baseUrl + '/Coleccion/GetAll');
    }
}
