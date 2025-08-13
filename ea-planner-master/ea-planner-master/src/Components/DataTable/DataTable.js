import './DataTable.css'

import React, { useState, useEffect } from 'react';


import { useTheme } from '@material-ui/core/styles';
import MaterialTable from 'material-table';
import Chip from '@material-ui/core/Chip'
import Divider from '@material-ui/core/Divider';
import EALogo from '../EALogo/EALogo';
import applyFilters from '../../applyFilters'

import Card from '@material-ui/core/Card';
import StatusDot from '../StatusDot/StatusDot';

import Grid from '@material-ui/core/Grid';

import D3Canvas from '../D3Canvas/D3Canvas';

import SignInCard from '../SignInCard/SignInCard';
import ScheduleCard from '../ScheduleCard/ScheduleCard';
import EmployeeCard from '../SignInCard/EmployeeCard';

import ScheduleRequestLegend from '../ScheduleRequestLegend/ScheduleRequestLegend';
import { Button } from '@material-ui/core';

function useWindowDims() {
  const [dims, setDims] = useState({ x: window.innerWidth, y: window.innerHeight });

  useEffect(() => {
    const handleResize = () => {
      setDims({ x: window.innerWidth, y: window.innerHeight });
    }
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });
  return dims;
}

let clickedRows = [];

let clickedEmployee = [];

export default function DataTable(props) {
  const theme = useTheme();

  const [showEmployeeCard, setShowEmployeeCard] = useState(false);

  const [showSeats, setShowSeats] = useState(true);

  const [showSignIn, setShowSignIn] = useState(false);

  const [showSchedule, setShowSchedule] = useState(false);

  const dims = useWindowDims();

  let toggle = true;

  const columns = [
    {
      field: 'headshot',
      title: '',
      render: rowData => <img src={rowData.headshot} style={{ width: 50, borderRadius: '50%' }} alt={rowData.name} />,
      width: 40,
      id: rowData => rowData.id,
      celStyle: { padding: '8px 0px 4px 16px' }
    },
    {
      title: 'Name',
      field: 'name',
      searchable: true,
      width: 200,
      id: rowData => rowData.id,
      render: rowData => <table><tbody><tr><td><a target="_blank" className='table-link' href={rowData.profile}>{rowData.name}</a></td></tr><tr><td><Divider /></td></tr><tr><td className="comment"><StatusDot color={props.getCheckInStyle(rowData.id).fill} stroke={rowData.checkInStatus === 'Working In the Office' ? '#000000' : undefined} strokewidth={10}/>{rowData.comment}</td></tr></tbody></table>,
      customSort: (a, b) => {
        return a.name.toUpperCase() < b.name.toUpperCase() ? -1 : 1;
      },
      cellStyle: { padding: '6px 24px 6px 0px' },
      headerStyle: { padding: '6px 24px 6px 0px' }
    },
    {
      title: 'Seat',
      field: 'seat',
      width: 20,
      id: rowData => rowData.id,
      customSort: (a, b) => a.seat < b.seat ? -1 : 1,
    },
    {
      title: 'Dept',
      field: 'dept',
      width: 20,
      searchable: false,
      id: rowData => rowData.id,
      customSort: (a, b) => a.dept < b.dept ? -1 : 1,
      render: rowData => rowData.dept ? <Chip className="dept-chip" label={rowData.dept} size='small' style={{ backgroundColor: theme.palette.teams[rowData.dept.replace(" ", "")] }} /> : '',
    }];

  let options = {
    paging: false,
    minBodyHeight: dims.y - 348 + 'px',
    maxBodyHeight: dims.y - 348 + 'px',
    headerStyle: { position: 'sticky', top: 0 },
    searchFieldAlignment: 'left',
    showTitle: false,
    padding: 'dense',
  }

  const handleSearchChange = (e) => {
    
    if (e === '') {
      toggle = false;
    }

    let filters = [...props.filters];

    let index = props.filters.findIndex(a => a.key === 'name');
    filters.splice(index, 1, { ...props.filters[index], key: 'name', enabled: toggle, val: e.toUpperCase() });

    props.setFilters(filters);
  }

  const handleSignInClick = () => {
    setShowSignIn(!showSignIn);
    setShowSchedule(false);
  }

  const handleScheduleClick = () => {
    setShowSchedule(!showSchedule);
    setShowSignIn(false);
  }

  const handleRowClick = (e, rowData) => {

    clickedEmployee = [];

    let seatsToggle = true;
    

    clickedEmployee.push(rowData);

    
    if(clickedEmployee[0].office == '1WTC'){
      setShowEmployeeCard(!showEmployeeCard);
      seatsToggle = true;
    } else {
      seatsToggle = false;
      console.log(seatsToggle)
    }
    
    
    let filters = [...props.filters];
    let index = props.filters.findIndex(a => a.key === 'name');
    filters.splice(index, 1, { ...props.filters[index], key: 'name', enabled: seatsToggle, val: clickedEmployee[0].name.toUpperCase() });
    props.setFilters(filters);    
    
  }


  const renderButton = () => {
    return (
      <>
        <Button onClick={handleSignInClick} variant='outlined'
          size='small'
          color='secondary'
          style={{
            margin: 4,
            alignSelf: 'center',
            justifySelf: 'flex-end'
          }}>
          Check In
        </Button>
        <Button onClick={handleScheduleClick} variant='outlined'
          size='small'
          color='secondary'
          style={{
            margin: 4,
            alignSelf: 'center',
            justifySelf: 'flex-end'
          }}>
          Schedule
        </Button>
      </>
    )
  }

  const renderForm = () => {
    if (showEmployeeCard) {
      return (
        <EmployeeCard show={showEmployeeCard}
          setShow={setShowEmployeeCard}
          records={props.records}
          signInRefresh={props.signInRefresh}
          openSnack={props.openSnack}
          clickedEmployee={clickedEmployee}
          setShowSeating={setShowSeats}
          filters={props.filters}
          setFilters={props.setFilters}
          dims={dims}
        />
      )
    } 
    if (showSignIn) {
      return (
        <SignInCard show={showSignIn}
          setShow={setShowSignIn}
          records={props.records}
          signInRefresh={props.signInRefresh}
          openSnack={props.openSnack}
        />
      )
    } 
    if (showSchedule) {
      return (
        <ScheduleCard show={showSchedule}
          setShowSchedule={setShowSchedule}
          records={props.records}
          openSnack={props.openSnack}
          activeDate={props.activeDate}
          scheduleRefresh={props.scheduleRefresh}
        />)
    } 
  }


  return (
    <Grid style={{ marginTop: '1vh', marginLeft: '1vh', height: 'calc(100vh - 230px)', minHeight:'400px'}} direction='column'>
      <Card elevation={2} style={{ height: '100%' }}>
        <Grid container spacing={2} direction='row' justify='space-between' style={{ marginBottom: '5px', padding: '24px 16px 8px' }}>
          <EALogo />
          {
            renderButton()
          }
          {
            renderForm()
          }
        </Grid>
        <Divider />
        <MaterialTable
          title="Ennead Staff"
          columns={columns}
          data={props.records}
          options={options}
          style={{ padding: '0px', boxShadow: 'none'}}
          isLoading={!props.loaded}
          onSearchChange={handleSearchChange}
          onRowClick={handleRowClick}
        />
      </Card>
      <ScheduleRequestLegend />
    </Grid>
  );
}
