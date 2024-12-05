import { ValueChangeEvent } from '@angular/forms';
import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'Permission',
    standalone: true,
})
export class PermissionPipe implements PipeTransform {

    readonly PERMISSIONS = {
        ADD: 'Añadir',
        EDIT: 'Editar',
        DELETE: 'Borrar'
    };

    transform(value: string[]): string {
        let result = '';
        value.forEach(permission => {
            const permiso = Object.entries(this.PERMISSIONS).find(entry => entry[0] === permission)
            result = result + (permiso ? `${ permiso[1] } ` : '');
    })
        return result
    }
}