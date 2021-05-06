export enum Estado {
    ACTIVO = 'ACTIVO',
    INACTIVO = 'INACTIVO'
}

export class  EstadoDocumento {
    v_descons : string;
}

export class  RevisionDocumento {
    id : string;
    fecha: Date;
    fechaAprobacion: Date;
    fechaAprobacionDocumento: Date;
    fechaAprobacionAnterior: Date;
    numeroAnterior: number;
    numero: string;
}

