import { Paginacion } from "./paginacion";
import { PaginacionSetComponent } from "../components/common/paginacion/paginacion-set.component";
import { RevisionDocumento } from 'src/app/models';

type Estados = 'OK'|'ERROR';

/* class Error {
    codigo: string;
    mensaje: string;
    mensajeInterno: string;
} */

export class RetornosBusqueda {
    parametroBusqueda:string;
    textoBusqueda:string;
    listaTipoDocumento: any[];
    listaFaseActDoc: any[];
    listaEstFaseActDoc: any[];
    listaEstMotivoRevDoc: any[];
    listaEstadoDocumento: any[];
    paginacion: Paginacion;
    pagina: number;
    registros:number;
    totalPaginas:number;
    totalRegistros:number;

    idProceso: string; 
    idalcasgi: string;
    idgeregnrl: string;
    idTipoDoc:number;
    parametroId: number;
    parametroIdTipoDoc: number;
    parametroRuta: string;
    activar: boolean;
    listaNodes: any;
    idProcesoDocSeleccinado:number;
    idProc:number;
    idAlcance:number;
    idGerencia:number;
    general1: PaginacionSetComponent;
    Tipo: string;
    parametrosMap: any[];
    tipoBusqueda: number;
    objetoRevisionDocumento: RevisionDocumento;
    
/*     estado: Estados;
    paginacion: any;
    error?: Error;
    resultado?: any; */

    constructor(){
        this.parametroBusqueda="";
        this.textoBusqueda="";
        this.parametroId = null;
        this.pagina = 1;
        this.registros = 0;
        this.totalPaginas = 0;
        this.totalRegistros = 0;

        this.idProceso= null;
        this.idalcasgi= null;
        this.idgeregnrl= null;
        this.idTipoDoc= null;
        this.parametroIdTipoDoc= null;
        this.parametroRuta= null;
        this.activar= null;
        this.listaNodes= null;
        this.idProcesoDocSeleccinado=null;
        this.idProc=null;
        this.idAlcance=null;
        this.idGerencia=null;
        this.general1 = null;
        this.Tipo = null;
        this.parametrosMap = [];
        this.tipoBusqueda = null;
        this.objetoRevisionDocumento = new RevisionDocumento();
    }   
}

