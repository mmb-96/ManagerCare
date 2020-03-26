import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPuntosConseguidos } from 'app/shared/model/puntos-conseguidos.model';

@Component({
  selector: 'jhi-puntos-conseguidos-detail',
  templateUrl: './puntos-conseguidos-detail.component.html'
})
export class PuntosConseguidosDetailComponent implements OnInit {
  puntosConseguidos: IPuntosConseguidos | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ puntosConseguidos }) => (this.puntosConseguidos = puntosConseguidos));
  }

  previousState(): void {
    window.history.back();
  }
}
