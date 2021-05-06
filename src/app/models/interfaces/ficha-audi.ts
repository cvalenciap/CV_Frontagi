import { AuditoriaAGI } from "../auditoria-agi";
import { GenericParam } from "./generic-param";
import { CursoNorma } from "./curso-norma";
import { CursoAuditor } from "./curso-auditor";

export interface FichaAudi extends AuditoriaAGI {

  idFichaAudi?: number;
  tipoAuditor?: GenericParam;
  ficha?: number;
  nomAudi?: string;
  apePaterno?: string;
  apeMaterno?: string;
  auditor?: string;
  fecIngreso?: string;
  annoExp?: string;
  nomCargo?: string;
  nomEmpre?: string;
  equipo?: GenericParam;
  gerencia?: GenericParam;
  rolAuditor?: GenericParam;
  tipoEducacion?: GenericParam;
  evalAudi?: string;
  stReg?: string;

  cursosNorma?: CursoNorma[];
  cursosCompletados?: CursoAuditor[];
  cursosPendientes?: CursoAuditor[];

}
