import {JerarquiasListaComponent} from './views/lista.component';
import {JerarquiasEditarComponent} from './views/editar.component';
import { EditarJerarquiaComponent } from 'src/app/modules/jerarquia/views/editarjerarquia.component';
import { BandejaDocumentoFichaTecnicaComponent } from 'src/app/modules/bandejadocumento/views/registrarFichaTecnica.component';

export const JerarquiaRoutes = [
  // Module routes
  {path: '', component: JerarquiasListaComponent},
  {path: 'registrar', component: JerarquiasEditarComponent},
  {path: 'editar/:id/:v_descons', component: JerarquiasEditarComponent},
  //{path: 'registrar/registrar1', component: EditarJerarquiaComponent},
  //{path: 'editar/:id/registrar1', component: EditarJerarquiaComponent},
  {path: 'registrar/registrar1/:indicador/:jerarquia', component: BandejaDocumentoFichaTecnicaComponent},
  {path: 'editar/:id/registrar1/:indicador/:jerarquia', component: BandejaDocumentoFichaTecnicaComponent},
  //{path: 'editar/:id', component: EditarJerarquiaComponent}
  {path: 'editarFicha/:modulo', component: BandejaDocumentoFichaTecnicaComponent},
];


