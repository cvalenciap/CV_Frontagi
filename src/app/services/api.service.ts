import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable()
export class ApiService {
  consultaCargoSig = '/auditoria';


  //Consulta Cargos SIG
  getConsultaCargoSig = environment.serviceEndpoint + this.consultaCargoSig + '/consultaCargoSig';
  getGuardaCargoSig = environment.serviceEndpoint + this.consultaCargoSig + '/guardaCargoSig';
  getGuardaModifCargoSig = environment.serviceEndpoint + this.consultaCargoSig + '/guardaModifCargoSig';
  getConsultaAreaParametro = environment.serviceEndpoint + '/areaAuditoria';
}
