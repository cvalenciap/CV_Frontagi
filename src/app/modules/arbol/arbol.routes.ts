import {ArbolPlantillaCoTreeFlatOverviewData } from './views/arbol-plantilla-component';
import {BandejaDocumentoEditarComponent} from '../bandejadocumento/views/editar.component';
export const ArbolRoutes = [
    // Module routes
    {path: '', component: ArbolPlantillaCoTreeFlatOverviewData },
    {path: 'detalleArbol/:id', component: BandejaDocumentoEditarComponent},
    
];
