import React, { useRef, useState } from 'react';
import Card from '@material-ui/core/Card'
import Slide from '@material-ui/core/Slide';
import Backdrop from '@material-ui/core/Backdrop';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/core/styles';

import AutocompleteSignIn from '../AutocompleteSignIn/AutocompleteSignIn'
import NativeSelect from '@material-ui/core/NativeSelect';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { STATUS } from '../../enums';

const ENVapiKey = process.env.REACT_APP_API_KEY;

var Airtable = require('airtable');

Airtable.configure({
  endpointUrl: 'https://api.airtable.com',
  apiKey: ENVapiKey
});

var base = Airtable.base('app4uGPnkMj2lRoyu');

export default function SignInCard(props) {
  const theme = useTheme();
  const bgRef = useRef();
  const signInRef = useRef();

  const [sel, setSel] = useState("");

  const useStyles = makeStyles({
    header: {
      backgroundColor: theme.palette.primary.dark,
      color: theme.palette.primary.contrastText,
    },
    headerContent: {
      textAlign: 'left',
    },
    subheader: {
      color: theme.palette.secondary.contrastText,
    }
  });


  const classes = useStyles();

  const handleClose = (e) => {
    if (typeof e === 'object' && e.target !== bgRef.current) return;
    props.setShow(false);
  }

  const handleSubmit = (e) => {
    let status = signInRef.current.querySelectorAll('select')[0].value

    let comment = signInRef.current.querySelectorAll('textarea')[0].value;

    base('Sign_In RTO').create([
      {
        "fields": {
          "EmployeeID": [
            sel.id
          ],
          "Status": status,
          "Comment": comment
        }
      },
    ], function (err, records) {
      if (err) {
        props.openSnack(":( Your sign in failed! Please contact HR.", "warning");
        return;
      }

      props.signInRefresh()
      props.openSnack("Thanks you've signed in successfully!", "success");
    });

    handleClose()
  }

  return (
    <Backdrop ref={bgRef} style={{ zIndex: 12, color: '#fff' }} open={props.show} onClick={handleClose}>
      <Slide direction="right" in={props.show} mountOnEnter unmountOnExit timeout={500}>
        <Card ref={signInRef} elevation={4} style={{ zIndex: 15, position: 'absolute', marginLeft: '25%', marginTop: '200px', top: 0, left: 0, width: '50%' }}>
          <CardHeader
            title="Good Morning!"
            subheader={new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            classes={{
              root: classes.header,
              content: classes.headerContent,
              subheader: classes.subheader,
            }}
          />
          <CardContent style={{ justifyContent: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <AutocompleteSignIn records={props.records} sel={sel} setSel={setSel} style={{ width: '80%' }} ></AutocompleteSignIn>
            <FormControl style={{ width: '80%', minWidth: '150px' }}>
              <InputLabel htmlFor="age-native-helper">Status</InputLabel>
              <NativeSelect
                inputProps={{
                  name: 'status',
                  id: 'working-status',
                }}
              >
                <option aria-label="None" value="" />
                <option value={STATUS.office}>Working From the Office</option>
                <option value={STATUS.remote}>Working Remotely</option>
                <option value={STATUS.traveling}>Traveling for Business</option>
                <option value={STATUS.out}>Out of Office</option>
              </NativeSelect>
              <FormHelperText>Select your work status</FormHelperText>
            </FormControl>
            <TextField
              id="outlined-multiline-static"
              label="Comment"
              multiline
              rows={3}
              variant="outlined"
              style={{ width: '80%', minWidth: '150px', margin: '10px' }}
            />
            <Button onClick={handleSubmit} variant="outlined" color="secondary" style={{ width: '80%', minWidth: '150px', margin: '10px' }}>
              Check In
            </Button>
          </CardContent>
        </Card>
      </Slide>
    </Backdrop>
  );
}
