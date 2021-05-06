import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { CorreoService} from '../../../../services';
import { Response } from '../../../../models/response';
import { Paginacion } from '../../../../models/paginacion';
import { ModalOptions, BsModalService, BsModalRef } from 'ngx-bootstrap';
import { RevisionDocumento } from 'src/app/models';
import { DomSanitizer } from '@angular/platform-browser';
import { BusquedaRegistroComponent } from 'src/app/modules/bandejadocumento/programacion/modales/busqueda-registro.component';
import { RevisionDocumentoService } from 'src/app/services/impl/revisiondocumentos.service';
import { DatePipe } from '@angular/common';
import { Constante } from 'src/app/models/enums';
import { SessionService } from 'src/app/auth/session.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Correo } from 'src/app/models/correo';

declare var jQuery: any;

@Component({
  selector: 'programacion-editar',
  templateUrl: 'editar.template.html',
  styleUrls: ['editar.component.scss']
})

export class ProgramacionEditarComponent implements OnInit {

  cItems: RevisionDocumento[];
  items: RevisionDocumento[];
  itemsAcum: RevisionDocumento[];
  itemsAcumFinal: RevisionDocumento[];
  item: RevisionDocumento;
  textoBusqueda: string;
  parametroBusqueda: string;
  paginacion: Paginacion;
  selectedRow: number;
  selectedObject: RevisionDocumento;
  loading: boolean;
  deshabilitarBuscar: boolean;
  mensajeInformacion: string;
  mostrarInformacion: boolean;
  mensajeAlerta: string;
  mostrarAlerta: boolean;
  textoMenu: string;
  listaEstados: any;
  parametroBusquedaAnterior: string;
  textoBusquedaAnterior: string;
  textoMenuAnterior: string;
  bsModalRef: BsModalRef;
  todosCheck: boolean;
  objetoBusqAvanz: RevisionDocumento;
  idProg: number;
  idEstProg: number;
  deshabilitarGuardar: boolean;
  activarColumna: boolean;
  flagJefe: string;
  codExiste: boolean;
  indicadorModi:number;
  activadorChecksTodos:boolean;
  gerenparametrodesc: string;
  gerenparametroid: string;

  public listaProgramacionSelecc: RevisionDocumento[];
  public listaProgramacionNoSelecc: RevisionDocumento[];
  public interruptorAceptar: boolean;
  private sub: any;

  constructor(private localeService: BsLocaleService,
    private toastr: ToastrService,
    private router: Router,
    public session: SessionService,
    private service: RevisionDocumentoService,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService,
    private datePipe: DatePipe,
    private serviceCorreo: CorreoService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this.loading = false;
    this.selectedRow = -1;
    this.items = [];
    this.cItems = [];
    this.parametroBusquedaAnterior = this.parametroBusqueda;
    this.paginacion = new Paginacion({ registros: 10 });
    this.deshabilitarBuscar = true;
    this.deshabilitarGuardar = true;
    this.mostrarAlerta = false;
    this.mostrarInformacion = false;
    this.textoMenu = null;
    this.objetoBusqAvanz = new RevisionDocumento();
    this.listaProgramacionSelecc = new Array<RevisionDocumento>();
    this.listaProgramacionNoSelecc = new Array<RevisionDocumento>();
    this.idProg = 0;
    this.idEstProg = 0;
    this.flagJefe = "";
    this.codExiste = true;
    this.indicadorModi = 0;
    this.activadorChecksTodos=true;
    this.gerenparametrodesc=null;
    this.gerenparametroid=null;
  }

  ngOnInit() {
    //this.getListaJefes();
    this.activarColumna = false;
    localStorage.removeItem("objetoAcumFinal");
    this.sub = this.route.params.subscribe(params => {
      this.idProg = + params['idProg'];
      this.idEstProg = + params['idEstProg'];
      this.deshabilitarGuardar = false;

      if (this.idProg) {
        this.indicadorModi = 1;
        this.abrirBusquedaPorIdProg(this.idProg);
      }

    });

    this.mostrarAlerta = false;
    this.mostrarInformacion = false;
    this.interruptorAceptar = true;
    
  }

