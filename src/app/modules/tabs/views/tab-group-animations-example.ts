import { Component, ViewChild, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EquipoUsuarioComponent } from 'src/app/modules/bandejadocumento/components/equipo-usuario.component';
import { CRegistroDocumentoComponent } from 'src/app/modules/bandejadocumento/components/components-registro-documento.component';
import { RevisionComponent } from 'src/app/modules/bandejadocumento/components/revision.component';
import { JsonService, JerarquiasService, RelacionCoordinadorService } from 'src/app/services';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { NOMBREPAGINA, ACCIONES } from 'src/app/constants/general/general.constants';
import { BandejaDocumentoService } from 'src/app/services/impl/bandejadocumentos.service';
import { Response, Documento, RevisionDocumento, ControlView, Jerarquia } from 'src/app/models';
import { ParticipanteComponent } from 'src/app/modules/revisiondocumento/components/participante.component';
import { ElaboracionComponent } from 'src/app/modules/bandejadocumento/components/elaboracion.component';
import { ConsensoComponent } from 'src/app/modules/bandejadocumento/components/consenso.component';
import { AprobacionComponent } from 'src/app/modules/bandejadocumento/components/apobacion.component';
import { HomologacionComponent } from 'src/app/modules/bandejadocumento/components/homologacion.component';
import { ComplementarioComponent } from 'src/app/modules/bandejadocumento/components/complementario.component';
import { FaseRegistroComponent } from 'src/app/modules/bandejadocumento/components/fase-registro.component';
import { Fase } from 'src/app/models/fase';
import { AppSettings } from 'src/app/app.settings';
import { EnvioParametros } from 'src/app/models/envioParametros';

import { CopiaTrabajador } from 'src/app/models/copiatrabajador';
declare var jQuery: any;

import { Constante } from 'src/app/models/enums';

import { NgxSpinnerService } from 'ngx-spinner';


import { ToastrService } from 'ngx-toastr';
import { RelacionCoordinador } from 'src/app/models/relacioncoordinador';


/**
 * @title Tab group animations
 */
@Component({
  selector: 'tab-group-animations-example',
  templateUrl: 'tab-group-animations-example.html',
  styleUrls: ['tab-group-animations-example.scss'],
})
export class TabGroupAnimationsExample implements OnInit {
  @ViewChild('equipousuario') equipousuario: EquipoUsuarioComponent;
  @ViewChild('participantes') participantes: ElaboracionComponent;
  @ViewChild('concenso') concenso: ConsensoComponent;
  @ViewChild('aprobacion') aprobacion: AprobacionComponent;
  @ViewChild('homologacion') homologacion: HomologacionComponent;
  @ViewChild('general') general: CRegistroDocumentoComponent;
  @ViewChild('complementario') complementario: ComplementarioComponent;
  @ViewChild('revision') revision: RevisionComponent;
  @ViewChild('bitacora') bitacora: FaseRegistroComponent;
  @Output() padre: EventEmitter<any> = new EventEmitter<any>();
  //enviar el estado de rechazo al padre
  @Output() FechaRechazo: EventEmitter<string> = new EventEmitter<string>();
  @Output() IndicadorDigital: EventEmitter<string> = new EventEmitter<string>();
  @Output() fechaliberacion: EventEmitter<string> = new EventEmitter<string>();
  @Output() cantidadRegistroFase: EventEmitter<string> = new EventEmitter<string>();
  @Output() RutaOrigin: EventEmitter<string> = new EventEmitter<string>();
    @Output() FechaRechazoAnteior: EventEmitter<string> = new EventEmitter<string>();



  //
  //@Output() enviarPadre:EventEmitter<string> = new EventEmitter<string>();
  @Input() activar: boolean;
  @Input() consulta: boolean;
  @Input() idFase: number;
  //@Input() activartab : boolean;
  itemCodigo: number;
  item: Documento;
  valor: boolean;
  permisos: any;
  varTemporal: boolean;
  FechaRechazoFase: Date;
  nombrePagina: string;
  tipoAccion: string;
  controlview: ControlView;
  indicadorSolicitudRevision: string;
  indicadorSelecDocu: string;
  faseElaboracion: Fase;
  faseConsenso: Fase;
  nombreCoordinador: string;
  faseAprobacion: Fase;
  faseHomologacion: Fase;
  idPadreCoord: number;
  valorAlcanceHijo: number;
  loading: boolean;
  revi: number;
  nroFicha: number;
  listaDoc: Documento[] = [];
  private sub: any;
  itemDocumento: EnvioParametros;
  listaReturn: any[] = [];
  idComboRevision: any;
  detDescripcionRevision: any;
  listEquipoAux: any;
  listElaboracionAux: any;
  listConsensoAux: any;
  listAprobacionAux: any;
  listHomologacionAux: any;
  valorFase: any;
  @Output() verDocumento: EventEmitter<string> = new EventEmitter<string>();
  @Output() verDocumentoOring: EventEmitter<string> = new EventEmitter<string>();

