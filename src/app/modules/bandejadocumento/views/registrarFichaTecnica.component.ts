import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { ToastrService } from 'ngx-toastr';
import { BandejaDocumentoService } from '../../../services';
import { Tipo } from '../../../models/tipo';
import { Estado } from '../../../models/enums/estado';
import { FichaTecnica } from '../../../models/fichaTecnica';
import { Response } from '../../../models/response';
import { Console } from '@angular/core/src/console';
import { ModalOptions, BsModalService, BsModalRef } from 'ngx-bootstrap';
import { AgregarColaboradorComponents } from 'src/app/modules/bandejadocumento/modales/agregar-colaborador.component';
import { BusquedaDocumentoFichaComponent } from 'src/app/modules/revisiondocumento/modals/busqueda-documento-ficha.component';
import { Jerarquia } from 'src/app/models';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { FichaTecnicaService } from 'src/app/services/impl/fichatecnica.service';
import { ParametrosService } from 'src/app/services/impl/parametros.service';
import { Constante } from 'src/app/models/enums';
import { Parametro } from 'src/app/models/parametro';
import { Colaborador } from 'src/app/models/colaborador';
import { DatePipe } from '@angular/common';
import { RutaParticipante } from 'src/app/models/rutaParticipante';
import { validate } from 'class-validator';
import { FichaTecnicaDocumento } from 'src/app/models/fichadocumento';
import { FormatoCarga } from 'src/app/constants/general/general.constants';
import { NgxSpinnerService } from 'ngx-spinner';
declare var jQuery: any;

@Component({
  selector: 'fichaTecnica-registrarFichaTecnica',
  templateUrl: 'registrarFichaTecnica.template.html',
  styleUrls: ['registrarFichaTecnica.component.scss'],
  providers: []
})
export class BandejaDocumentoFichaTecnicaComponent implements OnInit, OnDestroy {

  /* Datos */
  item: FichaTecnica;
  private sub: any;

  listaDocumentos: any;
  /* Objeto para modal */
  bsModalRef: BsModalRef;
  urlPDF:any;
  //Objeto para abrir ventana
  objetoVentana: BsModalRef;

  /* registro seleccionado */
  selectedRow: number;
  /* Objeto seleccionado */
  selectedObject: FichaTecnicaDocumento;
  objetoValidador:string;
  rutaArchivo: string;
  indicadorLectura: boolean;
  ValidarAdjuntar: boolean;
  objJerarquia: Jerarquia;
  listaTipoProceso: Parametro[];
  listaNivelProceso: Parametro[];
  errors: any;
  existeErrores: boolean;
  v_idTipoProceso: string;
  v_idNivel: string;
  archivo: any;
  v_idResponsable: string;
  nombreArchivo: string;
  /* Lista de fichas-documentos que son eliminados por el usuario  */
  listaFichaDocumentoEliminados: FichaTecnicaDocumento[];
  listaAux: FichaTecnicaDocumento[];
  listaAux1: FichaTecnica = new FichaTecnica;
  listaEliminadoAux: FichaTecnicaDocumento[];
  ngAfterViewInit() {
    // agregar slimscroll a página de árbol
    jQuery('.full-height-scroll').slimscroll({
      height: '100%'
    });
  }

  constructor(private localeService: BsLocaleService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private service: BandejaDocumentoService,
    private servicioFicha: FichaTecnicaService,
    private serviceParametro: ParametrosService,
    private datePipe: DatePipe,
    private modalService: BsModalService,
    private spinner: NgxSpinnerService
  ) {
    defineLocale('es', esLocale);
    this.localeService.use('es');
    this.selectedRow = -1;
    this.indicadorLectura = true;

    
    this.listaAux = [];
    this.listaEliminadoAux = [];
    this.item = new FichaTecnica();
    this.item.idTipoProceso = null;
    this.item.idNivel = null;
    this.ValidarAdjuntar = false;
    this.item.idConsensado = null;
    this.item.idElaborado = null;
    this.item.idAprobado = null;
    this.objJerarquia = new Jerarquia();
    this.listaTipoProceso = null;
    this.listaNivelProceso = null;
    this.errors = {};
    this.nombreArchivo = "";
    this.existeErrores = false;
    this.v_idTipoProceso = "0";
    this.v_idNivel = "0";
    this.v_idResponsable = "0";
    this.listaFichaDocumentoEliminados = [];
  }

  ngOnDestroy(): void {
    localStorage.removeItem("beanJerarquia");
  }

