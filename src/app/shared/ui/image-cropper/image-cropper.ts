import { CommonModule } from '@angular/common';
import { AfterViewChecked, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SliderModule } from 'primeng/slider';

export interface ImageCropperResult {
    blob: Blob;
    dataUrl: string;
    fileName: string;
}

export interface ImageCropperFileError {
    reason: 'file-too-large' | 'invalid-file-type';
    maxFileSizeMb: number;
    fileName: string;
    allowedFileExtensions: string[];
}

@Component({
    selector: 'app-image-cropper',
    standalone: true,
    imports: [ButtonModule, CommonModule, DialogModule, FormsModule, ProgressSpinnerModule, SliderModule],
    template: `
        <p-dialog
            [(visible)]="visible"
            [header]="title"
            [modal]="true"
            [draggable]="false"
            [resizable]="false"
            [style]="{ width: '42rem' }"
            [breakpoints]="{ '960px': '92vw', '640px': '100vw' }"
            [contentStyle]="{ overflow: 'visible' }"
            styleClass="app-image-cropper-dialog"
            (onHide)="handleCancel()"
        >
            <div class="space-y-4 sm:space-y-5">
                <div>
                    <p class="m-0 text-sm font-medium text-surface-900 dark:text-surface-0">{{ fileName || 'Nueva imagen' }}</p>
                    <p class="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">{{ subtitle }}</p>
                </div>

                @if (validationMessage) {
                    <div class="rounded-[0.85rem] border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-400/30 dark:bg-rose-400/10 dark:text-rose-300">
                        {{ validationMessage }}
                    </div>
                }

                <div class="grid gap-4 lg:grid-cols-[minmax(0,1fr)_16rem]">
                    <div class="rounded-[1rem] border border-slate-200 bg-slate-50 p-3 sm:p-4 dark:border-surface-700 dark:bg-surface-900/50">
                        <div class="mx-auto flex aspect-square w-full max-w-[20rem] items-center justify-center overflow-hidden rounded-[1rem] border border-slate-200 bg-white shadow-sm dark:border-surface-700 dark:bg-surface-900">
                            @if (isPreparing) {
                                <div class="flex flex-col items-center gap-3 text-center">
                                    <p-progress-spinner strokeWidth="4" styleClass="h-10 w-10" />
                                    <p class="m-0 text-sm text-slate-500 dark:text-slate-400">Preparando imagen...</p>
                                </div>
                            } @else if (sourceUrl) {
                                <canvas #previewCanvas width="288" height="288" class="h-full w-full rounded-[1rem]"></canvas>
                            }
                        </div>
                    </div>

                    <div class="space-y-4 rounded-[1rem] border border-slate-200 bg-white p-3 sm:p-4 dark:border-surface-700 dark:bg-surface-900">
                        <div>
                            <p class="m-0 text-sm font-medium text-surface-900 dark:text-surface-0">Ajustes</p>
                            <p class="mt-1 text-xs leading-5 text-slate-400 dark:text-slate-500">Ajusta el encuadre hasta que la imagen se vea como esperas.</p>
                        </div>

                        <div class="space-y-2">
                            <label class="text-sm font-medium text-surface-700 dark:text-surface-200">Zoom</label>
                            <p-slider [(ngModel)]="zoom" [min]="1" [max]="2" [step]="0.05" [disabled]="isPreparing || isApplying" (ngModelChange)="onCropChange()" />
                            <div class="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
                                <span>Amplio</span>
                                <span>{{ zoom.toFixed(2) }}x</span>
                                <span>Cercano</span>
                            </div>
                        </div>

                        <div class="space-y-2">
                            <label class="text-sm font-medium text-surface-700 dark:text-surface-200">Posición vertical</label>
                            <p-slider [(ngModel)]="offsetY" [min]="-100" [max]="100" [step]="1" [disabled]="isPreparing || isApplying" (ngModelChange)="onCropChange()" />
                            <div class="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
                                <span>Arriba</span>
                                <span>Centro</span>
                                <span>Abajo</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ng-template pTemplate="footer">
                <div class="flex flex-col gap-2 border-t border-slate-200 pt-3 sm:flex-row sm:justify-end dark:border-surface-700">
                    <p-button label="Cancelar" severity="secondary" text styleClass="w-full sm:w-auto" [disabled]="isApplying" (onClick)="handleCancel()" />
                    <p-button label="Usar imagen" styleClass="w-full sm:w-auto" [loading]="isApplying" [disabled]="isPreparing || !sourceUrl" (onClick)="apply()" />
                </div>
            </ng-template>
        </p-dialog>
    `,
    styles: `
        :host ::ng-deep .app-image-cropper-dialog {
            border-radius: 1rem;
            overflow: hidden;
        }

        :host ::ng-deep .app-image-cropper-dialog .p-dialog-content {
            padding: 1rem;
        }

        :host ::ng-deep .app-image-cropper-dialog .p-dialog-footer {
            padding: 0 1rem 1rem;
        }

        @media (max-width: 640px) {
            :host ::ng-deep .app-image-cropper-dialog {
                margin: 0;
                max-height: 100dvh;
                border-radius: 0;
            }

            :host ::ng-deep .app-image-cropper-dialog .p-dialog-header {
                padding: 1rem 1rem 0.75rem;
            }

            :host ::ng-deep .app-image-cropper-dialog .p-dialog-content {
                padding: 0 1rem 1rem;
            }

            :host ::ng-deep .app-image-cropper-dialog .p-dialog-footer {
                position: sticky;
                bottom: 0;
                padding: 0.75rem 1rem 1rem;
                background: var(--p-surface-0, #ffffff);
            }
        }
    `
})
export class ImageCropperComponent implements AfterViewChecked, OnDestroy {
    @ViewChild('previewCanvas') previewCanvas?: ElementRef<HTMLCanvasElement>;

