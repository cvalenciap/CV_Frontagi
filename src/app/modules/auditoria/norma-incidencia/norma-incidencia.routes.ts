
import { ListaNormasIncidenciasComponent } from './lista-normas-incidencias/lista-normas-incidencias.component';
import { RegistrarNormaIncidenciaComponent } from './registrar-norma-incidencia/registrar-norma-incidencia.component';
import { EditarNormaComponent } from './editar-norma/editar-norma.component';


export const NormaIncidenciaRoutes = [
    // Module routes
    { path: '', component: ListaNormasIncidenciasComponent },
    { path: 'nuevo', component: RegistrarNormaIncidenciaComponent },
    { path: 'editar/:id', component: RegistrarNormaIncidenciaComponent }



];    