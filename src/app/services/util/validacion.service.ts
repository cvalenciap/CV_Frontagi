import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { validate } from 'class-validator';
import { forkJoin } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ValidacionService {
  constructor() {}

  /**
   * @param modelo - aqui va la clase model donde esta las validaciones
   * @param objectForm - le pasas la referencia del control del formulario
   * @param errorsGlobal - le pasas una variable global para uqe pueda almacenar los errores encontrados
   */
validacionSingular(modelo:any,objectForm:any,errorsGlobal){
  validate(modelo).then( errors => {
     errorsGlobal[objectForm.name] = "";
     if (errors.length > 0) {
      errors.map(e => {
        if(e.property == objectForm.name){
          errorsGlobal[e.property] = e.constraints[Object.keys(e.constraints)[0]];
         return;
        }
         
       });
     }

   });
}

 mapearErrores(errors,tab,mensajes){
   
  let componente;
   let hayError= false;
   
    if (errors.length > 0) {
      //let mensaje = errors.map(e => {
        errors.map(e => {  
      componente = tab[e.target.tabName];
        //console.log("tab namee "+e.target.tabName, e);
        if(e.children.length>0){
                this.mapearErrores(e.children,tab,mensajes);
            //return;
        }else{
            componente.errors[e.property] = e.constraints[Object.keys(e.constraints)[0]];
            mensajes.push(e.constraints[Object.keys(e.constraints)[0]]);
            //return e.constraints[Object.keys(e.constraints)[0]];
        }
        });
      hayError = true;
       //mensajes.push(mensaje.join(". "));
    }
    return hayError;
}

validacionObjeto(item:any,errores:any){
  validate(item).then(errors => {
    if (errors.length > 0) {
      errors.map(e => {
        Object.defineProperty(errores, e.property, { value: e.constraints[Object.keys(e.constraints)[0]], writable:true });
      });
    }
  });
}

/* Solo se ingresa Letras*/
validacionSoloLetras(item: any){   
  let validador  
  validador = item.keycode || item.which;
  let tecla = String.fromCharCode(validador).toString();
  let letras = " áéíóúabcdefghijklmnñopqrstuvwxyzÁÉÍÓÚABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
  let especiales = [8, 6];    
  let tecla_especial = false
  for(var i in especiales){
    if(validador == especiales[i]){
        tecla_especial = true;
        break;
    }
}
if(letras.indexOf(tecla)==-1 && !tecla_especial){
  return false;
}

}

/* Solo se ingresa Letras*/
validacionSoloNumeros(item: any){   
  let validador  
  validador = item.keycode || item.which;
  let tecla = String.fromCharCode(validador).toString();
  let letras = " 0123456789";
  let especiales = [8, 6];    
  let tecla_especial = false
  for(var i in especiales){
    if(validador == especiales[i]){
        tecla_especial = true;
        break;
    }
}
if(letras.indexOf(tecla)==-1 && !tecla_especial){
  return false;
}

}


/*validacionTodoModel(modelo:any,errorsGlobal){
  validate(modelo).then( errors => {
     errorsGlobal = {};
     if (errors.length > 0) {
       console.log("error plural",errors);
     return errors.map(e => {
          errorsGlobal[e.property] = e.constraints[Object.keys(e.constraints)[0]];
       });
     }

   });
}*/

/*validacionEnlazados(modelo:any,objectForm:any,errorsGlobal){
  forkJoin(validate(modelo)).subscribe(([errors]:[any])=>{
     errorsGlobal[objectForm.name] = "";
     if (errors.length > 0) {
       console.log("error singular",errors);
      errors.map(e => {
        if(e.property == objectForm.name){
          errorsGlobal[e.property] = e.constraints[Object.keys(e.constraints)[0]];
         return;
        }
         
       });
     }

   });
  }
  private mapearErrores(errors){
    
     let hayError= false;
      if (errors.length > 0) {
        //this.invalid = true;
        let mensaje = errors.map(e => {
          
          if(e.children.length>0){
          
                  this.mapearErrores(e.children);
              
          }else{
              componente.errors[e.property] = e.constraints[Object.keys(e.constraints)[0]];
             
          }
          });
        hayError = true;
         this.mensajes.push(mensaje.join(". "));
      }
      return hayError;
  }*/

}
