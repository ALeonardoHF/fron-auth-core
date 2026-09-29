import { CanDeactivate, CanDeactivateFn } from "@angular/router";

export interface CanComponentDeactivate {
    canDeactivate: () => boolean;
}

export const unsavedChangesGuard: CanDeactivateFn<CanComponentDeactivate> =
    (component) => {
        if (component.canDeactivate()) return true;
        return confirm('¿Salir sin confirmar que escaneaste el QR?');
};