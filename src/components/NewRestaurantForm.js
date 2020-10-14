import React, { useState } from 'react';
import { connect } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Box, makeStyles } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { createRestaurant } from '../store/restaurants/actions';

const useStyles = makeStyles(theme => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

export const NewRestaurantForm = ({ createRestaurant }) => {
  const classes = useStyles();
  const [name, setName] = useState('');
  const [validationError, setValidationError] = useState(false);
  const [serverError, setServerError] = useState(false);

  const handleSubmit = e => {
    e.preventDefault();
    if (name === '') {
      setValidationError(true);
    } else {
      setValidationError(false);
      setServerError(false);
      createRestaurant(name)
        .then(() => {
          setName('');
        })
        .catch(() => {
          setServerError(true);
        });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {validationError && <Alert severity="error">Name is required</Alert>}
      {serverError && (
        <Alert severity="error">
          The restaurant could not be saved. Please try again.
        </Alert>
      )}
      <Box display="flex" className={classes.root}>
        <TextField
          placeholder="Add Restaurant"
          fullWidth
          variant="filled"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          data-testid="new-restaurant-submit-button"
        >
          Add
        </Button>
      </Box>
    </form>
  );
};

const mapStateToProps = null;
const mapDispatchToProps = { createRestaurant };

export default connect(mapStateToProps, mapDispatchToProps)(NewRestaurantForm);
