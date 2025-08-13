import React from 'react';
import './App.css';
import AirtableFetch from './Components/AirtableFetch/AirtableFetch'

import { ThemeProvider } from '@material-ui/styles';
import { createTheme } from '@material-ui/core/styles';

import blueGrey from '@material-ui/core/colors/blueGrey';
import teal from '@material-ui/core/colors/teal';

const theme = createTheme({
  palette: {
    primary: {
      light: blueGrey[100],
      main: blueGrey[300],
      dark: blueGrey[700],
      contrastText: '#ffffff',
    },
    secondary: {
      light: teal[100],
      main: teal[300],
      dark: teal[700],
      contrastText: '#ffffff',
    },
    teams: {
      Technical: '#90caf9',
      Accounting: '#a5d6a7',
      Operations: '#ffcc80',
      Admin: '#80cbc4',
      IT: '#ffe082',
      EAC: '#ffab91',
      HR: '#b39ddb',
      Interiors: '#80deea',
      Intern: '#f48fb1',
      Marketing: '#ce93d8',
      Shanghai: '#9fa8da',
      Partner: '#81d4fa',
    }
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <AirtableFetch></AirtableFetch>
      </div>
    </ThemeProvider>
  );
}

export default App;
