import App from "./App.svelte";
import { AddComponent } from "./core/component-registry";
import { currentSystemName } from "./core/system-store";
import { AddRule } from "./core/rule-registry";
import { IsNumeric } from "./core/number-util";
import { AddTask } from "./core/client-task-store";

import FlowContainer from "./modules/test/components/FlowContainer.svelte";
import HiddenControl from "./modules/test/components/HiddenControl.svelte";
import TableControl from "./modules/test/components/TableControl.svelte";
import TextControl from "./modules/test/components/TextControl.svelte";
import TabsetControl from "./modules/test/components/TabsetControl.svelte";
import DefaultGroup from "./modules/test/components/DefaultGroup.svelte";
import DefaultCollection from "./modules/test/components/DefaultCollection.svelte";
import StaticTextDecorator from "./modules/test/components/StaticTextDecorator.svelte";
import NumberControl from "./modules/test/components/NumberControl.svelte";
import SelectControl from "./modules/test/components/SelectControl.svelte";
import GraphDataDecorator from "./modules/test/components/GraphDataDecorator.svelte";
import AlertContextDecorator from "./modules/test/components/AlertContextDecorator.svelte";
import AccountRoutes from "./modules/account/route-config";
import SansRoutes from "./modules/sans/route-config";
import ClientsRoutes from "./modules/clients/route-config";

import { LoginTask } from "./modules/account/account-client-tasks";

currentSystemName.set("lab-calculator");
AddComponent("flow-container", FlowContainer);
AddComponent("hidden-control", HiddenControl);
AddComponent("table-control", TableControl);
AddComponent("text-control", TextControl);
AddComponent("number-control", NumberControl);
AddComponent("tabset-control", TabsetControl);
AddComponent("default-group", DefaultGroup);
AddComponent("default-collection", DefaultCollection);
AddComponent("static-text-decorator", StaticTextDecorator);
AddComponent("select-control", SelectControl);
AddComponent("graph-data-decorator", GraphDataDecorator);
AddComponent("alert-context-decorator", AlertContextDecorator);

AddRule("number-only", function (v, metadata) {
  if(v == null || v === "") return true;
  return IsNumeric(v) ? true : "Not a valid number";
});
AddRule("required", function(v, metadata) {
  return !!v || 'Required';
});
AddRule("minLength", function(v, metadata) {
  if(v == null) return true;
  if(v.length >= metadata.length) {
    return true;
  }
  return `Minimum length - ${metadata.length}`; 
});

let routes = new Map();
Object.keys(AccountRoutes).forEach((key) => {
  routes.set(key, AccountRoutes[key]);
});
Object.keys(SansRoutes).forEach((key) => {
  routes.set(key, SansRoutes[key]);
});
Object.keys(ClientsRoutes).forEach((key) => {
  routes.set(key, ClientsRoutes[key]);
});
const app = new App({
  target: document.body,
  props: {
    routes: routes,
  },
});

AddTask("login-task", LoginTask);

export default app;
