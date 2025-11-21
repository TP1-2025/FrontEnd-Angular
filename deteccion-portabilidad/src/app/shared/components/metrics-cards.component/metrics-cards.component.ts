import { Component, Input } from '@angular/core';
import { CommonModule, DecimalPipe, PercentPipe } from '@angular/common';
import { DashboardSummary } from '../../../core/models/prediction.model';

@Component({
  selector: 'app-metrics-cards',
  imports: [
    CommonModule,
    DecimalPipe,  
    PercentPipe    
  ],
  templateUrl: './metrics-cards.component.html',
  styleUrls: ['./metrics-cards.component.scss']
})
export class MetricsCardsComponent {
  @Input() summary!: DashboardSummary | null;
}
