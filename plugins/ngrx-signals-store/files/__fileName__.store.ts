
import { computed } from '@angular/core';
import { signalStore, withComputed, withMethods, withState, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { debounceTime, distinctUntilChanged, pipe, switchMap, tap } from "rxjs";
import { inject } from "@angular/core";

export interface <%= className %>State {
  isLoading: boolean;
  error: undefined | string | Error | null;
  items: any[];
  filter: string;
<% for(const prop of statePropertiesParsed) { %>
  <%= prop.name %>: <%= prop.type %>;
<% } %>
}

const initialState: <%= className %>State = {
  isLoading: false,
  error: undefined,
  items: [],
  filter: '',
<% for(const prop of statePropertiesParsed) { %>
  <%= prop.name %>: <%= prop.type === 'string' ? '""' : prop.type === 'number' ? '0' : prop.type === 'boolean' ? 'false' : 'null' %>,
<% } %>
};

export const <%= className %>sStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    // Add computed properties here
<% for(const prop of statePropertiesParsed) { %>
    // <%= prop.name %>$: computed(() => store.<%= prop.name %>()),
<% } %>
  })),
  withMethods((store, get<%= angularService %> = inject(<%= angularService %>)) => ({
    // Add methods here
    updateFilter(filter: string): void {
      patchState(store, (state) => ({filter}));
      this.load<%= className %>sWithSearch(filter);
    },
<% for(const prop of statePropertiesParsed) { %>
    set<%= prop.name.charAt(0).toUpperCase() + prop.name.slice(1) %>(value: <%= prop.type %>): void {
      patchState(store, (state) => ({ ...state, <%= prop.name %>: value }));
    },
<% } %>
    load<%= className %>sWithSearch: rxMethod<string> (
      pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => patchState(store, { 
          isLoading: true,
          error: null 
      })),
      switchMap(() => get<%= angularService %>.<%= angularServiceMethod %>(store.filter()).pipe(
        tapResponse({
          next: (data) => patchState(store, {
            items: data,
            error: null
          }),
          error: (error: Error) => {
              patchState(store, {
                items: [],
                error,
              });
          },
          finalize: () => patchState(store, {isLoading: false})
        })
        )
      )
    )
  ),
  load<%= className %>s: rxMethod<string> (
    pipe(
      tap(() => patchState(store, {isLoading: true, error: null})),
      switchMap(() => get<%= angularService %>.<%= angularServiceMethod %>(). pipe(
        tapResponse({
          next: (data) => patchState(store, {
            items: data,
            error: null
          }),
          error: (error: Error) => {
              patchState(store, {
                items: [],
                error,
              });
          },
          finalize: () => patchState(store, {isLoading: false})
        })
      ))
    )
  )
}))
);