import {Aula} from './aula';
import {Parametro} from './parametro';
import {RutaResponsable} from './rutaresponsable';
import {Instructor} from './instructor';
import {Response} from './response';
import {Paginacion} from './paginacion';
import {Tipo} from './tipo';
import {Jerarquia} from './jerarquia';
import {FiltroDocumento} from './filtro-documento';
import {BandejaDocumento} from './bandejadocumento';
import {RevisionDocumento} from './revisiondocumento';
import {Encuesta} from './encuesta';
import { Documento } from './documento';
import { ParametrosRevision } from './parametrosrevision';
import {ControlView} from './permisos/controlview';
import { UploadResponse } from 'src/app/models/upload-response';
import { DocumentoAdjunto } from 'src/app/models/documento-adjunto';
import { SolicitudCopiaDocumento } from 'src/app/models/solicitudcopiadocumento';
import { PreguntaCurso} from 'src/app/models/preguntacurso';
import  {PreguntaDetalle} from 'src/app/models/preguntadetalle';
import  {Curso} from 'src/app/models/curso';
import  {Asistencia} from 'src/app/models/asistencia';
import  {EmpleadoAsistencia} from 'src/app/models/empleadoAsistencia';
import { RutaParticipanteMigracion } from 'src/app/models/rutaParticipanteMigracion';
import { AdjuntoMensaje } from './adjunto-mensaje';
import { CargosSig } from './cargosSig';

//Export
export {
    Documento,
    Aula,
    Instructor,
    Response,
    Paginacion,
    AdjuntoMensaje,
    Tipo,
    RutaResponsable,
    Parametro,
    Jerarquia,
    FiltroDocumento,
    BandejaDocumento,
    RevisionDocumento,
    RutaParticipanteMigracion,
    Encuesta,
    ParametrosRevision,
    ControlView,
    UploadResponse,
    DocumentoAdjunto,
    SolicitudCopiaDocumento,

    PreguntaCurso,
    PreguntaDetalle,
    Curso,
    Asistencia,
    EmpleadoAsistencia,

    CargosSig
};
