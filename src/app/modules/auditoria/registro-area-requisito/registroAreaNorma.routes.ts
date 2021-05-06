import { ListaAreaRequisitoComponent } from "./views/listaAreaRequisito.component";
import { EditarAreaRequisitoComponent } from "./views/editarAreaRequisito.component";

export const RegistroAreaRequisitoRoutes = [
    {path: '', component: ListaAreaRequisitoComponent},
    {path: 'registrar', component: EditarAreaRequisitoComponent},
    {path: 'editar/:codigo', component: EditarAreaRequisitoComponent}
];