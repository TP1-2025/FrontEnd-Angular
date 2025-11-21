// src/app/features/dashboard/dashboard.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ChurnApiService } from '../../core/services/churn-api.service';
import {
  DashboardSummary,
  PredictionRecord,
  FilePredictResponse,
  HistoricalScoresResponse,
  PeriodSummary,
} from '../../core/models/prediction.model';

import { FileUploadComponent } from '../../shared/components/file-upload.component/file-upload.component'; 
import { MetricsCardsComponent } from '../../shared/components/metrics-cards.component/metrics-cards.component'; 
import { RiskTableComponent } from '../../shared/components/risk-table.component/risk-table.component'; 
import { RiskChartsComponent } from '../../shared/components/risk-charts.component/risk-charts.component'; 

type ModoVista = 'HISTORICO' | 'MES';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgClass,
    FileUploadComponent,
    MetricsCardsComponent,
    RiskTableComponent,
    RiskChartsComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  resumenHistorico: DashboardSummary | null = null;
  detalleHistorico: PredictionRecord[] = [];
  periodosDisponibles: number[] = [];

  resumenActual: DashboardSummary | null = null;
  detalleActual: PredictionRecord[] = [];

  cargandoHistorico = false;
  errorMessage: string | null = null;

  modoVista: ModoVista = 'HISTORICO';

  mesSeleccionado: number | null = null;
  mesComparar: number | null = null;

  filtroRiesgo: 'TODOS' | 'BAJO' | 'MEDIO' | 'ALTO' = 'TODOS';

  constructor(
    private api: ChurnApiService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const mode = (params['mode'] || '').toString().toLowerCase();
      if (mode === 'mes') {
        this.modoVista = 'MES';
      } else {
        this.modoVista = 'HISTORICO';
      }
    });

    this.cargarHistorico();
  }

  cargarHistorico(): void {
    this.cargandoHistorico = true;
    this.errorMessage = null;

    this.api.getHistoricalScores(0).subscribe({
      next: (resp: HistoricalScoresResponse) => {
        this.resumenHistorico = resp.resumen;
        this.detalleHistorico = resp.detalle;

        this.periodosDisponibles = (resp.resumen.por_periodo || [])
          .map((p: PeriodSummary) => p.NUMPERIODO)
          .sort();

        this.cargandoHistorico = false;
      },
      error: (err) => {
        this.errorMessage = 'Error cargando histórico: ' + (err?.error?.detail || '');
        this.cargandoHistorico = false;
      },
    });
  }

  onFileUploaded(response: FilePredictResponse): void {
    this.resumenActual = response.resumen;
    this.detalleActual = response.detalle;
    this.modoVista = 'MES';
    this.mesSeleccionado = null;
    this.mesComparar = null;
  }

  private buildSummaryFromRecords(records: PredictionRecord[]): DashboardSummary {
    if (!records || records.length === 0) {
      return {
        total_lineas: 0,
        promedio_probabilidad: 0,
        porcentaje_alto_riesgo: 0,
        por_nivel_riesgo: [],
        por_cluster: [],
        por_periodo: [],
      };
    }

    const total = records.length;
    const probs = records.map((r) => r.probabilidad_portabilidad || 0);
    const promedio = probs.reduce((a, b) => a + b, 0) / total;

    let bajo = 0,
      medio = 0,
      alto = 0;
    for (const p of probs) {
      if (p < 0.3) bajo++;
      else if (p < 0.7) medio++;
      else alto++;
    }

    const porcentajeAlto = alto / total;

    const porNivel = [
      { nivel_riesgo: 'BAJO', conteo: bajo, prob_promedio: 0 },
      { nivel_riesgo: 'MEDIO', conteo: medio, prob_promedio: 0 },
      { nivel_riesgo: 'ALTO', conteo: alto, prob_promedio: 0 },
    ];

    const clusterMap: { [key: string]: { conteo: number; sumaProb: number } } = {};
    for (const r of records) {
      const key = (r.cluster_id ?? -1).toString();
      if (!clusterMap[key]) clusterMap[key] = { conteo: 0, sumaProb: 0 };
      clusterMap[key].conteo++;
      clusterMap[key].sumaProb += r.probabilidad_portabilidad || 0;
    }
    const porCluster = Object.keys(clusterMap).map((k) => ({
      cluster_id: Number(k),
      conteo: clusterMap[k].conteo,
      prob_promedio: clusterMap[k].sumaProb / clusterMap[k].conteo,
    }));

    const periodoMap: { [key: string]: { conteo: number; sumaProb: number } } = {};
    for (const r of records) {
      const per = r.NUMPERIODO != null ? r.NUMPERIODO.toString() : 'NA';
      if (!periodoMap[per]) periodoMap[per] = { conteo: 0, sumaProb: 0 };
      periodoMap[per].conteo++;
      periodoMap[per].sumaProb += r.probabilidad_portabilidad || 0;
    }
    const porPeriodo = Object.keys(periodoMap).map((k) => ({
      NUMPERIODO: k === 'NA' ? -1 : Number(k),
      conteo: periodoMap[k].conteo,
      prob_promedio: periodoMap[k].sumaProb / periodoMap[k].conteo,
    }));

    return {
      total_lineas: total,
      promedio_probabilidad: promedio,
      porcentaje_alto_riesgo: porcentajeAlto,
      por_nivel_riesgo: porNivel,
      por_cluster: porCluster,
      por_periodo: porPeriodo,
    };
  }

  private filtrarPorPeriodo(records: PredictionRecord[], periodo: number | null): PredictionRecord[] {
    if (periodo == null) return records;
    return records.filter((r) => r.NUMPERIODO === periodo);
  }

  getResumenPrincipal(): DashboardSummary | null {
    if (this.resumenActual && this.detalleActual.length > 0) {
      return this.resumenActual;
    }

    if (this.modoVista === 'HISTORICO') {
      return this.resumenHistorico;
    }

    if (this.modoVista === 'MES' && this.mesSeleccionado != null && this.detalleActual.length === 0) {
      const regs = this.filtrarPorPeriodo(this.detalleHistorico, this.mesSeleccionado);
      return this.buildSummaryFromRecords(regs);
    }

    return this.resumenHistorico;
  }

  getDetallePrincipal(): PredictionRecord[] {
    const base = this.detalleActual.length > 0 ? this.detalleActual : this.detalleHistorico;

    let filtrados = base;
    if (this.modoVista === 'MES' && this.mesSeleccionado != null && this.detalleActual.length === 0) {
      filtrados = this.filtrarPorPeriodo(this.detalleHistorico, this.mesSeleccionado);
    }

    if (this.filtroRiesgo === 'TODOS') return filtrados;

    return filtrados.filter((r) => {
      const p = r.probabilidad_portabilidad;
      if (this.filtroRiesgo === 'BAJO') return p < 0.3;
      if (this.filtroRiesgo === 'MEDIO') return p >= 0.3 && p < 0.7;
      if (this.filtroRiesgo === 'ALTO') return p >= 0.7;
      return true;
    });
  }

  getResumenComparacion(): { actual: DashboardSummary; comparar: DashboardSummary } | null {
    if (this.detalleActual.length > 0) return null;
    if (!this.resumenHistorico) return null;
    if (this.mesSeleccionado == null || this.mesComparar == null) return null;

    const actualRegs = this.filtrarPorPeriodo(this.detalleHistorico, this.mesSeleccionado);
    const compararRegs = this.filtrarPorPeriodo(this.detalleHistorico, this.mesComparar);

    const resumenActual = this.buildSummaryFromRecords(actualRegs);
    const resumenComparar = this.buildSummaryFromRecords(compararRegs);

    return { actual: resumenActual, comparar: resumenComparar };
  }

  cambiarModoVista(modo: ModoVista): void {
    this.modoVista = modo;
    this.mesSeleccionado = null;
    this.mesComparar = null;
  }
}
