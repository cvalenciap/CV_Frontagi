import {environment} from '../../environments/environment';
/* Aulas */
import {AulasService} from './impl/aulas.service';
/* Encuesta */
import {EncuestaService} from './impl/encuesta.service';
import {EncuestaMockService} from './mocks/Encuesta.mock';
/* Instructor */
import {InstructoresService} from './impl/instructores.service';
/* Ruta y Responsable */
import {RutaResponsablesService} from './impl/rutaresponsables.service';
/* Parametros */
import {ParametrosService} from './impl/parametros.service';
/* Jerarquia */
import {JerarquiasService} from './impl/jerarquias.service';
/* Colaboradores */
import {ColaboradoresService} from './impl/colaboradores.service';
/* Equipo */
import {EquiposService} from './impl/equipos.service';
/* Bandeja de Documento */
import {BandejaDocumentoService} from './impl/bandejadocumentos.service';
/* Programacion de auditoria */
import { ProgramacionAuditoriaService } from './impl/programacionauditoria.service';
import { ProgramacionAuditoriaMockService } from './mocks/programacionauditoria.mock';
import { PlanAuditoriaService } from './impl/planauditoria.service';
import { PlanAuditoriaMockService } from './mocks/planauditoria.mock';
import { ListaVerificacionService } from './impl/listaverificacion.service';
import { ListaVerificacionMockService } from './mocks/listaverificacion.mock';
import { EvaluacionEditorService } from './impl/evaluacionEditor.service';
import { NormaIncidenciaService } from './impl/normaincidencia.service';
import { DeteccionHallazgosService } from './impl/deteccionhallazgos.service';
import { DeteccionHallazgosMockService } from './mocks/deteccionHallazgos.mock';
import { FichaRegistroAuditorService } from './impl/ficharegistroauditor.service';
import { FichaCargoSigService } from './impl/fichacargossig.service';
import { RegistroHallazgosService } from './impl/registrohallazgos.service';
import { RegistroHallazgoMockService } from './mocks/registrohallazgos.mock';
import { AgrupacionHallazgosService } from './impl/agrupacionhallazgos.service';
import { AgrupacionHallazgoMockService } from './mocks/agrupacionhallazgos.mock';
import { BancoPreguntaService } from './impl/bancopregunta.service';
import {DetalleDeteccionHallazgosService} from './impl/detalledeteccionhallazgos.service';
import { GeneralService } from './impl/general.service';
/* Revision de Documento - lgomez */
import {RevisionDocumentoMockService} from './mocks/revisiondocumento.mock';
import {TareasPendientesMockService} from './mocks/tareas-pendientes/tareaspendientes.mock';
/* Bandeja de Reprogramacion */
import { BandejaReprogramacionService } from './impl/bandejareprogramacion.service';
import { BandejaReprogramacionMockService} from './mocks/bandejareprogramacion.mock';
/* Capacitaciones */
import { BandejaAsistenciaService} from './impl/bandejaasistencia.service';
import { BandejaAsistenciaMockService } from './mocks/bandejaasistencia.mock';
import { BandejaEvaluacionesService } from './impl/bandejaevaluaciones.service';
import { BandejaEvaluacionesMockService} from './mocks/bandejaevaluaciones.mock';
import { ProgramarCapacitacionService } from './impl/programarcapacitacion.service';
import { ProgramarCapacitacionMockService } from './mocks/programarcapacitacion.mock';
import {JsonService} from './json.service';
import {ValidacionService} from './util/validacion.service';

/*File Server*/
import { FileServerService } from 'src/app/services/impl/file-server.service';

/* Tareas Pendientes */
import { TareasPendientesService } from 'src/app/services/impl/tareaspendientes.service';
/* */
import { RelacionCoordinadorService } from 'src/app/services/impl/relacioncoordinador.service';
import { CorreoService } from 'src/app/services/impl/correo.service';

import { PreguntaCursoService } from './impl/preguntacurso.service';
import { AsistenciaService } from './impl/asistencia.service';
import { CapacitacionService } from 'src/app/services/impl/capacitacion.service';

import { ApiService } from './api.service';
import { ConsultaCargosSiService } from './auditoriacargossig.service';

export {
    AulasService,    
    EncuestaService,
    EncuestaMockService,
    InstructoresService,    
    RutaResponsablesService,    
    ParametrosService,    
    JerarquiasService,    
    ColaboradoresService,
    EquiposService,
    BandejaDocumentoService,    
    ProgramacionAuditoriaService,
    ProgramacionAuditoriaMockService,
    PlanAuditoriaService,
    PlanAuditoriaMockService,
    ListaVerificacionService,
    ListaVerificacionMockService,
    EvaluacionEditorService,    
    NormaIncidenciaService,    
    DeteccionHallazgosService,
    DeteccionHallazgosMockService,            
    FichaRegistroAuditorService,        
    FichaCargoSigService,
    RegistroHallazgosService,
    RegistroHallazgoMockService,
    AgrupacionHallazgosService,
    AgrupacionHallazgoMockService,
	//lgomez
    RevisionDocumentoMockService,
    TareasPendientesMockService,
    BandejaReprogramacionService,
    BandejaReprogramacionMockService,
    BandejaAsistenciaService,
    BandejaAsistenciaMockService,
    BandejaEvaluacionesService,
    BandejaEvaluacionesMockService,
    ProgramarCapacitacionService,
    ProgramarCapacitacionMockService,
    BancoPreguntaService,
    DetalleDeteccionHallazgosService,
    GeneralService,
    JsonService,
    ValidacionService,
    FileServerService,
    TareasPendientesService,
    RelacionCoordinadorService,
    CorreoService,
    PreguntaCursoService,
    AsistenciaService,
    CapacitacionService,

    //cguera
    ConsultaCargosSiService,
    ApiService

};
