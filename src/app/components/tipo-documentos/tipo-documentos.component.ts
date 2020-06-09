import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Util } from '../../util/util';
import { ResponseModel } from '../../models/response-model';
import swal from 'sweetalert2';
import { TiposDocumentosService } from '../../services/tipos-documentos.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-tipo-documentos',
  templateUrl: './tipo-documentos.component.html',
  styleUrls: ['./tipo-documentos.component.css']
})
export class TipoDocumentosComponent implements OnInit {

  listTipoRecursos: any[] = [];
  formTipoRecurso: FormGroup;
  formBuilder: FormBuilder = new FormBuilder();
  util: Util = new Util();
  submitted = false;
  tituloModal = 'Nuevo Tipo de Recurso';
  operacion: string;
  @ViewChild('btnCloseModal') btnCloseModal: ElementRef;

  constructor(private tiposRecursos: TiposDocumentosService, private router: Router) {
    this.getTipoRecursos();
  }

  ngOnInit() {
    this.CreateFormValidation();
  }

  get fo() { return this.formTipoRecurso.controls; }

  CreateFormValidation() {
    this.formTipoRecurso = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.pattern('^[A-Za-zñÑáéíóúÁÉÍÓÚ ]+$')]],
      codigo: ['', null]
    });
  }

  onNewTipoRecurso() {
    this.operacion = 'ADD';
    this.tituloModal = 'Nuevo Tipo de Recurso';
    this.submitted = false;
    this.formTipoRecurso.reset();
    this.CreateFormValidation();
  }

  getTipoRecursos() {
    this.tiposRecursos.getTipoRecursos()
      .subscribe(response => {
        if (response.status) {
          this.listTipoRecursos = response.information;
        } else {
          this.util.manageResponseFalse(response);
        }
      },
      error => { this.util.manageSesion(this.router); this.btnCloseModal.nativeElement.click(); });
  }

  onEdit(codigoTipoRecurso: string) {
    this.operacion = 'MOD';
    this.tituloModal = 'Editar Tipo de Recurso';
    const TipoRecursoSelected = this.listTipoRecursos.filter(x => x.codigo === codigoTipoRecurso)[0];
    this.formTipoRecurso.setValue({
      nombre: TipoRecursoSelected.nombre,
      codigo: TipoRecursoSelected.codigo
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.formTipoRecurso.valid) {
      this.tiposRecursos.addEditTipoRecurso(this.formTipoRecurso.value, this.operacion)
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

  onDelete(codigoTipoRecurso: string) {
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
          this.deleteTipoRecurso(codigoTipoRecurso);
        }
      });
  }

  deleteTipoRecurso(codigoTipoRecurso: string): void {
    const TipoRecursoSelected = this.listTipoRecursos.filter(x => x.codigo === codigoTipoRecurso)[0];
    this.tiposRecursos.deleteTipoRecurso(TipoRecursoSelected)
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
    this.getTipoRecursos();
    this.onNewTipoRecurso();
  }

}
