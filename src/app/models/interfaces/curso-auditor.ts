import { AuditoriaAGI } from '../auditoria-agi';

export interface CursoAuditor extends AuditoriaAGI {

  idCurso?: number;
  idFichaAudi?: number;
  nomCurso?: string;
  indObli?: number;
  stReg?: string;

}
