import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';
import Aura from '@primeuix/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(appRoutes, withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }), withEnabledBlockingInitialNavigation()),
        provideHttpClient(withFetch()),
        provideZonelessChangeDetection(),
        providePrimeNG({
            theme: { preset: Aura, options: { darkModeSelector: '.app-dark' } },
            translation: {
                accept: 'Sí',
                reject: 'No',
                cancel: 'Cancelar',
                choose: 'Elegir',
                upload: 'Subir',
                emptyFilterMessage: 'No hay resultados',
                emptyMessage: 'No hay opciones disponibles',
                searchMessage: '{0} resultados disponibles',
                selectionMessage: '{0} elementos seleccionados',
                aria: {
                    trueLabel: 'Verdadero',
                    falseLabel: 'Falso',
                    selectAll: 'Seleccionar todo',
                    unselectAll: 'Deseleccionar todo',
                    close: 'Cerrar',
                    previous: 'Anterior',
                    next: 'Siguiente',
                    firstPageLabel: 'Primera página',
                    lastPageLabel: 'Última página',
                    nextPageLabel: 'Página siguiente',
                    prevPageLabel: 'Página anterior',
                    rowsPerPageLabel: 'Filas por página'
                }
            }
        })
    ]
};
