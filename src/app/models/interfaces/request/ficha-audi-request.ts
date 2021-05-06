import { GenericParam } from '../generic-param';

export interface FichaAudiRequest {
  ficha?: number;
  nombre?: string;
  apePaterno?: string;
  apeMaterno?: string;
  rol?: GenericParam;
}
