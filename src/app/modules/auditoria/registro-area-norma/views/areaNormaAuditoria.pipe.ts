import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'tipoArea'
})
export class AreaNormaAuditoriaPipe implements PipeTransform {
    transform(value: number) {
        if (value === 1) {
            return 'GERENCIA';
        } else if (value === 2) {
            return 'EQUIPO';
        } else if (value === 3) {
            return 'COMITÉ';
        }
    }
}