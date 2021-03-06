import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IUser } from 'app/core/user/user.model';
import { map } from 'rxjs/operators';
import * as moment from 'moment';
import { IObjetivosConseguidos } from 'app/shared/model/objetivos-conseguidos.model';
import { IPuntosConseguidos } from 'app/shared/model/puntos-conseguidos.model';

type EntityResponseType = HttpResponse<IUser>;
type EntityArrayResponseType = HttpResponse<IUser[]>;
type EntityArrayResponseTypeObject = HttpResponse<IObjetivosConseguidos[]>;
type EntityArrayResponseTypePuntos = HttpResponse<IPuntosConseguidos[]>;

@Injectable({ providedIn: 'root' })
export class UserTeamsService {
  public resourceUrl = SERVER_API_URL + 'api/users-teams';
  public resourceUrlView = SERVER_API_URL + 'api/users';
  public resourceOBjetivo = SERVER_API_URL + 'api/objetivos-ST';
  public resourcePuntos = SERVER_API_URL + 'api/puntos-conseguidos-user';

  constructor(protected http: HttpClient) {}

  find(login: string): Observable<EntityResponseType> {
    return this.http.get<IUser>(`${this.resourceUrlView}/${login}`, { observe: 'response' });
  }

  findObject(login: string): Observable<EntityArrayResponseTypeObject> {
    return this.http
    .get<IObjetivosConseguidos[]>(`${this.resourceOBjetivo}/${login}`, { observe: 'response' })
    .pipe(map((res: EntityArrayResponseTypeObject) => this.convertDateArrayFromServer(res)));
  }

  findPuntos(login: string): Observable<EntityArrayResponseTypePuntos> {
    return this.http
    .get<IPuntosConseguidos[]>(`${this.resourcePuntos}/${login}`, { observe: 'response' })
    .pipe(map((res: EntityArrayResponseTypePuntos) => this.convertDateArrayFromServerPunts(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IUser[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseTypeObject): EntityArrayResponseTypeObject {
    if (res.body) {
      res.body.forEach((objetivosConseguidos: IObjetivosConseguidos) => {
        objetivosConseguidos.fechaApertura = objetivosConseguidos.fechaApertura ? moment(objetivosConseguidos.fechaApertura) : undefined;
        objetivosConseguidos.fechaCierre = objetivosConseguidos.fechaCierre ? moment(objetivosConseguidos.fechaCierre) : undefined;
      });
    }
    return res;
  }

  protected convertDateArrayFromServerPunts(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((puntosConseguidos: IPuntosConseguidos) => {
        puntosConseguidos.anyos = puntosConseguidos.anyos ? moment(puntosConseguidos.anyos) : undefined;
      });
    }
    return res;
  }
}
