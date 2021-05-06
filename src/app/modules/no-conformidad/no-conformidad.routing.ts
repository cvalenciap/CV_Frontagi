import { BandejaNoConformidadComponent } from "./containers/bandeja-no-conformidad/bandeja-no-conformidad.component";
import { RegistroNoConformidadComponent } from "./containers/registro-no-conformidad/registro-no-conformidad.component";

export const NoConformidadRouting = [
  // Module routes
  { path: "", component: BandejaNoConformidadComponent },
  {
    path: "bandeja-no-conformidad",
    component: BandejaNoConformidadComponent
  },
  {
    path: "registrar",
    component: RegistroNoConformidadComponent
  },
  {
    path: "editar/:idNoConformidad",
    component: RegistroNoConformidadComponent
  }
];
