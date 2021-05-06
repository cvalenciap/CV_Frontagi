import { BandejaReprogramacionComponent } from "./views/bandeja-reprogramacion/bandeja-reprogramacion.component";
import { DetalleReprogramacionComponent } from "./views/detalle-reprogramacion/detalle-reprogramacion.component";

export const BandejaReprogramacionRoutes = [
    // Module routes
    {path: '', component: BandejaReprogramacionComponent},
    {path: 'editar/:idNoConformidad', component: DetalleReprogramacionComponent}
];