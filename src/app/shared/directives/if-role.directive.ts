import { Directive, Input, TemplateRef, ViewContainerRef, inject, effect } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Directive({ selector: '[appIfRole]', standalone: true })
export class IfRoleDirective {
    private templateRef = inject(TemplateRef<any>);
    private vcr = inject(ViewContainerRef);
    private authService = inject(AuthService);
    private hasView = false;
    private role = '';

    constructor() {
        effect(() => {
            const hasRole = this.authService.currentRole() === this.role;
            if (hasRole && !this.hasView) {
                this.vcr.createEmbeddedView(this.templateRef);
                this.hasView = true;
            } else if (!hasRole && this.hasView) {
                this.vcr.clear();
                this.hasView = false;
            }
        });
    }

    @Input() set appIfRole(role: string) {
        this.role = role;
    }
}
