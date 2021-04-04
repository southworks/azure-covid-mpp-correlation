/*!

=========================================================
* Material Dashboard React - v1.9.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// @material-ui/icons
import {Flag, HomeOutlined, LinkOutlined, Timeline, Twitter, Watch} from "@material-ui/icons";

const dashboardRoutes = [

  {
    path: "",
    name: "Home",
    rtlName: "",
    icon: HomeOutlined,
    layout: "/webapp-internal/index.html"
  },{
    path: "/multiline",
    name: "Multiline Reports",
    rtlName: "",
    icon: Timeline,
    layout: "/webapp-internal/index.html"
  },
  {
    path: "/tweets",
    name: "Twitter Reports",
    rtlName: "",
    icon: Twitter,
    layout: "/webapp-internal/index.html"
  },
  {
    path: "/time",
    name: "Time Reports",
    rtlName: "",
    icon: Watch,
    layout: "/webapp-internal/index.html"
  },
  {
    path: "/countries",
    name: "Countries",
    rtlName: "",
    icon: Flag,
    layout: "/webapp-internal/index.html"
  },
  {
    path: "/correlations",
    name: "Correlations",
    rtlName: "",
    icon: LinkOutlined,
    layout: "/webapp-internal/index.html"
  }
];

export default dashboardRoutes;
