import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import {
  HistoricalScoresResponse,
  PeriodScoresResponse,
  ComparePeriodsResponse,
} from '../models/prediction.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly baseUrl = 'https://lactogenic-alisha-extemporaneous.ngrok-free.dev';

  private readonly ngrokHeaders = new HttpHeaders({
    'ngrok-skip-browser-warning': 'true',   
  });

  constructor(private http: HttpClient) {}

  getHealth(): Observable<{ status: string; detail: string }> {
    return this.http.get<{ status: string; detail: string }>(
      `${this.baseUrl}/health`,
      {
        headers: this.ngrokHeaders,
      }
    );
  }

  getHistoricalScores(
    limitDetalle: number = 1000
  ): Observable<HistoricalScoresResponse> {
    return this.http.get<HistoricalScoresResponse>(
      `${this.baseUrl}/historical_scores`,
      {
        params: {
          limit_detalle: limitDetalle,
        } as any,
        headers: this.ngrokHeaders,
      }
      
    );
  }

  getPeriodScores(
    numperiodo: number,
    limitDetalle: number = 1000
  ): Observable<PeriodScoresResponse> {
    return this.http.get<PeriodScoresResponse>(
      `${this.baseUrl}/period_scores`,
      {
        params: {
          numperiodo,
          limit_detalle: limitDetalle,
        } as any,
        headers: this.ngrokHeaders,
      }
    );
  }

  comparePeriods(
    periodoA: number,
    periodoB: number
  ): Observable<ComparePeriodsResponse> {
    return this.http.get<ComparePeriodsResponse>(
      `${this.baseUrl}/compare_periods`,
      {
        params: {
          periodo_a: periodoA,
          periodo_b: periodoB,
        } as any,
        headers: this.ngrokHeaders,
      }
    );
  }

  uploadCsvForSummary(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{
      resumen: any;
      detalle: any[];
    }>(
      `${this.baseUrl}/predict_file_with_summary`, 
      formData,
      {
        headers: this.ngrokHeaders,
      }
    );

  }
}
