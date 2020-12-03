import { ShortLink } from './../../model/ShortLink';
export class GetAll {
  static readonly type = '[Links] Get';
}

export class GetLinkById {
  static readonly type = '[Links] Get Link by id';
  constructor(public id: number) {}
}

export class Add {
  static readonly type = '[Links] Add';
  constructor(public link: ShortLink) {}
}

export class Update {
  static readonly type = '[Links] Update';
  constructor(public id: number, public link: ShortLink) {}
}

export class Delete {
  static readonly type = '[Links] Delete';
  constructor(public id: number) {}
}
