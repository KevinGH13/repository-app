import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Util } from '../../util/util';
import { ResponseModel } from '../../models/response-model';
import swal from 'sweetalert2';
import { EstadosUsuarioService } from '../../services/estados-usuarios.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-estados-usuarios',
  templateUrl: './estados-usuarios.component.html',
  styleUrls: ['./estados-usuarios.component.css']
})
export class EstadosUsuariosComponent implements OnInit {

  listEstUsu: any[] = [];
  formEstUsu: FormGroup;
  formBuilder: FormBuilder = new FormBuilder();
  util: Util = new Util();
  submitted = false;
  total: number;
  pageNumber: number;
  tituloModal = 'Nuevo Estado';
  operacion: string;
  @ViewChild('btnCloseModal') btnCloseModal: ElementRef;

  constructor(private estadosUsuarioService: EstadosUsuarioService, private router: Router) {
    this.getEstUsu();
  }

  ngOnInit() {
    this.CreateFormValidation();
  }

  get fo() { return this.formEstUsu.controls; }

  CreateFormValidation() {
    this.formEstUsu = this.formBuilder.group({
      codigo: ['', null],
      nombre: ['', [Validators.required, Validators.pattern('^[A-Za-zñÑáéíóúÁÉÍÓÚ ]+$')]],
      indActivo: ['S', null]
    });
  }

  onNewEstUsu() {
    this.operacion = 'ADD';
    this.tituloModal = 'Nuevo Estado';
    this.submitted = false;
    this.formEstUsu.reset();
    this.CreateFormValidation();
  }

  getEstUsu() {
    this.estadosUsuarioService.getEstadosUsuario()
      .subscribe(response => {
        if (response.status) {
          this.listEstUsu = response.information;
        } else {
          this.util.manageResponseFalse(response);
        }
      },
        error => { this.util.manageSesion(this.router); this.btnCloseModal.nativeElement.click(); });
  }

  onEdit(codigoEstado: string) {
    this.operacion = 'MOD';
    this.tituloModal = 'Editar Estado';
    const EstUsuSelected = this.listEstUsu.filter(x => x.codigo === codigoEstado)[0];
    this.formEstUsu.setValue({
      codigo: EstUsuSelected.codigo,
      nombre: EstUsuSelected.nombre,
      indActivo: EstUsuSelected.indActivo
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.formEstUsu.valid) {
      this.estadosUsuarioService.addEditEstadoUsuario(this.formEstUsu.value, this.operacion)
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

  onDelete(codigoEstado: string) {
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
          this.deleteEstUsu(codigoEstado);
        }
      });
  }

  deleteEstUsu(codigoEstado: string): void {
    const EstUsuSelected = this.listEstUsu.filter(x => x.codigo === codigoEstado)[0];
    this.estadosUsuarioService.deleteEstadoUsuario(EstUsuSelected)
      .subscribe(response => {
        if (response.status) {
          this.actionAfterPostSuccess(response);
        } else {
          this.util.manageResponseFalse(response);
        }
      },
        error => { this.util.manageSesion(this.router); this.btnCloseModal.nativeElement.click(); });
  }

  actionAfterPostSuccess(response: ResponseModel) {
    if (this.operacion === 'MOD') {
      this.btnCloseModal.nativeElement.click();
    }
    this.util.manageResponseTrue(response);
    this.getEstUsu();
    this.onNewEstUsu();
  }
}
