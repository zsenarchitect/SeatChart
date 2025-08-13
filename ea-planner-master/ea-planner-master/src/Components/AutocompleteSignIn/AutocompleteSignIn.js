import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { makeStyles } from '@material-ui/core/styles';

export default function AutocompleteSignIn(props) {

  const useStyles = makeStyles({
    root: { ...props.style },
  });

  const classes = useStyles();

  return (
    <Autocomplete

      onChange={(event, newValue) => {
        props.setSel(newValue);
      }}

      selectOnFocus
      clearOnBlur
      handleHomeEndKeys

      options={props.records}

      getOptionLabel={(option) => {
        return option.eaID;
      }}

      getOptionSelected={(option, value) => option.eaID === value.eaID}

      renderOption={(option) => option.eaID}
      style={{ ...props.style }}

      classes={{
        root: classes.root
      }}

      renderInput={(params) => (
        <TextField {...params} label="Find your EA ID" variant="outlined" />
      )}
    />
  );
}