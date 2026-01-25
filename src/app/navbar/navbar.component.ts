import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewEncapsulation, OnInit, HostListener } from '@angular/core';
import 'iconify-icon';
import { LucideAngularModule, Home, User, Briefcase, Mail, Sun, Moon } from 'lucide-angular';
import { ThemeService, Theme } from '../theme/theme.service';
import { TooltipComponent } from '../tooltip/tooltip.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [LucideAngularModule, TooltipComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  encapsulation: ViewEncapsulation.None
})

export class NavbarComponent implements OnInit {
  readonly Home = Home;
  readonly User = User;
  readonly Briefcase = Briefcase;
  readonly Mail = Mail;
  readonly Sun = Sun;
  readonly Moon = Moon;

  currentTheme: Theme = 'light';
  isMobile: boolean = false;

  constructor(private themeService: ThemeService) {
    // Subscribe to theme changes
    this.themeService.theme$.subscribe(theme => {
      this.currentTheme = theme;
    });
  }

  ngOnInit() {
    this.checkScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    this.isMobile = window.innerWidth <= 768;
  }

  onPortfolioClick(): void {
    // Scroll to top without reloading
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}

