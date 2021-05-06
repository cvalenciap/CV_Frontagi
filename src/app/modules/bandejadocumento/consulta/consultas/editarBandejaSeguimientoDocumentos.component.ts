import { defineLocale, BsLocaleService, esLocale } from "ngx-bootstrap";
import { ToastrService } from "ngx-toastr";
import { Router, ActivatedRoute } from "@angular/router";
import { ViewChild, Component, OnInit } from "@angular/core";
import { BandejaDocumentoService, ValidacionService } from "src/app/services";
import { TabGroupAnimationsExample } from "src/app/modules/tabs/views/tab-group-animations-example";

@Component({
    selector: 'editar-bandeja-seguimiento-documentos',
    templateUrl: 'editarBandejaSeguimientoDocumentos.template.html',
    providers: []
})
export class EditarBandejaSeguimientoDocumentos implements OnInit {
    @ViewChild('tab') tab:TabGroupAnimationsExample;
    activar: boolean;
    consulta: boolean;
    private sub: any;
    idRevision: number;
    idEstadoDocumento: number;
    idEstadoRevision: number;

    constructor(private localeService: BsLocaleService,
        private toastr: ToastrService,
        private router: Router,
        private route: ActivatedRoute,
        private service: BandejaDocumentoService,
        private servicioValidacion:ValidacionService) {
        defineLocale('es', esLocale);
        this.localeService.use('es');
        this.activar = true;
        this.consulta = true;
        this.idEstadoDocumento = 0;
        this.idEstadoRevision = 0;
    }

    ngOnInit(){
        
    }

    OnRegresar(){
        this.router.navigate([`consulta/descarga/seguimientoDocumento`]); 
    }
}