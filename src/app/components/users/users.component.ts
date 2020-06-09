import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { Util } from '../../util/util';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import swal from 'sweetalert2';
import { ResponseModel } from 'src/app/models/response-model';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  util: Util = new Util();
  listUsers: any[] = [];
  listRoles: any[] = [];
  listStates: any[] = [];
  pageNumber: number;
  total: number;
  formUser: FormGroup;
  submitted = false;
  private formBuilder: FormBuilder = new FormBuilder();
  tituloModal = 'Nuevo Usuario';
  operacion: string;
  @ViewChild('btnCloseModal') btnCloseModal: ElementRef;

  constructor(private usersService: UsersService, private router: Router) {
    this.getUsers();
    this.getEstadosUsuario();
    this.getRoles();
  }

  ngOnInit() {
    this.CreateFormValidation();
  }

  getUsers() {
    this.usersService.getUsers()
      .subscribe(data => {
        if (data.status) {
          this.listUsers = data.information;
        } else {
          this.util.manageResponseFalse(data);
        }
      },
        error => { this.util.manageSesion(this.router); });
  }

  CreateFormValidation() {
    this.formUser = this.formBuilder.group({
      codigo: ['', null],
      nombres: ['', [Validators.required, Validators.pattern('^[A-Za-zñÑáéíóúÁÉÍÓÚ ]+$')]],
      apellidos: ['', [Validators.required, Validators.pattern('^[A-Za-zñÑáéíóúÁÉÍÓÚ ]+$')]],
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(8),
      Validators.maxLength(15), Validators.pattern('^[*A-Za-z0-9_-]+$')]],
      contrasenaConfirm: ['', [Validators.required, Validators.minLength(8),
      Validators.maxLength(15), Validators.pattern('^[*A-Za-z0-9_-]+$')]],
      codigoRol: ['', null],
      codigoEstadoUsuario: ['', null]
    }, {
      validator: this.util.MustMatch('contrasena', 'contrasenaConfirm')
    });
  }

  get fo() { return this.formUser.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.formUser.valid) {
      this.usersService.addEditUser(this.formUser.value, this.operacion)
        .subscribe(response => {
          if (response.status) {
            this.actionAfterPostSuccess(response);
          } else {
            this.util.manageResponseFalse(response);
          }
        },
          error => { if (error.status === 401) { this.util.manageSesion(this.router); } this.btnCloseModal.nativeElement.click(); });
    }
  }

  onNewUser() {
    this.submitted = false;
    this.tituloModal = 'Nuevo Usuario';
    this.operacion = 'ADD';
    this.CreateFormValidation();
    this.formUser.controls.codigoEstadoUsuario.setValue(this.listStates[0].codigo);
  }

  getRoles() {
    this.usersService.getRoles()
      .subscribe(data => {
        if (data.status) {
          this.listRoles = data.information;
        } else {
          this.util.manageResponseFalse(data);
        }
      },
        error => { this.util.manageSesion(this.router); this.btnCloseModal.nativeElement.click(); });
  }

  getEstadosUsuario() {
    this.usersService.getEstadosUsuario()
      .subscribe(data => {
        if (data.status) {
          this.listStates = data.information;
        } else {
          this.util.manageResponseFalse(data);
        }
      },
        error => { this.util.manageSesion(this.router); this.btnCloseModal.nativeElement.click(); });
  }

  onEdit(codigoUsuario: string) {
    this.tituloModal = 'Editar Usuario';
    this.operacion = 'MOD';
    const userSelected = this.listUsers.filter(x => x.codigo === codigoUsuario)[0];
    this.formUser.setValue({
      nombres: userSelected.nombres,
      apellidos: userSelected.apellidos,
      correo: userSelected.correo,
      contrasena: 'DefaultPass',
      contrasenaConfirm: 'DefaultPass',
      codigoRol: userSelected.codigoRol,
      codigoEstadoUsuario: userSelected.codigoEstadoUsuario,
      codigo: userSelected.codigo
    });
  }

  actionAfterPostSuccess(response: ResponseModel) {
    if (this.operacion === 'MOD') {
      this.btnCloseModal.nativeElement.click();
    }
    this.util.manageResponseTrue(response);
    this.getUsers();
    this.onNewUser();
  }

  onDelete(codigoUsuario: string) {
    swal.fire({
      type: 'question',
      title: 'Confirmar',
      text: this.util.MENSAJE_CONFIRMAR_ELIMINACION,
      cancelButtonText: 'No',
      confirmButtonText: 'Sí',
      showCancelButton: true,
      cancelButtonClass: 'btn btn-secondary',
      confirmButtonClass: 'btn btn-success',
      reverseButtons: true,
      confirmButtonColor: '#19a565e6',
      cancelButtonColor: '#5a6268',
      allowOutsideClick: false,
      heightAuto: false
    }).
      then(result => {
        if (result.value) {
          this.deleteTipoRecurso(codigoUsuario);
        }
      });
  }

  deleteTipoRecurso(codigoUsuario: string): void {
    const userSelected = this.listUsers.filter(x => x.codigo === codigoUsuario)[0];
    this.usersService.deleteUser(userSelected)
      .subscribe(response => {
        if (response.status) {
          this.actionAfterPostSuccess(response);
        } else {
          this.util.manageResponseFalse(response);
        }
      },
        error => { this.util.manageSesion(this.router); this.btnCloseModal.nativeElement.click(); });
  }

}
