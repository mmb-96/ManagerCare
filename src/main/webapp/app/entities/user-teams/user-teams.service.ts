import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IUser } from 'app/core/user/user.model';

type EntityResponseType = HttpResponse<IUser>;
type EntityArrayResponseType = HttpResponse<IUser[]>;

@Injectable({ providedIn: 'root' })
export class UserTeamsService {
  public resourceUrl = SERVER_API_URL + 'api/users-teams';
  public resourceUrlView = SERVER_API_URL + 'api/users';

  constructor(protected http: HttpClient) {}

  find(login: string): Observable<EntityResponseType> {
    return this.http.get<IUser>(`${this.resourceUrlView}/${login}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IUser[]>(this.resourceUrl, { params: options, observe: 'response' });
  }
}
