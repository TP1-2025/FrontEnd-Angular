// src/app/shared/components/risk-charts/risk-charts.component.ts

import { Component, Input, OnChanges } from '@angular/core';
import { DashboardSummary } from '../../../core/models/prediction.model';

@Component({
  selector: 'app-risk-charts',
  templateUrl: './risk-charts.component.html',
  styleUrls: ['./risk-charts.component.scss']
})
export class RiskChartsComponent implements OnChanges {
  @Input() summary!: DashboardSummary | null;

  maxConteoNivel = 0;
  maxConteoCluster = 0;

  ngOnChanges(): void {
    if (!this.summary) {
      this.maxConteoNivel = 0;
      this.maxConteoCluster = 0;
      return;
    }

    this.maxConteoNivel = Math.max(
      ...this.summary.por_nivel_riesgo.map(x => x.conteo),
      1
    );

    this.maxConteoCluster = this.summary.por_cluster.length
      ? Math.max(...this.summary.por_cluster.map(x => x.conteo))
      : 1;
  }

  calcularAnchoBarra(conteo: number, max: number): string {
    const pct = (conteo / max) * 100;
    return pct.toFixed(1) + '%';
  }
}
