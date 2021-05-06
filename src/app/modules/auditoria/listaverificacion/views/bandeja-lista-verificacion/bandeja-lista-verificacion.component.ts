import { Component, OnInit, SecurityContext } from '@angular/core';
//import { ListaVerificacion } from 'src/app/models/listaverificacion';
import { Paginacion, Response } from 'src/app/models';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ListaVerificacionMockService,ListaVerificacionService, PlanAuditoriaMockService, GeneralService} from './../../../../../services/index';
import { forkJoin } from 'rxjs';
import { ListaVerificacionAuditor } from 'src/app/models/listaverificacionauditor';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService } from 'ngx-bootstrap';
import { NombreParametro } from 'src/app/constants/general/general.constants';

@Component({
  selector: 'app-bandeja-lista-verificacion',
  templateUrl: './bandeja-lista-verificacion.component.html',
  styleUrls: ['./bandeja-lista-verificacion.component.scss']
})
export class BandejaListaVerificacionComponent implements OnInit {

  items:ListaVerificacionAuditor[];
  valorEstado:string;
  listaEstados:any[];
  parametroBusqueda:string;
  /* paginación */
  paginacion: Paginacion;
  /* registro seleccionado */
  selectedRow: number;
  selectedObject: ListaVerificacionAuditor;
  /* indicador de carga */
  loading: boolean;
  cargandoEstados:boolean;

  mostrarAlerta:boolean;
  mensajeAlerta:string;

  editar:boolean;

  listaComites:any[];
  listaGerencias:any[];
  listaEquipos:any[];
  listaCargos:any[];


  //INDICADOR TIPO DE ROL:
  tipoRol:string;// 1: Auditor    2: Auditor Lider    

  datatemp : any[];

  constructor(private toastr: ToastrService,
    private router: Router,
    private generalService:GeneralService,
    private service:ListaVerificacionMockService,
    private serviceBD:ListaVerificacionService,
    private planAuditoriaService:PlanAuditoriaMockService,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService) {
      this.loading = false;
      this.selectedRow = -1;
      this.items = [];
      this.parametroBusqueda = 'estado';
      this.paginacion = new Paginacion({registros: 10});
      this.valorEstado = "";
      this.cargandoEstados = true;
      this.tipoRol = "1";
      localStorage.removeItem('tipoRol');
     }

  ngOnInit() {
    this.listaEstados = [];
    this.listaGerencias = [];
    this.listaEquipos = [];
    this.listaCargos = [];
    this.listaComites = [];
    this.obtenerParametros();
    this.obtenerEstados();
    this.getLista();
    this.getData();
  }

  OnPageChanged(event): void {
    this.paginacion.pagina = event.page;
    this.getLista();
  }
  OnPageOptionChanged(event): void {
      this.paginacion.registros = event.rows;
      this.paginacion.pagina = 1;
      this.getLista();
  }
  OnRowClick(index, obj): void {
      this.selectedRow = index;
      this.selectedObject = obj;
  }

  OnBuscar(): void {

    let texto:string = "<strong>Busqueda Por: </strong>";
    switch (this.parametroBusqueda) {
        case 'estado':
            texto = texto + "<br/><strong>Estado: </strong>"+this.obtenerValorEstado(this.valorEstado);
            break;
    }
    this.mensajeAlerta = this.sanitizer.sanitize(SecurityContext.HTML, texto);
    this.mostrarAlerta = true;

    this.paginacion.pagina = 1;
    this.getLista();
  }

  obtenerValorEstado(codigo){
    let estado = this.listaEstados.find(obj => obj.v_campcons1 == codigo);
    return estado.v_valcons;
  }

  controlarError(error) {
    console.error(error);
    this.loading = false;
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
  }

  obtenerEstados(){
    let buscaEstados = this.generalService.obtenerParametroPadre(NombreParametro.listaEstadosLV);
    forkJoin(buscaEstados).subscribe(
      ([buscaEstados]:[Response]) => {
      this.listaEstados = buscaEstados.resultado;
      this.cargandoEstados = false;
    },
    (error) => this.controlarError(error)); 
  }

