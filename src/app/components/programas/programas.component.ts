import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProgramsService } from '../../services/programs.service'
import { Util } from '../../util/util';
import { ResponseModel } from '../../models/response-model';
import swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-programas',
  templateUrl: './programas.component.html',
  styleUrls: ['./programas.component.css']
})
export class ProgramasComponent implements OnInit {

  listPrograms: any[] = [];
  formProgram: FormGroup;
  formBuilder: FormBuilder = new FormBuilder();
  util: Util = new Util();
  submitted = false;
  total: number;
  pageNumber: number;
  tituloModal = 'Nuevo Programa';
  operacion: string;
  @ViewChild('btnCloseModal') btnCloseModal: ElementRef;

  constructor(private programService: ProgramsService, private router: Router) {
    this.getPrograms();
  }

  ngOnInit() {
    this.CreateFormValidation();
  }

  get fo() { return this.formProgram.controls; }

  CreateFormValidation() {
    this.formProgram = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.pattern('^[A-Za-zñÑáéíóúÁÉÍÓÚ, ]+$')]],
      codigo: ['', null],
      codigoPrograma: ['', null]
    });
  }

  onNewProgram() {
    this.operacion = 'ADD';
    this.tituloModal = 'Nuevo Programa';
    this.submitted = false;
    this.formProgram.reset();
    this.CreateFormValidation();
  }

  getPrograms() {
    this.programService.getPrograms()
      .subscribe(response => {
        if (response.status) {
          this.listPrograms = response.information;
        } else {
          this.util.manageResponseFalse(response);
        }
      },
        error => { this.util.manageSesion(this.router); this.btnCloseModal.nativeElement.click(); });
  }

  onEdit(codigoPrograma: string) {
    this.operacion = 'MOD';
    this.tituloModal = 'Editar Programa';
    const programSelected = this.listPrograms.filter(x => x.codigo === codigoPrograma)[0];
    this.formProgram.setValue({
      nombre: programSelected.nombre,
      codigo: programSelected.codigo,
      codigoProgram: programSelected.codigoPrograma
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.formProgram.valid) {
      this.programService.addEditProgram(this.formProgram.value, this.operacion)
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

  onDelete(codigoPrograma: string) {
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
          this.deleteProgram(codigoPrograma);
        }
      });
  }

  deleteProgram(codigoPrograma: string): void {
    const programSelected = this.listPrograms.filter(x => x.codigo === codigoPrograma)[0];
    this.programService.deleteProgram(programSelected)
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
    this.getPrograms();
    this.onNewProgram();
  }

}
