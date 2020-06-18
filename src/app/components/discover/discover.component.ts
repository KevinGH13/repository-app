import { Component, OnInit, ElementRef, ViewChild, NgZone } from '@angular/core';
import { ResourcesService } from '../../services/resources.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import swal from 'sweetalert2';
import { Util } from '../../util/util';
import { ResponseModel } from 'src/app/models/response-model';
import { saveAs } from 'file-saver';
import { LoginService } from '../../services/login.service';
import { SedesService } from '../../services/sedes.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.css']
})
export class DiscoverComponent implements OnInit {

  listResources: any[] = [];
  listLenguajes: any[] = [];
  listAreasConocimiento: any[] = [];
  listProgramasAcademicos: any[] = [];
  listTipoRecursos: any[] = [];
  listSedes: any[] = [];
  pageNumber: number;
  total: number;
  today: Date = new Date();
  maxDate: NgbDateStruct;
  formResource: FormGroup;
  formBusquedaAvanzada: FormGroup;
  util: Util = new Util();
  submitted = false;
  fechaGrid: Date;
  private formBuilder: FormBuilder = new FormBuilder();
  operacion: string;
  tituloModal: string;
  fileToUpload: File;
  @ViewChild('btnCloseModal') btnCloseModal: ElementRef;
  @ViewChild('labelImport') labelImport: ElementRef;
  @ViewChild('searchTitle') txtSearchTitle: ElementRef;

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
    this.getProgramasAcademicos();
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

  getProgramasAcademicos(): any {
    this.resourcesService.getProgramasAcademico().
      subscribe(response => {
        if (response.status) {
          this.listProgramasAcademicos = response.information;
        } else {
          this.util.manageResponseFalse(response);
        }
      },
        error => { this.util.manageSesion(this.router); this.btnCloseModal.nativeElement.click(); });
  }