  obtenerParametros(){
    //let buscaEstados = this.service.obtenerEstados();
   
    let buscaEntidades = this.planAuditoriaService.obtenerEntidades();

    forkJoin(buscaEntidades).subscribe(
      ([buscaEntidades]:[Response]) => {
      this.listaComites = buscaEntidades.resultado.listaComites;
      this.listaGerencias = buscaEntidades.resultado.listaGerencias;
      this.listaEquipos = buscaEntidades.resultado.listaEquipos;
      this.listaCargos = buscaEntidades.resultado.listaCargos;
      this.cargandoEstados = false;
    },
    (error) => this.controlarError(error)); 
  }

  getLista(){
    this.loading = true;
    const parametros: {estado?: string} = {estado: null};
    switch (this.parametroBusqueda) {
        case 'estado':
            parametros.estado = this.valorEstado;
            break;
    }

    this.serviceBD.buscarPorParametros(parametros,this.paginacion.pagina, this.paginacion.registros).subscribe(
      (response: Response) => {
        this.items = response.resultado;

        this.items.forEach(objeto => {
          objeto.fecha = new Date(objeto.fecha);

          if(objeto.valorEntidad == "1"){
            let gerencia = this.listaGerencias.find(obj => obj.valorGerencia == objeto.codigoGerencia);
            objeto.descripcionEntidad = gerencia.descripcionGerencia;
          }else if(objeto.valorEntidad == "2"){
            let equipo = this.listaEquipos.find(obj => obj.valorEquipo == objeto.codigoEquipo);
            objeto.descripcionEntidad = equipo.descripcionEquipo;
          }else if(objeto.valorEntidad == "3"){
            let cargo = this.listaCargos.find(obj => obj.valorCargo == objeto.codigoCargo);
            objeto.descripcionEntidad = cargo.descripcionCargo;
          }else if(objeto.valorEntidad == "4"){
            let comite = this.listaComites.find(obj => obj.valorComite == objeto.codigoComite);
            objeto.descripcionEntidad = comite.descripcionComite;
          }
        })

          this.paginacion = new Paginacion(response.paginacion);
          this.loading = false; 
        
      },
      (error) => this.controlarError(error)
    )
  }

  OnModificar(){
  //OnModificar(item:ListaVerificacionAuditor){
    this.editar = true;
    localStorage.setItem('tipoRol',this.tipoRol);
    //this.router.navigate([`auditoria/lista-verificacion/editar/${item.idListaVerificacion}`]);
    this.router.navigate([`auditoria/lista-verificacion/editar/1`]);
  }

  OnConsultar(item:ListaVerificacionAuditor){
    this.editar = false;
    localStorage.setItem('tipoRol',this.tipoRol);
    this.router.navigate([`auditoria/lista-verificacion/editar/${item.idListaVerificacion}`]);
  }

  limpiar(){
    this.valorEstado = "";
  }

  abrirModalTrazabilidad(){

  }

  activarOpcion(accion:number){
    switch(accion){
      case 1: this.parametroBusqueda = "estado"; break;
    }
  }

  getData() {
    this.datatemp = [
      {
        checked: false,
        descripcionAuditoria: "Auditoria Interna de la Gerencia de Finanzas I",
        mes: "Junio",
        ano: "2019",
        area: "GERENCIA DE DESARROLLO E INVESTIGACIÓN",
        tipo_lv: ["ISO 9001:2015", "ISO 14001:2015", "OHSAS 18001"],
        auditor_lider: "ROSSANA GABRIELA VASQUEZ SANCHEZ",
        auditores: ["LORENA ALVARIÑO", "GRACIELA ROJAS", "CECILIA VERA", "JULES CASALINO (Obs)"],
        estado: "En Aprobación"
      },
      {
        checked: false,
        descripcionAuditoria: "Auditoria Interna de la Gerencia de Finanzas II",
        mes: "Julio",
        ano: "2019",
        area: "GERENCIA DE FINANZAS",
        tipo_lv: ["ISO 9001:2015", "ISO 14001:2015", "OHSAS 18001"],
        auditor_lider: "ROSSANA GABRIELA VASQUEZ SANCHEZ",
        auditores: ["GRACIELA ROJAS", "CECILIA VERA", "JULES CASALINO (Obs)"],
        estado: "En Revisión"
      }
    ];
  }

}