  adjuntarArchivo(event: any) {
    
    if (event.target.files.length > 0) {
      if (event.target.files[0].size > 40000000) {
        this.toastr.warning('El documento excede el tamaño permitido 40MB.', 'Atención', { closeButton: true });
      } else {
        if (FormatoCarga.pdf == event.target.files[0].type ) {
          
          this.archivo = event.target.files[0];
          this.nombreArchivo = event.target.files[0].name;
        } else {
          this.toastr.warning('Solo se permite archivos PDF', 'Atención', { closeButton: true });
        }
      }
    }
  }

  ngOnInit() {
    
    this.nombreArchivo = "";
    // Recibir objeto para la ficha tecnica
    this.objJerarquia = JSON.parse(localStorage.getItem('beanJerarquia'));

    this.spinner.show();
    this.servicioFicha.buscar(this.objJerarquia.idPadre).subscribe(
      (response: Response) => {
        
        this.spinner.hide();
        if (response.resultado) {
          this.item = response.resultado;
          this.listaAux1 = response.resultado;
          this.listaAux = this.listaAux1.fichaTecnicaDocumento;
          this.v_idTipoProceso = this.item.idTipoProceso.toString();
          this.v_idNivel = this.item.idNivel.toString();
          this.v_idResponsable = this.item.idResponsable.toString();
          this.nombreArchivo = this.item.nombreGrafico;
        } else {
          this.item.idJera = this.objJerarquia.idPadre;
        }
      },
      (error) => this.controlarError(error)
    );

    this.serviceParametro.obtenerParametroPadre(Constante.TIPO_PROCESO).subscribe(
      (response: Response) => {
        
        this.listaTipoProceso = response.resultado;
      },
      (error) => this.controlarError(error)
    );

    this.serviceParametro.obtenerParametroPadre(Constante.NIVEL_PROCESO).subscribe(
      (response: Response) => {
        
        this.listaNivelProceso = response.resultado;
      },
      (error) => this.controlarError(error)
    );

    // Recibir los Parametros
    this.sub = this.route.params.subscribe(params => {
      
      let moduloInvoca = params['modulo'];
      if (moduloInvoca == Constante.MANTENIMIENTO) {
        this.indicadorLectura = false;
      }
    });


  }
  OnAbrirGrafico() {
    
    var file = new Blob([this.item.rutaGrafico]);
    var link = document.createElement('a');
    link.href = URL.createObjectURL(file);
    link.download = this.item.nombreGrafico;
    link.click();
  }
  
    //validar si tiene ruta
    OnValidaRuta(Ruta: string, visorPdfSwal) {
      
      let RutaFinal = Ruta;
      if (RutaFinal != null) {
          this.urlPDF = this.item.rutaGrafico;
        //  this.objetoBlob = false;
         // this.urlPDF2 = false;
          visorPdfSwal.show();
      } else {
          this.toastr.warning('No tiene ningún documento para mostrar.', 'Atención', { closeButton: true });
      }
  }

  OnValidar(): void {
    
    this.item.idTipoProceso = Number(this.v_idTipoProceso);
    this.item.idNivel = Number(this.v_idNivel);

    this.errors = {};

    validate(this.item).then(errors => {
      
      if (errors.length > 0) {
        
        errors.map(e => {
          Object.defineProperty(this.errors, e.property, { value: e.constraints[Object.keys(e.constraints)[0]] });
        });
      }
    });
  }