  constructor(private _jsonService: JsonService,
    private route: ActivatedRoute,
    private serviceJerarquia: JerarquiasService,
    private serviceRelacion: RelacionCoordinadorService,

    private spinner: NgxSpinnerService,
    private service: BandejaDocumentoService,
    private toastr: ToastrService) {

    /*Desactiva pesta�a Participantes*/
    this.valor = true;
    this.varTemporal = true;
    this.item = new Documento();
    this.controlview = new ControlView();
    this.indicadorSolicitudRevision = null;
    this.indicadorSelecDocu = null;
    //this.pruebaHijo = this.equipo_usuario.prueba;
    this.revi = 0;
  }

  ngAfterViewInit() {
    jQuery('.full-height-scroll').slimscroll({
      height: '100%'
    });
  }

  obtenerDataRutaPadre() {
    if (this.route.parent) {
      //this.route.parent.data.subscribe(params => {
      this.route.data.subscribe(params => {
        if (params['nArchivo']) {
          this.nombrePagina = params['nArchivo'];
          this.tipoAccion = params['accion'];
          this.cargarControlView(this.nombrePagina, this.tipoAccion);
        }

      });
    }
  }

  cargarControlView(nombrePagina, tipoAccion) {
    //console.log("tipo accione "+this.tipoAccion + " nombre apgina "+ nombrePagina);
    
    if (nombrePagina == NOMBREPAGINA.DOCUMENTO) {
      this.controlview.editar.general.btnBuscarDoc = false;
      this.controlview.editar.fase.esVisible = false;
      this.controlview.nuevo.general.btnBuscarDoc = false;
      this.controlview.nuevo.fase.esVisible = false;
      this.controlview.nuevo.revision.clAcciones = true;
      this.controlview.editar.revision.clAcciones = true;
      if (this.itemDocumento.edicion) {
        this.controlview.editar.general.clAcciones = false;
        this.controlview.editar.general.txtTitulo = false;
        this.controlview.editar.participantes.tabElaboracion.btnAgregar = false;
        this.controlview.editar.participantes.tabElaboracion.clAcciones = false;
        this.controlview.editar.participantes.tabConsenso.btnAgregar = false;
        this.controlview.editar.participantes.tabConsenso.clAcciones = false;
        this.controlview.editar.participantes.tabAprobacion.btnAgregar = false;
        this.controlview.editar.participantes.tabAprobacion.clAcciones = false;
        this.controlview.editar.participantes.tabHomologacion.btnAgregar = false;
        this.controlview.editar.participantes.tabHomologacion.clAcciones = false;
        this.controlview.editar.docComplementario.clAcciones = false;
        this.controlview.editar.usuario.clAcciones = false;
        this.controlview.editar.revision.clAcciones = false;
      }
    } else if (nombrePagina == NOMBREPAGINA.REVISION) {
      this.controlview.editar.general.btnBuscarDoc = false;
      this.controlview.editar.general.clAcciones = false;
      this.controlview.editar.participantes.tabAprobacion.esVisible = false;
      this.controlview.editar.participantes.tabAprobacion.clAcciones = false;
      this.controlview.editar.participantes.tabHomologacion.esVisible = false;
      this.controlview.editar.participantes.tabHomologacion.clAcciones = false;
      this.controlview.editar.participantes.tabElaboracion.btnAgregar = true;
      this.controlview.editar.participantes.tabElaboracion.clAcciones = true;
      this.controlview.editar.participantes.tabConsenso.btnAgregar = true;
      this.controlview.editar.participantes.tabConsenso.clAcciones = true;
      this.controlview.editar.fase.esVisible = false;
      this.controlview.editar.docComplementario.esVisible = false;

      this.controlview.nuevo.general.clAcciones = false;
      this.controlview.nuevo.participantes.tabAprobacion.esVisible = false;
      this.controlview.nuevo.participantes.tabAprobacion.clAcciones = false;
      this.controlview.nuevo.participantes.tabHomologacion.esVisible = false;
      this.controlview.nuevo.participantes.tabHomologacion.clAcciones = false;
      this.controlview.nuevo.participantes.tabElaboracion.btnAgregar = true;
      this.controlview.nuevo.participantes.tabElaboracion.clAcciones = true;
      this.controlview.nuevo.participantes.tabConsenso.btnAgregar = true;
      this.controlview.nuevo.participantes.tabConsenso.clAcciones = true;
      this.controlview.nuevo.fase.esVisible = false;
      this.controlview.nuevo.docComplementario.esVisible = false;

    } else if (nombrePagina == NOMBREPAGINA.APROSOLICITUDREVISION) {
      this.controlview.editar.general.btnBuscarDoc = false;
      this.controlview.editar.general.clAcciones = false;
      this.controlview.editar.fase.esVisible = false;
      this.controlview.editar.usuario.btnAgregar = false;
      //this.controlview.editar.docComplementario.clAcciones = false;
    } else if (nombrePagina == NOMBREPAGINA.ELABORACIONREVISION) {
      this.controlview.editar.general.clAcciones = false;
      this.controlview.editar.general.txtTitulo = true;
      this.controlview.editar.general.btnBuscarDoc = false;
      this.controlview.editar.revision.clAcciones = false;
      this.controlview.editar.fase.clAcciones = true;
    } else if (nombrePagina == NOMBREPAGINA.CONSENSOREVISION) {
      this.controlview.editar.general.clAcciones = false;
      this.controlview.editar.general.txtTitulo = true;
      this.controlview.editar.general.btnBuscarDoc = false;
      this.controlview.editar.revision.clAcciones = false;
      this.controlview.editar.participantes.tabElaboracion.btnAgregar = false;
      this.controlview.editar.participantes.tabElaboracion.clAcciones = false;
      this.controlview.editar.fase.clAcciones = true;
    } else if (nombrePagina == NOMBREPAGINA.APROBACIONREVISION) {
      this.controlview.editar.general.clAcciones = false;
      this.controlview.editar.general.txtTitulo = true;
      this.controlview.editar.general.btnBuscarDoc = false;
      this.controlview.editar.revision.clAcciones = false;
      this.controlview.editar.participantes.tabElaboracion.btnAgregar = false;
      this.controlview.editar.participantes.tabElaboracion.clAcciones = false;
      this.controlview.editar.participantes.tabConsenso.btnAgregar = false;
      this.controlview.editar.participantes.tabConsenso.clAcciones = false;
      this.controlview.editar.fase.clAcciones = true;
    } else if (nombrePagina == NOMBREPAGINA.HOMOLOGACIONREVISION) {
      this.controlview.editar.general.clAcciones = false;
      this.controlview.editar.general.txtTitulo = true;
      this.controlview.editar.general.btnBuscarDoc = false;
      this.controlview.editar.revision.clAcciones = false;
      this.controlview.editar.participantes.tabElaboracion.btnAgregar = false;
      this.controlview.editar.participantes.tabElaboracion.clAcciones = false;
      this.controlview.editar.participantes.tabConsenso.btnAgregar = false;
      this.controlview.editar.participantes.tabConsenso.clAcciones = false;
      this.controlview.editar.participantes.tabAprobacion.btnAgregar = false;
      this.controlview.editar.participantes.tabAprobacion.clAcciones = false;
      this.controlview.editar.fase.clAcciones = true;
    }

    
    if (this.itemDocumento.edicion) {
      this.permisos = this.controlview[ACCIONES.EDITAR];
    } else {
      this.permisos = this.controlview[ACCIONES.NUEVO];
    }
    //this.permisos = this.controlview[this.tipoAccion];
    console.log("el permiso es ", this.permisos);
  }

