import { Component, OnInit, SecurityContext } from '@angular/core';
import { Hallazgo } from 'src/app/models/hallazgo';
import { Paginacion, Response } from 'src/app/models';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { RegistroHallazgoMockService, RegistroHallazgosService, PlanAuditoriaMockService, GeneralService} from './../../../../../services/index';
import { forkJoin } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { ListaVerificacionAuditor } from 'src/app/models/listaverificacionauditor';
import { NombreParametro } from 'src/app/constants/general/general.constants';

@Component({
  selector: 'app-bandeja-registro-hallazgos',
  templateUrl: './bandeja-registro-hallazgos.component.html',
  styleUrls: ['./bandeja-registro-hallazgos.component.scss']
})
export class BandejaRegistroHallazgosComponent implements OnInit {
  items: ListaVerificacionAuditor[];
  valorEstado:string;
  parametroBusqueda:string;
  paginacion:Paginacion;

  listaEstados:any[];

  filaSeleccionada:number;
  objetoSeleccionado:ListaVerificacionAuditor;
  loading:boolean;

  mostrarAlerta:boolean;
  mensajeAlerta:string;


  listaComites:any[];
  listaGerencias:any[];
  listaEquipos:any[];
  listaCargos:any[];

  tipoRol:string;

  datatemp : any[];

  constructor(private toastr: ToastrService,
    private router: Router,
    private service: RegistroHallazgoMockService,
    private serviceBD: RegistroHallazgosService,
    private generalService:GeneralService,
    private planAuditoriaService: PlanAuditoriaMockService,
    private sanitizer: DomSanitizer) {
      this.loading = false;
      this.filaSeleccionada = -1;
      this.items = [];
      this.parametroBusqueda = 'estado';
      this.paginacion = new Paginacion({registros:10});
      this.valorEstado = "";
      
    }

  ngOnInit() {
    localStorage.removeItem("tipoRolRH");
    this.tipoRol = "1";
    this.listaEstados = [];
    this.listaGerencias = [];
    this.listaEquipos = [];
    this.listaCargos = [];
    this.listaComites = [];
    this.obtenerParametros();
    this.obtenerEstados();
    this.getLista();
    this.getDataTemp();
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
      this.filaSeleccionada = index;
      this.objetoSeleccionado = obj;
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
    let buscaEstados = this.generalService.obtenerParametroPadre(NombreParametro.listaTiposRevisionHallazgos);
    forkJoin(buscaEstados).subscribe(
      ([buscaEstados]:[Response]) => {
      this.listaEstados = buscaEstados.resultado;
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

          /*
          for(let i:number=0; this.items.length > i; i++){
            for(let j:number=0; this.listaEstados.length > j; j++){
              if(this.items[i].estadoHallazgo == this.listaEstados[j].valorEstado){
                this.items[i].descripcionEstado = this.listaEstados[j].descripcionEstado;
                break;
              }
            }
          }
          */
          this.paginacion = new Paginacion(response.paginacion);
          this.loading = false; 
        
      },
      (error) => this.controlarError(error)
    )
  }

  OnModificar(){
  //OnModificar(item:ListaVerificacionAuditor){
    localStorage.setItem("tipoRolRH",this.tipoRol);
    this.router.navigate([`auditoria/revision-hallazgos/editar/1`]);
  }

  OnConsultar(item:ListaVerificacionAuditor){
    localStorage.setItem("tipoRolRH",this.tipoRol);
    this.router.navigate([`auditoria/revision-hallazgos/editar/${item.idListaVerificacion}`]);
  }

  activarOpcion(accion:number){
    switch(accion){
      case 1: this.parametroBusqueda = "estado"; break;
    }
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
    },
    (error) => this.controlarError(error)); 
  }


  getDataTemp() {
    this.datatemp = [
      {
        checked: false,
        descripcionAuditoria: "Auditoria Interna de la Gerencia de Finanzas I",
        mes: "Junio",
        ano: "2019",
        area: "GERENCIA DE DESARROLLO E INVESTIGACIÓN",
        normas: ["ISO 9001:2015", "ISO 14001:2015", "OHSAS 18001"],
        auditorLider: "ROSSANA GABRIELA VASQUEZ SANCHEZ",
        auditores: ["LORENA ALVARIÑO", "GRACIELA ROJAS", "CECILIA VERA", "JULES CASALINO (Obs)"],
        estado: "En Aprobación"
      },
      {
        checked: false,
        descripcionAuditoria: "Auditoria Interna de la Gerencia de Finanzas II",
        mes: "Julio",
        ano: "2019",
        area: "GERENCIA DE FINANZAS",
        normas: ["ISO 9001:2015", "ISO 14001:2015", "OHSAS 18001"],
        auditorLider: "ROSSANA GABRIELA VASQUEZ SANCHEZ",
        auditores: ["GRACIELA ROJAS", "CECILIA VERA", "JULES CASALINO (Obs)"],
        estado: "En Revisión"
      }
    ];
  }
    

}
