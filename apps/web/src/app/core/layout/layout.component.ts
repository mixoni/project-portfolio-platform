import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <header style="padding: 1rem; background: #1f2933; color: white;">
      <h1 style="margin: 0;">Project Portfolio Demo - NX monorepo + Angular app + NestJS api + Angular library</h1>
    </header>

    <main style="padding: 1rem;">
      <router-outlet></router-outlet>
    </main>
  `,
})
export class LayoutComponent {}
