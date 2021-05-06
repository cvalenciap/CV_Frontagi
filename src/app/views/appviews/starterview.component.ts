import {Component, OnDestroy, OnInit,} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {ParametrosService} from 'src/app/services';
import {Constante} from 'src/app/models/enums';
import {Response} from 'src/app/models';
import { TareasPendientesService } from '../../services/impl/tareaspendientes.service';
import { TareasPendientes } from 'src/app/models/tareaspendientes';
import { AppSettings } from 'src/app/app.settings';
import { Router } from '@angular/router';
import { Parametro } from 'src/app/models/parametro';
import { Dashboard } from 'src/app/models/dashboard';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { DashboardDato } from 'src/app/models/dashboardDato';
import {ViewChild, Input, Output, EventEmitter} from '@angular/core';
import { BaseChartDirective } from 'ng2-charts/ng2-charts';
import { SessionService } from 'src/app/auth/session.service';
import {AuthService} from '../../auth/auth.service';

declare var jQuery:any;

@Component({
  selector: 'starter',
  templateUrl: 'starter.template.html'
})
export class StarterViewComponent implements OnDestroy, OnInit  {

  @ViewChild("baseChart") chart: BaseChartDirective;
  public nav:any;
  loading: boolean;
  idProceso: number;
  idAlcance: number;
  idGerencia: number;
  datosInfDocumentaria: TareasPendientes;
  idColaborador: number;
  idTrimestre: number;
  lista: Parametro[];
  anio: number;

  public constructor(private servicioTareasPendientes: TareasPendientesService,
                     private toastr: ToastrService,
                     private serviceParametro: ParametrosService,
                     private router:Router,
                     public session: SessionService,
                     private auth: AuthService) {
    this.nav = document.querySelector('nav.navbar');
    this.datosInfDocumentaria = new TareasPendientes();
    this.loading = false;
    sessionStorage.removeItem("rutaAnterior");

    let hoy: Date;
    hoy = new Date();
    this.anio = hoy.getFullYear();

    this.serviceParametro.obtenerParametroPadre(Constante.TIPO_JERARQUIA).subscribe(
      (response: Response) => {
        let resultado = response.resultado;
        this.idProceso=this.serviceParametro.obtenerIdParametro(
          resultado,Constante.TIPO_JERARQUIA_PROCESO);
        this.idAlcance=this.serviceParametro.obtenerIdParametro(
          resultado,Constante.TIPO_JERARQUIA_ALCANCE);
        this.idGerencia=this.serviceParametro.obtenerIdParametro(
          resultado,Constante.TIPO_JERARQUIA_GERENCIA);
      },
      (error) => this.controlarError(error)
    );

    this.serviceParametro.obtenerParametroPadre(Constante.LISTA_TRIMESTRE).subscribe(
      (response: Response) => {
        this.lista = response.resultado;
        this.idTrimestre=this.serviceParametro.obtenerIdParametro(
          this.lista,Constante.TRIMESTRE_I);
        this.mostrar();
      },
      (error) => this.controlarError(error)
    );
  }

  public ngOnInit():any {
    
    this.nav.className += " white-bg";
    //this.idColaborador = AppSettings.USUARIO_LOGIN;
    let datosUsuario = this.session.User;
    if(datosUsuario != null){
      this.idColaborador = datosUsuario.codFicha;
      console.log(this.idColaborador);
    }
    this.OnBuscarTareasPendientes();
  }

  OnBuscarTareasPendientes(){
        
    this.servicioTareasPendientes.obtenerTareasPendientesDocumental(this.idColaborador).subscribe(
      (response: Response) => {
        
        let listaTareasPendientes: TareasPendientes[] = response.resultado;
        if(listaTareasPendientes.length > 0){
          this.datosInfDocumentaria = listaTareasPendientes[0];
        }
      }, (error) => this.controlarError(error)
    );
  }

