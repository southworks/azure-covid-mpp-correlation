import * as React from "react";
import { NavLink } from "react-router-dom";
import { Button, Divider, Grid, Header, Icon, Menu } from "semantic-ui-react";
import LoginLogoutButton from "../../common/auth/LoginLogoutButton";

interface ILatMenuProps{
  isAuthenticated: boolean;
  userName: string | null;
}
type NavElemType = {
  title: string;
  path: string;
  icon: "area chart" | "twitter" | "chart line" | "globe" | "chain" | "time" | "home" | undefined;
}

const LatMenu: React.FC<ILatMenuProps> = ({isAuthenticated, userName}) => {
  const navElements:NavElemType[] = [
    {
      title: "Home",
      path: "/",
      icon: "home",
    },
    {
      title: "Multiline",
      path: "/multiline",
      icon: "area chart",
    },
    {
      title: "Time",
      path: "/forecast",
      icon: "time",
    },
    {
      title: "Twitter",
      path: "/twitter",
      icon: "twitter",
    },
    {
      title: "Countries",
      path: "/choropleth",
      icon: "globe",
    },
    {
      title: "Correlations",
      path: "/correlations",
      icon: "chain",
    },
  ];

  return (
    <Grid className={'LatMenu'} columns={1}>
      <Grid.Column textAlign={'center'} className={'pt-0'}>
        <Icon size={'huge'} className={'UserIcon'} circular name={'user outline'}/>
      </Grid.Column>
      <Grid.Column textAlign={'center'}>
        {isAuthenticated && (
          <Button className={'SignIn'} animated='fade'>
            <Button.Content visible>{`Welcome ${userName}`}</Button.Content>
            <LoginLogoutButton isPartial={true} />
          </Button>
        )}
        {!isAuthenticated && (
          <LoginLogoutButton />
        )}
      </Grid.Column>

      <Grid.Column className={'pb-0'}>
        <Divider horizontal inverted className={'pt-2 ph-1 pb-0'}>
          <Header as='h2' inverted>
            <Icon name='chart bar' />
          </Header>
        </Divider>
      </Grid.Column>

      <Grid.Column className={'pt-0'}>
        <Menu vertical className={'SideMenu'} fluid widths={16}>
          {navElements.map((item, index) => { 
            return (
                <Menu.Item  exact  key={index} name={item.title} as={NavLink} to={item.path}>
                  <Icon name={item.icon} />
                  {item.title}
                </Menu.Item>
              )
            }
          )}
        </Menu>
      </Grid.Column>
    </Grid>
  );
};

export default LatMenu;
