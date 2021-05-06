import { ProgramacionListaComponent } from "src/app/modules/bandejadocumento/programacion/programacion/lista.component";
import { ProgramacionEditarComponent } from "src/app/modules/bandejadocumento/programacion/programacion/editar.component";

export const ProgramacionesRoutes = [
  // Module routes
  {path: '', component: ProgramacionListaComponent},
  {path: 'registrar', component: ProgramacionEditarComponent},  
  {path: 'editar/:idProg/:idEstProg', component: ProgramacionEditarComponent},  
  /*{path: 'editar/registrarFichaTecnica', component: BandejaDocumentoFichaTecnicaComponent},
  {path: 'editar/registrar-documento', component: registrardocumentoEditarComponent}*/
];

