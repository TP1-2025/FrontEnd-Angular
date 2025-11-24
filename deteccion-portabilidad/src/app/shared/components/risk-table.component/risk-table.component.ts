import {
  Component,
  Input,
  ViewChild,
  OnChanges,
  SimpleChanges,
  AfterViewInit,
} from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { PredictionRow } from '../../../core/models/prediction.model';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-risk-table',
  standalone: true,
  imports: [
    CommonModule,
    DecimalPipe,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  templateUrl: './risk-table.component.html',
  styleUrls: ['./risk-table.component.scss'],
})
export class RiskTableComponent implements OnChanges, AfterViewInit {
  @Input() rows: PredictionRow[] = [];

  displayedColumns: string[] = [
    'NUMPERIODO',
    'cliente',
    'numero',
    'probabilidad',
    'nivel_riesgo',
    'cluster',
  ];

  dataSource = new MatTableDataSource<PredictionRow>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['rows']) {
      this.dataSource.data = this.rows ?? [];

 
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
      if (this.sort) {
        this.dataSource.sort = this.sort;
      }
    }
  }


  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  maskNumero(num: string | number | null | undefined): string {
    if (num === null || num === undefined) return '';
    const s = String(num);
    if (s.length <= 4) return '***' + s;
    return '****' + s.slice(-4);
  }
}
