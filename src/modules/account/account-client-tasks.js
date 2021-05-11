import Api from "../../core/api";
import { push } from "svelte-spa-router";

export const LoginTask = async (data, context) => {
  const credentials = data.loginCredentials;
  let alert__message = null;
  try {
    await Api.login(credentials.userName, credentials.password, credentials.tenant);
    push("/");
  } catch(_) {
    alert__message = "Invalid username/password/tenant";
  } 
  if(context == null) {
    context = { alert__message };
  } else {
    context.alert__message = alert__message;
  }
  return {
    data,
    context
  };
};
