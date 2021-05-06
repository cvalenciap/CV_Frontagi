import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { ToastrService } from 'ngx-toastr';
import { Tipo } from '../../../models/tipo';
import { Response } from '../../../models/response';
import { Curso } from 'src/app/models/curso';
import { Constante } from 'src/app/models/constante';
import { Paginacion } from 'src/app/models';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalOptions, BsModalRef, BsModalService } from 'ngx-bootstrap';
import { AgregarSesionComponents } from 'src/app/modules/curso/modals/agregar-sesion.component';
import { RegistroElaboracioncomponts } from 'src/app/modules/bandejadocumento/modales/registro-elaboracion.component';
import { GeneralService } from 'src/app/services/impl/general.service';
import { Observable } from 'rxjs/internal/Observable';
import { CursoService } from 'src/app/services/impl/curso.service';
import { Sesion } from 'src/app/models/sesion';
import { Session } from 'selenium-webdriver';
import { Area } from 'src/app/models/area';
import { Equipo } from 'src/app/models/equipo';
import { CursoEquipo } from 'src/app/models/cursoEquipo';
import { ValidacionService } from 'src/app/services/util/validacion.service';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { validate } from 'class-validator';
@Component({
    selector: 'curso-editar',
    templateUrl: 'editar.template.html',
    providers: []
})
export class CursoEditarComponent implements OnInit {
    textoIngresado: string;
    bsModalRef: BsModalRef;
    selectedObject: Curso;
    textoBusqueda: string;
    textoBusquedaEquipo: string;
    textoBusquedaSesion: string;
    parametroBusqueda: any;
    parametroBusquedaSesion: any;
    parametroBusquedaEquipo: any;
    paginacion: Paginacion;
    selectedRow: number;
    codigo: string;
    itemColumna: number;
    nombre: string;
    /* codigo seleccionado */
    itemCodigo: number;
    /* datos */
    listaTipos: Tipo[];
    item: Curso;
    items: Curso[];
    itemCombo: Constante[];
    itemsCombo: Constante[];
    loading: boolean;
    private sub: any;
    horas: string;
    /** Prueba */
    valor: string;
    //Objeto para abrir ventana
    objetoVentana: BsModalRef;
    mostrarDiv: boolean;
    mostrarDivEquipos: boolean;
    idConstante: Constante[]
    datoConstante: Constante;
    datoCurso: Curso;
    tipoCurso: Constante[];
    cursosIn: Curso;
    listaSes: Sesion[];
    lstArea: Area[];
    listaSesAux: Sesion[];
    listaAreaAux: Area[];
    sesionTmp: Sesion;
    codigoSesion: number;
    nuevo: boolean;
    selectedSesion: any;
    selectedSesionRow: number;
    sesionTablaTmp: Sesion = new Sesion();
    codCursoAux: number;
    list3: Sesion[];
    lstEqui: Equipo[];
    listaCursoEquipo: CursoEquipo[];
    lstCursEqui: Equipo[];
    lstCursEquiAux: Equipo[];
    lstEquipoTres: Equipo[];
    selectedEquipo: any;
    selectedEquipoRow: number;
    descr: string;
    abrv: string;
    txtBusqueda: string;
    mensajes: any[];
    errors: any;
    constructor(private localeService: BsLocaleService,
        private toastr: ToastrService,
        private router: Router,
        private route: ActivatedRoute,
        private modalService: BsModalService,
        private servicioGeneral: GeneralService,        
        private servicio: CursoService,
        private serv: ValidacionService,
        private sanitizer: DomSanitizer) {
        defineLocale('es', esLocale);
        this.localeService.use('es');
        this.selectedRow = -1;
        this.loading = false;
        // this.items = [];
        this.codigo = "";
        this.parametroBusqueda = 'codigo';
        this.parametroBusquedaEquipo = 'descr';
        this.paginacion = new Paginacion({ registros: 10 });
        this.datoConstante = new Constante();
        this.datoCurso = new Curso();
        this.cursosIn = new Curso();
        this.listaSes = [];
        this.lstArea = [];
        this.listaSesAux = [];
        this.listaAreaAux = [];
        this.lstCursEqui = [];
        this.lstCursEquiAux = [];
        this.codCursoAux = 0;
        this.list3 = [];
        this.lstEqui = [];
    }

