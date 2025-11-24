// src/app/features/dashboard/dashboard.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DashboardService } from '../../core/services/churn-api.service';
import { FileUploadComponent } from '../../shared/components/file-upload.component/file-upload.component';
import { MetricsCardsComponent } from '../../shared/components/metrics-cards.component/metrics-cards.component';
import { RiskChartsComponent } from '../../shared/components/risk-charts.component/risk-charts.component';
import { RiskTableComponent } from '../../shared/components/risk-table.component/risk-table.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FileUploadComponent,
    MetricsCardsComponent,
    RiskChartsComponent,
    RiskTableComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

 
  mode: 'historico' | 'mes' | 'comparacion' = 'historico';

  errorMessage = '';

  loadingHistorico = false;
  summaryHistorico: any | null = null;
  detalleHistorico: any[] = [];
  periodosDisponibles: number[] = [];


  comunidadesTopHistorico: any[] = [];
  evolucionPeriodoHistorico: any[] = [];


  loadingMes = false;
  selectedPeriodoMes: number | null = null;
  summaryMes: any | null = null;
  detalleMes: any[] = [];

  comunidadesTopMes: any[] = [];

  // -------- Vista comparación A vs B --------
  loadingComparacion = false;
  selectedPeriodoA: number | null = null;
  selectedPeriodoB: number | null = null;
  compareResult: any | null = null;
  comunidadesTopA: any[] = [];
  comunidadesTopB: any[] = [];


  constructor(private api: DashboardService) {}

  ngOnInit(): void {
    this.loadHistorico();
  }

  setMode(mode: 'historico' | 'mes' | 'comparacion'): void {
    this.mode = mode;
    this.errorMessage = '';

    if (mode === 'historico' && !this.summaryHistorico) {
      this.loadHistorico();
    }
  }


  loadHistorico(): void {
    this.loadingHistorico = true;
    this.errorMessage = '';

    this.api.getHistoricalScores().subscribe({
      next: (resp) => {
        this.summaryHistorico = resp.resumen;
        this.detalleHistorico = resp.detalle ?? [];
        this.periodosDisponibles = resp.periodos ?? [];


        this.comunidadesTopHistorico = (resp as any).comunidades_top ?? [];
        this.evolucionPeriodoHistorico = (resp as any).evolucion_periodo ?? [];

        this.loadingHistorico = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Error al cargar el histórico.';
        this.loadingHistorico = false;
      }
    });
  }


  loadMes(): void {
    if (!this.selectedPeriodoMes) {
      this.errorMessage = 'Selecciona un periodo para cargar.';
      return;
    }

    this.loadingMes = true;
    this.errorMessage = '';
    this.summaryMes = null;
    this.detalleMes = [];
    this.comunidadesTopMes = [];

    this.api.getPeriodScores(this.selectedPeriodoMes).subscribe({
      next: (resp) => {
        this.summaryMes = resp.resumen;
        this.detalleMes = resp.detalle ?? [];
        // Top comunidades para ese periodo
        this.comunidadesTopMes = (resp as any).comunidades_top ?? [];

        this.loadingMes = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Error al cargar datos del periodo.';
        this.loadingMes = false;
      }
    });
  }


  onCsvUploaded(result: { resumen: any; detalle: any[] }): void {
    this.summaryMes = result.resumen;
    this.detalleMes = result.detalle;
    this.comunidadesTopMes = [];  
    this.errorMessage = '';
  }


    loadComparacion(): void {
    if (!this.selectedPeriodoA || !this.selectedPeriodoB) {
      this.errorMessage = 'Selecciona ambos periodos para comparar.';
      return;
    }
    if (this.selectedPeriodoA === this.selectedPeriodoB) {
      this.errorMessage = 'Los periodos A y B deben ser distintos.';
      return;
    }

    this.loadingComparacion = true;
    this.errorMessage = '';
    this.compareResult = null;
    this.comunidadesTopA = [];
    this.comunidadesTopB = [];

    this.api.comparePeriods(this.selectedPeriodoA, this.selectedPeriodoB).subscribe({
      next: (resp) => {
        this.compareResult = resp;
        this.comunidadesTopA = resp.comunidades_top_a ?? [];
        this.comunidadesTopB = resp.comunidades_top_b ?? [];
        this.loadingComparacion = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Error al comparar los periodos.';
        this.loadingComparacion = false;
      }
    });
  }
  downloadDetalleMesCSV(): void {
  if (!this.detalleMes || this.detalleMes.length === 0) {
    alert("No hay datos para descargar.");
    return;
  }

  const rows = this.detalleMes;


  const csvHeaders = Object.keys(rows[0]);
  const csvRows = rows.map(row =>
    csvHeaders.map(h => JSON.stringify(row[h] ?? "")).join(",")
  );

  const csvString = [csvHeaders.join(","), ...csvRows].join("\n");

  // Crear archivo descargable
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `detalle_${this.selectedPeriodoMes}.csv`;
  link.click();


  URL.revokeObjectURL(url);
}


}
