import {BandejaDocumentosComponent} from './views/lista.component';
import {BandejaDocumentoEditarComponent} from './views/editar.component';
import {BandejaDocumentoFichaTecnicaComponent} from './views/registrarFichaTecnica.component';
import {registrardocumentoEditarComponent} from './views/registrar-documento.component';
import { NOMBREPAGINA, ACCIONES } from 'src/app/constants/general/general.constants';
import { BandejaEditarTrasladoComponent } from 'src/app/modules/bandejadocumento/views/editarTraslado.component';
import { registrardocumentoTrasladoComponent } from 'src/app/modules/bandejadocumento/views/registrar-documento-traslado.component';

export const BandejaDocumentosRoutes = [
  // Module routes   
  {path: '', component: BandejaDocumentosComponent},
  {path: 'editar', component: BandejaDocumentoEditarComponent},
  //{path: 'editar/:codigo', component: BandejaDocumentoEditarComponent},
  // YPM - INICIO
  // {path: 'editar/registrarFichaTecnica/:indicador/:documento', component: BandejaDocumentoFichaTecnicaComponent},
  {path: 'consultarFicha/:modulo', component: BandejaDocumentoFichaTecnicaComponent},
  // YPM - FIN
  {path: 'editar/registrar-documento', component: registrardocumentoEditarComponent,data:{nArchivo:NOMBREPAGINA.DOCUMENTO}},
  //{path: 'editar/editar-documento', component: registrardocumentoEditarComponent,data:{nArchivo:NOMBREPAGINA.DOCUMENTO,accion:ACCIONES.EDITAR}},
  {path: 'editar/editar-documento-traslado/:codigo', component: registrardocumentoTrasladoComponent,data:{nArchivo:NOMBREPAGINA.DOCUMENTO,accion:ACCIONES.EDITAR}},
  
  {path: 'editarTraslado', component: BandejaEditarTrasladoComponent},


];