  // YPM - INICIO
  OnGuardar() {
    

    this.errors = {};
    
    if(this.item.proceso.trim()==''){
      this.item.proceso='';
    }
    if(this.item.objetivo.trim()== ''){
      this.item.objetivo='';
      }
      if(this.item.alcance.trim()== ''){
        this.item.alcance='';
       }

       if(this.item.requisitos.trim()== ''){
        this.item.requisitos='';
       }
 
    this.item.idTipoProceso = Number(this.v_idTipoProceso);
    this.item.idNivel = Number(this.v_idNivel);
    this.item.nombreGrafico = this.nombreArchivo;
    validate(this.item).then(errors => {
      
      if (errors.length > 0) {
        
        this.existeErrores = true;
        errors.map(e => {
          Object.defineProperty(this.errors, e.property, { value: e.constraints[Object.keys(e.constraints)[0]] });
        });
        this.toastr.error(`Existen campos con infomación inválida`, 'Acción inválida', { closeButton: true });
      } 
      /* else if(this.item.proceso==null  || this.item.proceso.trim()== ''){
        this.toastr.warning('Por favor, registrar nombre de proceso.', 'Acción Incorrecta', { closeButton: true });
      } */
    /*   else if(this.item.objetivo==null  || this.item.objetivo.trim()== ''){
        this.toastr.warning('Por favor, registrar objetivo.', 'Acción Incorrecta', { closeButton: true });
      }
      else if(this.item.alcance==null  || this.item.alcance.trim()== ''){
        this.toastr.warning('Por favor, registrar alcance.', 'Acción Incorrecta', { closeButton: true });
      } */

      else {
        // Agrego las fichas-documentos eliminados a la lista
        /* if(this.listaFichaDocumentoEliminados.length > 0){
          this.listaFichaDocumentoEliminados.map(item => {
            this.item.fichaTecnicaDocumento.push(item);
          });
        } */

        if (this.listaEliminadoAux.length > 0) {
          for (let dato of this.listaEliminadoAux) {

            this.item.fichaTecnicaDocumento.push(dato);
          }
        }
        this.spinner.show();
        this.servicioFicha.guardar(this.archivo, this.item).subscribe(
          (response: Response) => {
            
            this.spinner.hide();
            localStorage.removeItem("nodeSeleccionado");
            localStorage.removeItem("ListaPlantilla");
            localStorage.removeItem("rutadelarbol");
            localStorage.removeItem("textotipodocumento");
            localStorage.removeItem("tipodocumento");
            localStorage.removeItem("idjerarquia");
            this.toastr.success('Registro almacenado', 'Acción completada!', { closeButton: true });
            this.router.navigate(['documento/jerarquias/editar/' + this.objJerarquia.idJerarquia + '/' + Constante.TIPO_JERARQUIA_PROCESO]);
          },
          (error) => this.controlarError(error)
        );
      }
    });

  }
  // YPM - FIN

  OnValidaElemento() {
    
    if (this.existeErrores) {
      this.OnValidar();
    }
  }

  OnRegresar() {
    

    if (!this.indicadorLectura) {
      localStorage.removeItem("nodeSeleccionado");
      localStorage.removeItem("ListaPlantilla");
      localStorage.removeItem("rutadelarbol");
      localStorage.removeItem("textotipodocumento");
      localStorage.removeItem("tipodocumento");
      localStorage.removeItem("idjerarquia");
      this.router.navigate(['documento/jerarquias/editar/' + this.objJerarquia.idJerarquia + '/' + Constante.TIPO_JERARQUIA_PROCESO]);
    } else {
      this.router.navigate(['documento/general/bandejadocumento/editar']);
    }
  }

  controlarError(error) {
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', { closeButton: true });
  }

