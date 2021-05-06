import {AuditoriaAGI} from '../../../../models/auditoria-agi';

export default class AgcUtil {

  public static validarCampoObjeto(value: any): boolean {
    return (value !== null && value !== undefined);
  }

  public static validarCampoTexto(value: string): boolean {
    if (value !== undefined && value !== null) {
      return value.trim() !== '';
    }
    return false;
  }

  public static camposAuditoria(): AuditoriaAGI {
    return new AuditoriaAGI();
  }

}
