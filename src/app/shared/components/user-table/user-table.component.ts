import { Component, input, output, ChangeDetectionStrategy, ContentChild, ElementRef, AfterContentInit, TemplateRef } from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";
import { User } from "../../../core/models/user.model";
import { RoleLabelPipe } from "../../pipes/role-label.pipe";

@Component({
    selector: 'app-user-table',
    standalone: true,
    imports: [RoleLabelPipe, NgTemplateOutlet],
    templateUrl: './user-table.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserTableComponent implements AfterContentInit{
    users = input.required<User[]>();
    userSelected = output<User>();
    rowTemplate = input<TemplateRef<{ $implicit: User}>>();

    @ContentChild('tableHeader') headerRef!: ElementRef;

    ngAfterContentInit(): void {
        if (this.headerRef) {
             console.log('Header proyectado: ', this.headerRef.nativeElement.textContent);
        }
    }

    onSelect(user: User): void {
        this.userSelected.emit(user);
    }
}