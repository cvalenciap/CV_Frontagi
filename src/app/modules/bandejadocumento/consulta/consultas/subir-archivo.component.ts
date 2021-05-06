import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { BsLocaleService, BsModalService, defineLocale, esLocale } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { FileServerService, ParametrosService, ValidacionService } from 'src/app/services';
import { Parametro } from 'src/app/models';
import { Plantilla } from 'src/app/models/plantilla';
import { Response } from '../../../../models/response';
import { PlantillaService } from 'src/app/services/impl/plantilla.service';
import { FormatoCarga } from 'src/app/constants/general/general.constants';
import { SessionService } from 'src/app/auth/session.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'bandeja-documento-modales-subir-archivo',
  templateUrl: 'subir-archivo.template.html',
  styleUrls: ['./subir-archivo.component.scss']
})

export class SubirArchivoComponents implements OnInit {
  public onClose: Subject<boolean>;
  @ViewChild('filed') myInputVariable: ElementRef;
  plantilla: Plantilla
  descripcion: string
  Documento: string
  ValidarTipo: boolean
  archivo: any;
  ValidarAdjuntar: boolean
  ValidarDescripcion: boolean
  public listaTipoPlantilla: Array<Parametro>;
  public listaTipoPlantillaReserva: Array<Parametro>;
  tipoPlantilla: string;
  mensaje: string;
  tipoPlantillaResult: string;
  ListaModulo: string;
  aceptar: string;
  nombreArchivo: string;

  constructor(private localeService: BsLocaleService,
    private parametroService: ParametrosService,
    private toastr: ToastrService,
    private servicioValidacion: ValidacionService,
    private router: Router,
    private service: PlantillaService,
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private bandejaFileServerService: FileServerService,
    private sanitizer: DomSanitizer,
    private spinner: NgxSpinnerService,
    public session: SessionService) {
    this.descripcion = "";
    this.Documento = "";
    this.tipoPlantilla = "";
    this.nombreArchivo = "";
    this.aceptar = "";
    this.mensaje = "";
    this.ValidarAdjuntar = false;
    this.ValidarDescripcion = false;
    this.ValidarTipo = false;
    this.tipoPlantillaResult = "";
    defineLocale('es', esLocale);
    this.localeService.use('es');
    this.ListaModulo = localStorage.getItem("ListaPlantilla");
  }

  ngOnInit() {
    
    this.plantilla = new Plantilla();
    this.obtenerTiposPlantilla();
  }

  cancelar() {
    this.router.navigate([`documento/consultas/bajarVideosPlantillas`]);
  }

  adjuntarArchivo(event: any) {
    
    if (this.tipoPlantilla == '') {
      this.toastr.error('Debe selecionar el tipo de archivo', 'Error', { closeButton: true });
    } else {

      if (this.tipoPlantilla == 'Plantilla') {
        
        if (event.target.files.length > 0) {
          if (event.target.files[0].size > 40000000) {
            this.toastr.warning('El documento excede el tamaño permitido 40MB.', 'Atención', { closeButton: true });
          } else {
            if (FormatoCarga.word == event.target.files[0].type || FormatoCarga.wordAntiguo == event.target.files[0].type) {
              this.archivo = event.target.files[0];
              this.nombreArchivo = event.target.files[0].name;
            } else {
              this.toastr.warning('Solo se permite archivos Word', 'Atención', { closeButton: true });
            }
          }
        }


      } else {

        if (event.target.files.length > 0) {
          if (event.target.files[0].size > 40000000) {
            this.toastr.warning('El documento excede el tamaño permitido 40MB.', 'Atención', { closeButton: true });
          } else {
            if (FormatoCarga.video == event.target.files[0].type) {
              this.archivo = event.target.files[0];
              this.nombreArchivo = event.target.files[0].name;
            } else {
              this.toastr.warning('Solo se permite archivos mp4', 'Atención', { closeButton: true });
            }
          }
        }

      }


    }
    this.myInputVariable.nativeElement.value = "";
    return;
  }

  OnGuardar() {
    if (this.tipoPlantilla == '') {
      this.ValidarTipo = true;
    } else { this.ValidarTipo = false; }
    if (this.nombreArchivo == '') {
      this.ValidarAdjuntar = true;
    } else { this.ValidarAdjuntar = false; }
    if (this.descripcion == '') {
      this.ValidarDescripcion = true;
    } else { this.ValidarDescripcion = false; }
    if (this.ValidarTipo || this.ValidarAdjuntar || this.ValidarDescripcion) {
      this.router.navigate([`documento/consultas/bandeja-documento-modales-subir-archivo`]);
      this.toastr.error('Debe ingresar  los campos obligatorios', 'Faltan Datos', { closeButton: true });
    } else {
      this.spinner.show()
      this.plantilla.nomplan = this.nombreArchivo;
      this.plantilla.desplan = this.descripcion;
      this.plantilla.tipoplan = this.tipoPlantilla;

      this.service.guardar(this.archivo, this.plantilla).subscribe(
        (response: Response) => {
          this.spinner.hide()
          this.toastr.success('Registro almacenado', 'Acción completada!', { closeButton: true });
          this.router.navigate([`documento/consultas/bajarVideosPlantillas`]);
        },
        (error) => this.controlarError(error)
      );
    }
  }

  obtenerTiposPlantilla() {
    this.parametroService.obtenerParametroPadre(this.ListaModulo).subscribe((response: Response) => {
      this.listaTipoPlantilla = response.resultado;
      this.listaTipoPlantillaReserva = response.resultado;
    }, (error) => {
      this.controlarError(error)
    });
  }

  controlarError(error) {
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', { closeButton: true });
  }

  limpiar(){
    this.nombreArchivo = "";
    this.descripcion = "";
  }

}
