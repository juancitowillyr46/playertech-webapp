import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

export interface PageHeaderBreadcrumb {
    label: string;
    routerLink?: string;
}

@Component({
    selector: 'app-page-header',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
        <div class="rounded-[0.75rem] border border-slate-200 bg-white px-4 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-surface-800 dark:bg-surface-900 sm:px-5 sm:py-5">
            <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div class="min-w-0 flex-1 space-y-0.5">
                    @if (breadcrumbs.length) {
                        <div class="flex flex-wrap items-center gap-2 text-[0.78rem] leading-none text-slate-500 dark:text-slate-400 sm:text-[0.82rem]">
                            @for (breadcrumb of breadcrumbs; track $index) {
                                @if (breadcrumb.routerLink) {
                                    <a [routerLink]="breadcrumb.routerLink" class="transition hover:text-slate-700 dark:hover:text-slate-200">{{ breadcrumb.label }}</a>
                                } @else {
                                    <span class="text-surface-700 dark:text-surface-200">{{ breadcrumb.label }}</span>
                                }

                                @if (!$last) {
                                    <span>/</span>
                                }
                            }
                        </div>
                    }

                    <div class="my-1">
                        <p class="!m-0 text-[1.15rem] font-semibold leading-[1.2] text-surface-900 dark:text-surface-0 sm:text-[1.25rem]">{{ title }}</p>
                    </div>

                    @if (subtitle) {
                        <p class="!m-0 text-sm leading-[1.45] text-slate-500 dark:text-slate-400">{{ subtitle }}</p>
                    }
                </div>

                <div class="shrink-0 self-start">
                    <ng-content select="[headerActions]"></ng-content>
                </div>
            </div>
        </div>
    `
})
export class PageHeader {
    @Input() title = '';
    @Input() subtitle = '';
    @Input() breadcrumbs: PageHeaderBreadcrumb[] = [];
}
