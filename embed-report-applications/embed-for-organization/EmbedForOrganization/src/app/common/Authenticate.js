import * as config from "../config/Config";
import {UserAgentApplication} from "msal";

const msalConfig = { auth: { clientId: config.clientId } };
const loginRequest = { scopes: config.scopes };
const msalInstance = new UserAgentApplication(msalConfig);
export  default class Authenticate {

    logIn() {
        msalInstance.loginRedirect(loginRequest);
    }

    logOut(){
        msalInstance.clearCache();
    }

    async getToken(){
        if (this.isLoggedIn()){
            return await msalInstance.acquireTokenSilent(loginRequest).then((res)=>{
                return res.accessToken
            });
        }else{
            return ("")
        }
    }

    getUserName(){
        return this.isLoggedIn() ? msalInstance.getAccount().name : "User Name" ;
    }

    isLoggedIn(){
        return msalInstance.getAccount()!=null
    }
}

