import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {
  constructor(private router: Router) {}

  verHistorico(): void {
    this.router.navigate(['/dashboard'], { queryParams: { mode: 'historico' } });
  }

  verPorMes(): void {
    this.router.navigate(['/dashboard'], { queryParams: { mode: 'mes' } });
  }
}
