import React from 'react';
import {
  render,
  fireEvent,
  cleanup,
  act,
  screen,
} from '@testing-library/react';
import flushPromises from 'flush-promises';
import { NewRestaurantForm } from '../NewRestaurantForm';

describe('NewRestaurantForm', () => {
  const restaurantName = 'Sushi place';
  const requiredError = 'Name is required';
  const serverError = 'The restaurant could not be saved. Please try again.';

  let createRestaurant;
  let context;

  beforeEach(() => {
    cleanup();
    createRestaurant = jest.fn().mockName('createRestaurant');
    context = render(<NewRestaurantForm createRestaurant={createRestaurant} />);
  });

  describe('create new restaurant', () => {
    beforeEach(async () => {
      createRestaurant.mockResolvedValue();
      const { getByPlaceholderText, getByTestId } = context;
      await fireEvent.change(getByPlaceholderText('Add Restaurant'), {
        target: { value: restaurantName },
      });
      fireEvent.click(getByTestId('new-restaurant-submit-button'));
      return act(flushPromises);
    });
    it('does not display a validation error', () => {
      const { queryByText } = context;
      expect(queryByText(requiredError)).toBeNull();
    });
    it('check if create restaurant called', () => {
      expect(createRestaurant).toHaveBeenCalledWith(restaurantName);
    });
  });
  describe('when empty', () => {
    beforeEach(async () => {
      createRestaurant.mockResolvedValue();
      const { getByPlaceholderText, getByTestId } = context;
      await fireEvent.change(getByPlaceholderText('Add Restaurant'), {
        target: { value: '' },
      });
      fireEvent.click(getByTestId('new-restaurant-submit-button'));
      return act(flushPromises);
    });

    it('does not call createRestaurant', () => {
      expect(createRestaurant).not.toHaveBeenCalled();
    });
  });
  describe('initially', () => {
    it('does not display a validation error', () => {
      const { queryByText } = context;
      expect(queryByText(requiredError)).toBeNull();
    });
    it('does not display error message', () => {
      const { queryByText } = context;
      expect(queryByText(serverError)).toBeNull();
    });
  });
});
