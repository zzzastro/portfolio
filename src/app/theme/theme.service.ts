import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type Theme = 'light' | 'dark';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private readonly THEME_KEY = 'user-theme-preference';
    private themeSubject: BehaviorSubject<Theme>;
    public theme$: Observable<Theme>;

    constructor() {
        const initialTheme = this.getInitialTheme();
        this.themeSubject = new BehaviorSubject<Theme>(initialTheme);
        this.theme$ = this.themeSubject.asObservable();
    }

    private getInitialTheme(): Theme {
        // Check if user has a saved preference
        const savedTheme = localStorage.getItem(this.THEME_KEY) as Theme | null;
        if (savedTheme) {
            return savedTheme;
        }

        // Otherwise, use system preference
        return this.getSystemTheme();
    }

    private getSystemTheme(): Theme {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    public initTheme(): void {
        const theme = this.themeSubject.value;
        this.applyTheme(theme);

        // Listen for system theme changes
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                // Only auto-switch if user hasn't set a manual preference
                if (!localStorage.getItem(this.THEME_KEY)) {
                    const newTheme = e.matches ? 'dark' : 'light';
                    this.setTheme(newTheme);
                }
            });
        }
    }

    public toggleTheme(): void {
        const newTheme: Theme = this.themeSubject.value === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
        // Save user's manual preference
        localStorage.setItem(this.THEME_KEY, newTheme);
    }

    public getTheme(): Theme {
        return this.themeSubject.value;
    }

    private setTheme(theme: Theme): void {
        this.themeSubject.next(theme);
        this.applyTheme(theme);
    }

    private applyTheme(theme: Theme): void {
        const body = document.body;
        body.classList.remove('light-theme', 'dark-theme');
        body.classList.add(`${theme}-theme`);
    }
}
