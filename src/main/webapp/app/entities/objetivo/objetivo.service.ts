import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IObjetivo } from 'app/shared/model/objetivo.model';

type EntityResponseType = HttpResponse<IObjetivo>;
type EntityArrayResponseType = HttpResponse<IObjetivo[]>;

@Injectable({ providedIn: 'root' })
export class ObjetivoService {
  public resourceUrl = SERVER_API_URL + 'api/objetivos';

  constructor(protected http: HttpClient) {}

  create(objetivo: IObjetivo): Observable<EntityResponseType> {
    return this.http.post<IObjetivo>(this.resourceUrl, objetivo, { observe: 'response' });
  }

  update(objetivo: IObjetivo): Observable<EntityResponseType> {
    return this.http.put<IObjetivo>(this.resourceUrl, objetivo, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IObjetivo>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IObjetivo[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