  ngOnInit(): void {
    
    this.loading = true;
    
    this.itemDocumento = JSON.parse(sessionStorage.getItem("item"));
    this.itemCodigo = this.itemDocumento.parametroPrincipal;
    this.equipousuario.idDocumento = this.itemCodigo;
    this.listaReturn = JSON.parse(sessionStorage.getItem("retornoLista"));
    sessionStorage.setItem('listaDocumentosDoc', JSON.stringify(this.listaReturn));
    this.obtenerDataRutaPadre();
    this.valorFase = JSON.parse(sessionStorage.getItem("FaseDatos"));
    this.idComboRevision = JSON.parse(sessionStorage.getItem("comboRevision"));
    this.detDescripcionRevision = JSON.parse(sessionStorage.getItem("descripcionRevision"));
    this.listEquipoAux = JSON.parse(sessionStorage.getItem("listaEquipoAux"));
    this.listElaboracionAux = JSON.parse(sessionStorage.getItem("listaElaboracionAux"));
    this.listConsensoAux = JSON.parse(sessionStorage.getItem("listaConsensoAux"));
    this.listAprobacionAux = JSON.parse(sessionStorage.getItem("listaAprobacionAux"));
    this.listHomologacionAux = JSON.parse(sessionStorage.getItem("listaHomologacionAux"));


    if (this.itemDocumento.edicion) {
      this.spinner.show();
      this.service.buscarPorCodigo(this.itemCodigo).subscribe((responseDocumento: Response) => {
        
        this.spinner.hide();
        this.mapearTabsParaTodos(responseDocumento.resultado);
        this.loading = false;
        let loading = this.loading;
        this.padre.emit(loading);
      }), (error) => this.controlarError(error);
    } else {
      this.loading = false;
      let loading = this.loading;
      this.padre.emit(loading);
    }

    //Ajustar Lista de Equipos Usuario
    if (this.participantes.agregarElaboracion != null) {
      this.participantes.agregarElaboracion.subscribe(equipo => {
        if (!this.equipousuario.listaEquipo.find(equipoLista => equipoLista.id === equipo.id)) {
          equipo.indicadorEliminar = true;
          this.equipousuario.listaEquipo.push(equipo);
        } else {
          let indice = this.equipousuario.listaEquipo.findIndex(equipoLista => equipoLista.id === equipo.id);
          this.equipousuario.listaEquipo[indice].indicadorEliminar = true;
        }
      });
    }
    if (this.concenso.agregarConsenso != null) {
      this.concenso.agregarConsenso.subscribe(equipo => {
        if (!this.equipousuario.listaEquipo.find(equipoLista => equipoLista.id === equipo.id)) {
          equipo.indicadorEliminar = true;
          this.equipousuario.listaEquipo.push(equipo);
        } else {
          let indice = this.equipousuario.listaEquipo.findIndex(equipoLista => equipoLista.id === equipo.id);
          this.equipousuario.listaEquipo[indice].indicadorEliminar = true;
        }
      });
    }
    if (this.aprobacion.agregarAprobacion != null) {
      this.aprobacion.agregarAprobacion.subscribe(equipo => {
        if (!this.equipousuario.listaEquipo.find(equipoLista => equipoLista.id === equipo.id)) {
          equipo.indicadorEliminar = true;
          this.equipousuario.listaEquipo.push(equipo);
        } else {
          let indice = this.equipousuario.listaEquipo.findIndex(equipoLista => equipoLista.id === equipo.id);
          this.equipousuario.listaEquipo[indice].indicadorEliminar = true;
        }
      });
    }
    if (this.homologacion.agregarHomologacion != null) {
      this.homologacion.agregarHomologacion.subscribe(equipo => {
        if (!this.equipousuario.listaEquipo.find(equipoLista => equipoLista.id === equipo.id)) {
          equipo.indicadorEliminar = true;
          this.equipousuario.listaEquipo.push(equipo);
        } else {
          let indice = this.equipousuario.listaEquipo.findIndex(equipoLista => equipoLista.id === equipo.id);
          this.equipousuario.listaEquipo[indice].indicadorEliminar = true;
        }
      });
    }

    if (this.participantes.eliminarElaboracion != null) {
      this.participantes.eliminarElaboracion.subscribe(equipo => {
        let indice = -1;
        if (this.concenso != null) {
          if (this.concenso.item.listaConsenso != null) {
            indice = this.concenso.item.listaConsenso.findIndex(p => p.equipo.id === equipo.id);
          }
        }
        if (indice == -1) {
          if (this.aprobacion != null) {
            if (this.aprobacion.item.listaAprobacion != null) {
              indice = this.aprobacion.item.listaAprobacion.findIndex(p => p.equipo.id === equipo.id);
            }
          }
        }
        if (indice == -1) {
          if (this.homologacion != null) {
            if (this.homologacion.item.listaHomologacion != null) {
              indice = this.homologacion.item.listaHomologacion.findIndex(p => p.equipo.id === equipo.id);
            }
          }
        }
        if (indice == -1) {
          indice = this.equipousuario.listaEquipo.findIndex(equipoLista => equipoLista.id === equipo.id);
          this.equipousuario.listaEquipo.splice(indice, 1);
        }
      });
    }
    if (this.concenso.eliminarConsenso != null) {
      this.concenso.eliminarConsenso.subscribe(equipo => {
        let indice = -1;
        if (this.participantes != null) {
          if (this.participantes.item.listaElaboracion != null) {
            indice = this.participantes.item.listaElaboracion.findIndex(p => p.equipo.id === equipo.id);
          }
        }
        if (indice == -1) {
          if (this.aprobacion != null) {
            if (this.aprobacion.item.listaAprobacion != null) {
              indice = this.aprobacion.item.listaAprobacion.findIndex(p => p.equipo.id === equipo.id);
            }
          }
        }
        if (indice == -1) {
          if (this.homologacion != null) {
            if (this.homologacion.item.listaHomologacion != null) {
              indice = this.homologacion.item.listaHomologacion.findIndex(p => p.equipo.id === equipo.id);
            }
          }
        }
        if (indice == -1) {
          indice = this.equipousuario.listaEquipo.findIndex(equipoLista => equipoLista.id === equipo.id);
          this.equipousuario.listaEquipo.splice(indice, 1);
        }
      });
    }
    if (this.aprobacion != null) {
      if (this.aprobacion.eliminarAprobacion != null) {
        this.aprobacion.eliminarAprobacion.subscribe(equipo => {
          let indice = -1;
          if (this.concenso != null) {
            if (this.concenso.item.listaConsenso != null) {
              indice = this.concenso.item.listaConsenso.findIndex(p => p.equipo.id === equipo.id);
            }
          }
          if (indice == -1) {
            if (this.participantes != null) {
              if (this.participantes.item.listaElaboracion != null) {
                indice = this.participantes.item.listaElaboracion.findIndex(p => p.equipo.id === equipo.id);
              }
            }
          }
          if (indice == -1) {
            if (this.homologacion != null) {
              if (this.homologacion.item.listaHomologacion != null) {
                indice = this.homologacion.item.listaHomologacion.findIndex(p => p.equipo.id === equipo.id);
              }
            }
          }
          if (indice == -1) {
            indice = this.equipousuario.listaEquipo.findIndex(equipoLista => equipoLista.id === equipo.id);
            this.equipousuario.listaEquipo.splice(indice, 1);
          }
        });
      }
    }
    if (this.homologacion.eliminarHomologacion != null) {
      this.homologacion.eliminarHomologacion.subscribe(equipo => {
        let indice = -1;
        if (this.concenso != null) {
          if (this.concenso.item.listaConsenso != null) {
            indice = this.concenso.item.listaConsenso.findIndex(p => p.equipo.id === equipo.id);
          }
        }
        if (indice == -1) {
          if (this.aprobacion != null) {
            if (this.aprobacion.item.listaAprobacion != null) {
              indice = this.aprobacion.item.listaAprobacion.findIndex(p => p.equipo.id === equipo.id);
            }
          }
        }
        if (indice == -1) {
          if (this.participantes != null) {
            if (this.participantes.item.listaElaboracion != null) {
              indice = this.participantes.item.listaElaboracion.findIndex(p => p.equipo.id === equipo.id);
            }
          }
        }
        if (indice == -1) {
          indice = this.equipousuario.listaEquipo.findIndex(equipoLista => equipoLista.id === equipo.id);
          this.equipousuario.listaEquipo.splice(indice, 1);
        }

      });
      if (this.itemCodigo) {
        this.service.buscarPorCodigo(this.itemCodigo).subscribe((responseDocumento: Response) => {
          this.mapearTabsParaTodos(responseDocumento.resultado)

        });
      }
    }
  }

