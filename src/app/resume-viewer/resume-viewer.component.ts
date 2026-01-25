import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { Subscription } from 'rxjs';
import { ThemeService } from '../theme/theme.service';
import { TooltipComponent } from '../tooltip/tooltip.component';

@Component({
    selector: 'app-resume-viewer',
    standalone: true,
    imports: [CommonModule, PdfViewerModule, TooltipComponent],
    templateUrl: './resume-viewer.component.html',
    styleUrls: ['./resume-viewer.component.css']
})
export class ResumeViewerComponent implements OnInit, OnDestroy {
    @Output() close = new EventEmitter<void>();

    pdfSrc = './assets/resume.pdf';
    zoom = 1.0;
    private themeSubscription: Subscription | undefined;

    constructor(private themeService: ThemeService) { }

    ngOnInit() {
        this.themeSubscription = this.themeService.theme$.subscribe(theme => {
            this.pdfSrc = theme === 'dark' ? './assets/resume-dark.pdf' : './assets/resume.pdf';
        });
    }

    ngOnDestroy() {
        if (this.themeSubscription) {
            this.themeSubscription.unsubscribe();
        }
    }

    closeViewer() {
        this.close.emit();
    }

    downloadResume() {
        const link = document.createElement('a');
        link.href = this.pdfSrc;
        link.download = 'Ashish_Bhatt_Resume.pdf';
        link.click();
    }

    zoomIn() {
        this.zoom += 0.1;
    }

    zoomOut() {
        if (this.zoom > 0.5) {
            this.zoom -= 0.1;
        }
    }
}
