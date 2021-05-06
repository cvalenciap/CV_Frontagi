import {Estado} from './enums/estado';
import {Equipo} from 'src/app/models/equipo';
import { Constante } from 'src/app/models/constante';
import { Colaborador } from 'src/app/models/colaborador';

export class RutaParticipante {
	numeroFicha: string;
	item:number;
	idRuta: number;
	idColaborador: number;
	idFase: number;
	ruta: String;
	responsable?: string; 
	funcion: String;
	descripcion?: string;
	estadoSoli: String;
	idsolicitud: string;
	//equipo: String;
	equipoColaborador: String;
	desta: string;
	fase: Constante[];
	//fechaLiberacion?: string;
	disponible: number;
	plazo:number;
	//plazo1:number;
	prioridad:number;
	comentario?: string;
	estado: Estado;
	esta: RutaParticipante[];
	fechaPlazo: Date;
	fechaLiberacion: Date;
	nombreCompleto: string;
	equipo: Equipo;
	idRevision: number;
	iteracion: number;
	nombreFase: string;
	indicadorRechazo: number;
	fechaRechazo: Date;
	indEnvio : number;
	//numeroFicha: number;
	idEquipo: number;
	indicadorTrabajador: number;
	indicadorEquipo: number;
	indicadorFuncion: number;
	idTrabajador: number;
	estiloBloqueado: boolean;
	textoBloqueado: string;

	lstColaborador : Colaborador[];
	constructor(){
		this.iteracion = 1;

		//this.numeroFicha = 0;
		this.lstColaborador = [];
		this.indEnvio = 0;
		this.estiloBloqueado = false;

	}
}