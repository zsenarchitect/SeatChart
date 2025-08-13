import React from 'react';
import ealogo from '../../assets/ennead_black.png';
// import ealogo from '../../assets/ennead_pink.png';
// import ealogo from '../../assets/ennead_flower.png';
import Typography from '@material-ui/core/Typography'

const EALogo = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', flexDirection: 'row' }}>

      <a href='https://ei.ennead.com/Default.aspx'>
        <img src={ealogo} alt="Logo" style={{ height: "30px", float: 'left' }}></img>
      </a>
      <Typography style={{ marginLeft: 4 }} variant='h6'>SeatingChart</Typography>
    </div>
  );
}

export default EALogo;