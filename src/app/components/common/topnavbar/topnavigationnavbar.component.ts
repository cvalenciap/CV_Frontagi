import { Component } from '@angular/core';
import {Router} from '@angular/router';
import { smoothlyMenu } from '../../../app.helpers';
import {AuthService} from '../../../auth/auth.service';
declare var jQuery:any;

@Component({
  selector: 'topnavigationnavbar',
  templateUrl: 'topnavigationnavbar.template.html'
})
export class TopNavigationNavbarComponent {

  constructor(private auth: AuthService) {}

  toggleNavigation(): void {
    jQuery("body").toggleClass("mini-navbar");
    smoothlyMenu();
  }

  OnLogout() {
    this.auth.logout();
  }

}