    ngOnInit() {
        this.mostrarDiv = false;
        this.mostrarDivEquipos = false;

        //this.valor="";

        this.horas = "Horas";
        // this.service.obtenerTipos().subscribe(
        //     (response: Response) => this.listaTipos = response.resultado,
        //     //(error) => this.controlarError(error)
        // );

        this.sub = this.route.params.subscribe(params => {
            this.itemCodigo = + params['codigo'];
            console.log("EDITAR :" + this.itemCodigo);
        });
        if (this.itemCodigo) {
            this.nuevo = false;
            this.servicio.bucarCursoPorCodigo(this.itemCodigo).subscribe(
                (response: Response) => {
                    this.datoCurso = response.resultado;
                    if (this.datoCurso.tipoCurso == '59') {
                        this.mostrarDiv = true;
                        this.mostrarDivEquipos = false;
                    } else if (this.datoCurso.tipoCurso == '60') {
                        this.mostrarDiv = true;
                        this.mostrarDivEquipos = false;
                    } else if (this.datoCurso.tipoCurso == '61') {
                        this.mostrarDiv = true;
                        this.mostrarDivEquipos = true;
                    } else {
                        this.mostrarDiv = false;
                        this.mostrarDivEquipos = false;
                    }
                    let lista: Curso;
                    console.log("LISTA SESIONES :" + this.datoCurso.listaSesiones.length);
                    if (this.datoCurso.listaSesiones.length > 0) {
                        
                        for (let session of this.datoCurso.listaSesiones) {

                            this.listaSes.push(session);
                        }
                        for (let session of this.datoCurso.listaSesiones) {

                            this.listaSesAux.push(session);
                        }
                        
                        for (let data of this.listaSes) {
                            if (this.codCursoAux > 0) {
                                data.itemColumna = 0;
                                data.itemColumna = this.codCursoAux + 1;
                                this.codCursoAux = data.itemColumna;

                            } else {
                                data.itemColumna = data.itemColumna + 1;
                                this.codCursoAux = data.itemColumna;
                            }
                        }
                    }
                    
                    if (this.datoCurso.listaAreas.length > 0) {
                        for (let cursoEquip of this.datoCurso.listaAreas) {
                            this.lstCursEqui.push(cursoEquip);
                            console.log(this.lstCursEqui);
                        }
                        for (let cursoEquip of this.datoCurso.listaAreas) {

                            this.lstCursEquiAux.push(cursoEquip);
                        }
                    }

                },
                (error) => this.controlarError(error)
            );
        } else {
            // this.item = this.service.crear(); 
            this.nuevo = true;

            //this.item.tipo = this.listaTipos[0];
        }
        this.cargarCombo();
        //this.getLista();
    }
    OnRowClick(index, obj): void {
        this.selectedRow = index;
        this.selectedObject = obj;
    }
    OnGuardar() {/*
        this.service.guardar(this.item).subscribe(
            (response: Response) => {
                this.item = response.resultado;
                this.toastr.success('Registro almacenado', 'Acción completada!', { closeButton: true });
                this.router.navigate([`mantenimiento/aulas`]);
            }
            //  (error) => this.controlarError(error)
        );*/
    }
    OnBuscarCurso() {
        const config = <ModalOptions>{
            ignoreBackdropClick: true,
            keyboard: false,
            initialState: {}
        }
        this.objetoVentana = this.modalService.show(AgregarSesionComponents, config);
        (<AgregarSesionComponents>this.objetoVentana.content).onClose.subscribe(result => {
        });
    }
    agreagarEquipo() {
        this.parametroBusqueda = "avanzada";
        const config = <ModalOptions>{
            ignoreBackdropClick: true,
            keyboard: false,
            initialState: {
            },
            class: 'modal-lg'
        }
        this.bsModalRef = this.modalService.show(RegistroElaboracioncomponts, config);
        (<RegistroElaboracioncomponts>this.bsModalRef.content).onClose.subscribe((result) => {
            
            console.log(result);
            this.lstCursEquiAux = result;

            for (let aux of this.lstCursEquiAux) {

                this.lstCursEqui.push(aux);
            }
            // this.lstCursEqui.push(result);

            console.log(this.lstCursEqui);
            //this.busquedaPlan = result;
            //this.OnBuscar();
        });
    }
    OnRegresar() {
        this.router.navigate([`mantenimiento/aulas`]);
    }
    controlarError(error) {
        console.error(error);
        // this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
    }
    getLista(): void {
        this.loading = true;
        const parametros: { codigo?: string, nombre?: string, descripcion?: string } = { codigo: null, nombre: null, descripcion: null };
        switch (this.parametroBusqueda) {
            case 'codigo':
                parametros.codigo = this.textoBusqueda;
                break;
            case 'nombre':
                parametros.nombre = this.textoBusqueda;
                break;
            case 'descripcion':
            default:
                parametros.descripcion = this.textoBusqueda;
        }
       /* this.service.buscarPorParametros(parametros, this.paginacion.pagina, this.paginacion.registros).subscribe(
            (response: Response) => {
                this.items = response.resultado;
                this.paginacion = new Paginacion(response.paginacion);
                this.loading = false;
            },
            (error) => this.controlarError(error)
        );*/
    }
    OnModificar() {

        const config = <ModalOptions>{
            ignoreBackdropClick: true,
            keyboard: false,
            initialState: {},
            class: 'modal-lg'
        }
        this.objetoVentana = this.modalService.show(AgregarSesionComponents, config);
        (<AgregarSesionComponents>this.objetoVentana.content).onClose.subscribe(result => {
        });
    }


