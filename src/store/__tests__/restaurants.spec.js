import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import restaurantsReducer from '../restaurants/reducers';
import { loadRestaurants } from '../restaurants/actions';

describe('restaurants', () => {
  describe('loadRestaurants action', () => {
    describe('when loading succeeds', () => {
      const records = [
        { id: 1, name: 'Sushi Place' },
        { id: 2, name: 'Pizza Place' },
      ];
      let store;
      beforeEach(() => {
        const initialState = {
          records: [],
        };

        const api = {
          loadRestaurants: () => Promise.resolve(records),
        };

        store = createStore(
          restaurantsReducer,
          initialState,
          applyMiddleware(thunk.withExtraArgument(api)),
        );

        return store.dispatch(loadRestaurants());
      });

      it('stores the restaurants', () => {
        expect(store.getState().records).toEqual(records);
      });
      it('clears the loading flag', () => {
        expect(store.getState().loading).toEqual(false);
      });
    });
    describe('while loading', () => {
      let store;
      beforeEach(() => {
        const api = {
          loadRestaurants: () => new Promise(() => {}),
        };

        const initialState = {};

        store = createStore(
          restaurantsReducer,
          initialState,
          applyMiddleware(thunk.withExtraArgument(api)),
        );

        return store.dispatch(loadRestaurants());
      });
      it('sets a loading flag', () => {
        expect(store.getState().loading).toEqual(true);
      });
    });
    describe('when loading fails', () => {
      let store;
      beforeEach(() => {
        const api = {
          loadRestaurants: () => Promise.reject(),
        };

        const initialState = {};

        store = createStore(
          restaurantsReducer,
          initialState,
          applyMiddleware(thunk.withExtraArgument(api)),
        );

        return store.dispatch(loadRestaurants());
      });
      it('sets a loadError flag', () => {
        expect(store.getState().loadError).toEqual(true);
      });
      it('clears the loading flag', () => {
        expect(store.getState().loading).toEqual(false);
      });
    });
    describe('initially', () => {
      let store;
      beforeEach(() => {
        const initialState = {};
        store = createStore(
          restaurantsReducer,
          initialState,
          applyMiddleware(thunk),
        );
      });

      it('does not have the loading flag set', () => {
        expect(store.getState().loading).toEqual(false);
      });

      it('does not have the loadError flag set', () => {
        expect(store.getState().loadError).toEqual(false);
      });
    });
  });
});
