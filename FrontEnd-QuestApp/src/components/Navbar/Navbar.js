import React from "react";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css"
import { LockOpen } from "@mui/icons-material";



function Navbar() {

    let navigate = useNavigate();

    const onClick = () => {
      localStorage.removeItem("tokenKey")
      localStorage.removeItem("currentUser")
      localStorage.removeItem("userName")
      navigate("/auth");
    }
    return(
        <>
       <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link  className="link" to="/">Home</Link>
          </Typography>
          <Typography variant="h6" component="div">
            {localStorage.getItem("currentUser") == null ? 
            <Link className="link" to="/auth">Login/Register</Link>:

            <div className="dflex-align-items-center">
            <Link className="link" to={{pathname :'/users/' + localStorage.getItem("currentUser")}}>Profile</Link>
            <IconButton
           
            onClick={onClick}>  <LockOpen className="link"></LockOpen></IconButton>
            </div>
            }

          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
        
        </>
    )
}

export default Navbar;