    abrir() {

        let tpCurso = this.datoCurso.tipoCurso;

        if (tpCurso == '59') {
            this.mostrarDiv = true;
            this.mostrarDivEquipos = false;
        } else if (tpCurso == '60') {
            this.mostrarDiv = true;
            this.mostrarDivEquipos = false;
        } else if (tpCurso == '61') {
            this.mostrarDiv = true;
            this.mostrarDivEquipos = true;
        } else {
            this.mostrarDiv = false;
            this.mostrarDivEquipos = false;
        }
    }

    cargarCombo() {

        let tipoCurso = this.servicioGeneral.consultarTipoCurso().subscribe(
            (response: Response) => {
                this.tipoCurso = response.resultado;
                this.loading = false;
            }, (error) => this.controlarError(error)
        );

    }

    registrarCurso() {
        //let guardarCurso:Curso = Object.assign({},this.item);
        let guardarCurso: Curso = this.datoCurso;
        //guardarCurso.listaSesiones = this.listaSes;
        
        if (this.nuevo) {
            this.cursosIn = new Curso();
            this.cursosIn.codigoCurso = this.datoCurso.codigoCurso;
            this.cursosIn.nombreCurso = this.datoCurso.nombreCurso;
            this.cursosIn.tipoCurso = this.datoCurso.tipoCurso;
            this.cursosIn.duracion = this.datoCurso.duracion;
            this.cursosIn.indicadorSGI = this.datoCurso.indicadorSGI;
            this.cursosIn.disponibilidad = this.datoCurso.disponibilidad;
            this.cursosIn.listaSesiones = this.listaSes;
            //this.cursosIn.listaEquipo = this.lstCursEqui;
            const agregarCurso = this.servicio.registrarCurso(this.cursosIn).subscribe(
                (response: Response) => {
                    this.toastr.success("REGISTRADO");
                }, (error) => this.controlarError(error)
            );
        } else {
            //ACTUALZIAR
            this.servicio.actualizarDatosCurso(guardarCurso).subscribe((response: Response) => {
                this.loading = false;
                this.toastr.success('Registro actualizado', 'Acción completada!', { closeButton: true });

            },
                (error) => this.controlarError(error))
        }


    }

    listarSesionesTemporales() {

    }

