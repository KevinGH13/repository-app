import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Util } from '../util/util';
import { Observable, throwError } from 'rxjs';
import { ResponseModel } from '../models/response-model';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ResourcesService {

    util: Util = new Util();
    public progress: number;
    public message: string;
    constructor(private httpClient: HttpClient) {

    }

    getSedes(): Observable<ResponseModel> {
        return this.httpClient.get<ResponseModel>(this.util.baseUrl + '/Sedes/GetAll', { headers: this.util.getHeaderToken() })
            .pipe(catchError(error => {
                return throwError(error);
            }));
    }

    getAreasConocimiento(): Observable<ResponseModel> {
        return this.httpClient.get<ResponseModel>(this.util.baseUrl + '/AreasConocimiento/GetAll', { headers: this.util.getHeaderToken() })
            .pipe(catchError(error => {
                return throwError(error);
            }));
    }

    getProgramasAcademico(): Observable<ResponseModel> {
        return this.httpClient.get<ResponseModel>(this.util.baseUrl + '/ProgramasAcademicos/GetAll',
            { headers: this.util.getHeaderToken() })
            .pipe(catchError(error => {
                return throwError(error);
            }));
    }

    getTiposLenguaje(): Observable<ResponseModel> {
        return this.httpClient.get<ResponseModel>(this.util.baseUrl + '/TiposLenguajes/GetAll', { headers: this.util.getHeaderToken() })
            .pipe(catchError(error => {
                return throwError(error);
            }));
    }

    getTiposRecursos(): Observable<ResponseModel> {
        return this.httpClient.get<ResponseModel>(this.util.baseUrl + '/TiposRecursos/GetAll', { headers: this.util.getHeaderToken() })
            .pipe(catchError(error => {
                return throwError(error);
            }));
    }

    getColletions(): Observable<ResponseModel> {
        return this.httpClient.get<ResponseModel>(this.util.baseUrl + '/Coleccion/GetAll', { headers: this.util.getHeaderToken() })
            .pipe(catchError(error => {
                return throwError(error);
            }));
    }

    getResources(): Observable<ResponseModel> {
        return this.httpClient.get<ResponseModel>(this.util.baseUrl + '/Recursos/GetAll', { headers: this.util.getHeaderToken() })
            .pipe(catchError(error => {
                return throwError(error);
            }));
    }

    addEditResource(modeloResource: any, operacion: string, file: File): Observable<ResponseModel> {
        const action = operacion === 'ADD' ? 'Create' : 'Update';
        const modelo = this.buildModelResource(modeloResource);
        const extension = modeloResource.archivo.split('.').pop();
        const formData: FormData = new FormData();
        formData.append('file', file);

        const httParams = new HttpParams()
            .append('jsonRecurso', JSON.stringify(modelo))
            .append('extension', extension);

        return this.httpClient.post<ResponseModel>(this.util.baseUrl + '/Recursos/'
            + action, formData, { params: httParams, headers: this.util.getHeaderToken() })
            .pipe(catchError(error => {
                return throwError(error);
            }));
    }

    deleteResource(modeloResource: any): Observable<ResponseModel> {
        const model = this.buildModelResource(modeloResource);
        return this.httpClient
            .post<ResponseModel>(this.util.baseUrl + '/Recursos/Delete', model, { headers: this.util.getHeaderToken() })
            .pipe(catchError(error => {
                return throwError(error);
            }));
    }

    buildModelResource(modeloResource: any) {
        console.log(modeloResource);
        return {
            Codigo: modeloResource.codigo,
            Title: modeloResource.title,
            Alternative: modeloResource.alternative,
            Abstract: modeloResource.abstract,
            Subject: modeloResource.subject,
            Source: modeloResource.source,
            Relation: modeloResource.relation,
            Creator: modeloResource.creator,
            Publisher: modeloResource.publisher,
            Contributor: modeloResource.contributor,
            Advice: modeloResource.advice,
            AccessRights: modeloResource.accessRights,
            Licence: modeloResource.licence,
            DateCreated: modeloResource.dateCreated,
            DateAccepted: modeloResource.dateAccepted,
            DateValid: modeloResource.dateValid,
            DateModified: modeloResource.dateModified,
            DateIssued: modeloResource.dateIssued,
            Format: modeloResource.format,
            Extend: modeloResource.extend,
            Medium: modeloResource.medium,
            Identifier: modeloResource.identifier,
            Doi: modeloResource.doi,
            Uri: modeloResource.uri,
            Issn: modeloResource.issn,
            Isbn: modeloResource.isbn,
            Year: modeloResource.year,
            Spatial: modeloResource.spatial,
            TimCodigo: 'Default',
            Tilcodigo: modeloResource.tilCodigo,
            TirCodigo: modeloResource.tirCodigo,
            ArcCodigo: modeloResource.arcCodigo,
            ProCodigo: modeloResource.proCodigo,
            ColCodigo: modeloResource.colCodigo,
            UsuCodigoCreacion: 'Default',
            SedeCodigo: modeloResource.sedeCodigo,
            IndDescargaRestringida: modeloResource.indDescargaRestringida
        };
    }

    getFileToDownload(codigoRecurso: string, isView: string = 'N'): Observable<Blob> {
        const httParams = new HttpParams()
            .append('codigoRecurso', codigoRecurso)
            .append('isView', isView);

        return this.httpClient.post(this.util.baseUrl + '/Recursos/Download', {},
            { responseType: 'blob', params: httParams, headers: this.util.getHeaderToken() });
    }

    getAdvancedSearch(model: string): Observable<ResponseModel> {
        const httParams = new HttpParams()
            .append('jsonConsulta', model);

        return this.httpClient.post<ResponseModel>(this.util.baseUrl + '/Recursos/GetAdvancedSearch', {}, { params: httParams });
    }

    getResourcesByTitle(title: string): Observable<ResponseModel> {
        const httParams = new HttpParams()
            .append('title', title);

        return this.httpClient.post<ResponseModel>(this.util.baseUrl + '/Recursos/SearchByTitle', {}, { params: httParams });
    }

    getResourcesByIdAndTitle(id: string, title: string): Observable<ResponseModel> {
        const httParams = new HttpParams()
            .append('id', id)
            .append('title', title);

        return this.httpClient.post<ResponseModel>(this.util.baseUrl + '/Recursos/GetResourceByIdAndTitle', {}, { params: httParams });
    }

    getResourcesByCod(codigo: string): Observable<ResponseModel> {
        const httParams = new HttpParams()
            .append('codigo', codigo);

        return this.httpClient.post<ResponseModel>(this.util.baseUrl + '/Recursos/SearchByCod', {}, { params: httParams });
    }
}
