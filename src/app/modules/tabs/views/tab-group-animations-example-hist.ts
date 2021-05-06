import { Component, ViewChild, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EquipoUsuarioComponent } from 'src/app/modules/bandejadocumento/components/equipo-usuario.component';
import { CRegistroDocumentoComponent } from 'src/app/modules/bandejadocumento/components/components-registro-documento.component';
import { RevisionComponent } from 'src/app/modules/bandejadocumento/components/revision.component';
import { JsonService } from 'src/app/services';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { NOMBREPAGINA, ACCIONES } from 'src/app/constants/general/general.constants';
import { BandejaDocumentoService } from 'src/app/services/impl/bandejadocumentos.service';
import { Response, Documento, RevisionDocumento, ControlView } from 'src/app/models';
import { ParticipanteComponent } from 'src/app/modules/revisiondocumento/components/participante.component';
import { ElaboracionComponent } from 'src/app/modules/bandejadocumento/components/elaboracion.component';
import { ConsensoComponent } from 'src/app/modules/bandejadocumento/components/consenso.component';
import { AprobacionComponent } from 'src/app/modules/bandejadocumento/components/apobacion.component';
import { HomologacionComponent } from 'src/app/modules/bandejadocumento/components/homologacion.component';
import { ComplementarioComponent } from 'src/app/modules/bandejadocumento/components/complementario.component';
import { FaseRegistroComponent } from 'src/app/modules/bandejadocumento/components/fase-registro.component';
import { Fase } from 'src/app/models/fase';
import { AppSettings } from 'src/app/app.settings';
import { NgxSpinnerService } from 'ngx-spinner';

/**
 * @title Tab group animations
 */
@Component({
  selector: 'tab-group-animations-example-hist',
  templateUrl: 'tab-group-animations-example-hist.html',
  styleUrls: ['tab-group-animations-example-hist.scss'],
})
export class TabGroupAnimationsExampleHist implements OnInit {
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
  //@Output() enviarPadre:EventEmitter<string> = new EventEmitter<string>();
  @Input() activar: boolean;
  @Input() consulta: boolean;
  @Input() idFase: number;
  //@Input() activartab : boolean;
  itemCodigo: number;
  idRevisionSeleccionado: number;
  item: Documento;
  valor: boolean;
  permisos: any;
  varTemporal: boolean;
  nombrePagina: string;
  tipoAccion: string;
  controlview: ControlView;
  indicadorSolicitudRevision: string;
  faseElaboracion: Fase;
  faseConsenso: Fase;
  faseAprobacion: Fase;
  faseHomologacion: Fase;
  revi: number;
  indicadorSelecDocu: string;

