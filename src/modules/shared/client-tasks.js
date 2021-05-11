import { push } from "svelte-spa-router";
import { currentState } from "../../core/system-store";
import { get } from "svelte/store";

export const RerouteTask = async (metadata) => {
    let url = metadata.url;
    if (metadata.appendParam != null) {
      url = `/${url}/${metadata.appendParam}`;
    }
    if(metadata.appendContextQueryParam != null) {
      const state = get(currentState);
      const context = state.context;
      const qParamValue = context[metadata.appendContextQueryParam];
      url = `${url}?${metadata.appendContextQueryParam}=${qParamValue}`;
      push(url);
    }
  };