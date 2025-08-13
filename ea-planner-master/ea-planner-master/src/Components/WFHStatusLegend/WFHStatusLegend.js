import './WFHStatusLegend.css'

import React, {useState, useEffect} from 'react';
import { useTheme } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Switch from '@material-ui/core/Switch';

function useWindowDims() {
  const [dims, setDims] = useState({x:window.innerWidth, y:window.innerHeight});
  
  useEffect(() => {
    const handleResize = () => {
      setDims({x:window.innerWidth, y:window.innerHeight});
    }
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });
  return dims;
}

export default function DataTable(props){
  const theme = useTheme();

  const dims = useWindowDims();

  const getCheckInColor = (r) => {
    // allows for query by string

    let status = "";
    if(typeof r === 'object'){
      status = r.checkInStatus;
      if(!r.checkedIn) return "#ff5722";
    } else if(typeof r === 'string'){
      status = r;
    }
    
    switch(status){
      case "Working From Home":
        return"#40c4ff";
      case "Working Elsewhere (Including Business Travel)":
        return "#40c4ff";
      case "Working In the Office*":
        return "#00838f";
      case "n/a (select if you are NOT working)":
        return "#ffc107";
      default:
        return "#ff5722";
    }
  }

  return(
    <Grid item style={{alignSelf:'flex-end'}}>
      <Card style={{height:'calc(100% - 4vh)', marginTop:'1vh', marginBottom:'1vh'}} elevation={4}>
          <Table size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell colSpan={2}>Status Legend</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                  <TableCell style={{width:"1px", paddingRight:"0px"}} align="right"><Switch size="small"/></TableCell>
                  <TableCell align="left">No Response</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{width:"1px", paddingRight:"0px"}} align="right"><Switch size="small"/></TableCell>
                  <TableCell align="left">None</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{width:"1px", paddingRight:"0px"}} align="right"><Switch size="small"/></TableCell>
                  <TableCell align="left">1-2 Days</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{width:"1px", paddingRight:"0px"}} align="right"><Switch size="small"/></TableCell>
                  <TableCell align="left">3-4 Days</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{width:"1px", paddingRight:"0px"}} align="right"><Switch size="small"/></TableCell>
                  <TableCell align="left">Full Time</TableCell>
                </TableRow>
            </TableBody>
          </Table>
      </Card>
    </Grid>
  );
}
