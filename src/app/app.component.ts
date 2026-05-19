import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { FooterComponent } from './layout/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-navbar />
    <main class="app-main">
      <router-outlet />
    </main>
    <app-footer />
  `,
  styles: [
    `
      .app-main {
        min-height: calc(100vh - 160px);
        padding: 24px 0;
      }
    `
  ]
})
export class AppComponent {}
