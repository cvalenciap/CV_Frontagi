import { Component, ViewChild, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { JsonService } from 'src/app/services';
import { ActivatedRoute } from '@angular/router';
import { NOMBREPAGINA } from 'src/app/constants/general/general.constants';
import { BandejaDocumentoService } from 'src/app/services/impl/bandejadocumentos.service';
import { Response, Documento, ControlView } from 'src/app/models';
import { RevisionComponent1 } from 'src/app/modules/alcmigracion/components/revision-migracion.component';
import { CriticaComponent } from "../../alcmigracion/components/critica-migracion.component";
import { CRegistroDocumentoComponent1 } from 'src/app/modules/alcmigracion/components/components-registro-documento-migracion.component';
import { ElaboracionMigracionComponent } from 'src/app/modules/alcmigracion/components/elaboracion-migracion.component';
import { ConsensoMigracionComponent } from 'src/app/modules/alcmigracion/components/consenso-migracion.component';
import { AprobacionMigracionComponent } from 'src/app/modules/alcmigracion/components/apobacion-migracion.component';
import { HomologacionMigracionComponent } from 'src/app/modules/alcmigracion/components/homologacion-migracion.component';
import { EquipoUsuarioMigracionComponent } from 'src/app/modules/alcmigracion/components/equipo-usuario-migracion.component';
import { DocumentoMigracion } from 'src/app/models/documentomigracion';
import { ComplementarioMigracionComponent } from 'src/app/modules/alcmigracion/components/complementario-migracion.component';

/**
 * @title Tab group animations
 */
@Component({
  selector: 'tab-group-animations-migracion',
  templateUrl: 'tab-group-animations-example.html',
  styleUrls: ['tab-group-animations-example.scss'],
})
export class TabGroupAnimationsExample1 implements OnInit {
  @ViewChild('equipousuario') equipousuario: EquipoUsuarioMigracionComponent;
  @ViewChild('participantes') participantes: ElaboracionMigracionComponent;
  @ViewChild('concenso') concenso: ConsensoMigracionComponent;
  @ViewChild('aprobacion') aprobacion: AprobacionMigracionComponent;
  @ViewChild('homologacion') homologacion: HomologacionMigracionComponent;
  @ViewChild('general') general: CRegistroDocumentoComponent1;
  @ViewChild('complementario') complementario: ComplementarioMigracionComponent;
  @ViewChild('revision') revision: RevisionComponent1;
  //@ViewChild('bitacora') bitacora: FaseRegistroComponent;
  @ViewChild('critica') critica: CriticaComponent;
  //@Output() enviarPadre:EventEmitter<string> = new EventEmitter<string>();
  @Input() activar: boolean;
  @Input() consulta: boolean;
  //cguerra

  @Output() indicadorDigital: EventEmitter<string> = new EventEmitter<string>();
  //cguerra


  itemCodigo: number;
  item: DocumentoMigracion;
  valor: boolean;
  permisos: any;
  varTemporal: boolean;
  nombrePagina: string;
  tipoAccion: string;
  controlview: ControlView;
  constructor(private _jsonService: JsonService, private route: ActivatedRoute,
    private service: BandejaDocumentoService) {
    /*Desactiva pesta�a Participantes*/
    this.valor = true;
    this.varTemporal = true;
    this.item = new DocumentoMigracion();
    this.controlview = new ControlView();
    //this.pruebaHijo = this.equipo_usuario.prueba;
  }

  obtenerDataRutaPadre() {
    if (this.route.parent) {
      //this.route.parent.data.subscribe(params => {
      this.route.data.subscribe(params => {
        if (params['nArchivo']) {
          //console.log("paramsUrl ", params);
          this.nombrePagina = params['nArchivo'];
          this.tipoAccion = params['accion'];
          this.cargarControlView(this.nombrePagina);
        }

      });
    }
  }

  cargarControlView(nombrePagina) {
    //console.log("tipo accione "+this.tipoAccion + " nombre apgina "+ nombrePagina);

    if (nombrePagina == NOMBREPAGINA.DOCUMENTO) {
      this.controlview.editar.general.btnBuscarDoc = false;
      this.controlview.editar.fase.esVisible = false;
      this.controlview.nuevo.general.btnBuscarDoc = false;
      this.controlview.nuevo.fase.esVisible = false;
    } else if (nombrePagina == NOMBREPAGINA.REVISION) {
      this.controlview.editar.general.btnBuscarDoc = false;
      this.controlview.editar.participantes.tabAprobacion.esVisible = false;
      this.controlview.editar.participantes.tabAprobacion.clAcciones = false;
      this.controlview.editar.participantes.tabHomologacion.esVisible = false;
      this.controlview.editar.participantes.tabHomologacion.clAcciones = false;
      this.controlview.editar.participantes.tabElaboracion.btnAgregar = false;
      this.controlview.editar.participantes.tabElaboracion.clAcciones = false;
      this.controlview.editar.participantes.tabConsenso.btnAgregar = false;
      this.controlview.editar.participantes.tabConsenso.clAcciones = false;
      this.controlview.editar.fase.esVisible = false;
      this.controlview.editar.docComplementario.esVisible = false;

      this.controlview.nuevo.participantes.tabAprobacion.esVisible = false;
      this.controlview.nuevo.participantes.tabAprobacion.clAcciones = false;
      this.controlview.nuevo.participantes.tabHomologacion.esVisible = false;
      this.controlview.nuevo.participantes.tabHomologacion.clAcciones = false;
      this.controlview.nuevo.participantes.tabElaboracion.btnAgregar = false;
      this.controlview.nuevo.participantes.tabElaboracion.clAcciones = false;
      this.controlview.nuevo.participantes.tabConsenso.btnAgregar = false;
      this.controlview.nuevo.participantes.tabConsenso.clAcciones = false;
      this.controlview.nuevo.fase.esVisible = false;
      this.controlview.nuevo.docComplementario.esVisible = false;
    } else if (nombrePagina == NOMBREPAGINA.APROSOLICITUDREVISION) {
      this.controlview.editar.general.btnBuscarDoc = false;
      this.controlview.editar.fase.esVisible = false;
      this.controlview.editar.usuario.btnAgregar = false;
      this.controlview.editar.docComplementario.clAcciones = false;
    } else if (nombrePagina == NOMBREPAGINA.ELABORACIONREVISION) {
      this.controlview.editar.general.btnBuscarDoc = false;
      this.controlview.editar.participantes.tabElaboracion.btnAgregar = false;
      this.controlview.editar.participantes.tabConsenso.btnAgregar = false;
      this.controlview.editar.participantes.tabAprobacion.btnAgregar = false;
      this.controlview.editar.participantes.tabHomologacion.btnAgregar = false;

      this.controlview.editar.participantes.tabElaboracion.clAcciones = false;
      this.controlview.editar.participantes.tabConsenso.clAcciones = false;
      this.controlview.editar.participantes.tabAprobacion.clAcciones = false;
      this.controlview.editar.participantes.tabHomologacion.clAcciones = false;

      this.controlview.editar.usuario.btnAgregar = false;
      this.controlview.editar.docComplementario.btnAgregar = false;

    } else if (nombrePagina == NOMBREPAGINA.CONSENSOREVISION) {
      this.controlview.editar.general.btnBuscarDoc = false;
      this.controlview.editar.participantes.tabElaboracion.btnAgregar = false;
      this.controlview.editar.participantes.tabConsenso.btnAgregar = false;
      this.controlview.editar.participantes.tabAprobacion.btnAgregar = false;
      this.controlview.editar.participantes.tabHomologacion.btnAgregar = false;
      this.controlview.editar.participantes.tabElaboracion.clAcciones = false;
      this.controlview.editar.participantes.tabConsenso.clAcciones = false;
      this.controlview.editar.participantes.tabAprobacion.clAcciones = false;
      this.controlview.editar.participantes.tabHomologacion.clAcciones = false;

      this.controlview.editar.usuario.btnAgregar = false;
      this.controlview.editar.docComplementario.btnAgregar = false;

    } else if (nombrePagina == NOMBREPAGINA.APROBACIONREVISION) {
      this.controlview.editar.general.btnBuscarDoc = false;
      this.controlview.editar.participantes.tabElaboracion.btnAgregar = false;
      this.controlview.editar.participantes.tabConsenso.btnAgregar = false;
      this.controlview.editar.participantes.tabAprobacion.btnAgregar = false;
      this.controlview.editar.participantes.tabHomologacion.btnAgregar = false;

      this.controlview.editar.participantes.tabElaboracion.clAcciones = false;
      this.controlview.editar.participantes.tabConsenso.clAcciones = false;
      this.controlview.editar.participantes.tabAprobacion.clAcciones = false;
      this.controlview.editar.participantes.tabHomologacion.clAcciones = false;

      this.controlview.editar.usuario.btnAgregar = false;
      this.controlview.editar.docComplementario.btnAgregar = false;
    } else if (nombrePagina == NOMBREPAGINA.HOMOLOGACIONREVISION) {
      this.controlview.editar.general.btnBuscarDoc = false;
      this.controlview.editar.participantes.tabElaboracion.btnAgregar = false;
      this.controlview.editar.participantes.tabConsenso.btnAgregar = false;
      this.controlview.editar.participantes.tabAprobacion.btnAgregar = false;
      this.controlview.editar.participantes.tabHomologacion.btnAgregar = false;

      this.controlview.editar.participantes.tabElaboracion.clAcciones = false;
      this.controlview.editar.participantes.tabConsenso.clAcciones = false;
      this.controlview.editar.participantes.tabAprobacion.clAcciones = false;
      this.controlview.editar.participantes.tabHomologacion.clAcciones = false;

      this.controlview.editar.usuario.btnAgregar = false;
      this.controlview.editar.docComplementario.btnAgregar = false;
    }
    this.permisos = this.controlview[this.tipoAccion];
    //console.log("el permiso es ", this.permisos);
  }


  ngOnInit(): void {

    this.obtenerDataRutaPadre();
    this.route.params.subscribe(params => {
      this.itemCodigo = + params['codigo'];
      this.equipousuario.idDocumento = this.itemCodigo;
    });
    if (this.itemCodigo) {
      this.service.buscarPorCodigoMigracion(this.itemCodigo).subscribe((responseDocumento: Response) => {
        this.mapearTabsParaTodos(responseDocumento.resultado)
      });

    }


    //console.log("arbol");
    //console.log(this.general.todosCheck1);

  }

  indicadordigitalAc(itemdigital) {

    this.indicadorDigital.next(itemdigital);
    //console.log("indicador DIGITAL");
    //console.log(itemdigital);

  }


  //Setear los campos en todas la pestañas
  mapearTabsParaTodos(itemResponse) {
    //cguerra
    this.item = itemResponse;
    let IndicadorDigital = String(this.item.indicadorDigital)
    localStorage.setItem("IndicadorDigital", IndicadorDigital)
    // this.item = responseDocumento.resultado;
    //console.log("this.item:",this.item);
    this.general.item = Object.assign(new DocumentoMigracion(), this.item);
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
      this.general.sgiparametrodesc = this.general.sgiparametrodesc.substr(0,
        this.general.sgiparametrodesc.length - this.general.tipodocumento.length - 1);
    }
    if (this.item.jproceso != null) {
      this.general.procesoparametroid = this.item.jproceso.idJerarquia + "";
      this.general.procesoparametrodesc = this.item.jproceso.descripcion;
      this.general.procesoparametrodesc = this.general.procesoparametrodesc.substr(0,
        this.general.procesoparametrodesc.length - this.general.tipodocumento.length - 1);
    }
    if (this.item.revision != null) {
      let fin = this.item.revision.numero + 1;
      if (fin < 10) {
        this.general.revisionCurso = String("0" + fin) //this.item.revision.numero+1;
      } else {
        this.general.revisionCurso = String(fin);
      }
      
      if (this.item.revision.numero <= 9) {
        if (this.item.revision.numero == 0) {
          this.general.ultimoNumero = "00"
        }
        this.general.ultimoNumero = String("0" + this.item.revision.numero);
      } else {
        this.general.ultimoNumero = String(this.item.revision.numero);
      }
    }//52316925



    if (this.item.periodo) {
      this.general.periodo = String(this.item.periodo);
      this.general.item.periodo = String(this.item.periodo);
      this.general.todosCheck = true;
      this.general.habilitacampo = false;
    }

    if (this.item.indicadorDigital == 1) {
      this.general.todosCheck1 = true;
    } else {
      this.general.todosCheck1 = false;
    }

    this.indicadordigitalAc(this.item.indicadorDigital);

    if (this.item.coordinador != null) {
      this.general.coordinador = this.item.coordinador.nombreCompleto;
    }
    if (this.item.codigoAnterior != null) {
      this.general.codigoAnterior = this.item.codigoAnterior.codigo;
    }

    if (this.item.participanteElaboracion != null) {
      this.participantes.item.listaElaboracion = this.item.participanteElaboracion;
      //localStorage.setItem("a",this.;
    }
    ///aqui
    if (this.item.participanteConsenso != null) {
      this.concenso.item.listaConsenso = this.item.participanteConsenso;
    }
    //console.log("aprobacionnn", this.aprobacion);
    if (this.item.participanteAprobacion != null && this.aprobacion) {
      this.aprobacion.item.listaAprobacion = this.item.participanteAprobacion;
    }

    if (this.item.participanteHomologacion != null && this.homologacion) {
      this.homologacion.item.listaHomologacion = this.item.participanteHomologacion;
    }
    if (this.item.listaComplementario != null) {
      this.complementario.listaSeguimiento = this.item.listaComplementario as Documento[];
    }
    /*Equipo Usuario*/

    if (this.item.listaEquipo != null) {
      this.equipousuario.listaEquipo = this.item.listaEquipo;
    }
    this.equipousuario.idDocumento = this.itemCodigo;
    this.equipousuario.listaEquipo = this.item.listaEquipo;

    //console.log(this.item.listaEquipo);
    this.equipousuario.indicadorresp;



    /* Limpiar Campos de revision*/
    this.revision.OnLimpiarCampos();
    this.general.habilitaDigital();
    /* Limpiar Campos de Critica*/
    this.critica.OnLimpiarCampos();


    /*revision*/
    /*  this.revision.listaRevision = this.item.listaRevision as RevisionDocumento[];
      let revision = this.revision.listaRevision.find(revision => revision.id == Number(this.item.idrevision));
      this.revision.revision = revision?revision:new RevisionDocumento();
      */
    /* Bitacora   */

    /* if(this.item.participanteElaboracion!=null) {
       this.bitacora.item.listaElaboracion=this.item.participanteElaboracion;
       this.bitacora.item.listaConsenso=this.item.participanteConsenso;
     }*/

  }

  extrametododepadre(documento) {
    this.mapearTabsParaTodos(documento);
  }

}
