import styles from '../../assets/jss/material-dashboard-react/layouts/adminStyle'
import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Menu from "../Menu/Menu";
const useStyles = makeStyles(styles);

export default function Content(props) {
    const classes = useStyles();
    const mainPanel = React.createRef();

    return(
        <div>
            <Menu/>
            <div>
                <div className={classes.mainPanel} ref={mainPanel}>
                    {props.children}
                </div>
            </div>
        </div>
)
}
