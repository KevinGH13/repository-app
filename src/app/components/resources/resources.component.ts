import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ResourcesService } from '../../services/resources.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import swal from 'sweetalert2';
import { Util } from '../../util/util';
import { ResponseModel } from 'src/app/models/response-model';
import { saveAs } from 'file-saver';
import { LoginService } from '../../services/login.service';
import { SedesService } from '../../services/sedes.service';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.css']
})
export class ResourcesComponent implements OnInit {

  listResources: any[] = [];
  listLenguajes: any[] = [];
  listAreasConocimiento: any[] = [];
  listTipoRecursos: any[] = [];
  listSedes: any[] = [];
  pageNumber: number;
  total: number;
  today: Date = new Date();
  maxDate: NgbDateStruct;
  formResource: FormGroup;
  util: Util = new Util();
  submitted = false;
  fechaGrid: Date;
  private formBuilder: FormBuilder = new FormBuilder();
  operacion: string;
  tituloModal: string;
  fileToUpload: File;
  @ViewChild('btnCloseModal') btnCloseModal: ElementRef;
  @ViewChild('labelImport') labelImport: ElementRef;

  constructor(private resourcesService: ResourcesService, private activatedRoute: ActivatedRoute,
    public loginService: LoginService, private router: Router, private sedesService: SedesService) {
    this.pageNumber = 1;
    this.maxDate = {
      year: this.today.getFullYear(),
      month: this.today.getMonth() + 1,
      day: this.today.getDate()
    };
    this.validateOrigin();
  }

  ngOnInit() {
    this.CreateFormValidation();
    this.getAreasConocimiento();
    this.getTiposRecursos();
    this.getTiposLenguaje();
    this.getSedes();
  }