    nuevaSesion(indiceSesion: number, item: Sesion) {
        
        const config = <ModalOptions>{
            ignoreBackdropClick: true,
            keyboard: false,
            initialState: {
                codigoSesion: this.listaSes.length + 1,
            }
        }

        this.objetoVentana = this.modalService.show(AgregarSesionComponents, config);
        
        (<AgregarSesionComponents>this.objetoVentana.content).onClose.subscribe(result => {
            
            if (result.disponibilidad == "0") {
                result.descDisp = "No";
            } else {
                result.descDisp = "Si";
            }
            this.listaSes.push(result);
            this.listaSesAux = this.listaSes;
        });

    }

    editarCursoSesion(indiceSesion: number, item: Sesion) {
        
        this.sesionTablaTmp = item;

        const config = <ModalOptions>{
            ignoreBackdropClick: true,
            keyboard: false,
            initialState: {
                item: item.itemColumna,
                dispo: item.disponibilidad,
                duracion: item.duracion,
                nombre: item.nombreSesion,
            }
        }
        this.objetoVentana = this.modalService.show(AgregarSesionComponents, config);
        
        (<AgregarSesionComponents>this.objetoVentana.content).onClose.subscribe((sesionTmp: Sesion) => {
            
            this.sesionTablaTmp.item = sesionTmp.itemColumna;
            this.sesionTablaTmp.nombreSesion = sesionTmp.nombreSesion;
            this.sesionTablaTmp.duracion = sesionTmp.duracion;
            // switch(sesionTmp.disponibilidad){
            //     case "0": this.sesionTablaTmp.descDisp = "NO"; break;
            //     case "1": this.sesionTablaTmp.descDisp = "SI"; break;
            // }
            this.sesionTablaTmp.disponibilidad = sesionTmp.disponibilidad;

            this.listaSes = this.listaSes.filter(x => x = this.sesionTablaTmp);
        });

    }

    agregarItem(listaResultados: any[]): any[] {
        let contador: number;
        let itemFila: number;
        
        listaResultados.forEach(element => {
            element.item = contador;
            contador++;
        });

        return listaResultados;

    }

    seleccionarSesion(index: number, obj: any) {
        this.selectedSesion = index;
        this.selectedSesionRow = obj;
        console.log("INDEX " + this.selectedSesion);
    }

    eliminarSesion(indiceSesion: number, item: Sesion) {

        /**/
        let indice: number;
        

        for (let dat of this.listaSes) {

            if (dat.nombreSesion == item.nombreSesion) {
                item.estadoRegistro = "2";
                this.list3.push(item);
                break;
            }
        }
        this.listaSes = this.listaSes.filter(x => x != item);

        var itemAux: number = 0;
        for (let dat of this.listaSes) {
            


            if (itemAux > 0) {
                dat.itemColumna = 0;
                dat.itemColumna = itemAux + 1;
                itemAux = dat.itemColumna;
            } else {
                dat.itemColumna = 0;
                dat.itemColumna = dat.itemColumna + 1;
                itemAux = dat.itemColumna;
            }

        }



    }

    validarCampos() {
        
        this.errors = {};
        this.serv.validacionObjeto(this.cursosIn, this.errors);
    }

    grabar() {
        console.log(this.listaSesAux);

        this.listaSesAux = this.listaSes;

        if (this.list3.length > 0) {
            for (let data of this.list3) {

                this.listaSesAux.push(data);
                this.listaSes = this.listaSes.filter(x => x != data);

            }
        }

        this.lstCursEquiAux = this.lstCursEqui;
        if (this.lstEqui.length > 0) {
            for (let data of this.lstEqui) {

                this.lstCursEquiAux.push(data);
                this.lstCursEqui = this.lstCursEqui.filter(x => x != data);

            }
        }
        
        this.datoCurso.listaSesiones = this.listaSesAux;
        this.datoCurso.listaAreas = this.lstCursEquiAux;
        // if (this.nuevo) {
        this.cursosIn = new Curso();
        this.cursosIn.codigoCurso = this.datoCurso.codigoCurso;
        this.cursosIn.nombreCurso = this.datoCurso.nombreCurso;
        this.cursosIn.tipoCurso = this.datoCurso.tipoCurso;
        this.cursosIn.duracion = this.datoCurso.duracion;
        this.cursosIn.indicadorSGI = this.datoCurso.indicadorSGI;
        this.cursosIn.disponibilidad = this.datoCurso.disponibilidad;
        this.cursosIn.listaSesiones = this.listaSesAux;
        this.cursosIn.listaEquipo = this.lstCursEquiAux;
        // }

        forkJoin(validate(this.cursosIn)).subscribe(([errors]: [any]) => {
            this.mensajes = [];

            if (errors.length > 0) {
                this.validarCampos();
                this.toastr.error("Existen campos obligatorios por completar", 'Acción inválida', { closeButton: true });
            } else {

                if (this.nuevo) {

                    const agregarCurso = this.servicio.registrarCurso(this.cursosIn).subscribe(
                        (response: Response) => {
                            this.toastr.success("REGISTRADO");
                            this.router.navigate(['mantenimiento/cursos']);
                        }, (error) => this.controlarError(error)
                    );
                } else {
                    //ACTUALZIAR
                    this.servicio.actualizarDatosCurso(this.datoCurso).subscribe((response: Response) => {
                        this.loading = false;
                        this.toastr.success('Registro actualizado', 'Acción completada!', { closeButton: true });
                        this.router.navigate(['mantenimiento/cursos']);
                    },
                        (error) => this.controlarError(error))
                }


            }
        });



    }

