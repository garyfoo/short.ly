import {
  State,
  Action,
  StateContext,
  Selector,
  createSelector,
} from '@ngxs/store';
import { Injectable } from '@angular/core';
import { ShortLink } from '../../model/ShortLink';
import { GetAll, GetLinkById, Update, Add, Delete } from './links.action';
import { ApiService } from '../../service/api/api.service';

import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { ApiError } from '../../model/ApiError';

export class ShortLinkStateModel {
  items: Array<ShortLink>;
  isLoading: boolean;
  isUpdating: boolean;
  errors: Array<ApiError>;
}

@State<ShortLinkStateModel>({
  name: 'Links',
  defaults: {
    items: [] as ShortLink[],
    isLoading: false,
    isUpdating: false,
    errors: [] as ApiError[],
  },
})
@Injectable()
export class ShortLinkState {
  constructor(private api: ApiService) {}

  @Selector()
  // tslint:disable-next-line: typedef
  static getLinks(state: ShortLinkStateModel) {
    return state.items;
  }

  @Selector()
  // tslint:disable-next-line: typedef
  static isLoading(state: ShortLinkStateModel) {
    return state.isLoading;
  }

  @Selector()
  // tslint:disable-next-line: typedef
  static errors(state: ShortLinkStateModel) {
    return state.errors;
  }

  @Selector()
  // tslint:disable-next-line: typedef
  static isUpdating(state: ShortLinkStateModel) {
    return state.isUpdating;
  }

  static getShortLinkById(id: number) {
    return createSelector(
      [ShortLinkState],
      (state: ShortLinkStateModel): ShortLink =>
        state.items.find((shortLink) => shortLink.id === id)
    );
  }

  @Action(GetAll)
  // tslint:disable-next-line: typedef
  getShortLinks({ patchState }: StateContext<ShortLinkStateModel>) {
    patchState({
      isLoading: true,
    });
    return this.api.getAll().pipe(
      catchError(async (error) => {
        patchState({
          errors: error.error.errors,
        });
      }),
      tap((payload: ShortLink[]) => {
        patchState({
          items: payload,
          isLoading: false,
        });
      })
    );
  }

  @Action(GetLinkById)
  // tslint:disable-next-line: typedef
  getLinkById(
    { patchState, getState }: StateContext<ShortLinkStateModel>,
    { id }: GetLinkById
  ) {
    patchState({ isUpdating: true, errors: [] });
    const state = getState();
    const link = state.items.find((item) => item.id === id);
    return this.api.getById(id).pipe(
      catchError(async (error) => {
        patchState({
          errors: error.error.errors,
        });
      }),
      tap((payload: ShortLink) => {
        patchState({
          items: link
            ? state.items.map((linkItem) =>
                linkItem.id === id
                  ? Object.assign({}, {
                      ...linkItem,
                      ...payload,
                    } as ShortLink)
                  : linkItem
              )
            : [...state.items, payload],
          isUpdating: false,
        });
      })
    );
  }

  @Action(Add)
  // tslint:disable-next-line: typedef
  addLink(
    { patchState, getState }: StateContext<ShortLinkStateModel>,
    { link }: Add
  ) {
    patchState({ isUpdating: true, errors: [] });
    const state = getState();
    return this.api.add(link).pipe(
      catchError(async (error) => {
        patchState({
          errors: error.error.errors,
        });
      }),
      tap((payload: ShortLink) => {
        patchState({
          items: payload ? [...state.items, payload] : state.items,
          isUpdating: false,
        });
      })
    );
  }

  @Action(Update)
  // tslint:disable-next-line: typedef
  updateLink(
    { patchState, getState }: StateContext<ShortLinkStateModel>,
    { id, link }: Update
  ) {
    patchState({ isUpdating: true, errors: [] });
    const state = getState();
    const shortLink = state.items.find((item) => item.id === id);
    return this.api.update(id, link).pipe(
      catchError(async (error) => {
        patchState({
          errors: error.error.errors,
        });
      }),
      tap((payload: ShortLink) => {
        patchState({
          items: shortLink
            ? state.items.map((linkItem) =>
                linkItem.id === id
                  ? Object.assign({}, {
                      ...linkItem,
                      ...payload,
                    } as ShortLink)
                  : linkItem
              )
            : [...state.items, payload],
          isUpdating: false,
        });
      })
    );
  }

  @Action(Delete)
  // tslint:disable-next-line: typedef
  deleteLink(
    { patchState, getState }: StateContext<ShortLinkStateModel>,
    { id }: Delete
  ) {
    patchState({ isUpdating: true, errors: [] });
    const state = getState();
    return this.api.delete(id).pipe(
      catchError(async (error) => {
        patchState({
          errors: error.error.errors,
        });
      }),
      tap((payload: ShortLink) => {
        patchState({
          items: state.items.filter((shortLink) => shortLink.id !== id),
          isUpdating: false,
        });
      })
    );
  }
}
