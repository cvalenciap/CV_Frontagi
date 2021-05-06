import {Routes} from "@angular/router";

import {Dashboard1Component} from "./views/dashboards/dashboard1.component";
import {Dashboard2Component} from "./views/dashboards/dashboard2.component";
import {Dashboard3Component} from "./views/dashboards/dashboard3.component";
import {Dashboard4Component} from "./views/dashboards/dashboard4.component";
import {Dashboard41Component} from "./views/dashboards/dashboard41.component";
import {Dashboard5Component} from "./views/dashboards/dashboard5.component";

import {StarterViewComponent} from "./views/appviews/starterview.component";
import {LoginComponent} from "./views/appviews/login.component";
import {ResetComponent} from "./views/appviews/reset.component";
import {OutlookViewComponent} from './views/appviews/outlook.component';
import {BootstrapRoutes} from "./modules/bootstrap/bootstrap.routes";

import {BlankLayoutComponent} from "./components/common/layouts/blankLayout.component";
import {BasicLayoutComponent} from "./components/common/layouts/basicLayout.component";
//import {TopNavigationLayoutComponent} from "./components/common/layouts/topNavigationlayout.component";

//AGI
import {AulasRoutes} from './modules/aula/aulas.routes';
import {CursosRoutes} from './modules/curso/curso.routes';
import {InstructoresRoutes} from './modules/instructor/instructores.routes';
import {RutaResponsablesRoutes} from './modules/rutaresponsable/rutaresponsables.routes';
import {ParametrosRoutes} from './modules/parametro/parametros.routes';
import {JerarquiaRoutes} from './modules/jerarquia/jerarquias.routes';
import {BandejaDocumentosRoutes} from './modules/bandejadocumento/bandejadocumentos.routes';
import { PreguntaCursoRoutes } from './modules/capacitacion/pregunta-curso/preguntaCurso.routes';

//Bandeja Documento - Copia Impresa
import {CopiaImpresaRoutes} from './modules/bandejadocumento/copiaimpresa/copiaimpresa.routes';
//Bandeja Documento - Consultas
import { ConsultasRoutes } from "././modules/bandejadocumento/consulta/consultas.routes";
//Bandeja Documento - Programacion
import { ProgramacionesRoutes } from "././modules/bandejadocumento/programacion/programaciones.routes";
import { DistribucionRoutes } from "src/app/modules/bandejadocumento/distribucion/distribucion.routes";

//arbol
import {ArbolRoutes} from './modules/arbol/arbol.routes';
//Tabs
import {TabsRoutes} from './modules/tabs/tabs.routes';
//Auditoria
import { ProgramacionRoutes } from "./modules/auditoria/programacion/programacion.routes";
import { PlanAuditoriaRoutes } from "./modules/auditoria/planauditoria/planauditoria.routes";
import { RegistroAuditorRoutes } from "./modules/auditoria/registroAuditor/registroAuditor.routes";
//import { PruebaRoutes } from "./modules/prueba-select/prueba.routes";
import { ListaVerificacionRoutes } from "./modules/auditoria/listaverificacion/listaverificacion.routes";
import { RegistroCargosRoutes } from "./modules/auditoria/cargos-sig/registroCargoAuditoria.routes";
import { EvaluacionEditorRoutes } from "./modules/auditoria/revisionAuditoria/revisionAuditoria.routes";
import { NormaIncidenciaRoutes } from "./modules/auditoria/norma-incidencia/norma-incidencia.routes";
import { DeteccionHallazgosRoutes } from "./modules/auditoria/deteccion-hallazgos/deteccion-hallazgos.routes";

