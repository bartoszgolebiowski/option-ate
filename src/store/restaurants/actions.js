export const STORE_RESTAURANTS = 'STORE_RESTAURANTS';
export const START_LOADING = 'START_LOADING';
export const RECORD_LOADING_ERROR = 'RECORD_LOADING_ERROR';
export const ADD_RESTAURANT = 'ADD_RESTAURANT';

export const createRestaurant = name => (dispatch, getState, api) => {
  return api
    .createRestaurant(name)
    .then(response => {
      dispatch(addRestaurant(response));
    })
    .catch(() => {});
};

export const loadRestaurants = () => (dispatch, getState, api) => {
  dispatch(startLoading());
  api
    .loadRestaurants()
    .then(records => {
      dispatch(storeRestaurants(records));
    })
    .catch(() => {
      dispatch(recordLoadingError());
    });
};

const storeRestaurants = records => ({
  type: STORE_RESTAURANTS,
  records,
});

const startLoading = () => ({ type: START_LOADING });
const recordLoadingError = () => ({ type: RECORD_LOADING_ERROR });
const addRestaurant = record => ({ type: ADD_RESTAURANT, record });