  controlarError(error) {
    console.error(error);
    this.loading = false;
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error',
      {closeButton: true});
  }

  public ngOnDestroy():any {
    this.nav.classList.remove("white-bg");
  }

  public mostrar() {
    if(this.idTrimestre!=null) {
      this.servicioTareasPendientes.obtenerDashBoardDocumento(this.anio, this.idTrimestre).subscribe(
        (response: Response) => {
          let objeto: Dashboard = response.resultado;
          let datosEstadistica: DashboardDato = new DashboardDato;
          let listaDatos: DashboardDato[] = [];
          datosEstadistica.data = objeto.listaDato;
          listaDatos.push(datosEstadistica);

          this.lineChartData   = listaDatos;
          let tamano = this.lineChartLabels.length;
          for(let posicion=tamano; posicion>0; posicion--) {
            this.lineChartLabels.pop();
          }
          objeto.listaTexto.forEach(nuevoTexto => {
              this.lineChartLabels.push(nuevoTexto);
            }
          );
        },
        (error) => this.controlarError(error)
      );
    }
  }

  public exportar(event) {
    let trimestre = this.lista.find(obj => obj.idconstante==this.idTrimestre);
    this.servicioTareasPendientes.obtenerDashBoardExcel(this.anio, this.idTrimestre,
      trimestre.v_valcons).subscribe(
      function(data) {
        var file = new Blob([data],
          {type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
        var fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      },
      (error) => this.controlarError(error)
    );
    this.toastr.info('Reporte generado', 'Confirmación', {closeButton: true});
  }

  public lineChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };
  public lineChartData:Array<any> = [{data: [0.5], label: 'Documentos Programados'}];
  public lineChartLabels:Array<any> = ['0'];
  public lineChartType:string = 'bar';
  public lineChartColors:Array<any> = [
    {
      backgroundColor: "rgba(51,152,220,0.5)",
      borderColor: "rgba(28,89,129,0.7)",
      pointBackgroundColor: "rgba(28,89,129,0.7)",
      pointBorderColor: "#fff",

      /*backgroundColor: "rgba(26,179,148,0.5)",
      borderColor: "rgba(26,179,148,0.7)",
      pointBackgroundColor: "rgba(26,179,148,1)",
      pointBorderColor: "#fff",*/
    },
    {
      backgroundColor: "rgba(98,192,255,0.5)",
      borderColor: "rgba(98,192,255,0.5)",
      pointBackgroundColor: "rgba(220,220,220,1)",
      pointBorderColor: "#fff",
    }
  ];

  public flotDataset:Array<any> = [
    { label: "Data 1", data: [[15, 1], [2, 3057], [2, 20434], [2, 31982], [1272672000000, 26602], [1275350400000, 27826], [1277942400000, 24302], [1280620800000, 24237], [1283299200000, 21004], [1285891200000, 12144], [1288569600000, 10577], [1291161600000, 10295]], color: '#17a084'}/*,
    { label: "Data 2", data: [[1262304000000, 5], [1264982400000, 200], [1267401600000, 1605], [1270080000000, 6129], [1272672000000, 11643], [1275350400000, 19055], [1277942400000, 30062], [1280620800000, 39197], [1283299200000, 37000], [1285891200000, 27000], [1288569600000, 21000], [1291161600000, 17000]], color: '#127e68' }*/
  ];

  public flotOptions:any =
  {
    xaxis: {
      tickDecimals: 0
    },
    series: {
      lines: {
        show: true,
        fill: true,
        fillColor: {
          colors: [{
            opacity: 1
          }, {
            opacity: 1
          }]
        },
      },
      points: {
        width: 0.1,
        show: false
      },
    },
    grid: {
      show: false,
      borderWidth: 0
    },
    legend: {
      show: false,
    }
  };
  
  public peityOptions:any = { fill: ['#1ab394', '#d7d7d7', '#ffffff']};

  onClick(idBoton){
    sessionStorage.setItem("rutaAnterior",this.router.url);
    localStorage.setItem("indicadordocumento","1");
    localStorage.setItem("idProcesoSeleccionado",idBoton);
    localStorage.removeItem('nodeSeleccionado'); 
  }

  onClicIndicador(){
    localStorage.removeItem("objetoRetornoBusqueda");    
    localStorage.removeItem("objetoRetornoBusquedaSolCopia");
    localStorage.removeItem("objetoRetornoBusquedaCopia");
    localStorage.removeItem("objetoRetornoBusquedaElaboracion");
    localStorage.removeItem("objetoRetornoBusquedaHomologacion");
    
  }


}
