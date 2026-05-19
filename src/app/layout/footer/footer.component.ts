import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="footer">
      <div class="container">
        <span>&copy; {{ year }} Recipe Social Network &amp; Planner</span>
      </div>
    </footer>
  `,
  styles: [
    `
      .footer {
        border-top: 1px solid var(--color-border);
        background: var(--color-surface);
        padding: 16px 0;
        color: var(--color-muted);
        font-size: 14px;
        text-align: center;
      }
    `
  ]
})
export class FooterComponent {
  readonly year = new Date().getFullYear();
}
