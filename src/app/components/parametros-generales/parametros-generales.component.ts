import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Util } from '../../util/util';
import { ResponseModel } from '../../models/response-model';
import swal from 'sweetalert2';
import { ParametrosGeneralesService } from '../../services/parametros-generales.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-parametros-generales',
  templateUrl: './parametros-generales.component.html',
  styleUrls: ['./parametros-generales.component.css']
})
export class ParametrosGeneralesComponent implements OnInit {

  listParamGen: any[] = [];
  formParamGen: FormGroup;
  formBuilder: FormBuilder = new FormBuilder();
  util: Util = new Util();
  submitted = false;
  pageNumber: number;
  total: number;
  tituloModal = 'Nuevo Parámetro General';
  operacion: string;
  @ViewChild('btnCloseModal') btnCloseModal: ElementRef;
  modeloOriginal: any = {};

  constructor(private parametrosGeneralesService: ParametrosGeneralesService, private router: Router) {
    this.getParamGen();
  }

  ngOnInit() {
    this.CreateFormValidation();
  }

  get fo() { return this.formParamGen.controls; }

  CreateFormValidation() {
    this.formParamGen = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.pattern('^[^<>]+$')]],
      valor: ['', [Validators.required, Validators.pattern('^[^<>]+$')]],
      fechaCreacion: ['', null]
    });
  }

  onNewParamGen() {
    this.operacion = 'ADD';
    this.tituloModal = 'Nuevo Parámetro General';
    this.submitted = false;
    this.formParamGen.reset();
    this.CreateFormValidation();
  }

  getParamGen() {
    this.parametrosGeneralesService.getParametrosGenerales()
      .subscribe(response => {
        if (response.status) {
          this.listParamGen = response.information;
        } else {
          this.util.manageResponseFalse(response);
        }
      },
        error => { this.util.manageSesion(this.router); this.btnCloseModal.nativeElement.click(); });
  }

  onEdit(nombreParametro: string) {
    this.operacion = 'MOD';
    this.tituloModal = 'Editar Parámetro General';
    const ParamGenSelected = this.listParamGen.filter(x => x.nombre === nombreParametro)[0];
    this.formParamGen.setValue({
      nombre: ParamGenSelected.nombre,
      valor: ParamGenSelected.valor,
      fechaCreacion: ParamGenSelected.fechaCreacion
    });
    this.builOriginalModel(ParamGenSelected);
  }

  builOriginalModel(ParamGenSelected: any) {
    this.modeloOriginal = {
      Nombre: ParamGenSelected.nombre,
      Valor: ParamGenSelected.valor,
      FechaCreacion: ParamGenSelected.fechaCreacion
    };
  }

  onSubmit() {
    this.submitted = true;
    if (this.formParamGen.valid) {
      this.parametrosGeneralesService.addEditParametroGeneral(this.formParamGen.value, this.operacion, this.modeloOriginal)
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

  onDelete(nombreParametro: string) {
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
          this.deleteParamGen(nombreParametro);
        }
      });
  }

  deleteParamGen(nombreParametro: string): void {
    const ParamGenSelected = this.listParamGen.filter(x => x.nombre === nombreParametro)[0];
    this.parametrosGeneralesService.deleteParametroGeneral(ParamGenSelected)
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
    this.getParamGen();
    this.onNewParamGen();
  }

}
