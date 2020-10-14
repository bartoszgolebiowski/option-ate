import React from 'react';
import { render, fireEvent, cleanup, act } from '@testing-library/react';
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
    it('clear input after submit', () => {
      const { getByPlaceholderText } = context;
      expect(getByPlaceholderText('Add Restaurant').value).toEqual('');
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

    it('displays a validation error', () => {
      const { queryByText } = context;
      expect(queryByText(requiredError)).not.toBeNull();
    });
    it('does not call createRestaurant', () => {
      expect(createRestaurant).not.toHaveBeenCalled();
    });
  });
  describe('when correcting a validation error', () => {
    beforeEach(async () => {
      createRestaurant.mockResolvedValue();
      const { getByPlaceholderText, getByTestId } = context;
      await fireEvent.change(getByPlaceholderText('Add Restaurant'), {
        target: { value: '' },
      });
      fireEvent.click(getByTestId('new-restaurant-submit-button'));
      await act(flushPromises);
      await fireEvent.change(getByPlaceholderText('Add Restaurant'), {
        target: { value: restaurantName },
      });
      fireEvent.click(getByTestId('new-restaurant-submit-button'));
      return act(flushPromises);
    });
    it('clears the validation error', () => {
      const { queryByText } = context;
      expect(queryByText(requiredError)).toBeNull();
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
  describe('when createRestaurant reject', () => {
    beforeEach(async () => {
      createRestaurant.mockRejectedValue();
      const { getByPlaceholderText, getByTestId } = context;
      await fireEvent.change(getByPlaceholderText('Add Restaurant'), {
        target: { value: restaurantName },
      });
      fireEvent.click(getByTestId('new-restaurant-submit-button'));
      return act(flushPromises);
    });
    it('display error message', () => {
      const { queryByText } = context;
      expect(queryByText(serverError)).not.toBeNull();
    });
    it('does not clear input', () => {
      const { getByPlaceholderText } = context;
      expect(getByPlaceholderText('Add Restaurant').value).toEqual(
        restaurantName,
      );
    });
  });
  describe('when createRestaurant reject and second try resolved ', () => {
    beforeEach(async () => {
      createRestaurant.mockRejectedValue().mockResolvedValue();
      const { getByPlaceholderText, getByTestId } = context;
      await fireEvent.change(getByPlaceholderText('Add Restaurant'), {
        target: { value: restaurantName },
      });
      fireEvent.click(getByTestId('new-restaurant-submit-button'));
      await act(flushPromises);
      fireEvent.click(getByTestId('new-restaurant-submit-button'));
      return act(flushPromises);
    });
    it('does not display error message', () => {
      const { queryByText } = context;
      expect(queryByText(serverError)).toBeNull();
    });
  });
});
