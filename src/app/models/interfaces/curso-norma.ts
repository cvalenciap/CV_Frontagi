import { AuditoriaAGI } from '../auditoria-agi';

export interface CursoNorma extends AuditoriaAGI {

  idCursoNorma?: number;
  idFichaAudi?: number;
  idNorma?: number;
  nomNorma?: string;
  indObli?: number;
  stReg?: string;

}
