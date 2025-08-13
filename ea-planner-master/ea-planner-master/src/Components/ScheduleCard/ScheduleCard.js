import React, { useEffect, useRef, useState } from 'react';

import { useAsync } from 'react-async-hook'

import Card from '@material-ui/core/Card'
import Slide from '@material-ui/core/Slide';
import Backdrop from '@material-ui/core/Backdrop';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography';

import { makeStyles } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/core/styles';

import AutocompleteSignIn from '../AutocompleteSignIn/AutocompleteSignIn'
import Button from '@material-ui/core/Button';

import DateAdapter from '@mui/lab/AdapterDayjs';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

import StaticDatePicker from '@mui/lab/StaticDatePicker';
import PickersDay from '@mui/lab/PickersDay';

import { STATUS } from '../../enums'

import dayjs from 'dayjs';

var Airtable = require('airtable');

const ENVapiKey = process.env.REACT_APP_API_KEY;

Airtable.configure({
  endpointUrl: 'https://api.airtable.com',
  apiKey: ENVapiKey
});

var base = Airtable.base('app4uGPnkMj2lRoyu');

const currentDate = new Date()

const fetchSchedule = async (record) => {
  if (record === undefined) return []

  return new Promise((resolve, reject) => {
    let response = []

    base('Schedule_RTO').select({
      view: "Grid",
      filterByFormula: `AND({RecordID}='${record.id}')`,
      sort: [{
        field: 'CreatedTime',
        direction: 'desc'
      }]
    }).eachPage(function page(recs, fetchNextPage) {

      recs.forEach(function (r) {
        response.push(r);
      });

      fetchNextPage();
    }, function done(error) {
      if (error) {
        reject(error);
      } else {
        resolve(response)
      }
    });
  })
}

