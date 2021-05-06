import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {BootstrapRoutes} from './bootstrap.routes';

// views
import {BootstrapTypographyComponent} from './views/typography.component';
import {BootstrapButtonsComponent} from './views/buttons.component';
import {BootstrapIconsComponent} from './views/icons.component';

// modules/components


@NgModule({
  declarations: [
    BootstrapTypographyComponent,
    BootstrapButtonsComponent,
    BootstrapIconsComponent
  ],
  imports: [
    RouterModule.forRoot(BootstrapRoutes)
  ]
})
export class BootstrapModule { }
