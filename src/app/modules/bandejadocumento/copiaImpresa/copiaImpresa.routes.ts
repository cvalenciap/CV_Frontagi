import { BandejaSolicitudCopiasImpresasComponent } from 'src/app/modules/bandejadocumento/copiaImpresa/copiaImpresa-solicitud/copiaImpresa.component';
import { CopiaImpresionComponent } from 'src/app/modules/bandejadocumento/copiaImpresa/copiaImpresa-Listado/copiaimpresion.component';

export const CopiaImpresaRoutes = [
  // Module routes
  {path: '', component: CopiaImpresionComponent},
  {path: 'detalle', component: BandejaSolicitudCopiasImpresasComponent},
  {path: 'detalle/:codigo', component: BandejaSolicitudCopiasImpresasComponent}  
];

