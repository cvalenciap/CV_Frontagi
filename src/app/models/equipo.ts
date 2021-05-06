import {Colaborador} from './colaborador';
import { ValidateIf, Min } from 'class-validator';

export class Equipo {
  id?: number;
  descripcion?: string;
  jefe?: Colaborador;
  sigla?: string;
  idRevision?: number;
  indicadorEliminar?: boolean;
  indicadorResponsable: number;
  indicadorResp?: number;
  idCurso?: string;
  idArea?: number;
  disponibilidad?: string;
  estadoRegistro?: string;
  abreviatura?: string;
  codigoCurso?: string;
  indicadorequiRes?: number;
  constructor() {
    this.indicadorResp= 0;
    this.id = 0;    
    this.jefe = new Colaborador();
    this.sigla = '';
    this.idRevision = 0;
    this.indicadorEliminar = false;
    this.indicadorResponsable = 0;
    this.idCurso = "";
    this.idArea = 0;
    this.disponibilidad = "";
    this.estadoRegistro = "";
    this.abreviatura = "";
    this.codigoCurso = "";
  }

}
