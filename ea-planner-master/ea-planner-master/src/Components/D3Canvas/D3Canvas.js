import React, { useEffect, useRef, useState } from 'react';

import { withStyles, makeStyles } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/core/styles';

import './D3Canvas.css';
import WTC from '../../assets/WTC.png'
import SHO from '../../assets/SHO.png'
import arrows from '../../assets/arrows.svg'
import applyFilters from '../../applyFilters'

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';

import dayjs from 'dayjs'

import DateAdapter from '@mui/lab/AdapterDayjs';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';

import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid'

import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import FormControl from '@material-ui/core/FormControl'
import Switch from '@material-ui/core/Switch';
import Tooltip from '@material-ui/core/Tooltip';
import TextField from '@material-ui/core/TextField'

import { draw, initChart, initData } from './chart.js';
import { FormGroup } from '@material-ui/core';
import { height } from '@mui/system';

const LightTooltip = withStyles((theme) => ({
  arrow: {
    color: theme.palette.common.white,
  },
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}))(Tooltip);

const D3Canvas = (props) => {
  const canvasRef = useRef();
  const planRef = useRef();
  const theme = useTheme();

  const [selOffice, setSelOffice] = useState("1WTC")

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [popoverContent, setPopoverContent] = useState({
    name: "",
    seat: "",
    headshot: "",
  });

  const [showArrow, setShowArrow] = useState(false);

  //plan set plan
  const [plan, setPlan] = useState(WTC);

  const handlePopoverOpen = (event) => {
    let anchor = document.querySelector("#" + event.id);

    setPopoverContent({
      name: event.name,
      seat: event.seat,
      ext: event.ext,
      headshot: event.headshot ?? event.image
    })
    setAnchorEl(anchor);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const useStyles = makeStyles({
    header: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.secondary.light,
      paddingTop: "10px",
      paddingBottom: "10px",
      paddingLeft: "15px",
      paddingRight: "15px",
    },
    headerContent: {
      textAlign: 'left',
    },
    subheader: {
      color: theme.palette.secondary.dark,
      margin: '2px'
    },
    icon: {
      color: theme.palette.primary.dark,
    },
    date: {
      color: "white"
    },
    calArrow: {
      color: 'black'
    },
    calAdornment: {
      color: 'white'
    }
  });

  const classes = useStyles();

  useEffect(() => {
    if (props.loading) return

    

    if (document.querySelector('#d3-svg-canvas')) {
      if (document.querySelector('#d3-svg-canvas').children.length < 1) {
        initData(applyFilters(props.records, props.filters), props.activeDate, handlePopoverOpen, handlePopoverClose, props.signin, props.schedule, props.getCheckInStyle);
        return;
      }
      draw(applyFilters(props.records, props.filters), props.activeDate, handlePopoverOpen, handlePopoverClose, props.signin, props.schedule, props.getCheckInStyle);
    }
    // when activeDate is changed, props.schedule also changes, we don't want this effect to be run twice, so props.activeDate is intentionally omitted
  }, [props.filters, props.loading, props.records, props.signin, props.schedule, props.getCheckInStyle]);

  function onImgLoad() {
    initChart(canvasRef);
  }

  // deselects only id filter for now
  const deselect = (e) => {
    let filters = [...props.filters];

    let index = props.filters.findIndex(a => a.key === 'id');
    filters.splice(index, 1, { ...props.filters[index], key: 'id', enabled: false });

    props.setFilters(filters);
  }

  const handleArrowChange = (e) => {
    setShowArrow(e.target.checked);
  }

  const handleOfficeChange = (e, obj) => {
    setSelOffice(obj.props.value);
    let filters = [...props.filters];
    let index = props.filters.findIndex(a => a.key === 'office');
    switch (obj.props.value) {
      case "1WTC":
        deselect();
        setPlan(WTC);
        filters.splice(index, 1, { ...props.filters[index], key: 'office', val: '1WTC' });
        props.setFilters(filters)
        break;
      case "SHO":
        deselect();
        setPlan(SHO);
        filters.splice(index, 1, { ...props.filters[index], key: 'office', val: 'SHO' });
        props.setFilters(filters)
        break;
      default:
        deselect();
        setPlan(WTC);
        filters.splice(index, 1, { ...props.filters[index], key: 'office', val: '1WTC' });
        props.setFilters(filters)
        break;
    }
  }

  const handleDateChange = (date) => {
    if (dayjs(date).isValid()) {
      props.setActiveDate(dayjs(date));
    }
  }

  return (
    <Card
      elevation={2}
      className='d3-container'
      style={{
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <CardHeader
        title={
          <Grid container direction="row" justify="space-between">
            <Grid item>
              <FormControl style={{ margin: '1px', minWidth: '100px' }}>
                <Select
                  style={{ color: theme.palette.primary.contrastText, fontSize: '1.3rem' }}
                  labelId="demo-simple-select-helper-label"
                  id="demo-simple-select-helper"
                  value={selOffice}
                  onChange={handleOfficeChange}
                  classes={{
                    icon: classes.icon,
                  }}
                >
                  <MenuItem value="1WTC">
                    New York
                  </MenuItem>
                  <MenuItem value={"SHO"}>Shanghai</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item>
              <FormGroup row={true}>
                <LightTooltip arrow title="Show Circulation Directions">
                  <FormGroup style={{ marginTop: "14px", marginRight: "10px" }}>
                    <Switch checked={showArrow} onChange={handleArrowChange}></Switch>
                  </FormGroup>
                </LightTooltip>
                <LocalizationProvider dateAdapter={DateAdapter}>
                  <DatePicker
                    label="Pick a day!"
                    disableToolbar
                    minDate={dayjs()}
                    maxDate={dayjs().add(6, 'month')}
                    shouldDisableDate={(day) => dayjs(day).isBefore(dayjs(), 'day')}
                    shouldDisableYear={(day) => dayjs(day).isBefore(dayjs(), 'year')}
                    value={props.activeDate.format('YYYY-MMMM-DD')}
                    onChange={handleDateChange}
                    renderInput={(params) => <TextField {...params} style={{ marginRight: 10 }} onChange={handleDateChange} />}
                  />
                </LocalizationProvider>
              </FormGroup>
            </Grid>
          </Grid>
        }
        classes={{
          root: classes.header,
          content: classes.headerContent,
        }}
      ></CardHeader>
      <Grid container direction='column' justify='center' alignItems='center' style={{ height: '100%', width: '96%', marginLeft: '2%', marginRight: '2%', marginTop: '1vh', marginBottom: '4vh' }}>
        <Grid item onClick={deselect} style={{ position: 'relative' }}>
          <div ref={canvasRef} style={{ width: '98%', zIndex: 5, margin: '1%', userSelect: 'none', maxWidth: '85vmin', position: 'absolute', display: 'inline-flex' }} />
          <img src={arrows}
            alt="circulation arrows"
            style={{
              width: '76.5%',
              Index: 2,
              margin: '14%',
              marginTop: '15%',
              opacity: '0.85',
              userSelect: 'none',
              maxWidth: '85vmin',
              position: 'absolute',
              display: showArrow ? 'inline-flex' : 'none'
            }}>
          </img>
          <img src={plan}
            ref={planRef}
            style={{ width: '98%', margin: '1%', userSelect: 'none', maxWidth: '85vmin' }}
            onLoad={onImgLoad}
            id="planImg"
            alt="plan"
          ></img>
        </Grid>
      </Grid>
      <Popover
        id="mouse-over-popover"
        style={{ pointerEvents: 'none' }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        {popoverContent.seat && popoverContent.ext ?
          <Grid container direction='row' style={{ marginTop: '10px', marginLeft: '10px', marginRight: '12px', marginBottom: '10px' }}>
            <Grid item>
              <img src={popoverContent.headshot} style={{ width: '50px', height: '50px', borderRadius: '25px', marginTop: '3px' }} alt={popoverContent.name} />
            </Grid>

            <Grid item style={{ paddingLeft: '10px' }}>
              <Grid item>
                {popoverContent.name}
              </Grid>
              <Grid item>
                <Typography variant="overline" style={{ lineHeight: '0px' }}>
                  Ext: {popoverContent.ext}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="overline" style={{ lineHeight: '0px' }}>
                  Seat: {popoverContent.seat}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          :
          <Grid container direction='column' style={{ marginTop: '10px', marginLeft: '10px', marginRight: '12px', marginBottom: '10px' }}>
            <Grid item>
              <Typography style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                {popoverContent.name}
              </Typography>
            </Grid>
            <Grid item>
              <img src={popoverContent.headshot} style={{ width: '180px', height: '180px', borderRadius: '4px', marginTop: '3px' }} alt={popoverContent.name} />
            </Grid>
          </Grid>
        }
      </Popover>
    </Card>
  )
}
export default D3Canvas