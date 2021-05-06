import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Perfil } from '../../auth/user';
import { SessionService } from '../../auth/session.service';
import { Router } from '@angular/router';
import { AppSettings } from '../../app.settings';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'login',
  templateUrl: 'login.template.html',
  styleUrls: ['login.component.scss']
})
export class LoginComponent implements OnInit {

  id: string;
  name: string;
  copyright: string;
  version: string;
  username: string;
  indexsesi: number;
  password: string;
  perfil: number;
  perfiles: Perfil[];
  waiting: boolean;
  authenticated: boolean;
  error: string;

  constructor(private auth: AuthService,
    private session: SessionService,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService) {
    this.id = AppSettings.APP_ID;
    this.name = AppSettings.APP_NAME;
    this.copyright = AppSettings.APP_COPYRIGHT;
    this.version = AppSettings.APP_VERSION;
    this.perfiles = [];
    this.waiting = false;
    this.authenticated = false;
    this.indexsesi = 0;
    this.spinner.show();
    this.spinner.hide();
  }

  ngOnInit() {
    
    if (this.session.read('isLoggedIn')) {
      this.router.navigate(['/']);
    }

    if (this.session.expired) {
      this.indexsesi = 1;
      this.error = 'Su sesión ha expirado';
    } else if (this.auth.error) {
      this.error = this.auth.error;
    }

    this.auth.authenticated.subscribe((loginResult: number) => {
      switch (loginResult) {
        case 0:
          this.waiting = false;
          this.authenticated = false;
          if (this.indexsesi == 1) {
            this.error = 'Su sesión ha expirado';
          } else {
            this.error = this.auth.error || null;
          }
          break;
        case 1:
          this.waiting = false;
          this.authenticated = true;
          this.error = this.auth.error || null;
          if (!this.error) {
            this.perfiles = this.session.User.perfilesAsociados;
            this.perfil = this.perfiles[0].codPerfil;
          }
          break;
        case 2:
          this.router.navigate(['/inicial']);
          break;
      }
    }
    );
  }

  doLogin(form) {
    this.error = '';
    if (!form.valid) {
      if (!this.username) { this.error = 'Debe ingresar su nombre de usuario'; return; }
      if (!this.password) { this.error = 'Debe ingresar su contraseña'; return; }
    }
    this.waiting = true;
    if (this.authenticated) {
      this.auth.setProfile(this.username, this.perfil);
    } else {
      this.auth.login(this.username, this.password);
    }
  }

  doRecover() {
    this.auth.error = null;
    this.router.navigate(['/login/reset']);
  }
}
