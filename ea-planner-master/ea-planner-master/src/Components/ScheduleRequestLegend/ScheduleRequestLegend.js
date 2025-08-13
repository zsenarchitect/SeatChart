import './ScheduleRequestLegend.css'

import React from 'react';

import Card from '@material-ui/core/Card';
import StatusDot from '../StatusDot/StatusDot';

import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

export default function ScheduleRequestLegend() {

  const getCheckInColor = (r) => {
    // allows for query by string

    let status = "";
    if (typeof r === 'object') {
      status = r.checkInStatus;
      if (!r.checkedIn) return "#b0bec5";
    } else if (typeof r === 'string') {
      status = r;
    }

    switch (status) {
      case "Working in the Office":
        return "#4987e8";
      case "Working Remotely":
        return "#c9daf8";
      case "Business Travel":
        return "#b5d7a8";
      case "Out of Office":
        return "#f2c331";
      default:
        return "#b0bec5";
    }
  }

  return (
    <Grid item style={{ alignSelf: 'flex-end', height: 250 }}>
      <Card style={{ marginTop: '1vh', marginBottom: '1vh' }} elevation={2}>
        <Table size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell colSpan={2}>Schedule Request Legend</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell style={{ width: "1px", paddingRight: "0px" }} align="right"><StatusDot color={getCheckInColor("Working in the Office")} stroke={"#4987e8"} /></TableCell>
              <TableCell align="left">Working From the Office</TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{ width: "1px", paddingRight: "0px" }} align="right"><StatusDot color={getCheckInColor("Working Remotely")} /></TableCell>
              <TableCell align="left">Working Remotely</TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{ width: "1px", paddingRight: "0px" }} align="right"><StatusDot color={getCheckInColor("Business Travel")} stroke={"#37761d"} /></TableCell>
              <TableCell align="left">Traveling for Business / Printer Online</TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{ width: "1px", paddingRight: "0px" }} align="right"><StatusDot color={getCheckInColor("Out of Office")} /></TableCell>
              <TableCell align="left">Out of Office / Printer Down</TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{ width: "1px", paddingRight: "0px" }} align="right"><StatusDot color={getCheckInColor("")} /></TableCell>
              <TableCell align="left">Not in / Scheduled</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
    </Grid>
  );
}
