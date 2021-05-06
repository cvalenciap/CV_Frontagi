import { Component,EventEmitter,Output } from '@angular/core';
import { smoothlyMenu } from '../../../app.helpers';
import { Router } from '@angular/router';
import {AuthService} from '../../../auth/auth.service';
import { AppSettings } from 'src/app/app.settings';
import { SessionService } from 'src/app/auth/session.service';

declare var jQuery:any;

@Component({
  selector: 'topnavbar',
  templateUrl: 'topnavbar.template.html'
})

export class TopNavbarComponent {
  @Output() emitEvent:EventEmitter<string> = new EventEmitter<string>();  

  nombre:string;
  idModulo:string;
  rutaActual:string;
  rutaAnterior:string;
  prendeapaga: boolean;
  encontroUrl: string;
  NoencontroUrl: string;
  encontroAuditoriaUrl: string;
  NoencontroAuditoriaUrl: string;
  prendeapagaAuditoria: boolean;
  encontroNoConformidadUrl:string;
  NoencontroNoConformidadUrl:string;
  prendeapagaNoConformidad:boolean;
  encontroCapacitacionUrl:string;
  NoencontroCapacitacionUrl:string;
  prendeapagaCapacitacion:boolean;
  encontroMantenimientoUrl:string;
  NoencontroMantenimientoUrl:string;
  prendeapagaMantenimiento:boolean;
  namemultiperfil: string;
  indicador: boolean;
  indicador2: boolean;
  constructor(private router: Router, private auth: AuthService,
    private session: SessionService) {
    this.nombre = AppSettings.APP_NAME;
    this.rutaAnterior = sessionStorage.getItem("rutaAnterior");    
    this.rutaActual = this.router.url;
    this.prendeapaga= false;  
    this.prendeapagaAuditoria= false;
    this.prendeapagaNoConformidad= false;
    this.prendeapagaCapacitacion= false;
    this.namemultiperfil= '';
  }

  toggleNavigation(): void {
    jQuery("body").toggleClass("mini-navbar");
    smoothlyMenu();
  }
  ngOnInit() {      
      let idfinal = sessionStorage.getItem("roleID");
      if(idfinal!=null){
        for(let i=0; i<this.session.User.perfilesAsociados.length;i++){
          if(this.session.User.perfilesAsociados[i].codPerfil==Number(idfinal)){
            this.namemultiperfil= this.session.User.perfilesAsociados[i].descripcion;            
          }
          this.indicador=true;
          this.indicador2=false;
      }
      }else{
           this.indicador=false;
           this.indicador2=true;
      }
            


    /* Informacion Documental */
    for (let i = 0; i < this.session.User.permisos.length; i++) {      
        if( this.session.User.permisos[i]==this.session.ACL.ID_GENERAR_PROTOCOLO){
          this.encontroUrl="encontro";          
        }else{
          this.NoencontroUrl="noencontro";
        }
    }
    if(this.encontroUrl=="encontro"){
       this.prendeapaga=false;
    }else{
      this.prendeapaga=true;
    }
    
    /*Modulo Auditoria */
    for (let i = 0; i < this.session.User.permisos.length; i++) {      
      if( this.session.User.permisos[i]==this.session.ACL.IDAuditoria_GENERAR_PROTOCOLO){
        this.encontroAuditoriaUrl="encontroAuditoria";          
      }else{
        this.NoencontroAuditoriaUrl="noencontroAuditoria";
      }
  }
    if(this.encontroAuditoriaUrl=="encontroAuditoria"){
      this.prendeapagaAuditoria=false;
    }else{
      this.prendeapagaAuditoria=true;
    }

    /*Modulo No Conformidad */
    for (let i = 0; i < this.session.User.permisos.length; i++) {      
      if( this.session.User.permisos[i]==this.session.ACL.IDNoConformidad_GENERAR_PROTOCOLO){
        this.encontroNoConformidadUrl="encontroNoConformidad";          
      }else{
        this.NoencontroNoConformidadUrl="noencontroNoConformidad";
      }
  }
    if(this.encontroNoConformidadUrl=="encontroNoConformidad"){
      this.prendeapagaNoConformidad=false;
    }else{
      this.prendeapagaNoConformidad=true;
    }

    /*Modulo Capacitacion */
    for (let i = 0; i < this.session.User.permisos.length; i++) {      
      if( this.session.User.permisos[i]==this.session.ACL.IDCapacitacion_GENERAR_PROTOCOLO){
        this.encontroCapacitacionUrl="encontroCapacitacion";          
      }else{
        this.NoencontroCapacitacionUrl="noencontroCapacitacion";
      }
  }
    if(this.encontroCapacitacionUrl=="encontroCapacitacion"){
      this.prendeapagaCapacitacion=false;
    }else{
      this.prendeapagaCapacitacion=true;
    }

    /*Modulo Mantenimiento */
    for (let i = 0; i < this.session.User.permisos.length; i++) {      
      if( this.session.User.permisos[i]==this.session.ACL.IDMantenimiento_GENERAR_PROTOCOLO){
        this.encontroMantenimientoUrl="encontroMantenimiento";          
      }else{
        this.NoencontroMantenimientoUrl="noencontroMantenimiento";
      }
  }
    if(this.encontroMantenimientoUrl=="encontroMantenimiento"){
      this.prendeapagaMantenimiento=false;
    }else{
      this.prendeapagaMantenimiento=true;
    }

  }

  OnID(numero){
    
    this.idModulo = numero;
    this.emitEvent.emit(this.idModulo);
    if(numero == 1){
      this.router.navigate([`starterview`]);
    }
    if(numero == 2){
      this.router.navigate([`start-auditoria`]);
    }
    if(numero == 3){
      this.router.navigate([`start-mantenimiento`]);
    }
    if(numero == 4){
      this.router.navigate([`start-capacitacion`]);
    }
    if(numero == 5){
      this.router.navigate([`start-noconformidad`]);
    }
     
    
    
  }

  OnLogout() {
    this.auth.logout();
  }
}
