import { Component, OnDestroy, OnInit, } from '@angular/core';
import { Router } from '@angular/router';
import { EventEmitter,Output } from '@angular/core';
import { AppSettings } from 'src/app/app.settings';
import { SessionService } from 'src/app/auth/session.service';

declare var jQuery:any;

@Component({
  selector: 'component-inicial',
  templateUrl: 'inicial.template.html',
  styleUrls: ['inicial.component.scss']
})

export class InicialComponent implements OnDestroy, OnInit  {
  @Output() emitEvent:EventEmitter<string> = new EventEmitter<string>();  
  public nav:any;
  idModulo:string;
  nombre:string;
  nombreUsuario:string;
  encontroUrl: string;
  NoencontroUrl:string;
  encontroAuditoriaUrl:string;
  NoencontroAuditoriaUrl:string;
  encontroNoConformidadUrl: string;
  NoencontroNoconformidadUrl:string;
  encontroCapacitaciondUrl: string;
  NoencontroCapacitaciondUrl:string;
  encontroMantenimientoUrl:string;
  NoencontroMantenimientoUrl:string;

  public constructor(private router: Router, public session: SessionService) {
   // this.nav = document.querySelector('nav.navbar');
    this.nombre = AppSettings.APP_NAME;
    let user = JSON.parse(sessionStorage.getItem("currentUser"));
    this.nombreUsuario = user.nombUsuario;
    localStorage.removeItem("idDocumento");
  }

  public ngOnInit():any {
    //this.nav.className += " white-bg";
  }

  public ngOnDestroy():any {
    //this.nav.classList.remove("white-bg");
  }

  OnNavegation(){
    this.router.navigate([`starterview`]);
  }
  
  OnID(numero){ 
    this.idModulo = numero;    
    localStorage.setItem("idModulo",numero);
//cguerra
/*informacion Documental*/

for (let i = 0; i < this.session.User.permisos.length; i++) {      
  if( this.session.User.permisos[i]==this.session.ACL.ID_GENERAR_PROTOCOLO){
    this.encontroUrl="encontro";          
  }else{
    this.NoencontroUrl="noencontro";
  }  
}
if(this.encontroUrl=="encontro"){
  if(numero == 1){      
    this.router.navigate([`starterview`])
  }
}
/*auditoria*/
for (let i = 0; i < this.session.User.permisos.length; i++) {      
  if( this.session.User.permisos[i]==this.session.ACL.IDAuditoria_GENERAR_PROTOCOLO){
    this.encontroAuditoriaUrl="encontroAuditoria";          
  }else{
    this.NoencontroAuditoriaUrl="noencontroAuditoria";
  }  
}
if(this.encontroAuditoriaUrl=="encontroAuditoria"){
  if(numero == 2){
    this.router.navigate([`start-auditoria`]);
  }
}
/*No Conformidad */
for (let i = 0; i < this.session.User.permisos.length; i++) {      
  if( this.session.User.permisos[i]==this.session.ACL.IDNoConformidad_GENERAR_PROTOCOLO){
    this.encontroNoConformidadUrl="encontroNoConformidad";          
  }else{
    this.NoencontroNoconformidadUrl="noencontroNoConformidad";
  }  
}
if(this.encontroNoConformidadUrl=="encontroNoConformidad"){
  if(numero == 5){
    this.router.navigate([`start-noconformidad`]);
  }
}
/*Capacitación */
for (let i = 0; i < this.session.User.permisos.length; i++) {      
  if( this.session.User.permisos[i]==this.session.ACL.IDCapacitacion_GENERAR_PROTOCOLO){
    this.encontroCapacitaciondUrl="encontroCapacitacion";          
  }else{
    this.NoencontroCapacitaciondUrl="noencontroCapacitacion";
  }  
}
if(this.encontroCapacitaciondUrl=="encontroCapacitacion"){
  if(numero == 4){
    this.router.navigate([`start-capacitacion`]);
  }
}
/*Mantenimiento */
for (let i = 0; i < this.session.User.permisos.length; i++) {      
  if( this.session.User.permisos[i]==this.session.ACL.IDMantenimiento_GENERAR_PROTOCOLO){
    this.encontroMantenimientoUrl="encontroMantenimiento";          
  }else{
    this.NoencontroMantenimientoUrl="noencontroMantenimiento";
  }  
}
if(this.encontroMantenimientoUrl=="encontroMantenimiento"){
  if(numero == 3){
    this.router.navigate([`start-mantenimiento`]);
  }
}  
  }

}