import React, { useState, useCallback, useEffect } from 'react';

import { useAsync } from 'react-async-hook'

import DataTable from '../DataTable/DataTable'
import D3Canvas from '../D3Canvas/D3Canvas'
import noProfile from '../../assets/default.jpg'

import Grid from '@material-ui/core/Grid'
import Snackbar from '@material-ui/core/Snackbar'
import Alert from '@material-ui/lab/Alert';

import dayjs from 'dayjs'
import { STATUS } from '../../enums';

const ENVapiKey = process.env.REACT_APP_API_KEY;

var Airtable = require('airtable');
Airtable.configure({
  endpointUrl: 'https://api.airtable.com',
  apiKey: ENVapiKey
});

var base = Airtable.base('app4uGPnkMj2lRoyu');

const fetchRecords = async () => {

  return new Promise((resolve, reject) => {
    let response = []

    base('Employees').select({
      view: "Employees_Active",
      fields: ['First Name', 'Active', 'Last Name', 'First Name', 'EA ID', 'Headshots', 'SeatLookup', 'Extension', 'Office', 'Dept.', 'Profile URL'],
      sort: [{
        field: 'Last Name',
        direction: 'asc'
      }]
    }).eachPage(function page(recs, fetchNextPage) {

      recs.forEach(function (r) {
        if (!r.get('Active')) { return; }
        let rec = {
          id: r.id,

          firstName: r.fields['First Name'],
          lastName: r.fields['Last Name'],
          name: r.fields['First Name'] + ' ' + r.fields['Last Name'],
          eaID: r.fields['EA ID'],

          headshot: typeof r.fields['Headshots'] !== 'undefined' ? r.fields['Headshots'][0].url : noProfile,
          seat: typeof r.fields['SeatLookup'] !== 'undefined' ? r.fields['SeatLookup'] : "",
          ext: typeof r.fields['Extension'] !== 'undefined' ? r.fields['Extension'] : "",
          office: typeof r.fields['Office'] !== 'undefined' ? r.fields['Office'] : "",
          dept: typeof r.fields['Dept.'] !== 'undefined' ? r.fields['Dept.'] : "",
          profile: typeof r.fields['Profile URL'] !== 'undefined' ? r.fields['Profile URL'] : "",

          checkInRec: typeof r.fields['Attendance'] !== 'undefined' ? r.fields['Attendance'] : [],
          checkedIn: false,
          checkInTime: typeof r.fields['TimeLookup'] !== 'undefined' ? r.fields['TimeLookup'] : "",
          checkInStatus: typeof r.fields['WorkLocationLookup'] !== 'undefined' ? r.fields['WorkLocationLookup'] : "",
          comment: typeof r.fields['CommentLookup'] !== 'undefined' ? r.fields['CommentLookup'][r.fields['CommentLookup'].length - 1] : "",

          wfhStatus: typeof r.fields['wfhStatus'] !== 'undefined' ? r.fields['wfhStatus'] : "",
        }

        response.push(rec);
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

const fetchSignIn = async () => {

  return new Promise((resolve, reject) => {
    let response = []
    base('Sign_In RTO').select({
      view: "Grid view",
      filterByFormula: `AND(DATETIME_DIFF({Time Created},'${dayjs().format('YYYY-MM-DD')}', 'hours') >= 0)`,
      sort: [{
        field: 'Time Created',
        direction: 'desc'
      }]
    }).eachPage(function page(recs, fetchNextPage) {

      recs.forEach(function (r) {
        response.push({ ...r.fields });
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

const fetchSchedule = async (date) => {
  if (!date) return new Promise((resolve, reject) => resolve([]))
  return new Promise((resolve, reject) => {
    let response = []

    base('Schedule_RTO').select({
      view: "Grid",
      filterByFormula: `AND(DATETIME_DIFF({Start Date},DATETIME_PARSE(DATETIME_FORMAT(SET_TIMEZONE('${date.format('YYYY-MM-DD')}', 'America/New_York'), 'YYYY-MM-DD','America/New_York')),'days') <= 1,DATETIME_DIFF({End Date},DATETIME_PARSE(DATETIME_FORMAT(SET_TIMEZONE('${date.format('YYYY-MM-DD')}', 'America/New_York'), 'YYYY-MM-DD','America/New_York')),'days') >= 1)`,
      fields: ['CreatedTime', 'Status', 'EmployeeID', 'Start Date', 'End Date', 'RecordID'],
      sort: [{
        field: 'CreatedTime',
        direction: 'asc'
      }]
    }).eachPage(function page(recs, fetchNextPage) {

      response = [...response, ...recs.reduce((p, c) => { p.push(c.fields); return p }, [])]

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

const AirtableFetch = () => {

  const [activeDate, setActiveDate] = useState(dayjs())

  const asyncRecords = useAsync(fetchRecords, [])
  const asyncSignIn = useAsync(fetchSignIn, [])
  const asyncSchedule = useAsync(fetchSchedule, [activeDate])

  const getCheckInStyle = useCallback((id) => {

    if (activeDate.isSame(dayjs(), 'day') && (!asyncSignIn.result || !asyncSignIn.result.length)) {
      return {
        fill: '#b1bec5',
        stroke: undefined,
        strokeWidth: undefined,
        radius: 0.5,
        opacity: 0.85,
      }
    } else if (!asyncSchedule.result || !asyncSchedule.result.length) {
      return {
        fill: '#b1bec5',
        stroke: undefined,
        strokeWidth: undefined,
        radius: 0.5,
        opacity: 0.85,
      }
    }

    let status;

    if (activeDate.isSame(dayjs(), 'day')) {
      let record = asyncSignIn.result.find((r) => r.EmployeeID[0] === id)
      status = record ? record["Status"] : ""
    } else {

      let records = asyncSchedule.result.filter((r) => r.EmployeeID[0] === id)

      if (!records.length) return {
        fill: '#b1bec5',
        stroke: undefined,
        strokeWidth: undefined,
        radius: 0.5,
        opacity: 0.85,
      }
      records.sort((a, b) => dayjs(a.CreatedTime).isBefore(dayjs(b.CreatedTime)) ? 1 : -1)
      status = records[0].Status
    }

    switch (status) {
      case STATUS.office:
        return {
          fill: '#4987e8',
          stroke: '#4987e8',
          strokeWidth: '0px',
          radius: 1,
          opacity: 0.8,
        }
      case STATUS.remote:
        return {
          fill: '#c9daf8',
          stroke: 'none',
          strokeWidth: '0px',
          radius: 1,
          opacity: 0.8,
        }
      case STATUS.traveling:
        return {
          fill: '#b5d7a8',
          stroke: '#36761d',
          strokeWidth: '3px',
          radius: 1,
          opacity: 0.8,
        }
      case STATUS.out:
        return {
          fill: '#f3c331',
          stroke: 'none',
          strokeWidth: '0px',
          radius: 1,
          opacity: 0.8,
        }
      default:
        return {
          fill: '#b1bec5',
          stroke: 'none',
          strokeWidth: '0px',
          radius: 0.5,
          opacity: 0.9,
        }
    }


  }, [asyncSignIn.result, asyncSchedule.result])

  // next steps are building in priority / ordering mechanism
  // "and" vs "or" mechanism
  // key array, so same filter can apply to multiple key:vals
  // each of these ideas solves similar problems
  const [filters, setFilters] = useState(
    [{
      key: "office",
      type: "includes",
      enabled: true,
      val: ["1WTC"],
    }, {
      key: "wfhStatus",
      type: "includes",
      enabled: false,
      val: ["No Response", "None", "1-2 days a week",
        "2-3 days a week", "3-4 days a week",
        "5 days a week"],
    }, {
      key: "name",
      enabled: false,
      type: "subString",
      val: [],
    }, {
      key: "eaID",
      enabled: false,
      type: "subString",
      val: [],
    }, {
      key: "id",
      enabled: false,
      type: "excludes",
      val: [],
    }]
  );

  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "info",
    location: "100,100",
  });

  const openSnack = (message, severity) => {
    setSnack({ open: true, message: message || "", severity: severity });
  }

  const closeSnack = (e, reason) => {
    setSnack({ open: false, message: "", severity: "info" });
  }

  return (
    <Grid container spacing={0}>
      <Grid item xs={12} sm={8}>
        <D3Canvas
          records={asyncRecords.result}
          signin={asyncSignIn.result}
          schedule={asyncSchedule.result}
          loading={asyncRecords.loading || asyncSignIn.loading || asyncSchedule.loading}
          filters={filters}
          setFilters={setFilters}
          activeDate={activeDate}
          setActiveDate={setActiveDate}
          getCheckInStyle={getCheckInStyle}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <DataTable records={asyncRecords.result}
          signInRefresh={asyncSignIn.execute}
          scheduleRefresh={asyncSchedule.execute}
          loaded={!asyncRecords.loading}
          filters={filters}
          setFilters={setFilters}
          openSnack={openSnack}
          activeDate={activeDate}
          getCheckInStyle={getCheckInStyle}
        />
      </Grid>

      <Snackbar open={snack.open}
        autoHideDuration={1500}
        onClose={closeSnack}
      >
        <Alert onClose={closeSnack} severity={snack.severity}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Grid>
  )
}

export default AirtableFetch;