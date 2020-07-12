import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FacultiesService } from '../../services/faculties.service';
import { Util } from '../../util/util';
import { TiposDocumentosService } from '../../services/tipos-documentos.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { ResourcesService } from '../../services/resources.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  aplicationName: string;
  universityName: string;
  listFaculties: any[] = [];
  listColletionsWithIcon: any[] = [];
  listTipoRecursos: any[] = [];
  listSedes: any[] = [];
  util: Util = new Util();
  formBusquedaAvanzada: FormGroup;
  formBuilder: FormBuilder = new FormBuilder();
  submitted = false;
  @ViewChild('btnCloseModal') btnCloseModal: ElementRef;
  @ViewChild('searchTitle') txtSearchTitle: ElementRef;
  @ViewChild('searchTitleSA') txtSearchTitleAS: ElementRef;

  constructor(private falcultiesService: FacultiesService, private tipoRecursoService: TiposDocumentosService,
    private sanitizer: DomSanitizer, private resourceService: ResourcesService, private route: Router) {
    this.aplicationName = 'REPOSITORIO INSTITUCIONAL';
    this.universityName = 'POLITÉCNICO COLOMBIANO JAIME ISAZA CADAVID';
  }

  ngOnInit() {
    this.CreateFormValidation();
    this.getFaculties();
    this.getTipoRecursos();
    this.getSedes();
    this.selectImagesHomePage();
  }

  get fo() { return this.formBusquedaAvanzada.controls; }

  CreateFormValidation() {
    this.formBusquedaAvanzada = this.formBuilder.group({
      title: ['', [Validators.pattern('^[^<>]+$')]],
      creator: ['', [Validators.pattern('^[^<>]+$')]],
      advice: ['', [Validators.pattern('^[^<>]+$')]],
      subject: ['', [Validators.pattern('^[^<>]+$')]],
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

  getTipoRecursos(): any {
    this.tipoRecursoService.getTipoRecursos()
      .subscribe(response => {
        if (response.status) {
          this.listTipoRecursos = response.information;
        } else {
          this.util.manageResponseFalse(response);
        }
      });
  }

  getSedes() {
    this.resourceService.getSedes()
      .subscribe(response => {
        if (response.status) {
          this.listSedes = response.information;
        } else {
          this.util.manageResponseFalse(response);
        }
      });
  }

  getFaculties() {
    this.falcultiesService.getFaculties()
      .subscribe(response => {
        if (response.status) {
          this.listFaculties = response.information;
        } else {
          this.util.manageResponseFalse(response);
        }
      });
  }

  selectImagesHomePage(): any {
    this.listColletionsWithIcon = [
      {
        codigo: '2567A065D99648C88D8BE14B73012ABB',
        nombre: 'Docencia',
        rutaIcono: '../../assets/images/docencia.png'
      },
      {
        codigo: '5D6B24D3723843B6AE6C2D9414596CF1',
        nombre: 'Institucional',
        rutaIcono: '../../assets/images/institucional.png'
      },
      {
        codigo: 'DF6F620DF6CA4BEBABB09586F077022B',
        nombre: 'Investigación',
        rutaIcono: '../../assets/images/investigacion.png'
      },
      {
        codigo: '225DC1D2FAD64C7FA6752062DF99AC50',
        nombre: 'Sello Editorial',
        rutaIcono: '../../assets/images/selloeditorial.png'
      },
      {
        codigo: '103195D9BECC428380D5D8A7F1E563B3',
        nombre: 'Trabajos de Grado',
        rutaIcono: '../../assets/images/trabajosdegrado.png'
      },
    ];
  }

  onSubmit() {
    this.submitted = true;
    const titleValue = this.txtSearchTitleAS.nativeElement.value;
    if (this.formBusquedaAvanzada.valid) {
      const model = this.buildAdvancedSearchModel();
      localStorage.setItem('AdvancedSearch', JSON.stringify(model));
      this.route.navigate(['/discover', { title: titleValue, search: 'true' }]);
      this.btnCloseModal.nativeElement.click();
    }
  }

  buildAdvancedSearchModel() {
    return {
      Title: this.formBusquedaAvanzada.value.title,
      CondicionUno: this.formBusquedaAvanzada.value.cond1,
      Creator: this.formBusquedaAvanzada.value.creator,
      CondicionDos: this.formBusquedaAvanzada.value.cond2,
      Advice: this.formBusquedaAvanzada.value.advice,
      CondicionTres: this.formBusquedaAvanzada.value.cond3,
      Subject: this.formBusquedaAvanzada.value.subject,
      CondicionCuatro: this.formBusquedaAvanzada.value.cond4,
      TirCodigo: this.formBusquedaAvanzada.value.tipoRecurso,
      CondicionCinco: this.formBusquedaAvanzada.value.cond5,
      ArcCodigo: this.formBusquedaAvanzada.value.areaConocimiento,
      CondicionSeis: this.formBusquedaAvanzada.value.cond6,
      SedeCodigo: this.formBusquedaAvanzada.value.sede,
    };
  }

  onSearchByTitle(event: any) {
    const titleValue = this.txtSearchTitle.nativeElement.value;
    // localStorage.setItem('SearchTitle', titleValue);
    this.route.navigate(['/discover', { title: titleValue }]);
  }

  onCancel() {
    this.formBusquedaAvanzada.reset();
  }

}