    @Input() title = 'Ajustar imagen';
    @Input() subtitle = 'Revisa la vista previa antes de continuar.';
    @Input() maxFileSizeMb = 3;
    @Input() allowedFileExtensions: string[] = ['png', 'jpg', 'jpeg', 'svg'];

    @Output() closed = new EventEmitter<void>();
    @Output() applied = new EventEmitter<ImageCropperResult>();
    @Output() fileError = new EventEmitter<ImageCropperFileError>();

    visible = false;
    isPreparing = false;
    isApplying = false;
    sourceUrl: string | null = null;
    fileName = '';
    validationMessage: string | null = null;
    zoom = 1;
    offsetY = 0;
    private pendingRender = false;
    private objectUrlSource: string | null = null;

    ngAfterViewChecked() {
        if (this.visible && this.pendingRender && !this.isPreparing) {
            this.renderPreview();
            this.pendingRender = false;
        }
    }

    ngOnDestroy() {
        this.cleanupObjectUrl();
    }

    openWithFile(file: File) {
        const extension = file.name.split('.').pop()?.toLowerCase() ?? '';

        if (!this.allowedFileExtensions.includes(extension)) {
            this.validationMessage = `Selecciona una imagen en formato ${this.allowedFileExtensions.map((item) => item.toUpperCase()).join(', ')}.`;
            this.fileError.emit({
                reason: 'invalid-file-type',
                maxFileSizeMb: this.maxFileSizeMb,
                fileName: file.name,
                allowedFileExtensions: this.allowedFileExtensions
            });
            return;
        }

        if (file.size > this.maxFileSizeMb * 1024 * 1024) {
            this.validationMessage = `Selecciona una imagen de hasta ${this.maxFileSizeMb} MB.`;
            this.fileError.emit({
                reason: 'file-too-large',
                maxFileSizeMb: this.maxFileSizeMb,
                fileName: file.name,
                allowedFileExtensions: this.allowedFileExtensions
            });
            return;
        }

        this.validationMessage = null;
        this.cleanupObjectUrl();
        this.objectUrlSource = URL.createObjectURL(file);
        this.sourceUrl = this.objectUrlSource;
        this.fileName = file.name;
        this.zoom = 1;
        this.offsetY = 0;
        this.isPreparing = true;
        this.visible = true;
        this.pendingRender = true;

        setTimeout(() => {
            this.isPreparing = false;
            this.pendingRender = true;
        }, 0);
    }

    openWithPreview(previewUrl: string, fileName: string, offsetY = 0) {
        this.validationMessage = null;
        this.cleanupObjectUrl();
        this.sourceUrl = previewUrl;
        this.fileName = fileName;
        this.zoom = 1;
        this.offsetY = offsetY;
        this.isPreparing = false;
        this.visible = true;
        this.pendingRender = true;
    }

    onCropChange() {
        this.pendingRender = true;
    }

    handleCancel() {
        this.isPreparing = false;
        this.isApplying = false;
        this.visible = false;
        this.validationMessage = null;
        this.cleanupObjectUrl();
        this.closed.emit();
    }

    async apply() {
        if (!this.sourceUrl) {
            this.visible = false;
            return;
        }

        this.isApplying = true;
        const result = await this.generateCroppedImage();
        this.isApplying = false;

        if (!result) {
            return;
        }

        this.visible = false;
        this.validationMessage = null;
        this.cleanupObjectUrl();
        this.applied.emit({
            blob: result.blob,
            dataUrl: result.dataUrl,
            fileName: this.fileName
        });
    }

    private async generateCroppedImage(): Promise<{ dataUrl: string; blob: Blob } | null> {
        if (!this.sourceUrl) {
            return null;
        }

        const image = await this.loadImage(this.sourceUrl);
        const canvas = document.createElement('canvas');
        const size = 512;
        canvas.width = size;
        canvas.height = size;

        const context = canvas.getContext('2d');
        if (!context) {
            return null;
        }

        this.drawToCanvas(context, image, size);

        const dataUrl = canvas.toDataURL('image/png');
        const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
        if (!blob) {
            return null;
        }

        return { dataUrl, blob };
    }

    private renderPreview() {
        const canvas = this.previewCanvas?.nativeElement;
        if (!canvas || !this.sourceUrl) {
            return;
        }

        const context = canvas.getContext('2d');
        if (!context) {
            return;
        }

        this.loadImage(this.sourceUrl).then((image) => {
            this.drawToCanvas(context, image, canvas.width);
        });
    }

    private drawToCanvas(context: CanvasRenderingContext2D, image: HTMLImageElement, size: number) {
        const baseScale = Math.max(size / image.width, size / image.height);
        const scale = baseScale * this.zoom;
        const scaledWidth = image.width * scale;
        const scaledHeight = image.height * scale;
        const maxOffsetY = Math.max(0, (scaledHeight - size) / 2);
        const translatedOffsetY = (this.offsetY / 100) * maxOffsetY;
        const drawX = (size - scaledWidth) / 2;
        const drawY = (size - scaledHeight) / 2 + translatedOffsetY;

        context.clearRect(0, 0, size, size);
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, size, size);
        context.drawImage(image, drawX, drawY, scaledWidth, scaledHeight);
    }

    private loadImage(source: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = () => resolve(image);
            image.onerror = reject;
            image.src = source;
        });
    }

    private cleanupObjectUrl() {
        if (this.objectUrlSource) {
            URL.revokeObjectURL(this.objectUrlSource);
            this.objectUrlSource = null;
        }
    }
}
