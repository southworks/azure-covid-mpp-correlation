import * as React from "react";
import {
  AzureAD,
  LoginType,
  AuthenticationState,
  IAzureADFunctionProps
} from "react-aad-msal";
import { ReduxStore } from "../../stores/reduxStore";

// Import the authentication provider which holds the default settings
import { authProvider } from "../../config/authProvider";
import { Button } from "semantic-ui-react";

interface ILoginLogoutButton{
  isPartial?: boolean;
}

const LoginLogoutButton: React.FC<ILoginLogoutButton> = ({isPartial}) => {
  // Change the login type to execute in a Popup
  const options = authProvider.getProviderOptions();
  options.loginType = LoginType.Popup;
  authProvider.setProviderOptions(options);

  return (
    <AzureAD provider={authProvider} reduxStore={ReduxStore}>
      {({ login, logout, authenticationState }: IAzureADFunctionProps) => {
        const isInProgress =
          authenticationState === AuthenticationState.InProgress;
        const isAuthenticated =
          authenticationState === AuthenticationState.Authenticated;
        const isUnauthenticated =
          authenticationState === AuthenticationState.Unauthenticated;

        if (isAuthenticated) {
          if(isPartial){
            return (
              <Button.Content onClick={logout} hidden>Sign-out</Button.Content>
            );
          }
          else {
            return (
              <Button className={'SignIn'} onClick={logout}>Sign-out</Button>
            );
          }
        } else if (isUnauthenticated || isInProgress) {
          if(isPartial){
            return (
              <Button.Content onClick={login} hidden>Sign-in</Button.Content>
            );
          }
          else {
            return (
              <Button className={'SignIn'} onClick={login} disabled={isInProgress}>Sign-in</Button>
            );
          }
        }
      }}
    </AzureAD>
  );
};

export default LoginLogoutButton;
