import routes from "../../../app/common/routes";
import Sidebar from "../../components/Sidebar/Sidebar";
import React from "react";
import bgImage from "../../assets/img/sidebar-1.jpg";
import Navbar from "../../components/Navbars/Navbar";

const Menu = () => {
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    }
    const [color] = React.useState("blue");
    const [image] = React.useState(bgImage);

    return(
        <div>
            <Sidebar
                routes = {routes}
                logoText ={"Quebec"}
                handleDrawerToggle ={handleDrawerToggle}
                open = {mobileOpen}
                color = {color}
                image = {image}
            />
            <Navbar
                routes={routes}
                handleDrawerToggle={handleDrawerToggle}
            />
        </div>

    );
}
export default Menu;
