import {Estado} from './enums/estado';
import {Tipo} from './tipo';

export class Arbol {
  tipo: Tipo;
  estado: Estado;
  m_idjerapadr: number;
  n_nivjera: number;
  v_rutjera: string;
  
  id: number;
	descripcion: String;
	nivel: number;
  ruta: string;
  idPadre: number;
  cantidadHijo: number;
  textoNodo: string;
  listaHijos: string[];
  idTipoDocu: number;

  constructor(){
    this.tipo = new Tipo();
    this.tipo.codigo = "";
    this.tipo.descripcion = "";
    this.estado = Estado.ACTIVO;

    this.m_idjerapadr = 0;
    this.n_nivjera = 0;
    this.v_rutjera = "";
    this.descripcion = "";
    this.nivel = 0;
    this.ruta = "";
    this.idPadre = 0;
    this.cantidadHijo = 0;
    this.textoNodo = "";
    this.listaHijos = [];
    this.id = 0;
    this.idTipoDocu = 0;
  }
}