  //Setear los campos en todas la pestañas 
  mapearTabsParaTodos(itemResponse) {
    
    this.item = itemResponse;
    //let rutaArchivoObsoleta = this.item.rutaDocumento;
    let rutaArchivoObsoleta = this.item.listaRevision[0].rutaDocumentoCopiaNoCont;
    let rutaArchivoOriginal = this.item.listaRevision[0].rutaDocumentoOriginal;

    this.verDocumento.next(rutaArchivoObsoleta);
    this.verDocumentoOring.next(rutaArchivoOriginal);
    //Cguerra
    this.general.item = Object.assign(new Documento(), this.item);
    this.general.item.gerencia = this.general.item.jgerencia ? this.general.item.jgerencia.idJerarquia : 0;

    this.item = itemResponse;
    console.log("dato final");
    console.log(this.item);
    console.log("dat final");
    this.general.item = Object.assign(new Documento(), this.item);

    this.general.item.gerencia = this.general.item.jgerencia ? this.general.item.jgerencia.idJerarquia : 0;

    if (this.item.ctipoDocumento != null) {
      this.general.tipodocumento = this.item.ctipoDocumento.v_descons;
      this.general.tipodcumentoid = this.item.ctipoDocumento.idconstante + "";
    }
    if (this.item.jgerencia != null) {
      this.general.gerenparametroid = this.item.jgerencia.idJerarquia + "";
      this.general.gerenparametrodesc = this.item.jgerencia.descripcion;
      this.general.gerenparametrodesc = this.general.gerenparametrodesc.substr(0,
        this.general.gerenparametrodesc.length - this.general.tipodocumento.length - 1);
    }
    if (this.item.jalcanceSGI != null) {
      this.general.sgiparametroid = this.item.jalcanceSGI.idJerarquia + "";
      this.general.sgiparametrodesc = this.item.jalcanceSGI.descripcion;
      /* if (this.general.sgiparametrodesc != "") {
         this.general.sgiparametrodesc = this.general.sgiparametrodesc.substr(0,
           this.general.sgiparametrodesc.length - this.general.tipodocumento.length - 1);
       }*/
    }
    if (this.item.jproceso != null) {
      this.general.procesoparametroid = this.item.jproceso.idJerarquia + "";
      this.general.procesoparametrodesc = this.item.jproceso.descripcion;
      /*if (this.general.procesoparametrodesc != "") {
        this.general.procesoparametrodesc = this.general.procesoparametrodesc.substr(0,
          this.general.procesoparametrodesc.length - this.general.tipodocumento.length - 1);
      }*/
    }
    if (this.item.revision != null) {
      if (this.item.estado.v_descons.toUpperCase().trim() ==
        Constante.ESTADO_DOCUMENTO_EN_REVISION.toUpperCase().trim()) {
        this.general.revisionCurso = this.item.revision.numero;
      }
      if (this.item.revision.estado.v_descons == "Rechazado") {
        this.general.iteracion = this.item.revision.iteracion + 1;
      }
      else { this.general.iteracion = this.item.revision.iteracion };
    }

    this.service.buscarPorIdDocumento(this.itemCodigo).subscribe((
      response: Response) => {
      this.listaDoc = response.resultado;
      for (let val of this.listaDoc) {
        this.general.codigoAnterior = val.codigoAntiguo;

      }
    });
    if (this.item.periodo) {
      this.general.periodo = String(this.item.periodo);
      this.general.item.periodo = String(this.item.periodo);
      this.general.todosCheck = true;
      this.general.habilitacampo = false;
    }
    
    if (this.item.coordinador != null) {
      //this.item.coordinador.nombreCompleto = this.nombreCoordinador;
      let idcoord = this.item.coordinador.idColaborador; //idcoordinador
      let idgerenhijo = this.item.jgerencia.idJerarquia; //idgerencia hijo
      if (this.item.jalcanceSGI != null) {
        this.valorAlcanceHijo = this.item.jalcanceSGI.idJerarquia;
      } else {
        this.valorAlcanceHijo = 0;
      }
      this.serviceJerarquia.buscarPorCodigoIdPadre(idgerenhijo).subscribe(
        (response: Response) => {
          let jerar: Jerarquia[] = response.resultado;
          this.idPadreCoord = jerar[0].idPadre;
          //coordinardor final
          this.serviceRelacion.obtenerDatosCoordinador(this.idPadreCoord, this.valorAlcanceHijo).subscribe((response: Response) => {
            let datosCoordinador: RelacionCoordinador[] = response.resultado;
            this.nombreCoordinador = datosCoordinador[0].nombreCompletoCoordinador;
            this.nroFicha = datosCoordinador[0].nroFicha;
            ////validcion            
            let coord = localStorage.getItem("COORDINADOR");
            if (coord == "COORDINADOR") {
              this.item.coordinador.nombreCompleto = this.nombreCoordinador;
              this.item.coordinador.idColaborador = this.nroFicha;
            } else {
              this.general.coordinador = this.item.coordinador.nombreCompleto;//
            }
            localStorage.removeItem("COORDINADOR");
            ////validcio 
          }, (error) => this.controlarError(error)
          );
        },
        (error) => this.controlarError(error)
      );

    }


    if (this.item.codigoAnterior != null) {
      this.general.codigoAnterior = this.item.codigoAnterior.codigo;
    }
    if (this.item.indicadorDigital != null) {
      this.general.indicadorDigital = this.item.indicadorDigital;
      if (this.general.indicadorDigital == 1) this.general.checkDigital = true;
      else this.general.checkDigital = false;
    }
    if (this.indicadorSolicitudRevision != null) {
      this.general.indicadorSolicitudRevision = this.indicadorSolicitudRevision;
    }
    //Participantes
    //Inicio Godar Cambios en memoria
    if (this.listElaboracionAux != undefined) {
      this.item.participanteElaboracion = this.listElaboracionAux;
    }
    if (this.listConsensoAux != undefined) {
      this.item.participanteConsenso = this.listConsensoAux;
    }
    if (this.listAprobacionAux != undefined) {
      this.item.participanteAprobacion = this.listAprobacionAux;
    }
    if (this.listHomologacionAux != undefined) {
      this.item.participanteHomologacion = this.listHomologacionAux;
    }
    // Fin Cambios 
    if (this.item.participanteElaboracion != null) {
      this.participantes.item.listaElaboracion = this.item.participanteElaboracion;
      sessionStorage.setItem("objListaElaboracion", JSON.stringify(this.participantes.item.listaElaboracion));
    }
    if (this.item.participanteConsenso != null) {
      this.concenso.item.listaConsenso = this.item.participanteConsenso;
      sessionStorage.setItem("objListaConsenso", JSON.stringify(this.concenso.item.listaConsenso));
    }
    if (this.item.participanteAprobacion != null && this.aprobacion) {
      this.aprobacion.item.listaAprobacion = this.item.participanteAprobacion;
      sessionStorage.setItem("objListaAprobacion", JSON.stringify(this.aprobacion.item.listaAprobacion));
    }
    if (this.item.participanteHomologacion != null && this.homologacion) {
      this.homologacion.item.listaHomologacion = this.item.participanteHomologacion;
      sessionStorage.setItem("objListaHomologacion", JSON.stringify(this.homologacion.item.listaHomologacion));
    }
    //Fase
    if (this.item.faseElaboracion != null) {
      this.faseElaboracion = this.item.faseElaboracion;
      if (this.faseElaboracion.indicadorBloqueo == 1 &&
        this.faseElaboracion.usuarioBloqueo != Number(AppSettings.USUARIO_LOGIN)) {
        this.controlview.editar.general.clAcciones = false;
        this.controlview.editar.general.txtTitulo = false;
        this.controlview.editar.participantes.tabElaboracion.btnAgregar = false;
        this.controlview.editar.participantes.tabElaboracion.clAcciones = false;
        this.controlview.editar.participantes.tabConsenso.btnAgregar = false;
        this.controlview.editar.participantes.tabConsenso.clAcciones = false;
        this.controlview.editar.participantes.tabAprobacion.btnAgregar = false;
        this.controlview.editar.participantes.tabAprobacion.clAcciones = false;
        this.controlview.editar.participantes.tabHomologacion.btnAgregar = false;
        this.controlview.editar.participantes.tabHomologacion.clAcciones = false;
        this.controlview.editar.docComplementario.clAcciones = false;
        this.controlview.editar.usuario.clAcciones = false;
        this.controlview.editar.revision.clAcciones = false;
        this.controlview.editar.fase.clAcciones = false;
        let parametro = this.faseElaboracion;
        this.padre.emit(parametro);
      }
    }
    if (this.item.faseConsenso != null) {
      this.faseConsenso = this.item.faseConsenso;
      if (this.faseConsenso.indicadorBloqueo == 1 &&
        this.faseConsenso.usuarioBloqueo != Number(AppSettings.USUARIO_LOGIN)) {
        this.controlview.editar.general.clAcciones = false;
        this.controlview.editar.general.txtTitulo = false;
        this.controlview.editar.participantes.tabElaboracion.btnAgregar = false;
        this.controlview.editar.participantes.tabElaboracion.clAcciones = false;
        this.controlview.editar.participantes.tabConsenso.btnAgregar = false;
        this.controlview.editar.participantes.tabConsenso.clAcciones = false;
        this.controlview.editar.participantes.tabAprobacion.btnAgregar = false;
        this.controlview.editar.participantes.tabAprobacion.clAcciones = false;
        this.controlview.editar.participantes.tabHomologacion.btnAgregar = false;
        this.controlview.editar.participantes.tabHomologacion.clAcciones = false;
        this.controlview.editar.docComplementario.clAcciones = false;
        this.controlview.editar.usuario.clAcciones = false;
        this.controlview.editar.revision.clAcciones = false;
      }
    }
    if (this.item.faseAprobacion != null && this.aprobacion) {
      this.faseAprobacion = this.item.faseAprobacion;
      if (this.faseAprobacion.indicadorBloqueo == 1 &&
        this.faseAprobacion.usuarioBloqueo != Number(AppSettings.USUARIO_LOGIN)) {
        this.controlview.editar.general.clAcciones = false;
        this.controlview.editar.general.txtTitulo = false;
        this.controlview.editar.participantes.tabElaboracion.btnAgregar = false;
        this.controlview.editar.participantes.tabElaboracion.clAcciones = false;
        this.controlview.editar.participantes.tabConsenso.btnAgregar = false;
        this.controlview.editar.participantes.tabConsenso.clAcciones = false;
        this.controlview.editar.participantes.tabAprobacion.btnAgregar = false;
        this.controlview.editar.participantes.tabAprobacion.clAcciones = false;
        this.controlview.editar.participantes.tabHomologacion.btnAgregar = false;
        this.controlview.editar.participantes.tabHomologacion.clAcciones = false;
        this.controlview.editar.docComplementario.clAcciones = false;
        this.controlview.editar.usuario.clAcciones = false;
        this.controlview.editar.revision.clAcciones = false;
      }
    }
    if (this.item.faseHomologacion != null && this.homologacion) {
      this.faseHomologacion = this.item.faseHomologacion;
      if (this.faseHomologacion.indicadorBloqueo == 1 &&
        this.faseHomologacion.usuarioBloqueo != Number(AppSettings.USUARIO_LOGIN)) {
        this.controlview.editar.general.clAcciones = false;
        this.controlview.editar.general.txtTitulo = false;
        this.controlview.editar.participantes.tabElaboracion.btnAgregar = false;
        this.controlview.editar.participantes.tabElaboracion.clAcciones = false;
        this.controlview.editar.participantes.tabConsenso.btnAgregar = false;
        this.controlview.editar.participantes.tabConsenso.clAcciones = false;
        this.controlview.editar.participantes.tabAprobacion.btnAgregar = false;
        this.controlview.editar.participantes.tabAprobacion.clAcciones = false;
        this.controlview.editar.participantes.tabHomologacion.btnAgregar = false;
        this.controlview.editar.participantes.tabHomologacion.clAcciones = false;
        this.controlview.editar.docComplementario.clAcciones = false;
        this.controlview.editar.usuario.clAcciones = false;
        this.controlview.editar.revision.clAcciones = false;
      }
    }
    //Documentos Complementarios    
    if (this.listaReturn != undefined) {
      this.item.listaComplementario = this.listaReturn;
    }
    if (this.item.listaComplementario != null) {
      this.complementario.listaSeguimiento = this.item.listaComplementario;
    }
    //Equipo Usuario
    if (this.item.listaEquipo != null) {
      this.equipousuario.listaEquipo = this.item.listaEquipo;

      for (let index = 0; index < this.equipousuario.listaEquipo.length; index++) {
        this.equipousuario.listaEquipo[index].indicadorEliminar = true;
      }

    }
    this.equipousuario.idDocumento = this.itemCodigo;
    this.equipousuario.listaEquipo = this.item.listaEquipo;
    //Inicio Godar cambios de equipo usuario en memoria
    if (this.listEquipoAux != undefined) {
      this.equipousuario.listaEquipo = this.listEquipoAux;
    }
    //Fin Cambios

    // Revision
    
    this.revision.listaRevision = this.item.listaRevision as RevisionDocumento[];

    if (this.revision.listaRevision.length == 1) {
      if (this.item.estado.idconstante == 119 || this.item.estado.idconstante ==117) {
        
        
        this.revision.listaRevisionHist = this.revision.listaRevision;
        
        console.log("AQUIESSS")
        console.log(this.revision.listaRevisionHist);
        
        this.revi = 1;
      } else {
        this.revision.listaRevisionHist = [];
      }

    } else {
      if (this.item.estado.idconstante == 119 || this.item.estado.idconstante ==117) {
        this.revision.listaRevisionHist = this.revision.listaRevision;
        this.revi = 1;
      } else {
        this.revision.listaRevisionHist = this.revision.listaRevision.filter(revision => revision.id != Number(this.item.idrevision));
      }
    }

    let cont = 0
    for (let val of this.revision.listaRevisionHist) {
      cont = cont + 1;
      if (cont == 1) {
        val.rutaFinal = val.rutaDocumentoCopiaNoCont;
        val.revisHist = true;
      } else {
        val.rutaFinal = val.rutaDocumentoCopiaObso;
        val.revisHist = false;
      }
    }
    let revision = this.revision.listaRevision.find(revision => revision.id == Number(this.item.idrevision));
    this.revision.revision = new RevisionDocumento();
    this.revision.revision.id = revision.id;

    if (this.indicadorSelecDocu == "1") {
      this.revision.revision.descripcion = "";
      this.revision.revision.idmotirevi = 0;
    } else {
      this.revision.revision.descripcion = revision.descripcion;
      this.revision.revision.idmotirevi = revision.idmotirevi;
      this.revision.revision.numero = revision.numero;
    }

    if (this.revi == 1) {
      this.revision.revision.descripcion = "";
      this.revision.revision.idmotirevi = 0;
    }
    //Inicio-Godar
    if (this.idComboRevision != undefined || this.idComboRevision != null) {
      this.revision.revision.idmotirevi = this.idComboRevision;
    }
    if (this.detDescripcionRevision != undefined || this.detDescripcionRevision != null) {
      this.revision.revision.descripcion = this.detDescripcionRevision;
    }
    //Fin Godar
    localStorage.removeItem('datosRevi');
    sessionStorage.setItem('datosRevi', JSON.stringify(this.revision.listaRevision));


    


    this.revision.revision.estado = revision.estado;
    this.revision.revision.iteracion = revision.iteracion;
    this.revision.revision.usuarioAprobacionDocumento = revision.usuarioAprobacionDocumento;
    this.revision.revision.fechaAprobacionDocumento = revision.fechaAprobacionDocumento;
    if (this.item.estado.v_descons.toUpperCase().trim() ==
      Constante.ESTADO_DOCUMENTO_APROBADO.toUpperCase().trim() ||
      this.item.estado.v_descons.toUpperCase().trim() ==
      Constante.ESTADO_DOCUMENTO_CANCELADO.toUpperCase().trim()) {
      this.revision.revision.numeroAnterior = revision.numero;
      this.revision.revision.fechaAprobacionAnterior = revision.fechaAprobacionDocumento;
      this.general.item.revision.numeroAnterior = revision.numero;
      this.general.item.revision.fechaAprobacionAnterior = revision.fechaAprobacionDocumento;
    } else {
      this.revision.revision.numeroAnterior = revision.numero;
      this.revision.revision.fechaAprobacionAnterior = revision.fechaAprobacionDocumento;
      this.general.item.revision.numeroAnterior = revision.numeroAnterior;
      this.general.item.revision.fechaAprobacionAnterior = revision.fechaAprobacionAnterior;
    }
    //this.revision.revision = revision?revision:new RevisionDocumento();
    //this.revision.revision = revision?revision:new RevisionDocumento();

    // Bitacora
    
    console.log("BITACORA:");
    console.log(this.bitacora);
    console.log(this.item.bitacora.lista);

    //Enviamos el Indicador Digital
    let indicador = this.general.indicadorDigital;
    this.IndicadorDigital.next(String(indicador));

    //inicio Godar cambios memoria en bitacora
    if (this.valorFase != undefined) {
      this.bitacora.fase.comentario = this.valorFase.comentario;
    }
    //Fin Cambios
    this.RutaOrigin.next(String(this.general.item.revision.rutaDocumentoOriginal));
    
    if (this.bitacora != null) {
      if (this.item.bitacora.lista != null) {
        //validamos si tiene el indicador digital
        if (this.item.indicadorDigital == 1) {
          
          //anterior
          if(this.item.bitacora.lista.length>2){
              let cantidadAnterior = this.item.bitacora.lista.length - 2;
              let fechaAnteriorRechazo = this.item.bitacora.lista[cantidadAnterior].fechaRechazo;
              this.FechaRechazoAnteior.next(String(fechaAnteriorRechazo))
          }
            //anterior
            let cantidad = this.item.bitacora.lista.length - 1;
            if(this.item.bitacora.lista.length>0){
                this.FechaRechazoFase = this.item.bitacora.lista[cantidad].fechaRechazo;
                //capturamos la fecha de rechazo
                this.FechaRechazo.next(String(this.FechaRechazoFase))

                    //fecha de aprobacion (fase)
              let fechaapro = this.item.bitacora.lista[cantidad].fechaLiberacion;
              this.fechaliberacion.next(String(fechaapro));
              this.cantidadRegistroFase.next(String(cantidad));
            }

         
          
        }

        this.item.bitacora.lista.forEach(obj => {
          if (this.idFase != null) {
            //cguerra
            if (obj.idFase == this.idFase && obj.idColaborador == Number(AppSettings.USUARIO_LOGIN)) {
              
              this.bitacora.fase.comentario = obj.comentario;
            }
          }
        });
        this.bitacora.fase.lista = this.item.bitacora.lista;

      }
    }

  }

