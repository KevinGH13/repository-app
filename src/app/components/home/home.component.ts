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
  listFacultiesWithIcon: any[] = [];
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
    this.aplicationName = 'REPOSITORIO DIGITAL';
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
    this.listFacultiesWithIcon = [
      {
        codigo: 'B8F85C967F1C4D2BAC95E5C3DBD72873',
        nombre: 'Ingenierías',
        rutaIcono: '../../assets/images/ingenierias-fondo.png'
      },
      {
        codigo: 'E235CA58AFFB4732A0C98B1E44DA0FCD',
        nombre: 'Comunicación Audiovisual',
        rutaIcono: '../../assets/images/comunicacion-fondo.png'
      },
      {
        codigo: '1A88CB43CB3E4495A5313B7B7608E103',
        nombre: 'Administración',
        rutaIcono: '../../assets/images/administracion-fondo.png'
      },
      {
        codigo: '8159AC5F19CC45C7A6C88E4BD1AE535D',
        nombre: 'Ciencias Básicas, Sociales y Humanas',
        rutaIcono: '../../assets/images/ciencias-basicas-fondo.png'
      },
      {
        codigo: 'C23FF86A5F2A4C00B5D2FC0DC110DF76',
        nombre: 'Ciencias Agrarias',
        rutaIcono: '../../assets/images/agrarias-fondo.png'
      },
      {
        codigo: '2AB9FDE4F503418281784CA5E74023FA',
        nombre: 'Educación Física, Recreación y Deportes',
        rutaIcono: '../../assets/images/deportes-fondo.png'
      }
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
      Subject: this.formBusquedaAvanzada.value.subject,
      CondicionTres: this.formBusquedaAvanzada.value.cond3,
      TirCodigo: this.formBusquedaAvanzada.value.tipoRecurso,
      CondicionCuatro: this.formBusquedaAvanzada.value.cond4,
      ArcCodigo: this.formBusquedaAvanzada.value.areaConocimiento,
      CondicionCinco: this.formBusquedaAvanzada.value.cond5,
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