import { FichaAuditorRoutes } from "./modules/auditoria/ficha-auditor/lista-ficha.routes";
import { BandejaRevisionAuditoriaRoutes } from "./modules/auditoria/bandeja-revision-auditoria/bandeja-revision-auditoria.routes";
import { EncuestaRoutes } from "src/app/modules/encuesta/encuesta.routes";
import { RegistroHallazgoRoutes } from "./modules/auditoria/registro-hallazgos/registrohallazgos.routes";
import { BandejaRevisionInformeRoutes } from "./modules/auditoria/bandeja-revision-informe/bandeja-revision-informe.routes";
import { AgrupacionHallazgosRoutes } from "./modules/auditoria/agrupacion-hallazgos/agrupacion-hallazgos.routes";
import { BancosPreguntasRoutes } from "./modules/auditoria/bandeja-banco-preguntas/bancoPreguntas.routes";
import { RevisionDocumentosRoutes } from "src/app/modules/revisiondocumento/revisiondocumentos.routes";
import { TareaPendienteRoutes } from "src/app/modules/tareapendiente/tareapendiente.routes";
import { from } from "rxjs/internal/observable/from";
import { StarterAuditoriaComponent } from "src/app/views/appviews/starter-auditoria.component";
import { StarterMantenimientoComponent } from "src/app/views/appviews/starter-mantenimiento.component";
import { StarterCapacitacionComponent } from "src/app/views/appviews/starter-capacitacion.component";
import { StarterNoConformidadComponent } from "src/app/views/appviews/starter-noconformidad.component";
import { InicialComponent } from "src/app/components/common/layouts/inicial.component";
import { ConsultasDocumentoGRoutes } from "src/app/modules/bandejadocumento/consultadocumento/consultas-documento.routes";
//import { TreeRoutes}from "./modules/auditoria/tree-norma-incidencia/tree-incidencia.routes";

// No Conformidad
// import { NoConformidadRoutes } from "./modules/noconformidad/bandeja-no-conformidad/bandeja-no-conformidad.routes";
import { NoConformidadRouting } from "./modules/no-conformidad/no-conformidad.routing";
// import { BandejaReprogramacionRoutes } from "./modules/noconformidad/bandeja-reprogramacion-plan-accion/bandeja-reprogramacion.routes";

//Capacitaciones
import { BandejaAsistenciaRoutes } from "./modules/capacitacion/bandeja-asistencia/bandeja-asistencia.routes";
import { BandejaEvaluacionesRoutes } from "./modules/capacitacion/bandeja-evaluaciones/bandeja-evaluaciones.routes";
import { ProgramarCapacitacionRoutes } from "./modules/capacitacion/programar-capacitacion/programar-capacitacion.routes";
import { BandejaExamenesRoutes } from "./modules/capacitacion/bandeja-examenes/bandeja-examenes.routes";
import { RevisionDocumentosRoutes1 } from "src/app/modules/alcmigracion/alcmigracion.routes";
import { TabsRoutes1 } from "src/app/modules/tabsmigracion/tabsmigracion.routes";
import { SolicitudCancelacionComponent } from "src/app/modules/tareapendiente/views/tarea-cancelacion/solicitud-cancelacion/solicitudcancelacion.component";

//Mantenimiento - Inf. Documentada
import { BandejaRelacionCoordinadorRoutes } from "./modules/relacioncoordinador/relacion-coodinador.routes";
//AGI
/*  Migración  */
import { AuthGuard} from "src/app/auth/auth.guard";
import { HistoricoComponent } from "src/app/modules/alcmigracion/components/historico.component";
import { EjecucionRoutes } from "./modules/bandejadocumento/ejecuciones/ejecucion.routes";
import { RegistroAreaNormaRoutes } from "./modules/auditoria/registro-area-norma/registroAreaNorma.routes";
import { RegistroAreaRequisitoRoutes } from "./modules/auditoria/registro-area-requisito/registroAreaNorma.routes";
import { RegistroAreaAuditoriaRoutes } from "./modules/auditoria/registro-area/registroAreaAuditoria.routes";
import { BandejaSeguimientoProgramaRoutes } from "./modules/auditoria/seguimiento-programa/bandeja-seguimiento-programa.routes";
import { BandejaSeguimientoPlanAuditoriaRoutes } from "./modules/auditoria/seguimiento-plan-auditoria/bandeja-seguimiento-plan-auditoria.routes";

/*  Migración  */

