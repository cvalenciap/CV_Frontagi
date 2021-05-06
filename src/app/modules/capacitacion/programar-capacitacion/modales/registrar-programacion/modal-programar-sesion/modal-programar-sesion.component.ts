import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { BsModalRef, BsLocaleService, defineLocale, ModalOptions, BsModalService, esLocale } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ProgramarCapacitacion } from 'src/app/models/programarcapacitacion';
import { ModalAgregarAulaComponent } from '../../../modales/registrar-programacion/modal-agregar-aula/modal-agregar-aula.component';
import { Sesion } from 'src/app/models/sesion';
import { Aula } from 'src/app/models/aula';
import { forEach } from '@angular/router/src/utils/collection';
import { AmazingTimePickerService } from 'amazing-time-picker';

@Component({
  selector: 'app-modal-programar-sesion',
  templateUrl: './modal-programar-sesion.template.html',
  styleUrls: ['./modal-programar-sesion.component.scss']
})
export class ModalProgramarSesionComponent implements OnInit {

    public onClose: Subject<ProgramarCapacitacion>;
    busqueda:ProgramarCapacitacion;
    bsConfig: object;

    /** Datos **/
    deshabilitarCaja:boolean;
    valorCodigo:string;
    valorNombre:string;
    valorFecha:Date;
    valorDuracion:string;
    valorInicio:string;
    valorFin:string;
    valorAula:string;
    busquedaProgramarCapacitacion: ProgramarCapacitacion;
    parametroBusqueda: string;
    datoSesion: Sesion;
    nombre: string;
    duracion: string;
    inicio: string;
    fin : string;
    fecha : Date;
    datoAula: Aula;
    capacitacion: ProgramarCapacitacion;
    idAula: string;
    nombreAula: string;
    idSesion: string;
    /** Datos **/

    constructor(public bsModalRef: BsModalRef,
                private toastr: ToastrService,
                private localeService: BsLocaleService,
                private modalService: BsModalService,
                private atp: AmazingTimePickerService) {
                    defineLocale('es', esLocale);
                    this.localeService.use('es');
                    this.datoSesion = new Sesion();
                    this.datoAula = new Aula();
                    this.parametroBusqueda = 'codigo';
    }

    ngOnInit() {
        this.onClose = new Subject();
        this.busqueda = new ProgramarCapacitacion();
        
        this.datoSesion.idSesion = this.idSesion;
        this.datoSesion.nombreSesion = this.nombre;
        this.datoSesion.fechaSesion = new Date(this.fecha);
        this.datoSesion.horaInicio = this.inicio;
        this.datoSesion.horaFin = this.fin;
        this.datoSesion.duracion = this.duracion;
        this.datoSesion.idAula = this.idAula;
        this.datoSesion.nombreAula = this.nombreAula;
        this.datoAula.vnomaula = this.datoSesion.nombreAula;
        this.busqueda.codigo = "";
        console.log(this.busqueda);
        /** Datos **/
        this.deshabilitarCaja=true;
        // this.valorCodigo="S0001";
        // this.valorNombre="Introducción";
        // this.valorFecha= new Date('10/01/2018');
        // this.valorDuracion="2 Horas";
        // this.valorInicio="10:00 am";
        // this.valorFin="12:00 pm";
        // this.valorAula="Sala 1";
        /** Datos **/
    }

    OnGuardar(){
        
        let sesionTmp: Sesion = this.datoSesion;
        let aulaTmp: Aula = this.datoAula;
        this.capacitacion = new ProgramarCapacitacion;
        this.capacitacion.sesion = this.datoSesion;
        this.capacitacion.aula = this.datoAula;
        this.onClose.next(this.capacitacion);

        this.bsModalRef.hide();
    }

    OnCancelar(){
        this.bsModalRef.hide();
    }

    OnBuscarAula(){
        this.parametroBusqueda = "avanzada";
        const config = <ModalOptions>{
            ignoreBackdropClick: true,
            keyboard: false,
            initialState: {        
            },
            class: 'modal-lg'
        }
        
        let modalbusqueda = this.modalService.show(ModalAgregarAulaComponent, config);
        (<ModalAgregarAulaComponent>modalbusqueda.content).onClose.subscribe(result => {
            
            console.log(result)
            this.datoAula = result;
        });
    }

   /* openInicio(horaIni: any) {
        horaIni = this.datoSesion.horaInicio;
        
        const amazingTimePicker = this.atp.open({
            locale: 'pe',
            time: horaIni,

        });
        amazingTimePicker.afterClose().subscribe(time=> {
            this.datoSesion.horaInicio= time;
        });
    }

    openFin(horaFin: any) {
        horaFin = this.datoSesion.horaFin;
        
        const amazingTimePicker = this.atp.open({
            locale: 'pe',
            time: horaFin,
        });
        amazingTimePicker.afterClose().subscribe(time => {
            this.datoSesion.horaFin = time;
            this.validarHoras();
        });
    }*/

    validarHoras(){
        let hIni = this.datoSesion.horaInicio;
        let hFin = this.datoSesion.horaFin;

        if(hFin < hIni){
            console.log("Valida")
        } 
    }

   
}