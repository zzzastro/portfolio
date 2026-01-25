import { Component, AfterViewInit, OnInit, Renderer2, OnDestroy, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import 'iconify-icon';
import { loadIcons } from 'iconify-icon';
import { ThemeService } from './theme/theme.service';
import { CommonModule } from '@angular/common';
import { ResumeViewerComponent } from './resume-viewer/resume-viewer.component';



import { NavbarComponent } from './navbar/navbar.component';
import { ParticlesBackgroundComponent } from './particles-background/particles-background.component';
import { TooltipComponent } from './tooltip/tooltip.component';

interface Project {
  title: string;
  description: string;
  media: { type: 'image' | 'video'; src: string };
  link: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarComponent, ParticlesBackgroundComponent, CommonModule, ResumeViewerComponent, TooltipComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class AppComponent implements OnInit, AfterViewInit, OnDestroy {

  title = 'portfolio-self';


  projects: Project[] = [
    {
      title: 'CiteCat',
      description: 'Django-based web app to detect content similarity using Pythons PyTorch library.',
      media: { type: 'video', src: 'assets/projects/project1.mp4' },
      link: ''
    },
    {
      title: 'Noteapp',
      description: 'A modern, feature-rich note-taking application built with Django & Tailwind.',
      media: { type: 'video', src: 'assets/projects/noteapp_project.mp4' },
      link: 'https://github.com/zzzastro/Noteapp'
    },
    {
      title: 'Storefront',
      description: 'A ecommerce project with a shopping cart, product listing, and checkout functionality.',
      media: { type: 'video', src: 'assets/projects/project3.mp4' },
      link: ''
    },
    {
      title: 'PDF Annotator',
      description: 'Tool that provides users with annotation capabilities to PDF documents.',
      media: { type: 'image', src: 'assets/projects/project.jpg' },
      link: ''
    },
    {
      title: 'Personal Portfolio',
      description: 'A personal portfolio project to showcase my information, skills, and projects.',
      media: { type: 'image', src: 'assets/projects/portfolio-project.png' },
      link: 'https://github.com/zzzastro/github-portfolio'
    },

  ];

  // Resume viewer state
  showResume = false;

  private navLinkUnlisteners: (() => void)[] = [];
  private animationQueues: Map<string, number> = new Map();
  private currentlyAnimating: string | null = null;

  constructor(private renderer: Renderer2, private themeService: ThemeService) { }

  ngOnInit(): void {
    // Initialize theme
    this.themeService.initTheme();

    // Preload icons to prevent flickering
    loadIcons([
      'skill-icons:python-dark',
      'skill-icons:django',
      'skill-icons:angular-dark',
      'skill-icons:typescript',
      'skill-icons:docker',
      'skill-icons:figma-dark',
      'skill-icons:git',
      'skill-icons:react-dark',
      'skill-icons:astro',
      'skill-icons:nestjs-dark',
      'skill-icons:tailwindcss-dark',
      'logos:facebook',
      'skill-icons:linkedin',
      'skill-icons:github-dark',
      'skill-icons:gmail-dark'
    ]);

    // Remove URL fragment (if any) on initial load and scroll to the top
    if (window.location.hash) {

      const cleanUrl = window.location.href.split('#')[0];
      window.history.replaceState({}, document.title, cleanUrl);
      window.scrollTo(0, 0);
    }
  }

  ngAfterViewInit(): void {
    // Ensure page is scrolled to the top after view initialization
    setTimeout(() => {
      if (!window.location.hash) {
        window.scrollTo(0, 0);
      }
    }, 100);

    // Attach click event listeners to navigation links using Renderer2
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
      // Skip any link that should be handled by its own component (portfolio link)
      if ((link as HTMLElement).classList.contains('portfolio-link')) {
        return;
      }
      const unlisten = this.renderer.listen(link, 'click', (event: Event) => {
        event.preventDefault();
        const targetId = (link as HTMLAnchorElement).getAttribute('href');
        if (targetId === '#' || targetId === '') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
        if (targetId) {
          const targetSection = document.querySelector(targetId) as HTMLElement;
          if (targetSection) {
            // If clicking a different section, clear all queues and stop current animation
            if (this.currentlyAnimating && this.currentlyAnimating !== targetId) {
              // Clear all queues
              this.animationQueues.clear();
              // Remove animation class from currently animating element
              const currentSection = document.querySelector(this.currentlyAnimating) as HTMLElement;
              if (currentSection) {
                currentSection.classList.remove('bounce-animation');
              }
            }

            // Get current queue count for this section
            const queueCount = this.animationQueues.get(targetId) || 0;

            // Only queue if less than 5
            if (queueCount < 5) {
              this.animationQueues.set(targetId, queueCount + 1);

              // If not currently animating this section, start the animation loop
              if (this.currentlyAnimating !== targetId) {
                this.playBounceAnimationQueue(targetId, targetSection);
              }
            }

            // Smooth scroll to the target section
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });
      this.navLinkUnlisteners.push(unlisten);
    });

    // Dispatch a resize event after a delay to recalculate particle background dimensions
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 200);
  }

  ngOnDestroy(): void {
    // Remove attached event listeners to avoid memory leaks
    this.navLinkUnlisteners.forEach(unlisten => unlisten());
  }

  private playBounceAnimationQueue(targetId: string, targetSection: HTMLElement): void {
    const queueCount = this.animationQueues.get(targetId) || 0;

    if (queueCount > 0) {
      this.currentlyAnimating = targetId;

      // Play one animation
      targetSection.classList.remove('bounce-animation');
      void targetSection.offsetWidth; // Force reflow
      targetSection.classList.add('bounce-animation');

      // Decrement queue
      this.animationQueues.set(targetId, queueCount - 1);

      // After animation completes, play next in queue
      setTimeout(() => {
        targetSection.classList.remove('bounce-animation');

        // Check if there are more in queue
        const remainingCount = this.animationQueues.get(targetId) || 0;
        if (remainingCount > 0) {
          // Play next animation
          this.playBounceAnimationQueue(targetId, targetSection);
        } else {
          // Queue is empty, clear current animation
          this.currentlyAnimating = null;
          this.animationQueues.delete(targetId);
        }
      }, 1100); // Animation duration
    } else {
      this.currentlyAnimating = null;
      this.animationQueues.delete(targetId);
    }
  }


  contactEmail(): void {
    const email = 'ashish.bhatt.app@gmail.com';
    const subject = 'Regarding Your Portfolio';
    const body = 'Hi Ashish,\n\nI came across your portfolio and would like to connect properly.';
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
  }

  openResume(): void {
    this.showResume = true;
    // Prevent background scrolling
    document.body.style.overflow = 'hidden';
  }

  closeResume(): void {
    this.showResume = false;
    // Restore background scrolling
    document.body.style.overflow = 'auto';
  }

  // Handle Missing Media Errors by providing fallback content
  handleMediaError(event: Event) {
    const target = event.target as HTMLImageElement | HTMLVideoElement;

    if (target instanceof HTMLImageElement) {
      target.src = 'assets/fallback-image.png'; // Fallback for images
    } else if (target instanceof HTMLVideoElement) {
      // Fallback for video: set poster image and hide video element
      target.setAttribute('poster', 'assets/fallback-image.png'); // Set poster image as fallback
      target.style.display = 'none'; // Hide the video itself

      // Create and append a fallback image element
      const fallbackImage = document.createElement('img');
      fallbackImage.src = 'assets/fallback-image.png';
      fallbackImage.alt = 'Video not available';
      fallbackImage.classList.add('fallback-media');
      target.parentElement?.appendChild(fallbackImage);
    }
  }

}


