import { Component, OnInit, ElementRef, ViewChild, NgZone } from '@angular/core';
import { ResourcesService } from '../../services/resources.service';
import { MetadataService } from '../../services/metadata.service';
import { ActivatedRoute, Router, ActivatedRouteSnapshot } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import swal from 'sweetalert2';
import { Util } from '../../util/util';
import { ResponseModel } from 'src/app/models/response-model';
import { saveAs } from 'file-saver';
import { LoginService } from '../../services/login.service';
import { Meta } from '@angular/platform-browser';
import { isNull } from 'util';


@Component({
  selector: 'app-metadata',
  templateUrl: './metadata.component.html',
  styleUrls: ['./metadata.component.css']
})
export class MetadataComponent implements OnInit {

  listResource: any[] = [];
  listResources: any[] = [];
  listLenguajes: any[] = [];
  listAreasConocimiento: any[] = [];
  listProgramasAcademicos: any[] = [];
  listTipoRecursos: any[] = [];
  util: Util = new Util();
  metadata: any;
  formResource: FormGroup;
  submitted = false;
  fechaGrid: Date;
  private formBuilder: FormBuilder = new FormBuilder();
  operacion: string;
  tituloModal: string;
  fileToUpload: File;
  @ViewChild('btnCloseModal') btnCloseModal: ElementRef;
  @ViewChild('labelImport') labelImport: ElementRef;


  constructor(private resourcesService: ResourcesService, private activatedRoute: ActivatedRoute,
    private router: Router, private metadataService: MetadataService, private loginService: LoginService,
    private meta: Meta) { }

  ngOnInit() {
    this.getAreasConocimiento();
    this.getTiposRecursos();
    this.getResourceByCod(this.activatedRoute.snapshot.paramMap.get('id'));
    this.createMetadata(this.activatedRoute.snapshot.paramMap.get('id'));
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

  getResource() {
    this.resourcesService.getResources()
      .subscribe(response => {
        if (response.status) {
          this.listResource = response.information;
          this.searchResourceById();
        } else {
          this.util.manageResponseFalse(response);
        }
      });
  }

  searchResourceById() {
    this.activatedRoute.params.subscribe(params => {
      if (params.id) {
        this.listResource = this.listResource.filter(x => x.arcCodigo === params.id);
      }
    });
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

  createMetadata(codigo: string) {
    this.metadataService.getResourcesByCod(codigo)
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
        if (this.metadata[0].date !== null) {
          this.meta.updateTag({ name: 'DC.date', content: this.metadata[0].date });
        }
        if (this.metadata[0].dateAvailable !== null) {
          this.meta.updateTag({ name: 'DCTERMS.available', content: this.metadata[0].available });
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
        if (this.metadata[0].description !== '') {
          this.meta.updateTag({ name: 'DC.description', content: this.metadata[0].description });
        }
        if (this.metadata[0].abstract !== '') {
          this.meta.updateTag({ name: 'DCTERMS.abstract', content: this.metadata[0].abstract });
        }
        if (this.metadata[0].extend !== '') {
          this.meta.updateTag({ name: 'DCTERMS.extend', content: this.metadata[0].extend });
        }
        if (this.metadata[0].medium !== '') {
          this.meta.updateTag({ name: 'DCTERMS.medium', content: this.metadata[0].medium });
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
}
