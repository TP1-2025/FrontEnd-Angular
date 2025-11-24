import { Component, Input } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { DashboardSummary } from '../../../core/models/prediction.model'; 

@Component({
  selector: 'app-metrics-cards',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  templateUrl: './metrics-cards.component.html',
  styleUrl: './metrics-cards.component.scss'
})
export class MetricsCardsComponent {
  @Input() summary: DashboardSummary | null = null;
}
