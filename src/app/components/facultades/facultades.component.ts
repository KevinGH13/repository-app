import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FacultiesService } from '../../services/faculties.service';
import { Util } from '../../util/util';
import { ResponseModel } from '../../models/response-model';
import swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-facultades',
  templateUrl: './facultades.component.html',
  styleUrls: ['./facultades.component.css']
})
export class FacultadesComponent implements OnInit {

  listFaculties: any[] = [];
  formFacultie: FormGroup;
  formBuilder: FormBuilder = new FormBuilder();
  util: Util = new Util();
  submitted = false;
  tituloModal = 'Nueva Facultad';
  operacion: string;
  @ViewChild('btnCloseModal') btnCloseModal: ElementRef;

  constructor(private facultieService: FacultiesService, private router: Router) {
    this.getFaculties();
  }

  ngOnInit() {
    this.CreateFormValidation();
  }

  get fo() { return this.formFacultie.controls; }

  CreateFormValidation() {
    this.formFacultie = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.pattern('^[A-Za-zñÑáéíóúÁÉÍÓÚ, ]+$')]],
      codigo: ['', null]
    });
  }

  onNewFacultie() {
    this.operacion = 'ADD';
    this.tituloModal = 'Nueva Facultad';
    this.submitted = false;
    this.formFacultie.reset();
    this.CreateFormValidation();
  }

  getFaculties() {
    this.facultieService.getFaculties()
      .subscribe(response => {
        if (response.status) {
          this.listFaculties = response.information;
        } else {
          this.util.manageResponseFalse(response);
        }
      },
      error => { this.util.manageSesion(this.router); this.btnCloseModal.nativeElement.click(); });
  }

  onEdit(codigoFacultad: string) {
    this.operacion = 'MOD';
    this.tituloModal = 'Editar Facultad';
    const facultieSelected = this.listFaculties.filter(x => x.codigo === codigoFacultad)[0];
    this.formFacultie.setValue({
      nombre: facultieSelected.nombre,
      codigo: facultieSelected.codigo
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.formFacultie.valid) {
      this.facultieService.addEditFacultie(this.formFacultie.value, this.operacion)
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

  onDelete(codigoFacultad: string) {
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
          this.deleteFacultie(codigoFacultad);
        }
      });
  }

  deleteFacultie(codigoFacultad: string): void {
    const facultieSelected = this.listFaculties.filter(x => x.codigo === codigoFacultad)[0];
    this.facultieService.deleteFacultie(facultieSelected)
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
    this.getFaculties();
    this.onNewFacultie();
  }

}
