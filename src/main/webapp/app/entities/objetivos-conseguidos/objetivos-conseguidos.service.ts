import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IObjetivosConseguidos } from 'app/shared/model/objetivos-conseguidos.model';

type EntityResponseType = HttpResponse<IObjetivosConseguidos>;
type EntityArrayResponseType = HttpResponse<IObjetivosConseguidos[]>;

@Injectable({ providedIn: 'root' })
export class ObjetivosConseguidosService {
  public resourceUrl = SERVER_API_URL + 'api/objetivos-conseguidos';

  constructor(protected http: HttpClient) {}

  create(objetivosConseguidos: IObjetivosConseguidos): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(objetivosConseguidos);
    return this.http
      .post<IObjetivosConseguidos>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(objetivosConseguidos: IObjetivosConseguidos): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(objetivosConseguidos);
    return this.http
      .put<IObjetivosConseguidos>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IObjetivosConseguidos>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IObjetivosConseguidos[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(objetivosConseguidos: IObjetivosConseguidos): IObjetivosConseguidos {
    const copy: IObjetivosConseguidos = Object.assign({}, objetivosConseguidos, {
      fechaApertura:
        objetivosConseguidos.fechaApertura && objetivosConseguidos.fechaApertura.isValid()
          ? objetivosConseguidos.fechaApertura.toJSON()
          : undefined,
      fechaCierre:
        objetivosConseguidos.fechaCierre && objetivosConseguidos.fechaCierre.isValid()
          ? objetivosConseguidos.fechaCierre.toJSON()
          : undefined
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.fechaApertura = res.body.fechaApertura ? moment(res.body.fechaApertura) : undefined;
      res.body.fechaCierre = res.body.fechaCierre ? moment(res.body.fechaCierre) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((objetivosConseguidos: IObjetivosConseguidos) => {
        objetivosConseguidos.fechaApertura = objetivosConseguidos.fechaApertura ? moment(objetivosConseguidos.fechaApertura) : undefined;
        objetivosConseguidos.fechaCierre = objetivosConseguidos.fechaCierre ? moment(objetivosConseguidos.fechaCierre) : undefined;
      });
    }
    return res;
  }
}