  getResource() {
    this.resourcesService.getResources()
      .subscribe(response => {
        if (response.status) {
          this.listResources = response.information;
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
        this.listResources = this.listResources.filter(x => (x.arcCodigo && x.tirCodigo) === params.id);
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
      title: ['', Validators.required],
      alternative: ['', null],
      abstract: ['', Validators.required],
      subject: ['', Validators.required],
      source: ['', null],
      relation: ['', null],
      creator: ['', Validators.required],
      publisher: ['', null],
      contributor: ['', null],
      advice: ['', null],
      accessRights: ['Derechos Patrimoniales', null],
      licence: ['', null],
      dateCreated: ['', Validators.required],
      dateAccepted: ['', null],
      dateValid: ['', null],
      dateModified: ['', null],
      dateIssued: ['', null],
      extend: ['', null],
      medium: ['', null],
      identifier: ['', null],
      doi: ['', null],
      uri: ['', null],
      issn: ['', null],
      isbn: ['', null],
      tilCodigo: ['', Validators.required],
      proCodigo: ['', Validators.required],
      tirCodigo: ['', Validators.required],
      arcCodigo: ['', Validators.required],
      archivo: ['', Validators.required],
      visualizaciones: ['', null],
      descargas: ['', null],
      sedeCodigo: ['', Validators.required],
      indDescargaRestringida: ['N', Validators.required],
      year: ['', null],
      spatial: ['', null],
      /*
      codigo: ['', null],
      title: ['', [Validators.required, Validators.pattern('^[A-Za-zñÑáéíóúÁÉÍÓÚ ]+$')]],
      alternative: ['', [Validators.pattern('^[A-Za-zñÑáéíóúÁÉÍÓÚ ]+$')]],
      description: ['', [Validators.required, Validators.pattern('^[^<>]+$')]],
      abstract: ['', [Validators.pattern('^[^<>]+$')]],
      subject: ['', [Validators.required, Validators.pattern('^[^<>]+$')]],
      source: ['', [Validators.pattern('^[^<>]+$')]],
      relation: ['', [Validators.pattern('^[^<>]+$')]],
      creator: ['', [Validators.pattern('^[A-Za-zñÑáéíóúÁÉÍÓÚ ]+$')]],
      publisher: ['', [Validators.pattern('^[A-Za-zñÑáéíóúÁÉÍÓÚ ]+$')]],
      contributor: ['', [Validators.pattern('^[A-Za-zñÑáéíóúÁÉÍÓÚ ]+$')]],
      advice: ['', [Validators.pattern('^[A-Za-zñÑáéíóúÁÉÍÓÚ ]+$')]],
      accessRights: ['', [Validators.pattern('^[A-Za-zñÑáéíóúÁÉÍÓÚ ]+$')]],
      licence: ['', [Validators.pattern('^[A-Za-zñÑáéíóúÁÉÍÓÚ ]+$')]],
      dateAvailable: ['', Validators.pattern('^[0-9]+$')],
      dateCreated: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      dateAccepted: ['', Validators.pattern('^[0-9]+$')],
      dateValid: ['', Validators.pattern('^[0-9]+$')],
      dateModified: ['', Validators.pattern('^[0-9]+$')],
      dateIssued: ['', Validators.pattern('^[0-9]+$')],
      format: ['', [Validators.pattern('^[^<>]+$')]],
      extend: ['', [Validators.pattern('^[^<>]+$')]],
      medium: ['', [Validators.pattern('^[^<>]+$')]],
      identifier: ['', Validators.pattern('^[^<>]+$')],
      doi: ['', [Validators.pattern('^[^<>]+$')]],
      uri: ['', [Validators.pattern('^[^<>]+$')]],
      issn: ['', [Validators.pattern('^[^<>]+$')]],
      isbn: ['', [Validators.pattern('^[^<>]+$')]],
      timCodigo: ['', [Validators.required]],
      tilCodigo: ['', [Validators.required]],
      tirCodigo: ['', [Validators.required]],
      arcCodigo: ['', [Validators.required]],
      proCodigo: ['', null],
      archivo: ['', [Validators.required]],
      visualizaciones: ['', null],
      descargas: ['', null],
      sedeCodigo: ['', Validators.required],
      indDescargaRestringida: ['N', Validators.required]*/
    });
    this.formBusquedaAvanzada = this.formBuilder.group({
      titulo: ['', [Validators.pattern('^[A-Za-zñÑáéíóúÁÉÍÓÚ ]+$')]],
      autor: ['', [Validators.pattern('^[A-Za-zñÑáéíóúÁÉÍÓÚ ]+$')]],
      palabrasClaves: ['', [Validators.pattern('^[^<>]+$')]],
      tipoLenguaje: ['', null],
      tipoRecurso: ['', null],
      areaConocimiento: ['', null],
      sede: ['', null],
      cond1: ['A', null],
      cond2: ['A', null],
      cond3: ['A', null],
      cond4: ['A', null],
      cond5: ['A', null],
      cond6: ['A', null]
    });
  }

  onSubmit() {
    this.submitted = true;
    console.log(this.formResource.valid);
    console.log(this.formResource);
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
    } else {
      console.log(this.formResource);
    }
  }