  pintarParticipantes() {
    
    let listaParticipanteElaboracion = this.participantes.item.listaElaboracion;
    let listaParticipanteConsenso = this.concenso.item.listaConsenso;
    let listaParticipanteAprobacion = this.aprobacion.item.listaAprobacion
    let listaParticipanteHomologacion = this.homologacion.item.listaHomologacion;

    this.service.buscarParticipantesModificados(this.itemCodigo).subscribe(
      (response: Response) => {
        
        let listaParticipanteModificado: CopiaTrabajador[] = response.resultado;
        console.log("listaParticipanteModificado");
        console.log(listaParticipanteModificado);
        jQuery('#' + this.concenso.item.listaConsenso[0].idColaborador).css('background', 'yellow');
        /*if(listaParticipanteModificado != null){
          if(listaParticipanteModificado.length > 0){
            let 
          }
        }*/
      }
    );
  }

  extrametododepadre(documento) {
    this.itemCodigo = documento.id;
    this.indicadorSolicitudRevision = "1";
    this.indicadorSelecDocu = "1";
    this.mapearTabsParaTodos(documento);
  }

  controlarError(error) {
    
    console.error(error);
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', { closeButton: true });
  }

  //otro
  obtenerColaborador(idGerencia: number, idAlcance: number) {
    
    this.serviceRelacion.obtenerDatosCoordinador(idGerencia, idAlcance).subscribe((response: Response) => {
      
      let datosCoordinador: RelacionCoordinador[] = response.resultado;

      sessionStorage.setItem('coordinador', JSON.stringify(datosCoordinador[0].nroFicha));
    },
      (error) =>
        this.controlarError(error)
    );
  }
  //otro

}
