import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { ToastrService } from 'ngx-toastr';
import { InstructoresService, ValidacionService } from '../../../services';
import { Tipo } from '../../../models/tipo';
import { Estado } from '../../../models/enums/estado';
import { Instructor } from '../../../models/instructor';
import { Response } from '../../../models/response';
import { ModalOptions, BsModalRef, BsModalService } from 'ngx-bootstrap';
import { BusquedaColaboradorMantenimientoComponent } from 'src/app/modules/instructor/modales/busqueda-colaborador-mantenimiento.component';
import { Colaborador } from 'src/app/models/colaborador';
import { forkJoin } from 'rxjs';
import { validate } from 'class-validator';

@Component({
    selector: 'instructores-editar',
    templateUrl: 'editar.template.html',
    styleUrls: ['lista.component.scss'],
    providers: [InstructoresService]
})
export class InstructoresEditarComponent implements OnInit {
    public colaborador: Colaborador;
    public nombreColaborador: string;
    tipoAccion: string;
    /* codigo seleccionado */
    itemCodigo: number;
    /* datos */
    instructor: Instructor;
    listaTipos: Tipo[];
    item: Instructor;
    private sub: any;
    bsModalRef: BsModalRef;
    idcolaborador: number;
    idcolaboracioncreaciondoc: number;
    errors: any;
    vnombre: string;
    vapellidoPaterno: string;
    apellidoMaterno: string;
    vdispo:number;
    vtipoDoc: string;
    vnumeroDoc: string;
    vtipo: string;
    mensajes:any[];
    habilitar:boolean;
    hdisponible:boolean;

    constructor(private localeService: BsLocaleService,
        private toastr: ToastrService,
        private router: Router,
        private route: ActivatedRoute,
        private service: InstructoresService,
        private modalService: BsModalService,
        private servicioValidacion: ValidacionService) {
        defineLocale('es', esLocale);
        this.localeService.use('es');
        this.vtipo = null;
        this.vdispo = 1;
        this.habilitar = false;
        this.hdisponible = true;
    }

    ngOnInit() {
        //this.habilitar = false;
        this.sub = this.route.params.subscribe(params => {
            this.itemCodigo = + params['codigo'];
        });

        this.instructor = JSON.parse(sessionStorage.getItem("instructor"));

        if (this.itemCodigo) {
            this.habilitar = true;
            this.hdisponible = false;
            this.tipoAccion = 'Modificar Instructor';
            this.vtipo = this.instructor.v_tipinst;
            this.nombreColaborador = this.instructor.v_codinst;
            this.vnombre = this.instructor.v_nominst;
            this.vapellidoPaterno = this.instructor.v_apepatinst;
            this.apellidoMaterno = this.instructor.v_apematinst;
            this.vdispo = this.instructor.n_disinst;
            this.vtipoDoc = this.instructor.v_tipdocinst;
            this.vnumeroDoc = this.instructor.v_numdocinst;
        } else {
            this.habilitar = false;
            this.hdisponible = true;
            this.tipoAccion = 'Registrar Instructor';
            this.itemCodigo = 0;
        }
    }
    OnGuardar() {
        
        this.obtenerAula();
        forkJoin(validate(this.item)).subscribe(([errors]:[any])=>{
            this.mensajes = [];
            if (errors.length > 0) {
                this.validarCampos();
                this.toastr.error("Existen campos obligatorios por completar", 'Acción inválida', { closeButton: true });
            } else {
                this.service.guardar(this.item).subscribe(
                    (response: Response) => {
                        this.item = response.resultado;
                        this.toastr.success('Registro almacenado', 'Acción completada!', { closeButton: true });
                        this.router.navigate([`mantenimiento/instructores`]);
                    }, (error) => this.controlarError(error));
            }

        }); 
        
    }

    validarCampos(){
        this.errors = {};
        this.servicioValidacion.validacionObjeto(this.item,this.errors);
    }


    OnRegresar() {
        this.router.navigate([`mantenimiento/instructores`]);
    }
    controlarError(error) {
        this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', { closeButton: true });
    }

    public obtenerColaborador(objectForm) {
        const config = <ModalOptions>{
            ignoreBackdropClick: true,
            keyboard: false,
            class: 'modal-lg'
        };
        this.bsModalRef = this.modalService.show(BusquedaColaboradorMantenimientoComponent, config);
        (<BusquedaColaboradorMantenimientoComponent>this.bsModalRef.content).onClose.subscribe((colaborador: Colaborador) => {
            this.colaborador = colaborador;
            
            this.nombreColaborador = this.colaborador.numeroFicha;
            this.vnombre = this.colaborador.nombre;
            this.vapellidoPaterno = this.colaborador.apellidoPaterno;
            this.apellidoMaterno = this.colaborador.apellidoMaterno;
            this.vtipoDoc = 'DNI';
            this.vnumeroDoc = this.colaborador.dni;


        });
    }

    obtenerAula() {
        this.item = new Instructor();
        this.item.n_idinst = this.itemCodigo;
        this.item.v_tipinst = this.vtipo;
        this.item.v_codinst = this.nombreColaborador;
        this.item.v_nominst = this.vnombre;
        this.item.v_apepatinst = this.vapellidoPaterno;
        this.item.v_apematinst = this.apellidoMaterno;
        this.item.n_disinst = this.vdispo;
        this.item.v_tipdocinst = this.vtipoDoc;
        this.item.v_numdocinst = this.vnumeroDoc;
    }

    Validar(objectForm) {
        
        this.servicioValidacion.validacionSingular(this.item,objectForm,this.errors);
    }


}

