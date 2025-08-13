import './SignInStatusLegend.css'

import React from 'react';

import Card from '@material-ui/core/Card';
import StatusDot from '../StatusDot/StatusDot';

import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

export default function SignInStatusLegend(props) {

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
      case "Working From Home":
        return "#81d4fa";
      case "Working Elsewhere (Including Business Travel)":
        return "#81d4fa";
      case "Working In the Office":
        return "#81d4fa";
      case "n/a (select if you are NOT working)":
        return "#ffb74d";
      default:
        return "#b0bec5";
    }
  }

  return (
    <Grid item style={{ height: '210px', alignSelf: 'flex-end' }}>
      <Card style={{ height: 'calc(100% - 4vh)', marginTop: '1vh', marginBottom: '1vh' }} elevation={2}>
        <Table size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell colSpan={2}>Daily Check-In Legend</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell style={{ width: "1px", paddingRight: "0px" }} align="right"><StatusDot color={getCheckInColor("Working From Home")} /></TableCell>
              <TableCell align="left">Working From Home</TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{ width: "1px", paddingRight: "0px" }} align="right"><StatusDot color={getCheckInColor("Working In the Office")} stroke={"#2962ff"} /></TableCell>
              <TableCell align="left">Working In the Office</TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{ width: "1px", paddingRight: "0px" }} align="right"><StatusDot color={getCheckInColor("n/a (select if you are NOT working)")} /></TableCell>
              <TableCell align="left">Not Working</TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{ width: "1px", paddingRight: "0px" }} align="right"><StatusDot color={getCheckInColor("")} /></TableCell>
              <TableCell align="left">Not Checked In</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
    </Grid>
  );
}
