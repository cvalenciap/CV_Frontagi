import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
import { User } from './user';
import { ACLConstants, RutaConstantes } from './constants';
import * as data from './validacionrutas.json';
//import { StarterService } from '../services/impl/starter.service';
(window as any).global = window;

@Injectable({ providedIn: 'root' })
export class SessionService {

  private expiresAt: number;
  private authenticated: boolean;
  accessToken: string;
  private userProfile: User;
  private permissions: string[];
  private _expired: boolean;
  private aclConstants = ACLConstants;
  private rutaConstants = RutaConstantes;

  constructor() {
    //if ((this.accessToken === null || this.accessToken === undefined)  && sessionStorage.getItem('accessToken')) {
    this.expiresAt = Number(sessionStorage.getItem('expiresIn')) * 60000 + Date.now();
    
    //this.expiresAt = Number(sessionStorage.getItem('expiresIn')) * 50 + Date.now();
    this.accessToken = sessionStorage.getItem('accessToken');
    this.userProfile = JSON.parse(sessionStorage.getItem('currentUser'));
    this.permissions = null;
    //this.authenticated = true;
  }

  setSession(authResult) {    
    // Save authentication data and update login status subject
    this.expiresAt = authResult.expiresIn * 60000 + Date.now();
    this.accessToken = authResult.token;
    this.userProfile = authResult.userProfile;
    this.authenticated = true;
   // sessionStorage.setItem('expiresIn', authResult.expiresIn);
   // sessionStorage.setItem('expiresIn', "10s");//////////////
    sessionStorage.setItem('accessToken', authResult.token);
    sessionStorage.setItem('currentUser', JSON.stringify(authResult.userProfile));
  }

  setSessionPerfil(authResult) {    
    
    this.userProfile.permisos = authResult.permisos;
    this.authenticated = true;
  }


//cguerra
validateExpiration(): void {
  const dateStart: Date = new Date();;
  const dateEnd: Date = new Date(this.expiresAt);
  const dateDiff = dateStart.getTime() - dateEnd.getTime();
  const elapsedMinutes: number = Math.round(dateDiff / (1000 * 60));
  if (elapsedMinutes > Number(sessionStorage.getItem('expiresIn')) || elapsedMinutes === NaN) {
    this.expireSession();
    location.reload();
  } else {
    this._expired = false;
  }
}

//cguerra


  updateExpiration() {
    // Update session expiration date
    this.expiresAt = Number(sessionStorage.getItem('expiresIn')) + Date.now();

  }

  expireSession() {
    this.deleteSession();
    this._expired = true;
  }

  deleteSession() {
    // remove user from local storage to log user out
    this.authenticated = false;
    this.accessToken = null;
    this.userProfile = null;
    this.expiresAt = null;
    this.permissions = null;
    sessionStorage.removeItem('expiresIn');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('currentUser');
    sessionStorage.clear();
    //this.starterService.reset();
  }

  public getAuthorities(): string[] {
    this.permissions = [];
    if (sessionStorage.getItem('accessToken')) {
      this.permissions = this.userProfile.permisos;
      this.permissions.push('/inicio');
      if (this.permissions.includes('/bandeja-entrada')) {
        this.permissions.push('/bandeja-entrada/recibidos');
        this.permissions.push('/bandeja-entrada/con-plazo');
      }
    }
    return this.permissions;
  }

  public validatePermission(permission: string): boolean {
    // Validar si usuario posee un permiso
    if (permission[0] !== '/') { permission = `/${permission}`; }
    const urls = this.getAuthorities();
    let valida: boolean = urls.includes(permission);
    return valida;
  }


  get User() {
    // Return user profile
    return this.userProfile;
  }

  get isLoggedIn(): boolean {

    // Check if current date is before expired
    // expiration and user is signed in locally
    return (Date.now() < this.expiresAt) && this.authenticated;

  }

  get expired(): boolean {
    return this._expired;

  }

  get ACL() {
    return this.aclConstants;
  }

  get Ruta() {
    return this.rutaConstants;
  }

  public getRouteSecurity(value: string): string {
    let routeList: any[] = (<any>data).listaRutas;
    let routeSecurity: string = "";
    let find: boolean = false;
    for (let route of routeList) {
      if (route.rutaSistema == value) {
        find = true;
        routeSecurity = route.rutaSeguridad;
        break;
      }
    }
    if (find) {
      return routeSecurity;
    } else {
      return null;
    }

  }

  public read(key: string) {
    const value = sessionStorage.getItem(key);
    try {
      const obj = JSON.parse(value);
      return obj;
    } catch (e) {
      return value;
    }
  }

  public getRutas(): any[] {
    let routeList: any[] = (<any>data).listaRutas;
    return routeList;
  }
}
