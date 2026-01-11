import { Directive, ElementRef, HostListener, Input, OnDestroy, Renderer2 } from '@angular/core';

@Directive({
  selector: '[mkTooltip]',
  standalone: true,
})
export class TooltipDirective implements OnDestroy {
  @Input('mkTooltip') tooltipText = '';


  tooltipElement!: HTMLElement;
  arrowElement!: HTMLElement;

  constructor(private el: ElementRef, private renderer: Renderer2) {
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    if (!this.tooltipText) return;

    // Создание тултипа
    this.tooltipElement = this.renderer.createElement('div');
    this.tooltipElement.innerText = this.tooltipText;

    this.renderer.appendChild(document.body, this.tooltipElement);

    this.createContainer();

    // Создание стрелки
    this.arrowElement = this.renderer.createElement('div');
    this.renderer.appendChild(this.tooltipElement, this.arrowElement);

    this.createArrow();

    const rect = this.el.nativeElement.getBoundingClientRect();
    const top = rect.top + window.scrollY - 30;
    const left = rect.left + window.scrollX - this.tooltipElement.offsetWidth / 2 + 12;

    this.renderer.setStyle(this.tooltipElement, 'top', `${ top }px`);
    this.renderer.setStyle(this.tooltipElement, 'left', `${ left }px`);
  }

  ngOnDestroy(): void {
    if (this.tooltipElement) {
      this.renderer.removeChild(document.body, this.tooltipElement);
    }
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    if (this.tooltipElement) {
      this.renderer.removeChild(document.body, this.tooltipElement);
    }
  }

  private createArrow(): void {
    this.renderer.setStyle(this.arrowElement, 'position', 'absolute');
    this.renderer.setStyle(this.arrowElement, 'bottom', '-5px');
    this.renderer.setStyle(this.arrowElement, 'left', '50%');
    this.renderer.setStyle(this.arrowElement, 'transform', 'translateX(-50%)');
    this.renderer.setStyle(this.arrowElement, 'width', '0');
    this.renderer.setStyle(this.arrowElement, 'height', '0');
    this.renderer.setStyle(this.arrowElement, 'borderLeft', '5px solid transparent');
    this.renderer.setStyle(this.arrowElement, 'borderRight', '5px solid transparent');
    this.renderer.setStyle(this.arrowElement, 'borderTop', '5px solid #333');
  }

  private createContainer(): void {
    this.renderer.setStyle(this.tooltipElement, 'position', 'absolute');
    this.renderer.setStyle(this.tooltipElement, 'background', '#333');
    this.renderer.setStyle(this.tooltipElement, 'color', '#fff');
    this.renderer.setStyle(this.tooltipElement, 'padding', '6px 10px');
    this.renderer.setStyle(this.tooltipElement, 'borderRadius', '4px');
    this.renderer.setStyle(this.tooltipElement, 'fontSize', '12px');
    this.renderer.setStyle(this.tooltipElement, 'pointerEvents', 'none');
    this.renderer.setStyle(this.tooltipElement, 'zIndex', '1000');
    this.renderer.setStyle(this.tooltipElement, 'textAlign', 'center');
  }
}