  clearDatePicker() {
    this.formResource.get('date').setValue(undefined);
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
      title: [resourceSelected.title, [Validators.required, Validators.pattern('^[A-Za-zñÑáéíóúÁÉÍÓÚ ]+$')]],
      alternative: [resourceSelected.alternative, [Validators.pattern('^[A-Za-zñÑáéíóúÁÉÍÓÚ ]+$')]],
      description: [resourceSelected.description, [Validators.required, Validators.pattern('^[^<>]+$')]],
      abstract: [resourceSelected.alternative, [Validators.pattern('^[^<>]+$')]],
      subject: [resourceSelected.subject, [Validators.required, Validators.pattern('^[^<>]+$')]],
      source: [resourceSelected.source, [Validators.pattern('^[^<>]+$')]],
      relation: [resourceSelected.relation, [Validators.pattern('^[^<>]+$')]],
      creator: [resourceSelected.creator, [Validators.pattern('^[A-Za-zñÑáéíóúÁÉÍÓÚ ]+$')]],
      publisher: [resourceSelected.publisher, [Validators.pattern('^[A-Za-zñÑáéíóúÁÉÍÓÚ ]+$')]],
      contributor: [resourceSelected.contributor, [Validators.pattern('^[A-Za-zñÑáéíóúÁÉÍÓÚ ]+$')]],
      advice: [resourceSelected.advice, [Validators.pattern('^[A-Za-zñÑáéíóúÁÉÍÓÚ ]+$')]],
      accessRights: [resourceSelected.accessRights, [Validators.pattern('^[A-Za-zñÑáéíóúÁÉÍÓÚ ]+$')]],
      licence: [resourceSelected.licence, [Validators.pattern('^[A-Za-zñÑáéíóúÁÉÍÓÚ ]+$')]],
      dateAvailable: [resourceSelected.dateAvailable, Validators.pattern('^[0-9]+$')],
      dateCreated: [resourceSelected.dateCreated, Validators.pattern('^[0-9]+$')],
      dateAccepted: [resourceSelected.dateAccepted, Validators.pattern('^[0-9]+$')],
      dateValid: [resourceSelected.dateValid, Validators.pattern('^[0-9]+$')],
      dateModified: [resourceSelected.dateModified, Validators.pattern('^[0-9]+$')],
      dateIssued: [resourceSelected.dateIssued, Validators.pattern('^[0-9]+$')],
      extend: [resourceSelected.extend, [Validators.pattern('^[^<>]+$')]],
      medium: [resourceSelected.medium, [Validators.pattern('^[^<>]+$')]],
      identifier: [resourceSelected.identifier, [Validators.pattern('^[^<>]+$')]],
      doi: [resourceSelected.doi, [Validators.pattern('^[^<>]+$')]],
      uri: [resourceSelected.uri, [Validators.pattern('^[^<>]+$')]],
      issn: [resourceSelected.issn, [Validators.pattern('^[^<>]+$')]],
      isbn: [resourceSelected.isbn, [Validators.pattern('^[^<>]+$')]],
      tilCodigo: [resourceSelected.tilCodigo, [Validators.required]],
      tirCodigo: [resourceSelected.tirCodigo, [Validators.required]],
      arcCodigo: [resourceSelected.arcCodigo, [Validators.required]],
      proCodigo: [resourceSelected.proCodigo, [Validators.required]],
      archivo: ['', [Validators.required]],
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

  downloadFile(codigoRecurso: string, title: string) {
    this.resourcesService.getFileToDownload(codigoRecurso)
      .subscribe(
        (response) => {
          const blob = new Blob([response], { type: response.type });
          saveAs(blob, title);
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

  onSearchByTitle(event: any) {
    const titleValue = this.txtSearchTitle.nativeElement.value;
    // localStorage.setItem('SearchTitle', titleValue);
    this.router.navigate(['/discover', { title: titleValue }]);
  }

  buildAdvancedSearchModel() {
    return {
      Titulo: this.formBusquedaAvanzada.value.titulo,
      CondicionUno: this.formBusquedaAvanzada.value.cond1,
      Autor: this.formBusquedaAvanzada.value.autor,
      CondicionDos: this.formBusquedaAvanzada.value.cond2,
      PalabrasClave: this.formBusquedaAvanzada.value.palabrasClaves,
      CondicionTres: this.formBusquedaAvanzada.value.cond3,
      TirCodigo: this.formBusquedaAvanzada.value.tipoRecurso,
      CondicionCuatro: this.formBusquedaAvanzada.value.cond4,
      ArcCodigo: this.formBusquedaAvanzada.value.areaConocimiento,
      CondicionCinco: this.formBusquedaAvanzada.value.cond5,
      SedeCodigo: this.formBusquedaAvanzada.value.sede,
      CondicionSeis: this.formBusquedaAvanzada.value.cond6,
    };
  }

}
