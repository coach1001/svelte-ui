import Api from "../../core/api";
import { push } from "svelte-spa-router";

export const TempTask = async (data, context) => {
  return {
    data,
    context
  };
};
