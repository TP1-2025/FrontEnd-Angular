// src/app/core/models/prediction.model.ts

export interface PredictionRecord {
  numero: string;
  cluster_id: number;
  probabilidad_portabilidad: number;
  NUMPERIODO?: number;
  ds_base_bsns?: string;
  VCHPLAN_TIPO?: string;
  // agrega más campos si tu inference devuelve más
}

export interface RiskLevelSummary {
  nivel_riesgo: string;  // "BAJO" | "MEDIO" | "ALTO"
  conteo: number;
  prob_promedio: number;
}

export interface ClusterSummary {
  cluster_id: number;
  conteo: number;
  prob_promedio: number;
}

export interface PeriodSummary {
  NUMPERIODO: number;
  conteo: number;
  prob_promedio: number;
}

export interface DashboardSummary {
  total_lineas: number;
  promedio_probabilidad: number;
  porcentaje_alto_riesgo: number;
  por_nivel_riesgo: RiskLevelSummary[];
  por_cluster: ClusterSummary[];
  por_periodo: PeriodSummary[];
}

export interface HistoricalScoresResponse {
  resumen: DashboardSummary;
  detalle: PredictionRecord[];
  archivos_usados: string[];
}

export interface FilePredictResponse {
  resumen: DashboardSummary;
  detalle: PredictionRecord[];
}
