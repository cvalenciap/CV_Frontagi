import {IsNotEmpty} from 'class-validator/decorator/decorators';

export class AdjuntoMensaje {

  //@IsNotEmpty({message: 'Para solicitar acceso al aplicativo OPEN SGC debe adjuntar un MEMO al EGCM.'})
  nombreAdjunto: String;

  idAdjunto: number;
  nombreRealAdjunto: String;
  extensionAdjunto: string;
  urlAdjunto: string;
  sizeAdjunto: number;
  bytesArray: any[];
  n_estado: number;
  a_v_usucre: String;
  a_v_usumod: String;
  

  constructor() {
      this.nombreRealAdjunto = '';
      this.nombreAdjunto = '';
      this.urlAdjunto = '';
  }
}