  OnBuscarColaborador(control) {
    let colaborador: RutaParticipante;
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {},
      class: 'modal-lg'
    }
    this.objetoVentana = this.modalService.show(AgregarColaboradorComponents, config);
    (<AgregarColaboradorComponents>this.objetoVentana.content).onClose.subscribe(result => {
      
      if (control == "RESPONSABLE") {
        this.item.idResponsable = result.idColaborador;
        this.item.responsable = result.nombreCompleto.toString();
      } else if (control == "ELABORADO") {
        this.item.idElaborado = result.idColaborador;
        this.item.elaborado = result.nombreCompleto.toString();
      } else if (control == "CONSENSADO") {
        this.item.idConsensado = result.idColaborador;
        this.item.consensado = result.nombreCompleto.toString();
      } else if (control == "APROBADO") {
        this.item.idAprobado = result.idColaborador;
        this.item.aprobado = result.nombreCompleto.toString();
      }

      if (this.existeErrores) {
        this.OnValidar();
      }

    });
  }

  OnRowClick(index, obj): void {
    this.selectedRow = index;
    this.selectedObject = obj;
  }

  OnLimpiar(): void {

    /* Inicio : Quito todas las fichas-documentos*/
    this.item.fichaTecnicaDocumento.map((objFichaDoc: FichaTecnicaDocumento) => {
      objFichaDoc.disFichDoc = 2
      this.listaFichaDocumentoEliminados.push(objFichaDoc);
    });
    /* Fin */

    let idFicha = this.item.id > 0 ? this.item.id : 0;

    this.item = new FichaTecnica();
    this.item.fichaTecnicaDocumento = [];
    this.item.idJera = this.objJerarquia.idPadre;
    // En caso sea una actualización
    this.item.id = idFicha;

    this.item.idTipoProceso = null;
    this.item.idNivel = null;
    this.item.idConsensado = null;
    this.item.idElaborado = null;
    this.item.idAprobado = null;

    this.errors = {};
    this.existeErrores = false;
    this.v_idTipoProceso = "0";
    this.v_idNivel = "0";
    this.v_idResponsable = "0";
  }

  onBuscarDocumento() {
    
    this.item.fichaTecnicaDocumento ? null : this.item.fichaTecnicaDocumento = [];

    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      class: 'modal-lg'
    };
    this.bsModalRef = this.modalService.show(BusquedaDocumentoFichaComponent, config);
    (<BusquedaDocumentoFichaComponent>this.bsModalRef.content).onClose.subscribe(result => {
      
      let existeEnLista: boolean = false;

      if (this.item.fichaTecnicaDocumento.length > 0) {
        this.item.fichaTecnicaDocumento.map(e => {
          if (e.idDocu == result.id) {
            existeEnLista = true;
          }
        });
      }

      if (existeEnLista) {
        this.toastr.info('El Documento seleccionado ya se encuentra en la lista ', 'Aviso', { closeButton: true });
      } else {

        /*  if(this.listaFichaDocumentoEliminados.length > 0){
           this.listaFichaDocumentoEliminados.map(e =>{
             if(e.idDocu == result.id){
               e.disFichDoc = 1;
               this.item.fichaTecnicaDocumento.push(e);
               // Quito registro de la lista de eliminados
               this.listaFichaDocumentoEliminados.splice(this.listaFichaDocumentoEliminados.findIndex(v => v.idDocu === e.idDocu), 1);                    
               existeEnLista = true;
             }
           });
         } */

        if (!existeEnLista) {
          let obj: FichaTecnicaDocumento = new FichaTecnicaDocumento();
          obj.idDocu = result.id;
          obj.codDocu = result.codigo;
          obj.desDocu = result.descripcion;
          obj.idFich = this.item.id;
          obj.disFichDoc = 1;
          this.item.fichaTecnicaDocumento.push(obj);
        }
      }
      for (let data of this.item.fichaTecnicaDocumento) {
        data.disFichDoc = 1;
        this.item.fichaTecnicaDocumento = this.item.fichaTecnicaDocumento.filter(x => x = data);
      }

    });
  }

  OnEliminarDocumento(item: FichaTecnicaDocumento): void {
    

    // Verifico si es una FichaDocumento que ya existe
    /* if(this.selectedObject.idFichDoc){
      this.item.fichaTecnicaDocumento.map((objFichaDoc : FichaTecnicaDocumento) =>{
        if(objFichaDoc.idFichDoc == this.selectedObject.idFichDoc){
          objFichaDoc.disFichDoc = 2
          this.listaFichaDocumentoEliminados.push(objFichaDoc);
        }
      });
    }   */
    this.listaAux;
    let valor: boolean = false;
    for (let val of this.listaAux) {
      if (val.idDocu == item.idDocu) {
        val.disFichDoc = 2;
        this.listaEliminadoAux.push(val);
        this.item.fichaTecnicaDocumento = this.item.fichaTecnicaDocumento.filter(x => x != val);
        valor = true;
        break;
      }


      /* this.item.fichaTecnicaDocumento.splice(this.item.fichaTecnicaDocumento.findIndex(v => v.idDocu === this.selectedObject.idDocu), 1);      
      this.selectedObject = null; */
    }
    if (!valor) {
      for (let val of this.listaAux) {
        if (val.idDocu != item.idDocu) {
          this.item.fichaTecnicaDocumento = this.item.fichaTecnicaDocumento.filter(x => x != val);
        }
      }
    }

  }

  OnExportarXls() {
    
    let params: Map<string, any> = new Map();
    params = params.set('id', this.item.id);
    params = params.set('estado', 1);
    let fechaPrueba = new Date();
    let fecha = this.datePipe.transform(fechaPrueba, "dd/MM/yyyy");
    
    this.servicioFicha.generarExcel(params).subscribe(function (data) {
      
      var file = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      var link = document.createElement('a');
      link.href = URL.createObjectURL(file);
      link.download = "Ficha-Tecnica(" + fecha + ").xlsx";
      link.click();
    },
      (error) => this.controlarError(error)
    );
    this.toastr.info('Documento generado', 'Confirmación', { closeButton: true });
  }

}
