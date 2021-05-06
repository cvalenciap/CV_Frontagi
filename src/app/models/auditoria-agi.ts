export class AuditoriaAGI {

  idUsuaCrea?: string;
  feUsuaCrea?: string;
  idTermCrea?: string;
  idUsuaModi?: string;
  feUsuaModi?: string;
  idTermModi?: string;
  nomPrg?: string;

  constructor() {
    this.idUsuaCrea = JSON.parse(sessionStorage.getItem('currentUser')).codUsuario;
    this.feUsuaCrea = null;
    this.idTermCrea = null;
    this.idUsuaModi = JSON.parse(sessionStorage.getItem('currentUser')).codUsuario;
    this.feUsuaModi = null;
    this.idTermModi = null;
    this.nomPrg = null;
  }

}
