import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IObjetivo } from 'app/shared/model/objetivo.model';

type EntityResponseType = HttpResponse<IObjetivo>;
type EntityArrayResponseType = HttpResponse<IObjetivo[]>;

@Injectable({ providedIn: 'root' })
export class ObjetivoUserService {
  public resourceUrl = SERVER_API_URL + 'api/objetivos';
  public resourceUrl2 = SERVER_API_URL + 'api/objetivos-user';

  constructor(protected http: HttpClient) {}

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IObjetivo>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IObjetivo[]>(this.resourceUrl2, { params: options, observe: 'response' });
  }
}
