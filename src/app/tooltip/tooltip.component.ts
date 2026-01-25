import { Component, Input, ViewEncapsulation, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-tooltip',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './tooltip.component.html',
    styleUrls: ['./tooltip.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class TooltipComponent {
    @Input() text: string = '';
    @Input() position: 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' = 'bottom';

    isVisible = false;
    currentPosition: 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' = 'bottom';

    constructor(private elementRef: ElementRef) { }

    show() {
        this.currentPosition = this.position;
        this.isVisible = true;

        // Update position based on viewport
        setTimeout(() => {
            this.updatePosition();
        }, 0);
    }

    hide() {
        this.isVisible = false;
    }

    private updatePosition() {
        if (!this.isVisible) return;

        const hostRect = this.elementRef.nativeElement.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;

        // If bottom position doesn't fit, switch to top
        if (this.position === 'bottom') {
            // Estimate space below (60px for tooltip height + margin)
            const spaceBelow = viewportHeight - hostRect.bottom;
            if (spaceBelow < 60) {
                this.currentPosition = 'top';
            }
        }
    }
}
