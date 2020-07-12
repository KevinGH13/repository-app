import { Component, OnInit, ElementRef, ViewChild, NgZone } from '@angular/core';
import { ResourcesService } from '../../services/resources.service';
import { ActivatedRoute, Router, ActivatedRouteSnapshot } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import swal from 'sweetalert2';
import { Util } from '../../util/util';
import { ResponseModel } from 'src/app/models/response-model';
import { saveAs } from 'file-saver';
import { LoginService } from '../../services/login.service';
import { SedesService } from '../../services/sedes.service';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-recurso',
  templateUrl: './recurso.component.html',
  styleUrls: ['./recurso.component.css']
})
export class RecursoComponent implements OnInit {

  listResources: any[] = [];
  listResource: any[] = [];
  listLenguajes: any[] = [];
  listAreasConocimiento: any[] = [];
  listProgramasAcademicos: any[] = [];
  listTipoRecursos: any[] = [];
  listSedes: any[] = [];
  listLicences: any[] = [];
  ListColletions: any[] = [];
  metadata: any;
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
  @ViewChild('searchTitle') txtSearchTitle: ElementRef;

  constructor(private resourcesService: ResourcesService, private activatedRoute: ActivatedRoute,
    public loginService: LoginService, private router: Router, private sedesService: SedesService, private meta: Meta) {
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
    this.getLicences();
    this.getColletions();
    this.getResourceByCod(this.activatedRoute.snapshot.paramMap.get('id'));
    this.createMetadata(this.activatedRoute.snapshot.paramMap.get('id'));
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

  get fo() { return this.formResource.controls; }

  validateOrigin(): any {
    this.activatedRoute.params.subscribe(params => {
      if (params.search === 'true') {
        // this.getAdvancedSearch();
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

  getResourceByCod(codigo: string) {
    this.resourcesService.getResourcesByCod(codigo)
      .subscribe(response => {
        if (response.status) {
          this.listResource = response.information;
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
          console.log(this.util.manageResponseFalse(response));
        }
      },
        error => { this.util.manageSesion(this.router); this.btnCloseModal.nativeElement.click(); });
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

  onEdit(codigoRecurso: string) {
    this.tituloModal = 'Editar Recurso';
    this.operacion = 'MOD';
    const resourceSelected = this.listResource[0];
    this.formResource = this.formBuilder.group({
      codigo: [resourceSelected.codigo, null],
      title: [resourceSelected.title, [Validators.required, Validators.pattern('^[^<>]+$')]],
      alternative: [resourceSelected.alternative, [Validators.pattern('^[^<>]+$')]],
      abstract: [resourceSelected.abstract, Validators.required],
      subject: [resourceSelected.subject, [Validators.required, Validators.pattern('^[^<>]+$')]],
      source: [resourceSelected.source, [Validators.pattern('^[^<>]+$')]],
      relation: [resourceSelected.relation, [Validators.pattern('^[^<>]+$')]],
      creator: [resourceSelected.creator, [Validators.required, Validators.pattern('^[^<>]+$')]],
      publisher: [resourceSelected.publisher, [Validators.pattern('^[^<>]+$')]],
      contributor: [resourceSelected.contributor, [Validators.pattern('^[^<>]+$')]],
      advice: [resourceSelected.advice, [Validators.pattern('^[^<>]+$')]],
      accessRights: [resourceSelected.accessRights],
      licence: [resourceSelected.licence],
      dateCreated: [resourceSelected.dateCreated],
      dateAccepted: [resourceSelected.dateAccepted],
      dateValid: [resourceSelected.dateValid],
      dateModified: [resourceSelected.dateModified],
      dateIssued: [resourceSelected.dateIssued],
      extend: [resourceSelected.extend],
      medium: [resourceSelected.medium],
      identifier: [resourceSelected.identifier],
      doi: [resourceSelected.doi],
      uri: [resourceSelected.uri],
      issn: [resourceSelected.issn],
      isbn: [resourceSelected.isbn],
      year: [resourceSelected.year],
      spatial: [resourceSelected.spatial],
      timCodigo: [resourceSelected.timCodigo, Validators.required],
      tilCodigo: [resourceSelected.tilCodigo, Validators.required],
      tirCodigo: [resourceSelected.tirCodigo, Validators.required],
      arcCodigo: [resourceSelected.arcCodigo, Validators.required],
      proCodigo: [resourceSelected.proCodigo, Validators.required],
      colCodigo: [resourceSelected.proCodigo, Validators.required],
      archivo: [''],
      visualizaciones: [resourceSelected.visualizaciones, null],
      descargas: [resourceSelected.descargas, null],
      sedeCodigo: [resourceSelected.sedeCodigo],
      indDescargaRestringida: [resourceSelected.indDescargaRestringida]
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
          this.router.navigate(['/discover']);
        }
      });
  }

  deleteTipoRecurso(codigoRecurso: string): void {
    const resourceSelected = this.listResource[0];
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

  createMetadata(codigo: string) {
    this.resourcesService.getResourcesByCod(codigo)
      .subscribe(response => {
        this.metadata = response.information;
        if (this.metadata[0].creator !== '') {
          this.meta.updateTag({ name: 'DC.creator', content: this.metadata[0].creator });
        }
        if (this.metadata[0].contributor !== '') {
          this.meta.updateTag({ name: 'DC.contributor', content: this.metadata[0].contributor });
        }
        if (this.metadata[0].advice !== '') {
          this.meta.updateTag({ name: 'DC.contributor.advice', content: this.metadata[0].advice });
        }
        if (this.metadata[0].sedeNombre !== '') {
          this.meta.updateTag({ name: 'DC.coverage', content: this.metadata[0].sedeNombre });
        }
        if (this.metadata[0].spatial !== '') {
          this.meta.updateTag({ name: 'DCTERMS.coverage.spatial', content: this.metadata[0].spatial });
        }
        if (this.metadata[0].date !== null) {
          this.meta.updateTag({ name: 'DC.date', content: this.metadata[0].date });
        }
        if (this.metadata[0].year !== '') {
          this.meta.updateTag({ name: 'DCTERMS.issued', content: this.metadata[0].year });
        }
        if (this.metadata[0].dateCreated !== null) {
          this.meta.updateTag({ name: 'DCTERMS.created', content: this.metadata[0].dateCreated });
        }
        if (this.metadata[0].dateAccepted !== null) {
          this.meta.updateTag({ name: 'DCTERMS.dateAccepted', content: this.metadata[0].dateAccepted });
        }
        if (this.metadata[0].dateValid !== null) {
          this.meta.updateTag({ name: 'DCTERMS.valid', content: this.metadata[0].dateValid });
        }
        if (this.metadata[0].dateModified !== null) {
          this.meta.updateTag({ name: 'DCTERMS.modified', content: this.metadata[0].dateModified });
        }
        if (this.metadata[0].dateIssued !== null) {
          this.meta.updateTag({ name: 'DCTERMS.issued', content: this.metadata[0].dateIssued });
        }
        if (this.metadata[0].abstract !== '') {
          this.meta.updateTag({ name: 'DCTERMS.abstract', content: this.metadata[0].abstract });
        }
        if (this.metadata[0].extend !== '') {
          this.meta.updateTag({ name: 'DCTERMS.extend', content: this.metadata[0].extend });
        }
        if (this.metadata[0].medium !== '') {
          this.meta.updateTag({ name: 'DC.format', content: this.metadata[0].medium });
        }
        if (this.metadata[0].timCodigo !== '') {
          this.meta.updateTag({ name: 'DC.format.mimetype', content: this.metadata[0].timNombre });
        }
        if (this.metadata[0].tilCodidog !== '') {
          this.meta.updateTag({ name: 'DC.language', content: this.metadata[0].tilNombre });
        }
        if (this.metadata[0].publisher !== '') {
          this.meta.updateTag({ name: 'DC.publisher', content: this.metadata[0].publisher });
        }
        if (this.metadata[0].arcCodigo !== '') {
          this.meta.updateTag({ name: 'DC.publisher.department', content: this.metadata[0].arcNombre });
        }
        if (this.metadata[0].proCodigo !== '') {
          this.meta.updateTag({ name: 'DC.publisher.program', content: this.metadata[0].proNombre });
        }
        if (this.metadata[0].accessRights !== '') {
          this.meta.updateTag({ name: 'DCTERMS.accessRights', content: this.metadata[0].accessRights });
        }
        if (this.metadata[0].licence !== '') {
          this.meta.updateTag({ name: 'DCTERMS.licence', content: this.metadata[0].licence });
        }
        if (this.metadata[0].relation !== '') {
          this.meta.updateTag({ name: 'DC.relation', content: this.metadata[0].relation });
        }
        if (this.metadata[0].subject !== '') {
          this.meta.updateTag({ name: 'DC.subject', content: this.metadata[0].subject });
        }
        if (this.metadata[0].title !== '') {
          this.meta.updateTag({ name: 'DC.title', content: this.metadata[0].title });
        }
        if (this.metadata[0].alternative !== '') {
          this.meta.updateTag({ name: 'DCTERMS.alternative', content: this.metadata[0].alternative });
        }
      });
  }

  onSearchByTitle(event: any) {
    const titleValue = this.txtSearchTitle.nativeElement.value;
    // localStorage.setItem('SearchTitle', titleValue);
    this.router.navigate(['/discover', { title: titleValue }]);
  }

  onSearchById(event: any, id: string) {
    const titleValue = this.txtSearchTitle.nativeElement.value;
    const idValue = id;
    // localStorage.setItem('SearchTitle', titleValue);
    if (titleValue === '') {
      this.router.navigate(['/discover', { title: titleValue, id: idValue, search: false }]);

    } else {
      this.router.navigate(['/discover', { title: titleValue, id: idValue, search: true }]);
    }
  }

}
