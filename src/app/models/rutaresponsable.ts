import {Estado} from './enums/estado';
import {Tipo} from './tipo';
import { RutaParticipante } from 'src/app/models/rutaParticipante';
import { Colaborador } from 'src/app/models/colaborador';

export class RutaResponsable {
    codigo: number;
    id: number;
    idconstante: number;
    fecha: Date;
    descripcion: string;
    tipo: Tipo;
    estado: Estado;
    fechaRegistro: Date;
    fechaCreacion: Date;
    usuarioCreacion: String;
    responsable: string;
    fechaString: String;
    listaElaboracion : RutaParticipante[];
    listaConsenso : RutaParticipante[];
    listaAprobacion : RutaParticipante[];
    listaHomologacion : RutaParticipante[];
    listaBitacora: RutaParticipante[];
    constructor(){
        this.tipo = new Tipo();
        this.tipo.codigo = "";
        this.tipo.descripcion = "";
        this.codigo = 0;
        this.descripcion = "";
        this.estado = Estado.ACTIVO;
        //this.fechaRegistro = new Date();
        this.fecha = new Date();
        this.responsable = "";
        this.listaElaboracion = [];
        this.listaConsenso = [];
        this.listaAprobacion = [];
        this.listaHomologacion = [];
        this.listaBitacora = [];
    }
}


