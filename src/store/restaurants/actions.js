export const STORE_RESTAURANTS = 'STORE_RESTAURANTS';
export const START_LOADING = 'START_LOADING';
export const RECORD_LOADING_ERROR = 'RECORD_LOADING_ERROR';

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