export default function ScheduleCard(props) {
  const theme = useTheme();
  const bgRef = useRef();
  const signInRef = useRef();

  const [selRecord, setSelRecord] = useState()

  const asyncSchedule = useAsync(fetchSchedule, [selRecord])

  const [selDate, setSelDate] = useState({
    first: undefined,
    second: undefined,
  })

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

  const handleCloseSchedule = (e) => {
    if (typeof e === 'object' && e.target !== bgRef.current) return;
    props.setShowSchedule(false);
  }

  const handleDateChange = (date) => {
    setSelDate(state => {
      if (state.first === undefined) return ({ first: date, second: undefined })
      else if (state.second === undefined) return ({
        first: dayjs(state.first).isBefore(date) ? state.first : date,
        second: dayjs(state.first).isBefore(date) ? date : state.first
      })
      else return ({
        first: date,
        second: undefined
      })
    })
  }

  const dayJsBetween = (_date, first, second) => {
    if (first === undefined && second === undefined) return false
    const date = dayjs(_date)
    if (second === undefined) return date.isSame(first, 'day')
    return date.isSame(first, 'day') || date.isSame(second, 'day') || (date.isAfter(first, 'day') && date.isBefore(second, 'day'))
  }

  const getScheduled = (date) => {
    if (asyncSchedule.loading || !asyncSchedule.result || asyncSchedule.result.length < 1) return undefined
    let schedule = asyncSchedule.result.find((val, i, arr) => dayJsBetween(date, dayjs(val.fields['Start Date']), dayjs(val.fields['End Date'])))
    if (schedule && schedule.fields) return schedule.fields['Status']
  }

  const getScheduleStatusStyle = (date, selected) => {
    if (selected) return {}

    const status = getScheduled(date);

    switch (status) {
      case STATUS.office:
        return ({ backgroundColor: '#c9daf8', border: '2px solid #4987e8' })
      case STATUS.remote:
        return ({ backgroundColor: '#c9daf8' })
      case STATUS.traveling:
        return { backgroundColor: '#B5D7A8', border: '2px solid #37761d' }
      case STATUS.out:
        return { backgroundColor: '#f2c331' }
      default:
        return {}
    }
  }

  const handleCreateSchedule = (e, newStatus) => {

    if (typeof selDate.first === 'undefined' || typeof selRecord === 'undefined') return // should pop a helpful message here

    base('Schedule_RTO').create([
      {
        "fields": {
          "EmployeeID": [
            selRecord.id
          ],
          "Status": newStatus,
          "Start Date": selDate.first.format('YYYY-MM-DD'),
          "End Date": selDate.second ? selDate.second.format('YYYY-MM-DD') : selDate.first.format('YYYY-MM-DD'),
        }
      }], function (err, records) {
        if (err) {
          console.error(err);
          return;
        }
        asyncSchedule.execute(selRecord)
        props.scheduleRefresh(props.activeDate)
        setSelDate({ first: undefined, second: undefined })
      });
  }

  return (
    <Backdrop ref={bgRef} style={{ zIndex: 12, color: '#fff' }} open={props.show} onClick={handleCloseSchedule}>
      <Slide direction="right" in={props.show} mountOnEnter unmountOnExit timeout={500}>
        <Card ref={signInRef} elevation={4} style={{ zIndex: 15, margin: '30% 10%', width: '40%', minWidth: 650 }}>
          <CardHeader
            title={props.activeDate.format('dddd, MMMM DD, YYYY')}
            subheader={"Schedule your attendance in advance."}
            classes={{
              root: classes.header,
              content: classes.headerContent,
              subheader: classes.subheader,
            }}
          />
          <CardContent style={{ display: 'flex', flexDirection: 'column' }}>
            <Grid container>
              <Grid item direction='row' xs={12} style={{ width: '100%', padding: '8px 2% 2px', justifyContent: 'space-between', display: 'flex' }}>
                <Typography color='textSecondary'>1. Select your EA ID</Typography>
              </Grid>
              <Grid item direction='row' xs={12} style={{ width: '100%', padding: '2%' }}>
                <AutocompleteSignIn records={props.records} sel={selRecord} setSel={setSelRecord}></AutocompleteSignIn>
              </Grid>
              <Grid item direction='row' xs={12} style={{ width: '100%', padding: '8px  2% 2px', justifyContent: 'space-between', display: 'flex' }}>
                <Typography color='textSecondary' style={{ maxWidth: '50%' }}>2. Select Days</Typography>
                <Typography color='textSecondary' style={{ maxWidth: '50%' }}>3. Select Status to Schedule</Typography>
              </Grid>
              <Grid item container direction='column' xs={7} style={{ padding: '2% 0px', alignItems: 'flex-start' }}>
                <LocalizationProvider dateAdapter={DateAdapter}>
                  <StaticDatePicker
                    displayStaticWrapperAs="desktop"
                    minDate={dayjs(currentDate)}
                    maxDate={dayjs(currentDate).add(2, 'year')}
                    shouldDisableDate={(day) => dayjs(day).isBefore(currentDate, 'day')}
                    shouldDisableYear={(day) => dayjs(day).isBefore(currentDate, 'year')}
                    value={props.activeDate}
                    onChange={handleDateChange}
                    label="Your Schedule"
                    allowSameDateSelection={true}
                    loading={asyncSchedule.loading}
                    renderDay={(day, selected, props) => {
                      let sel = dayJsBetween(day, selDate.first, selDate.second)
                      return <PickersDay  {...{ ...props, selected: sel, style: getScheduleStatusStyle(day, sel) }} />
                    }}
                    renderInput={() => <Grid></Grid>}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item container direction='column' xs={5} style={{ padding: '2%', alignItems: 'flex-end' }}>
                <Button onClick={(e) => handleCreateSchedule(e, STATUS.office)} style={{ width: '100%', backgroundColor: '#c9daf8', border: '2px solid #4987e8', margin: '12px 0px' }} >In Office</Button>
                <Button onClick={(e) => handleCreateSchedule(e, STATUS.remote)} style={{ width: '100%', backgroundColor: '#c9daf8', margin: '12px 0px' }} >Working Remotely</Button>
                <Button onClick={(e) => handleCreateSchedule(e, STATUS.traveling)} style={{ width: '100%', backgroundColor: '#B5D7A8', border: '2px solid #37761d', margin: '12px 0px' }} >Business Travel</Button>
                <Button onClick={(e) => handleCreateSchedule(e, STATUS.out)} style={{ width: '100%', backgroundColor: '#f2c331', margin: '12px 0px' }} >Out of Office</Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Slide>
    </Backdrop>
  );
}
