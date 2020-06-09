import { ResponseModel } from '../models/response-model';
import { FormGroup } from '@angular/forms';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';

export class Util {

    constructor() { }

    //public baseUrl = 'http://localhost:9000/RepositorioPCJIC';
    public baseUrl = 'https://webapirdpcjic.azurewebsites.net/RepositorioPCJIC';
    public MENSAJE_CAMPO_OBLIGATORIO = 'Campo Obligatorio';
    public MENSAJE_CAMPO_CARACTERES_INVALIDOS = 'No se permiten los caracteres: < , >';
    public MENSAJE_CAMPO_SOLO_LETRAS_ESPACIO = 'Solo se permiten letras y espacios';
    public MENSAJE_NO_RESULTADOS = 'No se encontraron resultados';
    public MENSAJE_CONFIRMAR_ELIMINACION = '¿Está seguro que desea eliminar el registro?';

    manageResponseFalse(response: ResponseModel) {
        this.showAlert(response.message, response);
    }

    manageResponseTrue(response: ResponseModel) {
        this.showAlert('', response);
    }

    showAlert(message: string = '', response: ResponseModel) {
        swal.fire({
            title: response.status ? 'Operación Exitosa' : 'Error',
            text: message,
            type: response.status ? 'success' : 'error',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#19a565e6',
            allowOutsideClick: false,
            heightAuto: false
        });
    }

    manageSesion(route: Router) {
        /*
                swal.fire({
                    type: 'error',
                    title: 'Error',
                    confirmButtonText: 'Aceptar',
                    confirmButtonClass: 'btn btn-success',
                    confirmButtonColor: '#19a565e6',
                    allowOutsideClick: false,
                    text: 'Su sesión ha finalizado. \nSerá redirigido al inicio.',
                    heightAuto: false
                }).
                    then(result => {
                        route.navigate(['/home']);
                    });*/
    }

    MustMatch(controlName: string, matchingControlName: string) {
        return (formGroup: FormGroup) => {
            const control = formGroup.controls[controlName];
            const matchingControl = formGroup.controls[matchingControlName];

            if (matchingControl.errors && !matchingControl.errors.mustMatch) {
                // return if another validator has already found an error on the matchingControl
                return;
            }

            // set error on matchingControl if validation fails
            if (control.value !== matchingControl.value) {
                matchingControl.setErrors({ mustMatch: true });
            } else {
                matchingControl.setErrors(null);
            }
        };
    }

    onCancel(form: FormGroup) {
        form.reset();
    }

    getHeaderToken() {
        return new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    }
}

