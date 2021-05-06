import {Estado} from './enums/estado';
import {ValidateNested,MaxLength,MinLength,IsEmpty,IsDefined,NotContains,ValidateIf,Min,NotEquals} from 'class-validator';
import {RutaParticipante} from 'src/app/models/rutaParticipante';

export class Fase {
	tabName:string;
  idFase: number;
	idDocumento: number;
	idRevision: number;
	iteracion: number;
	idEstadoFase: number;
	estadoFase: string;
	usuarioFase: number;
	fechaFase: string;
	indicadorActividad: number;
	critica: string;
	disponible: number;
	estadoDisponible: Estado;
	indAprobacionSoli: string;
	indicadorBloqueo: number;
	usuarioBloqueo: number;
	nombreBloqueo: number;
	fechaBloqueo: Date;
	lista:RutaParticipante[];
	@MinLength(1, {message: 'Se requiere ingresar comentario'})
	comentario: string;
	descripcionFase:string;

  constructor(){
    this.estadoDisponible = Estado.ACTIVO;
		this.iteracion = 1;
		this.lista = [];
		this.tabName = "bitacora";
  }
}