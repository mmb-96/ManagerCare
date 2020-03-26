import { Moment } from 'moment';
import { IUser } from 'app/core/user/user.model';

export interface IPuntosConseguidos {
  id?: number;
  puntos?: number;
  anyos?: Moment;
  user?: IUser;
}

export class PuntosConseguidos implements IPuntosConseguidos {
  constructor(public id?: number, public puntos?: number, public anyos?: Moment, public user?: IUser) {}
}
