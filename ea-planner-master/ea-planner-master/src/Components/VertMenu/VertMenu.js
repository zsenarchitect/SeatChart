import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import MenuList from '@material-ui/core/MenuList';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';

import SvgIcon from '@material-ui/core/SvgIcon';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import BusinessIcon from '@material-ui/icons/Business';
import Divider from '@material-ui/core/Divider';
import './VertMenu.css'

const options = [
  'Shanghai Office',
  'New Plan',
  'New Dataset',
];

const ITEM_HEIGHT = 48;

export default function VertMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon size='large' color='secondary'/>
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: '20ch',
          },
        }}
      >
          <MenuList>
          <MenuItem>
            <ListItemIcon>
              <BusinessIcon/>
            </ListItemIcon>
            <Typography variant="inherit">Shanghai Office</Typography>
          </MenuItem>
          <Divider style={{marginBottom:'12px'}}/>
          <MenuItem>
            <ListItemIcon>
              <AddCircleOutlineIcon fontSize="small" />
            </ListItemIcon>
            <Typography variant="inherit">New Plan</Typography>
          </MenuItem>
          <MenuItem>
            <ListItemIcon>
              <AddCircleOutlineIcon fontSize="small" />
            </ListItemIcon>
            <Typography variant="inherit">
              New Dataset
            </Typography>
          </MenuItem>
        </MenuList>
      </Menu>
    </div>
  );
}
