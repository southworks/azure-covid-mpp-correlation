import {Avatar, Button, Chip, Divider, Grid, withStyles} from "@material-ui/core";
import ExitToAppIcon from "@material-ui/icons/ExitToAppRounded";
import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import styles from "../../assets/jss/material-dashboard-react/components/sidebarHeaderStyle.js";
import {purple} from "@material-ui/core/colors";
import Authenticate from "../../../app/common/Authenticate";

const useStyles = makeStyles(styles)
const auth = new Authenticate();
const logout = ()=>{
    auth.logOut()
    window.location.reload()
}
const ColorButton = withStyles((theme) => ({
    root: {
        color: theme.palette.getContrastText(purple[500]),
        '&:hover': {
            backgroundColor: "var(--color-text-title)",
        },
    },
}))(Button);
const UserChip = withStyles({
    root:{
        backgroundColor: "var(--color-main)",
        color: "var(--color-text-title)",
    }
})(Chip);

const SidebarHeader= ()=>{
    const classes= useStyles();
    const userName=auth.getUserName()
    return(
        <Grid container className={classes.buttonHeaderWrapper} spacing={1}>
            {(auth.isLoggedIn()&&(<Grid item xs={12}>
                <UserChip
                    label={userName}
                    variant="outlined"
                    avatar={
                        <Avatar alt={userName} className={classes.center}/>
                    }
                /></Grid>))}
            <Grid item xs={12} className={classes.center}>
                <ColorButton onClick={() => {auth.isLoggedIn() ? logout(): auth.logIn()}}>
                    <ExitToAppIcon/>{auth.isLoggedIn()?(<span>Log Out</span>):(<span>Log In</span>)}
                </ColorButton>
            </Grid>
            <Grid item xs={12}>
                <Divider variant={"middle"} style={{}}/>
            </Grid>
        </Grid>
    )
        ;
}


export default SidebarHeader;

