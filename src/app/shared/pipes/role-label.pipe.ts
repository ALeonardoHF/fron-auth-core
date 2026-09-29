import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'roleLabel',
    standalone: true,
    pure: true
})
export class RoleLabelPipe implements PipeTransform {
    transform(role: string): string {
        const labels: Record<string, string> = {
            Admin: 'Administrador',
            Client: 'Cliente',
            Helper: 'Asistente'
        };
        return labels[role] ?? role;
    }

}