import React, { useRef, useState, useEffect } from 'react';

import Card from '@material-ui/core/Card'
import Backdrop from '@material-ui/core/Backdrop';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import { dataSet } from '../../data/data';
import AirtableFetch from '../AirtableFetch/AirtableFetch';
import DataTable from '../DataTable/DataTable';
import { maxHeight, width } from '@mui/system';

const ENVapiKey = process.env.REACT_APP_API_KEY;

var Airtable = require('airtable');

Airtable.configure({
  endpointUrl: 'https://api.airtable.com',
  apiKey: ENVapiKey
});

var base = Airtable.base('app4uGPnkMj2lRoyu');

export default function EmployeeCard(props) {

  let img = document.querySelector('#planImg');

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
    props.setShow(false);

    let seatsToggle = false;

    
    let filters = [...props.filters];
    let index = props.filters.findIndex(a => a.key === 'name');
    filters.splice(index, 1, { ...props.filters[index], key: 'name', enabled: seatsToggle, val: props.clickedEmployee[0].name.toUpperCase() });
    props.setFilters(filters);    

  }

  const seatingPosX = (d) => {
    var dSeat = String(d.seat);
    let seatData;
  
    //filtering to show proper office is taken care of upstream
    switch (d.office) {
      case "1WTC":
        seatData = dataSet.WTC[dSeat];
        break;
      case "SHO":
        seatData = dataSet.SHO[dSeat];
        break;
      default:
        return null;
    }
  
    
    if (typeof (seatData) == 'undefined') {
      return -100;
    }
  
    var posX = seatData.x;
    return (posX * (img.width));
  }
  
  const seatingPosY = (d) => {
    var dSeat = String(d.seat);
    let seatData;
  
    //filtering to show proper office is taken care of upstream
    switch (d.office) {
      case "1WTC":
        seatData = dataSet.WTC[dSeat];
        break;
      case "SHO":
        seatData = dataSet.SHO[dSeat];
        break;
      default:
        return null;
    }
  
    let img = document.querySelector('#planImg');
  
    if (typeof (seatData) == 'undefined') {
      return -100;
    }
  
    var posY = seatData.y;
    return Math.abs((posY - 1) * (img.height));
  }

  console.log((((props.dims.x*.65)-(img.width))/2));

  let XLocation = seatingPosX(props.clickedEmployee[0])+10+(((props.dims.x*.65)-(img.width))/2);
  let YLocation = seatingPosY(props.clickedEmployee[0])+125;


  return (
    <Backdrop ref={bgRef} invisible={true} style={{ zIndex: 12}} open={props.show} onClick={handleClose}>
        <Card ref={signInRef} elevation={4} style={{ zIndex: 15, position: 'absolute', top: YLocation, left: XLocation}}>
          <CardContent style={{ justifyContent: 'center', display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: '0px', marginLeft: '0px', marginRight: '0px', marginBottom: '0px' }}>
          <Grid container direction='row' style={{marginLeft: '0px', marginRight: '0px', marginBottom: '0px'}}>
            <Grid item>
              <img src={props.clickedEmployee[0].headshot} style={{ width: '50px', height: '50px', borderRadius: '25px', marginTop:'5px' ,marginLeft: '0px', marginRight: '0px', marginBottom: '0px'}} alt={props.clickedEmployee[0].name} />
            </Grid>

            <Grid item style={{ paddingLeft: '10px', paddingBottom: '0px', marginTop:'5px' ,marginLeft: '0px', marginRight: '0px', marginBottom: '0px'}}>
              <Grid item>
                {props.clickedEmployee[0].name}
              </Grid>
              <Grid item>
                <Typography variant="overline" style={{ lineHeight: '0px' }}>
                  Ext: {props.clickedEmployee[0].ext}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="overline" style={{ lineHeight: '0px' }}>
                  Seat: {props.clickedEmployee[0].seat}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          </CardContent>
        </Card>
    </Backdrop>
  );
}