  getSedes(): any {
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

  getTiposLenguaje(): any {
    this.resourcesService.getTiposLenguaje()
      .subscribe(response => {
        if (response.status) {
          this.listLenguajes = response.information;
        } else {
          this.util.manageResponseFalse(response);
        }
      },
        error => { this.util.manageSesion(this.router); this.btnCloseModal.nativeElement.click(); });
  }

  getTiposRecursos(): any {
    this.resourcesService.getTiposRecursos()
      .subscribe(response => {
        if (response.status) {
          this.listTipoRecursos = response.information;
        } else {
          this.util.manageResponseFalse(response);
        }
      },
        error => { this.util.manageSesion(this.router); this.btnCloseModal.nativeElement.click(); });
  }

  getAreasConocimiento(): any {
    this.resourcesService.getAreasConocimiento()
      .subscribe(response => {
        if (response.status) {
          this.listAreasConocimiento = response.information;
        } else {
          this.util.manageResponseFalse(response);
        }
      },
        error => { this.util.manageSesion(this.router); this.btnCloseModal.nativeElement.click(); });
  }

  get fo() { return this.formResource.controls; }

  validateOrigin(): any {
    this.activatedRoute.params.subscribe(params => {
      if (params.search === 'true') {
        this.getAdvancedSearch();
      } else if (params.title) {
        this.getResourcesByTitle(params.title);
      } else {
        this.getResources();
      }
    },
      error => { this.util.manageSesion(this.router); this.btnCloseModal.nativeElement.click(); });
  }

  getAdvancedSearch() {
    this.resourcesService.getAdvancedSearch(localStorage.getItem('AdvancedSearch'))
      .subscribe(response => {
        if (response.status) {
          this.listResources = response.information;
        } else {
          this.util.manageResponseFalse(response);
        }
      },
        error => { this.util.manageSesion(this.router); this.btnCloseModal.nativeElement.click(); });
  }

  getResources() {
    this.resourcesService.getResources()
      .subscribe(response => {
        if (response.status) {
          this.listResources = response.information;
          this.searchResourceById();
        } else {
          this.util.manageResponseFalse(response);
        }
      },
        error => { this.util.manageSesion(this.router); this.btnCloseModal.nativeElement.click(); });
  }

  searchResourceById() {
    this.activatedRoute.params.subscribe(params => {
      if (params.id) {
        this.listResources = this.listResources.filter(x => x.arcCodigo === params.id);
        this.listResources = this.listResources.filter(x => x.tirCodigo === params.id);
      }
    },
      error => { this.util.manageSesion(this.router); this.btnCloseModal.nativeElement.click(); });
  }

  getResourcesByTitle(title: string) {
    this.resourcesService.getResourcesByTitle(title)
      .subscribe(response => {
        if (response.status) {
          this.listResources = response.information;
        } else {
          this.util.manageResponseFalse(response);
        }
      },
        error => { this.util.manageSesion(this.router); this.btnCloseModal.nativeElement.click(); });
  }

  CreateFormValidation() {
    this.formResource = this.formBuilder.group({
      codigo: ['', null],
      titulo: ['', [Validators.required, Validators.pattern('^[A-Za-zñÑáéíóúÁÉÍÓÚ ]+$')]],
      autor: ['', [Validators.required, Validators.pattern('^[A-Za-zñÑáéíóúÁÉÍÓÚ ]+$')]],
      palabrasClaves: ['', [Validators.required, Validators.pattern('^[^<>]+$')]],
      derechosAutor: ['', [Validators.required, Validators.pattern('^[A-Za-zñÑáéíóúÁÉÍÓÚ ]+$')]],
      descripcion: ['', [Validators.pattern('^[^<>]+$')]],
      editor: ['', [Validators.pattern('^[A-Za-zñÑáéíóúÁÉÍÓÚ ]+$')]],
      colaborador: ['', [Validators.pattern('^[A-Za-zñÑáéíóúÁÉÍÓÚ ]+$')]],
      anioElaboracion: ['', Validators.pattern('^[0-9]+$')],
      identificador: ['', [Validators.pattern('^[^<>]+$')]],
      fuente: ['', [Validators.pattern('^[^<>]+$')]],
      tilCodigo: ['', Validators.required],
      relacion: ['', [Validators.pattern('^[^<>]+$')]],
      cobertura: ['', [Validators.pattern('^[^<>]+$')]],
      tirCodigo: ['', [Validators.required]],
      arcCodigo: ['', [Validators.required]],
      archivo: ['', [Validators.required]],
      visualizaciones: ['', null],
      descargas: ['', null],
      sedeCodigo: ['', Validators.required],
      indDescargaRestringida: ['N', Validators.required]
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.formResource.valid) {
      this.resourcesService.addEditResource(this.formResource.value, this.operacion, this.fileToUpload)
        .subscribe(response => {
          if (response.status) {
            this.actionAfterPostSuccess(response);
            this.labelImport.nativeElement.innerHTML = 'Seleccione un archivo';
          } else {
            this.util.manageResponseFalse(response);
          }
        },
          error => { this.util.manageSesion(this.router); this.btnCloseModal.nativeElement.click(); });
    }
  }

  clearDatePicker() {
    this.formResource.get('fecha').setValue(undefined);
  }

  onCancel() {
    this.formResource.reset();
  }

  onNewResource() {
    this.operacion = 'ADD';
    this.tituloModal = 'Nuevo Recurso';
    this.submitted = false;
    this.CreateFormValidation();
  }

  onEdit(codigoRecurso: string) {
    this.tituloModal = 'Editar Recurso';
    this.operacion = 'MOD';
    const resourceSelected = this.listResources.filter(x => x.codigo === codigoRecurso)[0];
    this.formResource = this.formBuilder.group({
      codigo: [resourceSelected.codigo, null],
      titulo: [resourceSelected.titulo, [Validators.required, Validators.pattern('^[A-Za-zñÑáéíóúÁÉÍÓÚ ]+$')]],
      autor: [resourceSelected.autor, [Validators.required, Validators.pattern('^[A-Za-zñÑáéíóúÁÉÍÓÚ ]+$')]],
      palabrasClaves: [resourceSelected.palabrasClaves, [Validators.required, Validators.pattern('^[^<>]+$')]],
      derechosAutor: [resourceSelected.derechosAutor, [Validators.required, Validators.pattern('^[A-Za-zñÑáéíóúÁÉÍÓÚ ]+$')]],
      descripcion: [resourceSelected.descripcion, [Validators.pattern('^[^<>]+$')]],
      editor: [resourceSelected.editor, [Validators.pattern('^[A-Za-zñÑáéíóúÁÉÍÓÚ ]+$')]],
      colaborador: [resourceSelected.colaborador, [Validators.pattern('^[A-Za-zñÑáéíóúÁÉÍÓÚ ]+$')]],
      anioElaboracion: [resourceSelected.anioElaboracion, Validators.pattern('^[0-9]+$')],
      identificador: [resourceSelected.identificador, [Validators.pattern('^[^<>]+$')]],
      fuente: [resourceSelected.fuente, [Validators.pattern('^[^<>]+$')]],
      tilCodigo: [resourceSelected.tilCodigo, Validators.required],
      relacion: [resourceSelected.relacion, [Validators.pattern('^[^<>]+$')]],
      cobertura: [resourceSelected.cobertura, [Validators.pattern('^[^<>]+$')]],
      tirCodigo: [resourceSelected.tirCodigo, [Validators.required]],
      arcCodigo: [resourceSelected.arcCodigo, [Validators.required]],
      archivo: ['', null],
      visualizaciones: [resourceSelected.visualizaciones, null],
      descargas: [resourceSelected.descargas, null],
      sedeCodigo: [resourceSelected.sedeCodigo, Validators.required],
      indDescargaRestringida: [resourceSelected.indDescargaRestringida, Validators.required]
    });
  }

  actionAfterPostSuccess(response: ResponseModel) {
    if (this.operacion === 'MOD') {
      this.btnCloseModal.nativeElement.click();
    }
    this.util.manageResponseTrue(response);
    this.getResources();
    this.onNewResource();
  }

  onDelete(codigoRecurso: string) {
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
          this.deleteTipoRecurso(codigoRecurso);
        }
      });
  }

  deleteTipoRecurso(codigoRecurso: string): void {
    const resourceSelected = this.listResources.filter(x => x.codigo === codigoRecurso)[0];
    this.resourcesService.deleteResource(resourceSelected)
      .subscribe(response => {
        if (response.status) {
          this.actionAfterPostSuccess(response);
        } else {
          this.util.manageResponseFalse(response);
        }
      },
        error => { this.util.manageSesion(this.router); this.btnCloseModal.nativeElement.click(); });
  }

  openFile(codigoRecurso: string) {
    let fileURL = '';
    this.resourcesService.getFileToDownload(codigoRecurso, 'Y')
      .subscribe(
        (response) => {
          const blob = new Blob([response], { type: response.type });
          fileURL = URL.createObjectURL(blob);
          window.open(fileURL, 'blanck');
          this.getResources();
          return false;
        },
        error => {
          swal.fire('Error', 'Ha ocurrido un error descargando el archivo solicitado.', 'error');
        }
      );
  }

  downloadFile(codigoRecurso: string, titulo: string) {
    this.resourcesService.getFileToDownload(codigoRecurso)
      .subscribe(
        (response) => {
          const blob = new Blob([response], { type: response.type });
          saveAs(blob, titulo);
          this.getResources();
        },
        error => {
          swal.fire('Error', 'Ha ocurrido un error descargando el archivo solicitado.', 'error');
        }
      );
  }

  handleFileInput(file: FileList) {
    console.log(file);
    this.fileToUpload = file.item(0);
    if (file.item(0)) {
      this.labelImport.nativeElement.innerHTML = file.item(0).name;
    } else {
      this.labelImport.nativeElement.innerHTML = 'Seleccione un archivo';
    }
  }
}
