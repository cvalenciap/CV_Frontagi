
export class User {
  codUsuario: string;
  codFicha: number;
  nombUsuario: string;
  descripcion: string;
  codPerfil: number;
  descPerfil: string;
  codArea: number;
  descArea: string;
  abrevArea: string;
  permisos: string[];
  perfilesAsociados: Perfil[];
}

export class Perfil {
  codPerfil: number;
  descripcion: string;
}