    seleccionarEquipo(index: number, obj: any) {
        this.selectedEquipoRow = index;
        this.selectedEquipo = obj;
    }

    eliminarAuditado(indiceArea: number, item: Equipo) {
        console.log("Hola");

        let indice: number;
        

        for (let dat of this.lstCursEqui) {

            if (dat.abreviatura == item.abreviatura) {
                item.estadoRegistro = "2";
                this.lstEqui.push(item);
                break;
            }
        }
        this.lstCursEqui = this.lstCursEqui.filter(x => x != item);


        console.log(this.lstCursEqui);
        console.log(this.lstCursEquiAux);
        console.log(this.lstEqui);
    }

    cancelar() {
        this.router.navigate(['mantenimiento/cursos']);
    }

    buscarSesion() {
        
        const parametros: {
            itemColumna?: number,
            nombre?: string
        } =
            {
                itemColumna: this.itemColumna,
                nombre: this.nombre
            }
        switch (this.parametroBusquedaSesion) {
            case 'itemColumna':
                parametros.itemColumna = Number(this.textoBusquedaSesion);
                break;
            case 'nombre':
                parametros.nombre = this.textoBusquedaSesion;
                break;

        }

        this.listaSesAux = this.listaSes;
        if (this.listaSes.length > 0) {
            this.listaSesAux
        }
        if (this.textoBusquedaSesion != undefined || this.textoBusquedaSesion != null) {
            for (let data of this.listaSesAux) {
                
                if (String(data.itemColumna) == this.textoBusquedaSesion || data.nombreSesion.includes(this.textoBusquedaSesion)) {

                    this.listaSes = this.listaSesAux.filter(x => x = data);
                } else {
                    this.listaSes = [];

                }
            }
        } else {
            this.listaSes = this.listaSesAux;
        }
    }
    buscarEquipo() {
        console.log(this.textoBusquedaEquipo);
        const parametros: {
            descr?: string,
            abrv?: string
        } =
            {
                descr: this.descr,
                abrv: this.abrv
            }
        switch (this.parametroBusqueda) {
            case 'descr':
                parametros.descr = this.textoBusquedaEquipo;
                break;
            case 'abrv':
                parametros.abrv = this.textoBusquedaEquipo;
                break;

        }
        
        if (this.lstCursEqui.length > 0) {
            this.lstCursEquiAux = this.lstCursEqui;
        }
        if (this.textoBusquedaEquipo != undefined || this.textoBusquedaEquipo != null) {
            for (let data of this.lstCursEquiAux) {
                
                if (data.descripcion.includes(this.textoBusquedaEquipo) || data.abreviatura.includes(this.textoBusquedaEquipo)) {

                    this.lstCursEqui = this.lstCursEquiAux.filter(x => x = data);
                } else {
                    this.lstCursEqui = [];

                }
            }
        } else {
            this.lstCursEqui = this.lstCursEquiAux;
        }

    }

    Validar(objectForm) {
        
        this.serv.validacionSingular(this.cursosIn, objectForm, this.errors);
    }
}
