export interface NivelRiesgoSummary {
  nivel: string;           // BAJO / MEDIO / ALTO
  conteo: number;
  prob_promedio: number;  
}

export interface ComunidadSummary {
  cluster_id: number;
  total_lineas: number;
  prob_promedio: number;
  pct_alto_riesgo: number;
  segmento_dominante?: string;
}

export interface PeriodoSummary {
  NUMPERIODO: number;
  conteo: number;
  prob_promedio: number;

  pct_alto_riesgo?: number;
}

export interface SegmentoSummary {
  segmento: string;
  conteo: number;
  prob_promedio: number;
  pct_alto_riesgo: number;
}

export interface DashboardSummary {
  total_lineas: number;
  promedio_probabilidad: number;
  porcentaje_alto_riesgo: number;

  por_nivel_riesgo: NivelRiesgoSummary[];


  por_cluster?: { cluster_id: number; conteo: number; prob_promedio: number }[];

   comunidades?: ComunidadSummary[];

  por_periodo: PeriodoSummary[];

  por_segmento?: SegmentoSummary[];
}


export interface PredictionRow {

  NUMPERIODO?: number;
  id_cst?: string;
  id_sbsc?: string;
  numero?: string;
  codigo_cliente?: string;
  tipo_documento?: string;
  numero_documento?: string;

  probabilidad_portabilidad: number;
  cluster_id?: number;
  nivel_riesgo?: string;


  [key: string]: any;
}


export interface EvolucionPeriodoPoint {
  NUMPERIODO: number;
  pct_alto_riesgo: number;   
}


export interface HistoricalScoresResponse {
  resumen: DashboardSummary;
  detalle: PredictionRow[];
  periodos: number[];

  comunidades_top: ComunidadSummary[];
  evolucion_periodo: EvolucionPeriodoPoint[];
}


export interface PeriodScoresResponse {
  resumen: DashboardSummary;
  detalle: PredictionRow[];
  periodo: number;
}

export interface ComparePeriodsResponse {
  periodo_a: number;
  resumen_a: DashboardSummary;
  periodo_b: number;
  resumen_b: DashboardSummary;


  comunidades_top_a?: ComunidadSummary[];
  comunidades_top_b?: ComunidadSummary[];
}

