import {Routes} from '@angular/router';

import {SpinkitDemoComponent} from './spinkit.component';

import {BlankLayoutComponent} from './../../components/common/layouts/blankLayout.component';
import {BasicLayoutComponent} from './../../components/common/layouts/basicLayout.component';

export const ROUTES:Routes = [

  // Module views
  {
    path: 'components', component: BasicLayoutComponent,
    children: [
      {path: 'spinkit', component: SpinkitDemoComponent }
    ]
  }
];
