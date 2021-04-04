import React, { Fragment, ReactNode } from 'react';
import { IAccountInfo } from 'react-aad-msal';
import { Button, Grid, Icon, Segment, Sidebar } from 'semantic-ui-react';
import LatMenu from "./nav/LatMenu";

type DashBoardProps = {
  accountInfo: IAccountInfo | null;
  isAuthenticated: boolean;
  children?: ReactNode;
}

const DashBoard: React.FC<DashBoardProps> = ({ accountInfo, isAuthenticated, children }) => {
  const segmentRef = React.useRef<HTMLElement>(null);
  const [visible, setVisible] = React.useState<boolean | undefined>(false)

  return (
    <Fragment>
      <Fragment>
        <div className={'DarkBackground FullHeight SideMenuWrapper'}>
          <LatMenu isAuthenticated={isAuthenticated} userName={accountInfo ? `${accountInfo.account.idToken.given_name} ${accountInfo.account.idToken.family_name}` : ''} />
        </div>
      </Fragment>
      <Fragment>
        <Sidebar
          as={Sidebar}
          animation='push'
          icon='labeled'
          inverted
          onHide={() => setVisible(false)}
          vertical
          target={segmentRef}
          visible={visible}
          width='wide'
          className={'DarkBackground'}
        >
          <Segment textAlign={'right'} className={'CloseMobileNavWrapper'}>
            <Button icon className={'CloseMobileNav'} size={'big'} onClick={(e, data) => setVisible(false)}>
              <Icon size={'big'} name={'close'} on />
            </Button>
          </Segment>
          <LatMenu isAuthenticated={isAuthenticated} userName={accountInfo ? `${accountInfo.account.idToken.given_name} ${accountInfo.account.idToken.family_name}` : ''} />
        </Sidebar>
      </Fragment>
      <Sidebar.Pushable>
        <Sidebar.Pusher className={'FullHeight'}>
          <Grid centered className={'FullHeight'}>
            <Grid.Row stretched className={'pb-0'}>
              <Grid.Column computer={3} mobile={1} className={'DarkBackground FullHeight p-0 SideMenuPlaceholder'}></Grid.Column>
              <Grid.Column width={13} className={'FullHeight pb-1'}>
                <Grid columns={1} className={'ContentArea'} >
                  <Grid.Column className={'OpenMobileNavWrapper'}>
                    <Button icon className={'OpenMobileNav'} size={'big'} onClick={(e, data) => setVisible(true)}>
                      <Icon size={'big'} name={'sidebar'} on />
                    </Button>
                  </Grid.Column>
                  <Grid.Column>
                    {children}
                  </Grid.Column>
                </Grid>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    </Fragment>
  );
};

export default DashBoard;