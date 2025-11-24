import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-risk-charts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './risk-charts.component.html',
  styleUrl: './risk-charts.component.scss'
})
export class RiskChartsComponent implements OnChanges {

  @Input() summary: any | null = null;

  @Input() comunidadesTop: any[] = [];
  @Input() evolucionPeriodo: any[] = [];

  nivelesRiesgo: { nivel: string; conteo: number; prob_promedio: number }[] = [];


  metricOptions = [
    { key: 'pct_alto_riesgo', label: '% alto riesgo' },
    { key: 'prob_promedio', label: 'Prob. media' }
  ] as const;

  selectedMetric: 'pct_alto_riesgo' | 'prob_promedio' = 'pct_alto_riesgo';


  periodos: any[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    this.buildNivelesRiesgo();
    this.buildPeriodos();
  }

  private buildNivelesRiesgo(): void {
    if (!this.summary || !Array.isArray(this.summary.por_nivel_riesgo)) {
      this.nivelesRiesgo = [];
      return;
    }

    this.nivelesRiesgo = this.summary.por_nivel_riesgo.map((r: any) => ({
      nivel: r.nivel_riesgo ?? r.nivel ?? '',
      conteo: r.conteo ?? 0,
      prob_promedio: r.prob_promedio ?? 0
    }));
  }

  private buildPeriodos(): void {
    if (this.evolucionPeriodo && this.evolucionPeriodo.length > 0) {

      this.periodos = this.evolucionPeriodo;
    } else if (this.summary && Array.isArray(this.summary.por_periodo)) {
     
      this.periodos = this.summary.por_periodo;
    } else {
      this.periodos = [];
    }
  }

   barWidthComunidad(c: any): string {
    if (!this.comunidadesTop || this.comunidadesTop.length === 0) {
      return '0%';
    }

    const key = this.selectedMetric;
    const value = Number(c[key] ?? 0);

    const max = Math.max(
      ...this.comunidadesTop.map((x) => Number(x[key] ?? 0)),
      0.0001
    );

    const pct = (value / max) * 100;
    return `${pct}%`;
  }

  labelValorComunidad(c: any): string {
    const key = this.selectedMetric;
    const value = Number(c[key] ?? 0);

    if (key === 'pct_alto_riesgo') {
      return `${(value * 100).toFixed(1)}% alto riesgo`;
    }
    return `${(value * 100).toFixed(1)}% prob. media`;
  }


  barWidthPeriodo(p: any): string {
    if (!this.periodos || this.periodos.length === 0) {
      return '0%';
    }

    const val = Number(p.pct_alto_riesgo ?? 0);
    const max = Math.max(
      ...this.periodos.map((x) => Number(x.pct_alto_riesgo ?? 0)),
      0.0001
    );

    const pct = (val / max) * 100;
    return `${pct}%`;
  }
}
