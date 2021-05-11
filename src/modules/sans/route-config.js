import { wrap } from "svelte-spa-router/wrap";
import RouteComponent from "../../core/components/RouteComponent.svelte";
import { GetModule } from "../../core/system-store";

export default {
  "/sans/:flow/:stepElement/*": wrap({
    component: RouteComponent,
    userData: {
      moduleName: "sans-samples-module",
    },
    conditions: [
      async (route) => {
        await GetModule(route);
        return true;
      },
    ],
  }),
};
