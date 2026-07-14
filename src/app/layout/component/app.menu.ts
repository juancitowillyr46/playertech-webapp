import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MockAuthService } from '@/app/core/auth/mock-auth.service';
import { AppMenuitem } from './app.menuitem';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        @for (item of model; track item.label) {
            @if (!item.separator) {
                <li app-menuitem [item]="item" [root]="true"></li>
            } @else {
                <li class="menu-separator"></li>
            }
        }
    </ul> `,
})
export class AppMenu {
    model: MenuItem[] = [];

    constructor(private readonly auth: MockAuthService) {}

    ngOnInit() {
        const role = this.auth.getRole();
        const isRoot = role === 'super_admin';
        const canManageAcademy = ['tenant_owner', 'academy_admin'].includes(role);
        const canManagePlayers = ['tenant_owner', 'academy_admin', 'staff'].includes(role);

        this.model = [
            {
                label: 'Principal',
                items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }]
            },
            {
                label: 'Mi cuenta',
                items: [
                    { label: 'Perfil', icon: 'pi pi-fw pi-user', routerLink: ['/account/profile'] },
                    ...(canManageAcademy ? [{ label: 'Academia', icon: 'pi pi-fw pi-building', routerLink: ['/academy'] }] : []),
                    ...(canManagePlayers ? [{ label: 'Jugadores', icon: 'pi pi-fw pi-users', routerLink: ['/players'] }] : [])
                ]
            },
            ...(isRoot
                ? [
                      {
                          label: 'Plataforma',
                          items: [{ label: 'Academias', icon: 'pi pi-fw pi-building', routerLink: ['/tenants'] }]
                      }
                  ]
                : []),
            {
                label: 'Soporte',
                items: [
                    {
                        label: 'Documentación',
                        icon: 'pi pi-fw pi-book',
                        routerLink: ['/documentation']
                    },
                    {
                        label: 'View Source',
                        icon: 'pi pi-fw pi-github',
                        url: 'https://github.com/juancitowillyr46/playertech-webapp',
                        target: '_blank'
                    }
                ]
            }
        ];
    }
}
