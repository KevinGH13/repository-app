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
  listLicences: any[] = [];
  ListColletions: any[] = [];
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
  @ViewChild('searchId') searchId: ElementRef;
  @ViewChild('searchTitleSA') txtSearchTitleAS: ElementRef;

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
    this.CreateFormValidationAS();
    this.getAreasConocimiento();
    this.getTiposRecursos();
    this.getTiposLenguaje();
    this.getSedes();
    this.getProgramasAcademicos();
    this.getLicences();
    this.getColletions();
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

  getColletions(): any {
    this.resourcesService.getColletions()
      .subscribe(response => {
        if (response.status) {
          this.ListColletions = response.information;
        } else {
          this.util.manageResponseFalse(response);
        }
      }, error => { this.util.manageSesion(this.router); this.btnCloseModal.nativeElement.click(); });
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

  getLicences(): any {
    this.listLicences = ['Copyrigth', 'Copyleft', 'Creative Commons - Reconocimiento', 'Creative Commons - Reconocimiento - NoComercial',
      'Creative Commons - Reconocimiento - NoComercial - CompartirIgual',
      'Creative Commons - Reconocimiento - NoComercial - SinObraDerivada',
      'Creative Commons - CompartirIgual', 'Creative Commons - Reconocimiento - SinObraDerivada'];
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

  get fo() {
    return this.formResource.controls;
  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngAfterContentInit() {
    this.activatedRoute.params.subscribe(params => {
      if (params) {
        this.txtSearchTitle.nativeElement.value = '';
      }
      if (params.title !== undefined) {
        this.txtSearchTitle.nativeElement.value = params.title;
      }
    });
  }

  validateOrigin(): any {
    this.activatedRoute.params.subscribe(params => {
      if (params.search === 'true') {
        this.getAdvancedSearch();
      } else if (params.fil === 'true') {
        this.getResourcesByIdAndTitle(params.id, params.title);
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
        this.listResources = this.listResources.filter(x => x.colCodigo === params.id);
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

  getResourcesByIdAndTitle(id: string, title: string) {
    this.resourcesService.getResourcesByIdAndTitle(id, title)
      .subscribe(response => {
        if (response.status) {
          this.listResources = response.information;
        } else {
          this.util.manageResponseFalse(response);
        }
      },
        error => { this.util.manageSesion(this.router); this.btnCloseModal.nativeElement.click(); });
  }

  onSearchById(event: any, id: string) {
    const titleValue = this.txtSearchTitle.nativeElement.value;
    const idValue = id;
    if (titleValue === '') {
      this.router.navigate(['/discover', { title: titleValue, id: idValue, fil: false }]);

    } else {
      this.router.navigate(['/discover', { title: titleValue, id: idValue, fil: true }]);
    }
  }

  CreateFormValidation() {
    this.formResource = this.formBuilder.group({
      codigo: ['', null],
      title: ['', [Validators.required, Validators.pattern('^[^<>]+$')]],
      alternative: ['', [Validators.pattern('^[^<>]+$')]],
      abstract: ['', [Validators.required, Validators.pattern('^[^<>]+$')]],
      subject: ['', [Validators.required, Validators.pattern('^[^<>]+$')]],
      source: ['', [Validators.pattern('^[^<>]+$')]],
      relation: ['', [Validators.pattern('^[^<>]+$')]],
      creator: ['', [Validators.required, Validators.pattern('^[^<>]+$')]],
      publisher: ['', [Validators.pattern('^[^<>]+$')]],
      contributor: ['', [Validators.pattern('^[^<>]+$')]],
      advice: ['', [Validators.pattern('^[^<>]+$')]],
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
      colCodigo: ['', Validators.required],
      archivo: ['', Validators.required],
      visualizaciones: ['', null],
      descargas: ['', null],
      sedeCodigo: ['', Validators.required],
      indDescargaRestringida: ['N', Validators.required],
      year: ['', null],
      spatial: ['', [Validators.pattern('^[^<>]+$')]],
    });
  }

  CreateFormValidationAS() {
    this.formBusquedaAvanzada = this.formBuilder.group({
      titulo: ['', [Validators.pattern('^[^<>]+$')]],
      autor: ['', [Validators.pattern('^[^<>]+$')]],
      asesor: ['', [Validators.pattern('^[^<>]+$')]],
      keywords: ['', [Validators.pattern('^[^<>]+$')]],
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
    this.fileToUpload = file.item(0);
    if (file.item(0)) {
      this.labelImport.nativeElement.innerHTML = file.item(0).name;
    } else {
      this.labelImport.nativeElement.innerHTML = 'Seleccione un archivo';
    }
  }

  onSearchByTitle(event: any) {
    const titleValue = this.txtSearchTitle.nativeElement.value;
    localStorage.setItem('SearchTitle', titleValue);
    this.router.navigate(['/discover', { title: titleValue }]);
  }

  buildAdvancedSearchModel() {
    return {
      Title: this.formBusquedaAvanzada.value.titulo,
      CondicionUno: this.formBusquedaAvanzada.value.cond1,
      Creator: this.formBusquedaAvanzada.value.autor,
      CondicionDos: this.formBusquedaAvanzada.value.cond2,
      Advice: this.formBusquedaAvanzada.value.asesor,
      CondicionTres: this.formBusquedaAvanzada.value.cond3,
      Subject: this.formBusquedaAvanzada.value.keywords,
      CondicionCuatro: this.formBusquedaAvanzada.value.cond4,
      TirCodigo: this.formBusquedaAvanzada.value.tipoRecurso,
      CondicionCinco: this.formBusquedaAvanzada.value.cond5,
      ArcCodigo: this.formBusquedaAvanzada.value.areaConocimiento,
      CondicionSeis: this.formBusquedaAvanzada.value.cond6,
      SedeCodigo: this.formBusquedaAvanzada.value.sede,
    };
  }

  onSubmitAS() {
    this.submitted = true;
    const titleValue = this.txtSearchTitleAS.nativeElement.value;
    if (this.formBusquedaAvanzada.valid) {
      const model = this.buildAdvancedSearchModel();
      localStorage.setItem('AdvancedSearch', JSON.stringify(model));
      this.router.navigate(['/discover', { title: titleValue, search: 'true' }]);
      this.btnCloseModal.nativeElement.click();
    }
  }

}
