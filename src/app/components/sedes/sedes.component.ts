import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Util } from 'src/app/util/util';
import { SedesService } from '../../services/sedes.service';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { ResponseModel } from 'src/app/models/response-model';

@Component({
  selector: 'app-sedes',
  templateUrl: './sedes.component.html',
  styleUrls: ['./sedes.component.css']
})
export class SedesComponent implements OnInit {

  listSedes: any[] = [];
  formSedes: FormGroup;
  formBuilder: FormBuilder = new FormBuilder();
  util: Util = new Util();
  submitted = false;
  total: number;
  pageNumber: number;
  tituloModal = 'Nueva Sede';
  operacion: string;
  @ViewChild('btnCloseModal') btnCloseModal: ElementRef;

  constructor(private sedesService: SedesService, private router: Router) {
    this.getSedes();
  }

  ngOnInit() {
    this.CreateFormValidation();
  }

  get fo() { return this.formSedes.controls; }

  CreateFormValidation() {
    this.formSedes = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.pattern('^[A-Za-zñÑáéíóúÁÉÍÓÚ ]+$')]],
      codigo: ['', null]
    });
  }

  onNewSede() {
    this.operacion = 'ADD';
    this.tituloModal = 'Nueva Sede';
    this.submitted = false;
    this.formSedes.reset();
    this.CreateFormValidation();
  }

  getSedes() {
    this.sedesService.getSedes()
      .subscribe(response => {
        if (response.status) {
          this.listSedes = response.information;
        } else {
          this.util.manageResponseFalse(response);
        }
      },
        error => { this.util.manageSesion(this.router); this.btnCloseModal.nativeElement.click(); });
  }

  onEdit(codigoSede: string) {
    this.operacion = 'MOD';
    this.tituloModal = 'Editar Sede';
    const Sedeselected = this.listSedes.filter(x => x.codigo === codigoSede)[0];
    this.formSedes.setValue({
      nombre: Sedeselected.nombre,
      codigo: Sedeselected.codigo
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.formSedes.valid) {
      this.sedesService.addEditSede(this.formSedes.value, this.operacion)
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

  onDelete(codigoSede: string) {
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
          this.deleteSede(codigoSede);
        }
      });
  }

  deleteSede(codigoSede: string): void {
    const Sedeselected = this.listSedes.filter(x => x.codigo === codigoSede)[0];
    this.sedesService.deleteSede(Sedeselected)
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
    this.getSedes();
    this.onNewSede();
  }

}
