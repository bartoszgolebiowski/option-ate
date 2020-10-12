import React from 'react';
import { render } from '@testing-library/react';
import { RestaurantList } from '../RestaurantList';

let loadRestaurants;
let context;
const restaurants = [
  { id: 1, name: 'Sushi Place' },
  { id: 2, name: 'Pizza Place' },
];

const renderWithProps = (propOverrides = {}) => {
  const props = {
    loadRestaurants: jest.fn().mockName('loadRestaurants'),
    restaurants,
    loading: false,
    loadError: false,
    ...propOverrides,
  };
  loadRestaurants = props.loadRestaurants;
  context = render(<RestaurantList {...props} />);
};

describe('RestaurantList', () => {
  describe('when loading succeeds', () => {
    it('loads restaurants on first render', () => {
      renderWithProps();
      expect(loadRestaurants).toHaveBeenCalled();
    });
    it('displays the restaurants', () => {
      renderWithProps();
      const { queryByText } = context;
      expect(queryByText('Sushi Place')).not.toBeNull();
      expect(queryByText('Pizza Place')).not.toBeNull();
    });
    it('does not display the loading indicator while not loading', () => {
      renderWithProps();
      const { queryByTestId } = context;
      expect(queryByTestId('loading-indicator')).toBeNull();
    });
  });

  it('displays the loading indicator while loading', () => {
    renderWithProps({ loading: true });
    const { queryByTestId } = context;
    expect(queryByTestId('loading-indicator')).not.toBeNull();
  });

  describe('displays the error indicator while request fails', () => {
    it('display error message', () => {
      renderWithProps({ loadError: true });
      const { queryByText } = context;
      expect(queryByText('Restaurants could not be loaded.')).not.toBeNull();
    });
    it('does not display error message', () => {
      renderWithProps();
      const { queryByText } = context;
      expect(queryByText('Restaurants could not be loaded.')).toBeNull();
    });
  });
});
