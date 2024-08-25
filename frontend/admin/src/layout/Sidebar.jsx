import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { List, ListItem, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <>
      <CssBaseline />
      <Container maxWidth="sm" sx={{ border: '1px solid black', height: '100vh', width: '20vw', marginLeft: '0' }}>
        <List sx={{ height: '100%', display: 'flex', justifyContent: 'space-around', flexDirection: 'column' }}>
          <ListItem button component={Link} to="/">
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button component={Link} to="/products">
            <ListItemText primary="Products" />
          </ListItem>
          <ListItem button component={Link} to="/services">
            <ListItemText primary="Services" />
          </ListItem>
          <ListItem button component={Link} to="/contact">
            <ListItemText primary="Contact" />
          </ListItem>
        </List>
      </Container>
    </>
  );
};

export default Sidebar;