  constructor(private _jsonService: JsonService,
    private route: ActivatedRoute,
    private service: BandejaDocumentoService,
    private spinner: NgxSpinnerService) {
    /*Desactiva pesta�a Participantes*/
    this.valor = true;
    this.varTemporal = true;
    this.item = new Documento();
    this.controlview = new ControlView();
    this.indicadorSolicitudRevision = null;
    this.revi = 0;
    this.indicadorSelecDocu = null;
    //this.pruebaHijo = this.equipo_usuario.prueba;
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
      if (tipoAccion == ACCIONES.EDITAR) {
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
    this.permisos = this.controlview[this.tipoAccion];
    //console.log("el permiso es ", this.permisos);
  }

  ngOnInit(): void {
    this.obtenerDataRutaPadre();
    this.route.params.subscribe(params => {
      this.itemCodigo = + params['codigo'];

      if (!this.itemCodigo) {
        this.itemCodigo = Number.parseInt(localStorage.getItem("itemSeleccionado"));
        this.idRevisionSeleccionado = Number.parseInt(localStorage.getItem("idRevisionSeleccionado"));
      }

      this.equipousuario.idDocumento = this.itemCodigo;
    });
    this.spinner.show();
    if (this.itemCodigo) {
      this.service.buscarPorCodigoHist(this.itemCodigo, this.idRevisionSeleccionado).subscribe((responseDocumento: Response) => {
        this.mapearTabsParaTodosHist(responseDocumento.resultado)
        this.spinner.hide();
      });
    }
  }

  //Setear los campos en todas la pestañas
  mapearTabsParaTodos(itemResponse) {
    

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
    }
    if (this.item.jproceso != null) {
      this.general.procesoparametroid = this.item.jproceso.idJerarquia + "";
      this.general.procesoparametrodesc = this.item.jproceso.descripcion;
    }
    if (this.item.revision != null) {
      this.general.revisionCurso = this.item.revision.numero + 1;
      if (this.item.revision.estado.v_descons == "Rechazado") {
        this.general.iteracion = this.item.revision.iteracion + 1;
      }
      else { this.general.iteracion = this.item.revision.iteracion };
    }
    if (this.item.periodo) {
      this.general.periodo = String(this.item.periodo);
      this.general.item.periodo = String(this.item.periodo);
      this.general.todosCheck = true;
      this.general.habilitacampo = false;
    }
    if (this.item.coordinador != null) {
      this.general.coordinador = this.item.coordinador.nombreCompleto;
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
    if (this.item.participanteElaboracion != null) {
      this.participantes.item.listaElaboracion = this.item.participanteElaboracion;
    }
    if (this.item.participanteConsenso != null) {
      this.concenso.item.listaConsenso = this.item.participanteConsenso;
    }
    if (this.item.participanteAprobacion != null && this.aprobacion) {
      this.aprobacion.item.listaAprobacion = this.item.participanteAprobacion;
    }
    if (this.item.participanteHomologacion != null && this.homologacion) {
      this.homologacion.item.listaHomologacion = this.item.participanteHomologacion;
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
    if (this.item.listaComplementario != null) {
      this.complementario.listaSeguimiento = this.item.listaComplementario;
    }
    //Equipo Usuario
    if (this.item.listaEquipo != null) {
      this.equipousuario.listaEquipo = this.item.listaEquipo;
    }
    this.equipousuario.idDocumento = this.itemCodigo;
    this.equipousuario.listaEquipo = this.item.listaEquipo;
    // Revision
    this.revision.listaRevision = this.item.listaRevision as RevisionDocumento[];
    let revision = this.revision.listaRevision.find(revision => revision.id == Number(this.item.idrevision));
    this.revision.revision = revision ? revision : new RevisionDocumento();
    // Bitacora
    if (this.bitacora != null) {
      if (this.item.bitacora.lista != null) {
        this.item.bitacora.lista.forEach(obj => {
          if (this.idFase != null) {
            if (obj.idFase == this.idFase && obj.idColaborador == Number(AppSettings.USUARIO_LOGIN)) {
              this.bitacora.fase.comentario = obj.comentario;
            }
          }
        });
        this.bitacora.fase.lista = this.item.bitacora.lista;
      }
      if (this.item.participanteElaboracion != null) {
        this.item.participanteElaboracion.forEach(obj => {
          this.bitacora.fase.lista.push(obj);
          if (this.idFase != null) {
            if (obj.idFase == this.idFase && obj.idColaborador == Number(AppSettings.USUARIO_LOGIN)) {
              this.bitacora.fase.comentario = obj.comentario;
            }
          }
        });
      }
      if (this.item.participanteConsenso != null) {
        this.item.participanteConsenso.forEach(obj => {
          this.bitacora.fase.lista.push(obj);
          if (this.idFase != null) {
            if (obj.idFase == this.idFase && obj.idColaborador == Number(AppSettings.USUARIO_LOGIN)) {
              this.bitacora.fase.comentario = obj.comentario;
            }
          }
        });
      }
      if (this.item.participanteAprobacion != null) {
        this.item.participanteAprobacion.forEach(obj => {
          this.bitacora.fase.lista.push(obj);
          if (this.idFase != null) {
            if (obj.idFase == this.idFase && obj.idColaborador == Number(AppSettings.USUARIO_LOGIN)) {
              this.bitacora.fase.comentario = obj.comentario;
            }
          }
        });
      }
      if (this.item.participanteHomologacion != null) {
        this.item.participanteHomologacion.forEach(obj => {
          this.bitacora.fase.lista.push(obj);
          if (this.idFase != null) {
            if (obj.idFase == this.idFase && obj.idColaborador == Number(AppSettings.USUARIO_LOGIN)) {
              this.bitacora.fase.comentario = obj.comentario;
            }
          }
        });
      }
    }

  }

  mapearTabsParaTodosHist(itemResponse) {
    

    this.item = itemResponse;
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
    }
    if (this.item.jproceso != null) {
      this.general.procesoparametroid = this.item.jproceso.idJerarquia + "";
      this.general.procesoparametrodesc = this.item.jproceso.descripcion;
    }
    if (this.item.revision != null) {
      this.general.revisionCurso = this.item.revision.numero + 1;
      if (this.item.revision.estado.v_descons == "Rechazado") {
        this.general.iteracion = this.item.revision.iteracion + 1;
      }
      else { this.general.iteracion = this.item.revision.iteracion };
    }
    if (this.item.periodo) {
      this.general.periodo = String(this.item.periodo);
      this.general.item.periodo = String(this.item.periodo);
      this.general.todosCheck = true;
      this.general.habilitacampo = false;
    }
    if (this.item.coordinador != null) {
      this.general.coordinador = this.item.coordinador.nombreCompleto;
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
    if (this.item.participanteElaboracion != null) {
      this.participantes.item.listaElaboracion = this.item.participanteElaboracion;
    }
    if (this.item.participanteConsenso != null) {
      this.concenso.item.listaConsenso = this.item.participanteConsenso;
    }
    if (this.item.participanteAprobacion != null && this.aprobacion) {
      this.aprobacion.item.listaAprobacion = this.item.participanteAprobacion;
    }
    if (this.item.participanteHomologacion != null && this.homologacion) {
      this.homologacion.item.listaHomologacion = this.item.participanteHomologacion;
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
    if (this.item.listaComplementario != null) {
      this.complementario.listaSeguimiento = this.item.listaComplementario;
    }
    //Equipo Usuario
    if (this.item.listaEquipo != null) {
      this.equipousuario.listaEquipo = this.item.listaEquipo;
    }
    this.equipousuario.idDocumento = this.itemCodigo;
    this.equipousuario.listaEquipo = this.item.listaEquipo;
    // Revision
    this.revision.listaRevision = this.item.listaRevision as RevisionDocumento[];

    if (this.revision.listaRevision.length == 1) {
      if (this.item.estado.idconstante == 119) {
        this.revision.listaRevisionHist = this.revision.listaRevision;
        this.revi = 1;
      } else {
        this.revision.listaRevisionHist = [];
      }

    } else {
      if (this.item.estado.idconstante == 119) {
        this.revision.listaRevisionHist = this.revision.listaRevision;
        this.revi = 1;
      } else {
        this.revision.listaRevisionHist = this.revision.listaRevision.filter(revision => revision.id != Number(this.item.idrevision));
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

    //this.revision.revision = revision?revision:new RevisionDocumento();
    // Bitacora
    if (this.bitacora != null) {
      if (this.item.bitacora.lista != null) {
        this.item.bitacora.lista.forEach(obj => {
          if (this.idFase != null) {
            if (obj.idFase == this.idFase && obj.idColaborador == Number(AppSettings.USUARIO_LOGIN)) {
              this.bitacora.fase.comentario = obj.comentario;
            }
          }
        });
        this.bitacora.fase.lista = this.item.bitacora.lista;
      }
    }
  }

  extrametododepadre(documento) {
    this.itemCodigo = documento.id;
    this.indicadorSolicitudRevision = "1";
    this.indicadorSelecDocu = "1";
    //this.mapearTabsParaTodos(documento);
    this.mapearTabsParaTodosHist(documento);
  }

}
