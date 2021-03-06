import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { environment } from './../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { SessionService } from './session.service';

(window as any).global = window;

@Injectable({ providedIn: 'root' })
export class AuthService {

  private apiEndpoint: string;
  expiresAt: Date;
  authenticated: BehaviorSubject<0 | 1 | 2>; // 0=sin autenticar, 1=autentico usr/pwd, 2=selecciono perfil
  passwordRequested: BehaviorSubject<0 | 1 | 2>; // 0=solicitar password, 1=actualizar password, 2=password actualizado
  accessToken: string;
  userProfile: any;
  info: string;
  error: string;

  constructor(private http: HttpClient,
    private router: Router,
    private session: SessionService) {
    this.apiEndpoint = `${environment.serviceEndpointAuth}`;
    this.authenticated = new BehaviorSubject(null);
    this.passwordRequested = new BehaviorSubject(null);
  }

  login(username: string, password: string) {
    this.info = null;
    this.error = null;
    const loginParams = { username, password };
    this.http.post<any>(`${this.apiEndpoint}/login`, loginParams).subscribe(
      (response) => {
        
        if (response && response.resultado && response.resultado.token) {
          this.session.setSession(response.resultado);
          window.location.hash = '';
          if (response.resultado.perfiles && response.resultado.perfiles.length > 1) {
            this.authenticated.next(1);
          } else {
            this.authenticated.next(2);
          }
          //this.router.navigate(['/']);
          localStorage.setItem("codFichaLogueado", response.resultado.userProfile.codFicha);
          localStorage.setItem("codAreaLogueado", response.resultado.userProfile.codArea);
          sessionStorage.setItem('expiresIn', response.resultado.expiresIn);
        } else {
          this.error = 'El procedimiento de autenticaci??n no se realiz?? correctamente';
          this.authenticated.next(0);
        }
      },
      (errorResponse) => {
        if (!errorResponse && !errorResponse.status) {
          this.error = 'Ocurri?? un error al durante la conexi??n con el servicio de autenticaci??n';
        } else {
          switch (errorResponse.status) {
            case 400:
            case 401:
            case 403:
              this.error = errorResponse.error.error.mensaje;
              break;
            case 404:
              this.error = 'La configuraci??n del servicio de autenticaci??n no es correcta';
              break;
            case 500:
            default:
              this.error = 'Ocurri?? un error durante el proceso de autenticaci??n';
          }
          if (!environment.production) {
            console.error(`Auth Error:`, errorResponse.error);
          }
        }
        this.authenticated.next(0);
      });
  }

  setProfile(username: String, roleId: number) {

    this.info = null;
    this.error = null;
    const loginParams = { username, roleId };
    sessionStorage.setItem("roleID", String(roleId));
    this.http.post<any>(`${this.apiEndpoint}/login/profile`, loginParams).subscribe(
      (response) => {
        if (response && response.resultado) {
          this.session.setSessionPerfil(response.resultado);
          window.location.hash = '';
          this.authenticated.next(2);
        } else {
          this.error = 'Se presentaron problemas al establecer el perfil seleccionado';
          this.authenticated.next(0);
        }
      },
      (errorResponse) => {
        if (!errorResponse && !errorResponse.status) {
          this.error = 'Ocurri?? un error al durante la conexi??n con el servicio de autenticaci??n';
        } else {
          switch (errorResponse.status) {
            case 400:
            case 401:
            case 403:
              this.error = errorResponse.error.error.mensaje;
              break;
            case 404:
              this.error = 'La configuraci??n del servicio de autenticaci??n no es correcta';
              break;
            case 500:
            default:
              this.error = 'Ocurri?? un error durante el proceso de selecci??n de perfil';
          }
          if (!environment.production) {
            console.error(`Auth Error:`, errorResponse.error);
          }
        }
        this.authenticated.next(0);
      });
    sessionStorage.getItem("roleID");
  }

  logout() {
    /**/
    let token = sessionStorage.getItem("accessToken");
    let loginParam1s = { token };
    let num = 1;
    const loginParams = { token, num };
    /**/
    this.http.post<any>(`${this.apiEndpoint}/login/logout`, loginParams).subscribe(
      //this.http.post<any>(`${this.apiEndpoint}/logout`, loginParams).subscribe(
      (response) => {
        
        // clear session info
        this.session.deleteSession();
        this.error = null;
        this.authenticated.next(0);
        this.router.navigate(['/login']);
      },
      (errorResponse) => {
        if (!errorResponse && !errorResponse.status) {
          this.error = 'Ocurri?? un error al durante la cngonexi??n con el servicio de autenticaci??n';
        } else if (errorResponse.status !== 200) {
          switch (errorResponse.status) {
            case 404:
              this.error = 'La configuraci??n del servicio de autenticaci??n no es correcta';
              break;
            case 500:
            default:
              this.error = 'Ocurri?? un error durante el proceso de autenticaci??n';
          }
          console.error(`Auth Error: ${this.error}`);
        }
        // clear session info
        this.session.deleteSession();
        this.authenticated.next(0);
        this.router.navigate(['/login']);
      }
    );
  }

  requestPassword(username: string) {
    this.info = null;
    this.error = null;
    const requestParams = { username };
    this.http.post<any>(`${this.apiEndpoint}/login/password/request`, requestParams).subscribe(
      (response) => {
        if (response && response.resultado) {
          this.info = response.resultado;
          this.passwordRequested.next(1);
        } else {
          this.error = 'La solicitud no se realiz?? correctamente';
          this.passwordRequested.next(0);
        }
      },
      (errorResponse) => {
        if (!errorResponse && !errorResponse.status) {
          this.error = 'Ocurri?? un error al durante la conexi??n con el sistema de seguridad';
        } else {
          switch (errorResponse.status) {
            case 401:
            case 404:
              this.error = errorResponse.error.error.mensaje;
              break;
            case 500:
            default:
              this.error = 'Ocurri?? un error durante la solicitud';
          }
          if (!environment.production) {
            console.error(`Auth Error:`, errorResponse.error);
          }
        }
        this.passwordRequested.next(0);
      }
    );
  }

  resetPassword(username: string, oldPassword: string, newPassword: string, newPasswordCheck: string) {

    this.info = null;
    this.error = null;
    const requestParams = { username, oldPassword, newPassword, newPasswordCheck };
    this.http.post<any>(`${this.apiEndpoint}/login/password/reset`, requestParams).subscribe(
      (response) => {
        if (response && response.resultado) {
          this.info = response.resultado;
          this.passwordRequested.next(2);
        } else {
          this.error = 'La solicitud no se realiz?? correctamente';
          this.passwordRequested.next(1);
        }
      },
      (errorResponse) => {
        if (!errorResponse && !errorResponse.status) {
          this.error = 'Ocurri?? un error al durante la conexi??n con el sistema de seguridad';
        } else {
          switch (errorResponse.status) {
            case 401:
            case 404:
              this.error = errorResponse.error.error.mensaje;
              break;
            case 500:
            default:
              this.error = 'Ocurri?? un error durante la solicitud';
          }
          if (!environment.production) {
            console.error(`Auth Error:`, errorResponse.error);
          }
        }
        this.passwordRequested.next(1);
      }
    );
  }
}
