import { ConsultaDocumentoComponent } from "src/app/modules/bandejadocumento/consultadocumento/views/consulta-documento.component";
import { registrardocumentoEditarComponent } from "src/app/modules/bandejadocumento/views/registrar-documento.component";
import { BandejaDocumentoEditarComponent } from "src/app/modules/bandejadocumento/views/editar.component";
import { BandejaDocumentoFichaTecnicaComponent } from "src/app/modules/bandejadocumento/views/registrarFichaTecnica.component";

export const ConsultasDocumentoGRoutes = [  
  {path: '', component: ConsultaDocumentoComponent},  
  {path: 'editar', component: BandejaDocumentoEditarComponent},
  //{path: 'editar/:codigo', component: BandejaDocumentoEditarComponent}//,
  {path: 'editar/registrarFichaTecnica/:indicador/:documento', component: BandejaDocumentoFichaTecnicaComponent},
    {path: 'editar/registrar-documento', component: registrardocumentoEditarComponent},
  
  //llamado desde la ventana consultar  
  {path: 'registrar-documento', component: registrardocumentoEditarComponent},
  {path: 'registrarFichaTecnica/:indicador/:documento', component: BandejaDocumentoFichaTecnicaComponent},
];
