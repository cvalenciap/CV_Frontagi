export type Estados = 'OK'|'ERROR';

class Error {
    codigo: string;
    mensaje: string;
    mensajeInterno: string;
}

export class Response {
    estado: Estados;
    paginacion: any;
    error?: Error;
    resultado?: any;
    parametros?: any;
    estadoRespuesta: string;
    mensajeRespuesta: any;
}