  abrirBusquedaPorIdProg(idProg): void {
    
    this.loading = true;
    const parametros: { idProg?: string } = { idProg: null };
    parametros.idProg = idProg;
    this.service.buscarPorParametroIdProg(parametros).subscribe(
      (response: Response) => {
        this.todosCheck = false;
        this.activadorChecksTodos = false;
        let listadedocumento: RevisionDocumento[] = response.resultado;
        listadedocumento.forEach(documento => {
          documento.fecRevi = new Date(documento.fecRevi);
        });
        this.items = response.resultado;
        this.itemsAcumFinal = response.resultado;
        localStorage.setItem("objetoAcumFinal", JSON.stringify(this.itemsAcumFinal));

        this.seleccionarTodos();
        
        if (this.items.length > 0) {
          this.gerenparametrodesc = this.items[0].ruta;
          this.gerenparametroid = this.items[0].gerenparametroid.toString();
        }

        this.loading = false;
      },
      (error) => this.controlarError(error)
    );
  }

  OnRowClick(index, obj): void {
    this.selectedRow = index;
    this.selectedObject = obj;
  }
  
  controlarError(error) {
    console.error(error);
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', { closeButton: true });
  }

  permitirNumero(evento): void {
    if (!(evento.which >= 48 && evento.which <= 57))
      evento.preventDefault();
  }

  habilitarBuscar(): void {
    if (this.textoBusqueda != '')
      this.deshabilitarBuscar = false;
    else
      this.deshabilitarBuscar = true;
  }

  habilitarBuscarNumero(): void {
    if (this.textoBusqueda != null) {
      if (this.textoBusqueda != "") {
        this.deshabilitarBuscar = false;
      } else {
        this.deshabilitarBuscar = true;
      }
    } else {
      this.deshabilitarBuscar = true;
    }
  }

  obtenerTextoEstado(): void {
    this.textoMenu = this.listaEstados.find(resultado => (resultado.id + "") == this.textoBusqueda).valor;
  }

  OnRegresar(): void {
    this.router.navigate(['documento/programacion/programacion']);
  }

  OnLimpiar() {
    this.interruptorAceptar = true;
  }

