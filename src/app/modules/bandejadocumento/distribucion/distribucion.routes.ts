import { DistribucionListaComponent } from "src/app/modules/bandejadocumento/distribucion/view/lista.component";

import { DistribucionComponent } from "src/app/modules/bandejadocumento/distribucion/view/distribucion.component";
import { EjecucionComponent } from "src/app/modules/bandejadocumento/distribucion/view/ejecucion.component";

export const DistribucionRoutes = [
  // Module routes
  {path: '', component: DistribucionListaComponent},
  {path: 'distribuir/:idProg', component: DistribucionComponent},
  {path: 'ejecucion/:idProg', component: EjecucionComponent}
 
];

