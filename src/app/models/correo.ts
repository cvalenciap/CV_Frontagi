import {CorreoAdjunto} from "src/app/models/correoAdjunto";
import {CorreoCabecera} from "src/app/models/correoCabecera";
import {CorreoImagen} from "src/app/models/correoImagen";
import {CorreoVariable} from "src/app/models/correoVariable";

export class Correo {

	correoCabecera: CorreoCabecera;
	archivosAdjuntos: CorreoAdjunto[];
	imagenesAdjuntas: CorreoImagen[];
	variable: CorreoVariable;
	mensaje: string;
	asunto: string;

	constructor(){
		this.archivosAdjuntos = [];
		this.imagenesAdjuntas = [];
	}

}