  abrirBusquedaAvanzada() {
    
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        parametroDescRuta : this.gerenparametrodesc,
        parametroId : this.gerenparametroid
      },
      class: 'modal-md'
    }
    this.bsModalRef = this.modalService.show(BusquedaRegistroComponent, config);
    (<BusquedaRegistroComponent>this.bsModalRef.content).onClose.subscribe(result => {
      let objeto: RevisionDocumento = result;
      this.objetoBusqAvanz = objeto;
      this.getListaBusqueda(objeto);
    });
  }

  getListaBusqueda(objeto): void {
    this.loading = true;
    const parametros: { tipodoc?: string, gerenId?: string, anioantiguedad?: string } =
      { tipodoc: null, gerenId: null, anioantiguedad: null };

    parametros.tipodoc = objeto.tipodocumento;
    parametros.gerenId = objeto.gerenparametroid;
    parametros.anioantiguedad = objeto.anioantiguedad;
    this.itemsAcum=[];
    this.itemsAcumFinal = JSON.parse(localStorage.getItem("objetoAcumFinal"));
    this.itemsAcum = this.itemsAcumFinal;

    this.service.buscarPorParametrosAvanz(parametros, this.paginacion.pagina, this.paginacion.registros).subscribe(
      (response: Response) => {
        let listadedocumento: RevisionDocumento[] = response.resultado;
        this.items = [];
  
        this.todosCheck = false;
        
        listadedocumento.forEach(documento => {
          documento.fecRevi = new Date(documento.fecRevi);
        });

        
        this.items = response.resultado;

        if (this.items.length == 0) {
          this.activadorChecksTodos = true;
        } else {
          this.activadorChecksTodos = false;
          if (this.itemsAcum != undefined) {
            for (let index = 0; index < this.items.length; index++) {
              for (let indey = 0; indey < this.itemsAcum.length; indey++) {
                if (this.items[index].codDocu == this.itemsAcum[indey].codDocu) {
                  this.codExiste = false;
                }
              }
            }
          }

          if (this.itemsAcum) {
            if (this.codExiste) {
              this.items.forEach(item => {
                this.itemsAcum.push(item)
              });
            }

            this.items = this.itemsAcum;
            this.items.sort((a, b) => a.antiguedadDocu);
          }

          this.paginacion = new Paginacion(response.paginacion);

          this.items.forEach(obj => {
            obj.seleccionado = false;
          });
          this.seleccionarTodos();
        }

        this.loading = false;

      },
      (error) => this.controlarError(error)
    );
  }

  seleccionarTodos() {
    
     if (this.todosCheck) {
      this.todosCheck = false;
      this.items.forEach(obj => {
        if (obj.periodoOblig!= null || obj.periodoOblig > 0) {
          obj.seleccionado = true;
        }else{
          obj.seleccionado = false;
        }
      });
    } else {
      this.todosCheck = true;

      this.items.forEach(obj => {
        if (obj.periodoOblig!= null || obj.periodoOblig > 0) {
          obj.seleccionado = true;
        }else{
          obj.seleccionado = true;
        }

        if (obj.responsableEquipo) {
          obj.seleccionado = true;
        }else{
          obj.seleccionado = false;
        }

      });
    }
  }

  seleccionarCheck(item: any) {
    if (item.seleccionado) {
      item.seleccionado = false;
      if (!this.validaSeleccionados()) {
        this.todosCheck = false;
      }
    } else {
      item.seleccionado = true;
      if (this.validaSeleccionados()) {
        this.todosCheck = true;
      }
    }
  }

  validaSeleccionados(): boolean {
     let flag: boolean = true;
    for (let i: number = 0; this.items.length > i; i++) {
      if (!this.items[i].seleccionado) {
        flag = false;
        break;
      }
    }
    return flag;
  }

  OnPageChanged(event): void {
    this.paginacion.pagina = event.page;
    this.getListaBusqueda(this.objetoBusqAvanz);
  }

  OnPageOptionChanged(event): void {
    this.paginacion.registros = event.rows;
    this.paginacion.pagina = 1;
    this.getListaBusqueda(this.objetoBusqAvanz);
  }

  getListaJefes(): void {
    const parametros: { nroficha?: string, codArea?: string } = { nroficha: null, codArea: null };

    if (localStorage.getItem("codFichaLogueado")) {
      //recupero codigo de ficha del logueado al sistema
      let codFichaLogueado = localStorage.getItem("codFichaLogueado");
      let codAreaLogueado = localStorage.getItem("codAreaLogueado");

      parametros.nroficha = codFichaLogueado;
      parametros.codArea = codAreaLogueado;

      this.service.buscarJefes(parametros, this.paginacion.pagina, 10000).subscribe(
        (response: Response) => {
          for (let item of response.resultado) {
            if (item.fichaJefe == codFichaLogueado) {
              this.flagJefe = item.fichaJefe;
              localStorage.setItem("flagJefeRegistro", this.flagJefe);
            }
          }
          this.loading = false;
        },
        (error) => this.controlarError(error)
      );
    }
  }

  OnGuardar() {
    
    let c = 0;
    let revisionDocumento: RevisionDocumento = new RevisionDocumento();
    revisionDocumento.idTipDoc = localStorage.getItem("idTipDoc");
    revisionDocumento.gerenparametroid = this.objetoBusqAvanz.gerenparametroid;
    this.listaProgramacionSelecc = [];
    this.listaProgramacionNoSelecc = [];
    
    for (let item of this.items) {
      if (item.seleccionado) {
        c = c + 1;
        this.listaProgramacionSelecc.push(item);
      } else {
        if (item.idProgExistente) {
          this.listaProgramacionNoSelecc.push(item);
        }
      }
    }

    const jsonListaProgramacionSelecc = JSON.stringify(this.listaProgramacionSelecc);
    const jsonListaProgramacionNoSelecc = JSON.stringify(this.listaProgramacionNoSelecc);
    let parametros: any = { "listaProgSeleccionada": jsonListaProgramacionSelecc, "listaProgNoSeleccionada": jsonListaProgramacionNoSelecc }

    if (localStorage.getItem("codFichaLogueado")) {
      parametros.codFichaLogueado = localStorage.getItem("codFichaLogueado");
    }

     parametros.idEstProg = Constante.ID_ESTADO_PROGRAMACION_PROGRAMADO; //estado programado

    if (this.idProg) {
      parametros.idProg  = this.idProg;
    } else {
      parametros.idProg  = null;
    }
    
    if (this.listaProgramacionSelecc.length == 0) {
      this.toastr.error('Por favor, selecione minimo un documento.', 'Acción Incorrecta', { closeButton: true });
    } else {
      this.spinner.show();
      this.service.guardarProgramacion(parametros).subscribe(
        (response: Response) => {
          this.cItems = response.resultado;
          if ( this.indicadorModi == 0) {
            localStorage.removeItem("objetoRetornoBusqueda"); 
          }          
          this.spinner.hide();
          this.toastr.success('Registro Almacenado', 'Acción completada!', { closeButton: true });
          this.router.navigate([`documento/programacion/programacion`]);
        }
      );
    }
  
  }

  OnFinalizar() {
    let c = 0;
    let revisionDocumento: RevisionDocumento = new RevisionDocumento();
    revisionDocumento.idTipDoc = localStorage.getItem("idTipDoc");
    revisionDocumento.gerenparametroid = this.objetoBusqAvanz.gerenparametroid;
    this.listaProgramacionSelecc = [];
    this.listaProgramacionNoSelecc = [];
    
    for (let item of this.items) {
      if (item.seleccionado) {
        c = c + 1;
        this.listaProgramacionSelecc.push(item);
      } else {
        if (item.idProgExistente) {
          this.listaProgramacionNoSelecc.push(item);
        }
      }
    }

    const jsonListaProgramacionSelecc = JSON.stringify(this.listaProgramacionSelecc);
    const jsonListaProgramacionNoSelecc = JSON.stringify(this.listaProgramacionNoSelecc);
    let parametros: any = { "listaProgSeleccionada": jsonListaProgramacionSelecc, "listaProgNoSeleccionada": jsonListaProgramacionNoSelecc }

    if (localStorage.getItem("codFichaLogueado")) {
      parametros.codFichaLogueado = localStorage.getItem("codFichaLogueado");
    }

    parametros.idEstProg = Constante.ID_ESTADO_PROGRAMACION_DISTRIBUIDO; 

    if (this.idProg) {
      parametros.idProg  = this.idProg;
    } else {
      parametros.idProg  = null;
    }
    
    if (this.listaProgramacionSelecc.length == 0) {
      this.toastr.error('Por favor, selecione minimo un documento.', 'Acción Incorrecta', { closeButton: true });
    } else {
      this.spinner.show();
      this.service.guardarProgramacion(parametros).subscribe(
        (response: Response) => {
          this.cItems = response.resultado;
          localStorage.removeItem("objetoRetornoBusqueda"); 
          for (let index = 0; index < this.cItems.length; index++) {

            this.serviceCorreo.obtenerListaCorreo(this.cItems[index].idProgramacion, this.cItems[index].idEquipoProgramacion ,
              Constante.CORREO_REGISTRO_PROGRAMACION).subscribe(
                (response: Response) => {
                  const lista: Correo[] = response.resultado;
                  lista.forEach(correo => {
                    if (correo.correoCabecera.correoDestino.length > 0) {
                      this.serviceCorreo.enviarCorreo(correo).subscribe(
                        (response: Response) => { },
                        (error) => {
                          this.controlarError(error);
                        }
                      );
                    }
                  });
                },
                (error) => {
                  this.controlarError(error);
                }
              );
          }
          this.spinner.hide();
          this.toastr.success('Registro Almacenado', 'Acción completada!', { closeButton: true });
          this.router.navigate([`documento/programacion/programacion`]);
        }
      );
    }
  }

}