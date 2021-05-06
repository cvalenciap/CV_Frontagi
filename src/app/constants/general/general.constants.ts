export const FormatoCarga = {
    pdf: 'application/pdf',
    video:'video/mp4',
    excel: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    excelAntiguo: 'application/vnd.ms-excel',
    imagen: 'image/jpeg',
    word: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',

    wordAntiguo: 'application/msword',
    ppt: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    pptAntiguo : 'application/vnd.ms-powerpoint',
    
    
}

export const MensajeGeneral = {
    mensajeErrorServicio: 'Se presentó un error inesperado en la última acción'
}

export const NombreParametro = {
    listaMeses: 'Lista de Meses',
    listaTipos: 'Tipo de Auditoria',
    listaEstadosAuditoria: 'Listado de Estados de Auditoria',
    listaCriterios: 'Listado de Criterios de Resultado',
    listadoRolAuditor: 'Listado Rol de Auditores',
    listaEstadosLV: 'Listado de Estados de LV',
    listaTiposLV: 'Listado de Tipos de LV',
    listaTiposRevisionHallazgos: 'Listado de Estados de Revision de Hallazgos',
    listaTiposHallazgos: 'Listado de Tipos de Hallazgos',
    listaTiposReglas: 'Listado de Tipos de Reglas',
    listaTipoNoConformidad: 'Listado de Tipo de No Conformidad',
    listaOrigenDeteccion: 'Listado de Origen de Deteccion',
    listaEstadoDeteccionHallazgos: 'Listado de Estados de Deteccion de Hallazgos',
    listaTipoSolicitudCancelacion: 'Listado de Tipo de la Solicitud de Cancelacion',
    listaMotivoCancelacion: 'Listado de Motivo de Cancelacion',
    listaEstadosDocumento: 'Listado de Estado de Documento'
}

/*export const PERMISOS = {
    REVISION: 'permisosRevision',
    BANDEJADOC: 'bandejaDocumento',
    PERMISOPORDEFECTO: 'permisosPorDefectos',
    TAREAPENDIENTE:{
        APROSOLREVISION:'tareaaprobSoliRevision',
        ELABORREVISION:'tareaelaborRevision',
        CONSENREVISION:'tareaconsensoRevision',
        APROBREVISION: 'tareaaprobacionRevision',
        HomoRevision: 'tareahomoRevision'
    }
}*/

export const NOMBREPAGINA = {
    REVISION: 'REVISION',
    DOCUMENTO: 'DOCUMENTO',
    APROSOLICITUDREVISION:'APROSOLICITUDREVISION',
    ELABORACIONREVISION:'ELABORACIONREVISION',
    CONSENSOREVISION:'CONSENSOREVISION',
    APROBACIONREVISION: 'APROBACIONREVISION',
    HOMOLOGACIONREVISION: 'HOMOLOGACIONREVISION',
    SEGUIMIENTOREVISION:'SEGUIMIENTOREVISION'
}

export const ACCIONES = {
    NUEVO:'nuevo',
    EDITAR:'editar'
}

export const EstadosCancelacion = {
    REGISTRADO:'Registrado',
    REVISION:'En revision',
    APROBADO:'Aprobado',
    RECHAZADO:'Rechazado',
    EJECUTADO:'Ejecutado'
}

export const ESTADO ={
    EMITIDO: 203
}
export const ESTADO_REVISION ={
    EMITIDO: 141
}

export const ID_FASE ={
    ELABORACION:128,
    CONSENSO: 129,
    APROBACION:130,
    HOMOLOGACION:131
}