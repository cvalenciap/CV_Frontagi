import {Documento} from './documento';

export class DetalleDocumento {
  id: number;
  codigo: string;
  titulo: string;
  fecha: string;
  idHistorial: string;
  documento: Documento;
  descripcion: string;
  motivoRevision: string;
  fechaAprobacion: string;
  cantidadPlazo: number;
}
