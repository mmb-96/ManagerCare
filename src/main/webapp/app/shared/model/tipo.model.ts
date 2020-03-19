export interface ITipo {
  id?: number;
  nombre?: string;
}

export class Tipo implements ITipo {
  constructor(public id?: number, public nombre?: string) {}
}
