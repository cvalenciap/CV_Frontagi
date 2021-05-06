
import { DeteccionHallazgosComponent } from "./lista-detecciones/deteccion-hallazgos.component";
//import { RegistrarDeteccionHallazgosComponent} from "./registrar-deteccion-hallazgos/registrar-deteccion-hallazgos.component";
import { DetalleDeteccionesComponent } from "./registrar-deteccion-hallazgos/detalle-detecciones/detalle-detecciones.component";
import { RegistrarDeteccionComponent } from "./registrar-deteccion-hallazgos/registrar-deteccion/registrar-deteccion.component";
import { RegistrarDeteccionFueraComponent } from "./registrar-deteccion-hallazgos/registrar-deteccion-fuera/registrar-deteccion-fuera.component";


export const DeteccionHallazgosRoutes = [
    // Module routes
    {path: '', component: DeteccionHallazgosComponent},
    {path:'nuevo',component: RegistrarDeteccionComponent},
    {path:'nuevoFuera',component: RegistrarDeteccionFueraComponent},

    {path:'editar/:codigo',component: RegistrarDeteccionComponent},
    {path:'editarFuera/:codigo',component: RegistrarDeteccionFueraComponent}


];    