import {Estado} from './enums/estado';
import {Equipo} from 'src/app/models/equipo';
import { Constante } from 'src/app/models/constante';
import { IsDate } from 'class-validator';
import { Colaborador } from 'src/app/models/colaborador';

export class RutaParticipanteMigracion {
	numeroFicha: string;
	item:number;
	idRuta: number;
	indEnvio : number;
	indicadorTrabajador: number;
	indicadorEquipo: number;
	indicadorFuncion: number;
	idColaborador: number;
	idTrabajador: number;
	estiloBloqueado: boolean;
	textoBloqueado: string;
	idFase: number;
	ruta: String;
	responsable?: string; 
	funcion: String;
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
	esta: RutaParticipanteMigracion[];
	fechaPlazo: Date;
	@IsDate({message: 'fecha'})
	fechaLiberacion: Date;
	nombreCompleto: string;
	equipo: Equipo;
	idRevision: number;
	iteracion: number;
	nombreFase: string;
	indicadorRechazo: number;
	fechaRechazo: Date;
	idEquipo: number;
	lstColaborador : Colaborador[];
	constructor(){
		this.iteracion = 1;
		this.indEnvio = 0;
		
	}
}