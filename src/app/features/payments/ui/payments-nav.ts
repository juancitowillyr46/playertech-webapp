import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-payments-nav',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
        <div class="overflow-hidden rounded-[0.75rem] border border-slate-200 bg-white shadow-sm dark:border-surface-800 dark:bg-surface-900">
            <div class="flex flex-wrap gap-1 border-b border-slate-200 px-2 py-2 dark:border-surface-800 sm:px-3">
                <a
                    routerLink="/payments/concepts"
                    class="inline-flex items-center gap-2 rounded-[0.7rem] px-3 py-2 text-sm font-medium transition-colors"
                    [ngClass]="active === 'concepts' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-surface-800'"
                >
                    <i class="pi pi-wallet text-sm"></i>
                    <span>Conceptos</span>
                </a>

                <a
                    routerLink="/payments/charges"
                    class="inline-flex items-center gap-2 rounded-[0.7rem] px-3 py-2 text-sm font-medium transition-colors"
                    [ngClass]="active === 'charges' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-surface-800'"
                >
                    <i class="pi pi-receipt text-sm"></i>
                    <span>Cargos y deuda</span>
                </a>

                <a
                    routerLink="/payments/history"
                    class="inline-flex items-center gap-2 rounded-[0.7rem] px-3 py-2 text-sm font-medium transition-colors"
                    [ngClass]="active === 'payments' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-surface-800'"
                >
                    <i class="pi pi-credit-card text-sm"></i>
                    <span>Pagos</span>
                </a>

                <a
                    routerLink="/payments/rapid-collection"
                    class="inline-flex items-center gap-2 rounded-[0.7rem] px-3 py-2 text-sm font-medium transition-colors"
                    [ngClass]="active === 'rapid-collection' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-surface-800'"
                >
                    <i class="pi pi-bolt text-sm"></i>
                    <span>Recaudo rápido</span>
                </a>
            </div>
        </div>
    `
})
export class PaymentsNav {
    @Input({ required: true }) active!: 'concepts' | 'charges' | 'payments' | 'rapid-collection';
}