export const ROUTES:Routes = [
  // Main redirect
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {
    path: 'inicial', component: InicialComponent },
  { path: 'login', component: LoginComponent },
  { path: 'login/reset', component: ResetComponent },

  // App views
  {
    path: 'dashboards', component: BasicLayoutComponent,
    children: [
      {path: 'dashboard1', component: Dashboard1Component},
      {path: 'dashboard2', component: Dashboard2Component},
      {path: 'dashboard3', component: Dashboard3Component},
      {path: 'dashboard4', component: Dashboard4Component},
      {path: 'dashboard5', component: Dashboard5Component}
    ]
  },
  //AGI

  /* Migración*/

  {
    path: 'documento', component: BasicLayoutComponent,
    children: [
       {path: 'historico', component: BlankLayoutComponent,  children: RevisionDocumentosRoutes1},
        {path: 'migracion', component: BlankLayoutComponent, children: RevisionDocumentosRoutes1
      }
    ]
  },
  /* Migración*/

  //Mantenimiento - Inf. Documentada
  {
    path: 'documento', component: BasicLayoutComponent,
    children: [
      {
        path: 'relacioncoordinador', component: BlankLayoutComponent,
        children: BandejaRelacionCoordinadorRoutes

      }
    ]
  },

   //PREGUNTAS CURSO
/*    {
    path: 'mantenimiento', component: BasicLayoutComponent,
    children: [
      {
        path: 'preguntasCurso', component: BlankLayoutComponent,
        children: PreguntaCursoRoutes
      },
    ]
  },  */

  //AULAS
/*   {
    path: 'mantenimiento', component: BasicLayoutComponent,
    children: [
      {
        path: 'aulas', component: BlankLayoutComponent,
        children: AulasRoutes
      },
    ]
  }, */
  //CURSOS
/*   {
    path: 'mantenimiento', component: BasicLayoutComponent,
    children: [
      {
        path: 'cursos', component: BlankLayoutComponent,
        children: CursosRoutes
      },
    ]
  }, */
  //ENCUESTA
/*   {
    path: 'mantenimiento', component: BasicLayoutComponent,
    children: [
      {
        path: 'encuesta', component: BlankLayoutComponent,
        children: EncuestaRoutes
      },
    ]
  }, */
  //INSTRUCTOR
/*   {
    path: 'mantenimiento', component: BasicLayoutComponent,
    children: [
      {
        path: 'instructores', component: BlankLayoutComponent,
        children: InstructoresRoutes
      },

    ]
  }, */
  //Ruta y Responsable
/*   {
    path: 'mantenimiento', component: BasicLayoutComponent,
    children: [
      {
        path: 'rutaresponsables', component: BlankLayoutComponent,
        children: RutaResponsablesRoutes
      },

    ]
  }, */
  //Parametros Generales
/*   {
    path: 'mantenimiento', component: BasicLayoutComponent,
    children: [
      {
        path: 'parametros', component: BlankLayoutComponent,
        children: ParametrosRoutes
      },

    ]
  }, */
//Jerarquia
/*   {
    path: 'mantenimiento', component: BasicLayoutComponent,
    children: [
      {
        path: 'jerarquias', component: BlankLayoutComponent,
        children: JerarquiaRoutes
      },
    ]
  },  */

   //consulta-documento
   /*
   {
    path: 'documento', component: BasicLayoutComponent,
    children: [
      {
        path: 'revisardocumentos', component: BlankLayoutComponent,
        children: ConsultasDocumentoGRoutes
      }
    ]
  },
  */
 {
  path: 'mantenimiento', component: BasicLayoutComponent,
  children: [
    {
      path: 'aulas', component: BlankLayoutComponent,
      children: AulasRoutes
    },
    {
      path: 'cursos', component: BlankLayoutComponent,
      children: CursosRoutes
    },
    {
      path: 'preguntasCurso', component: BlankLayoutComponent,
      children: PreguntaCursoRoutes
    },
    {
      path: 'encuesta', component: BlankLayoutComponent,
      children: EncuestaRoutes
    },
    {
      path: 'instructores', component: BlankLayoutComponent,
      children: InstructoresRoutes
    },
    {
      path: 'parametros', component: BlankLayoutComponent,
      children: ParametrosRoutes
    }

  ]
},
  //Bandeja de Documento
  {
    path: 'documento', component: BasicLayoutComponent,
    children: [
      {
        path: 'copiaimpresa', component: BlankLayoutComponent,
        children: CopiaImpresaRoutes
      },
      {
        path: 'consultas', component: BlankLayoutComponent,
        children: ConsultasRoutes
      },
      {
        path: 'programacion', component: BlankLayoutComponent,
        //children: ProgramacionesRoutes
        children:[
          {
            path: 'programacion', component: BlankLayoutComponent,
            children: ProgramacionesRoutes
          },
          {
            path: 'distribucion', component: BlankLayoutComponent,
            children: DistribucionRoutes
          },
          {
            path: 'ejecucion', component: BlankLayoutComponent,
            children: EjecucionRoutes
          }
        ]
      },
/*       {
        path: 'distribucion', component: BlankLayoutComponent,
        children: DistribucionRoutes
      },
      {
        path: 'ejecucion', component: BlankLayoutComponent,
        children: EjecucionRoutes
      }, */
      {
        path: 'arbol', component: BlankLayoutComponent,
        children: ArbolRoutes
      },
      {
        path: 'solicitudes', component: BlankLayoutComponent,
        children:[
          {
            path: 'revisiondocumento', component: BlankLayoutComponent,
            children: RevisionDocumentosRoutes
          },
          {
            path: 'copiaimpresa', component: BlankLayoutComponent,
              children: CopiaImpresaRoutes
          },
          {
            path: 'cancelaciones', component: BlankLayoutComponent,
            children: [
              {path: 'SolicitudCancel', component: SolicitudCancelacionComponent},
            ]
          }
        ]
      },
      {
        path: 'tareapendiente', component: BlankLayoutComponent,
      children: TareaPendienteRoutes
      },
      {
        path: 'jerarquias', component: BlankLayoutComponent,
        children: JerarquiaRoutes
      },
      {
        path: 'general', component: BlankLayoutComponent,
        children:[
          {
            path: 'revisardocumentos', component: BlankLayoutComponent,
            children: ConsultasDocumentoGRoutes
          },
          {
            path: 'bandejadocumento', component: BlankLayoutComponent,
            children: BandejaDocumentosRoutes
          }
        ]
      }
    ]
  },
  //Arbol
  /*
  {
    path: 'documento', component: BasicLayoutComponent,
    children: [
      {
        path: 'arbol', component: BlankLayoutComponent,
        children: ArbolRoutes
      },

    ]
  },
  */
  //Revisiones de Documento - lgomez
  /*
  {
    path: 'documento', component: BasicLayoutComponent,
    children: [
      {
        path: 'revisiondocumento', component: BlankLayoutComponent,
        children: RevisionDocumentosRoutes
      }
    ]
  },
*/
/*
  { path: 'documento', component: BasicLayoutComponent,
  children: [
    {
    path: 'tareapendiente', component: BlankLayoutComponent,
  children: TareaPendienteRoutes
}
]},
*/
  //Auditoria
  {
    path: 'auditoria', component: BasicLayoutComponent,
    children: [
      {
        path: 'programacion', component: BlankLayoutComponent,
        children: ProgramacionRoutes
      },
      {
        path: 'plan-auditoria', component: BlankLayoutComponent,
        children: PlanAuditoriaRoutes
      },
      {
        path: 'lista-verificacion', component: BlankLayoutComponent,
        children: ListaVerificacionRoutes
      },
      {
        path: 'registro-auditor', component: BlankLayoutComponent,
        children: RegistroAuditorRoutes
      },

      //cguerra
      {
        path: 'registro-cargo-auditoria', component: BlankLayoutComponent,
        children: RegistroCargosRoutes
      },
      //cguerra
      {
      path: 'registro-area-norma', component: BlankLayoutComponent,
      children: RegistroAreaNormaRoutes
      },
      {
      path: 'registro-area-auditoria', component: BlankLayoutComponent,
      children: RegistroAreaAuditoriaRoutes
      },
      {
        path: 'registro-area-requisito', component: BlankLayoutComponent,
        children: RegistroAreaRequisitoRoutes
      },
     {
        path: 'evaluacion-editor', component: BlankLayoutComponent,
        children: EvaluacionEditorRoutes
      }
      ,
     {
        path: 'norma-incidencia', component: BlankLayoutComponent,
        children: NormaIncidenciaRoutes
      }
      ,
     {
        path: 'deteccion-hallazgos', component: BlankLayoutComponent,
        children: DeteccionHallazgosRoutes
      }
      ,
      {
         path: 'ficha-auditor', component: BlankLayoutComponent,
         children: FichaAuditorRoutes
       }

       ,
      {
         path: 'bandeja-revision-auditoria', component: BlankLayoutComponent,
         children: BandejaRevisionAuditoriaRoutes
       },

       {
         path: 'revision-hallazgos', component: BlankLayoutComponent,
         children: RegistroHallazgoRoutes
       },
       {
         path: 'agrupacion-hallazgos', component: BlankLayoutComponent,
         children: AgrupacionHallazgosRoutes
       },
       {
          path: 'bandeja-revision-informe', component: BlankLayoutComponent,
          children: BandejaRevisionInformeRoutes
        } ,
        {
           path: 'banco-preguntas', component: BlankLayoutComponent,
           children: BancosPreguntasRoutes
         }
    ],
  },

 {
    path:'consultaAuditoria', component: BasicLayoutComponent,
    children: [
      {
        path: 'seguimiento-programacion', component: BlankLayoutComponent,
        children: BandejaSeguimientoProgramaRoutes
      },
      {
        path: 'seguimiento-plan-auditoria', component: BlankLayoutComponent,
        children: BandejaSeguimientoPlanAuditoriaRoutes
      }
    ]
  },

   /*{
    path:'prueba', component: BasicLayoutComponent,
    children: [
      {
        path: 'ejemplo/arbol', component:BlankLayoutComponent,
        children: PruebaRoutes
      }
    ]
  },*/
  //Tabs
   {
    path: 'documento', component: BasicLayoutComponent,
    children: [
      {
        path: 'tabs', component: BlankLayoutComponent,
        children: TabsRoutes
      },
    ]
  },
  //tabsmigracion
  {
    path: 'documento', component: BasicLayoutComponent,
    children: [
      {
        path: 'tabsmigracion', component: BlankLayoutComponent,
        children: TabsRoutes1
      },
    ]
  },

  //Consulta
  {
    path: 'consulta', component: BasicLayoutComponent,
    children: [

      {
        path: 'descarga', component: BlankLayoutComponent,
        children: ConsultasRoutes
      }

    ]
  },
//Copia
/*
  {
    path: 'copia', component: BasicLayoutComponent,
    children: [
      {
        path: 'copiaimpresa', component: BlankLayoutComponent,
        children: CopiaImpresaRoutes
      }
    ]
  },
 */
  //AGI
  /*{
    path: 'dashboards', component: TopNavigationLayoutComponent,
    children: [
      {path: 'dashboard41', component: Dashboard41Component}
    ]
  },*/
  {
    path: '', component: BasicLayoutComponent,
    children: [
      {path: 'starterview', component: StarterViewComponent},
      {path: 'outlook', component: OutlookViewComponent},
      {path: 'start-auditoria', component: StarterAuditoriaComponent},
      {path: 'start-mantenimiento', component: StarterMantenimientoComponent},
      {path: 'start-capacitacion', component: StarterCapacitacionComponent},
      {path: 'start-noconformidad', component: StarterNoConformidadComponent}


    ]
  },

  {
    path: 'bootstrap', component: BasicLayoutComponent,
    children: BootstrapRoutes
  },
  /*
  {
    path: '', component: BlankLayoutComponent,
    children: [


    ]
  },*/

  // YPM - Inicio
  // No Conformidad
  {
    path: 'no-conformidad', component: BasicLayoutComponent,
    children: [
        {
            path: 'bandejanoconformidad', component: BlankLayoutComponent,
            children: NoConformidadRouting
        }/*,
        {
            path: 'bandejareprogramacion', component: BlankLayoutComponent,
            children: BandejaReprogramacionRoutes
        }*/
    ]
  },
  // YPM - Fin

  //Capacitación
  {
    path: 'capacitacion', component: BasicLayoutComponent,
    children: [
        {
            path: 'bandejaasistencia', component: BlankLayoutComponent,
            children: BandejaAsistenciaRoutes
        },
        {
            path: 'bandejaevaluaciones', component: BlankLayoutComponent,
            children: BandejaEvaluacionesRoutes
        },
        {
            path: 'programarcapacitacion', component: BlankLayoutComponent,
            children: ProgramarCapacitacionRoutes
        },
        {
            path: 'bandejaexamenes', component: BlankLayoutComponent,
            children: BandejaExamenesRoutes
        }
    ]
  },

 // Handle all other routes
 {path: '**',  redirectTo: 'inicial'}

];
