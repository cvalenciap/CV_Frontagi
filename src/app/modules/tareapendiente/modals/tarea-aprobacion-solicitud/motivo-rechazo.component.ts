import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap';
import { Subject } from 'rxjs';
import { REVISION } from 'src/app/modules/revisiondocumento/constanteRevision';
import { RevisionDocumentoService } from 'src/app/services/impl/revisiondocumentos.service';
import { ToastrService } from 'ngx-toastr';
import { Response } from '../../../../models/response';
import { RevisionDocumento } from '../../../../models';
import { Correo } from 'src/app/models/correo';
import { Constante } from 'src/app/models/enums/constante';
import { CorreoService } from 'src/app/services';

@Component({
  selector: 'app-motivo-rechazo',
  templateUrl: './motivo-rechazo.component.html',
  styleUrls: ['./motivo-rechazo.component.scss']
})
export class MotivoRechazoComponent implements OnInit {
  public onClose: Subject<boolean>;
  textoMotivoRechazo: string;
  idDocumento: number;
  idRevision: number;
  revisionDocumento: RevisionDocumento;
  deshabilitarBoton: boolean;

  constructor(public bsModalRef: BsModalRef,
              private router: Router,
              private service: RevisionDocumentoService,
              private serviceCorreo: CorreoService,
              private toastr: ToastrService) {
                  this.onClose = new Subject();
                  this.deshabilitarBoton = true;
                  this.revisionDocumento = new RevisionDocumento();
  }

  ngOnInit() {
    this.textoMotivoRechazo = "";
  }

  OnEnviarRechazar(){

    this.revisionDocumento = new RevisionDocumento();
    if(this.textoMotivoRechazo != ""){
      if(this.idDocumento != 0){
        this.revisionDocumento.motivoRechazoRev = this.textoMotivoRechazo;
        this.revisionDocumento.id = this.idRevision;
      }
      this.service.rechazarDocumento(this.idDocumento, this.revisionDocumento).subscribe(
        (response: Response) => {
            let objeto = response.resultado;
            localStorage.removeItem("objetoRetornoBusqueda");
            //Enviar Correo - Plazo de Atencion
            this.serviceCorreo.obtenerListaCorreo(this.idDocumento, null,
                Constante.CORREO_RECHAZO_DOCUMENTO).subscribe(
                (response: Response) => {
                    const lista: Correo[] = response.resultado;
                    lista.forEach(correo => {
                      if(correo.correoCabecera.correoDestino.length > 0) {
                        this.serviceCorreo.enviarCorreo(correo).subscribe(
                            (response: Response) => {},
                            (error) => {
                                this.controlarError(error);
                            }
                        );
                    }
                    });
                },
                (error) => {
                    this.controlarError(error);
                }
            );

            this.toastr.success('Documento rechazado', 'Acción completada!', {closeButton: true});
            this.OnCerrar();
        },
        (error) => this.controlarError(error)
      );
    }
  }

  activarBotones() {
    if (this.textoMotivoRechazo !== '') {
      this.deshabilitarBoton = false;
    } else {
      this.deshabilitarBoton = true;
    }
  }

  OnCerrar(){
    this.bsModalRef.hide();
    this.router.navigate([`/documento/tareapendiente/AprobarSolicitud`]);
  }

  controlarError(error) {
    console.error(error);
    //this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
  }
}
