<script>
  import { onMount } from "svelte";
  import { get } from "svelte/store";
  import DynamicComponent from "./DynamicComponent.svelte";
  import {
    currentModule,
    currentFlow,
    currentStepElement,
    SetContextKey,
    RunTasks,
    currentState,
  } from "../system-store";
  import debounce from "lodash.debounce";

  export let params;
  let element;
  let flowData;
  let cFlow;
  let initComplete = false;

  onMount(async () => {
    const { flow, stepElement, wild } = params;
    let routeConfig = [];
    if(wild != null) {
      routeConfig = wild.split("/");
    }
    const cModule = get(currentModule);
    cFlow = cModule.flows[flow];
    currentFlow.set(cFlow);
    element = cFlow.elements.find((e) => e.route[0].path === stepElement);
    currentStepElement.set(element);
    for (let i = 1; i < element.route.length; i++) {
      if (!element.route[i].staticPath) {
        SetContextKey(element.route[i].path, routeConfig[i - 1]);
      }
    }
    const cState = get(currentState);
    flowData = cState.data;
    const result = await RunTasks(
      "server",
      "pre",
      cFlow.tasks,
      flowData,
      cState.context
    );
    flowData = result == null ? {} : result.data;
    currentState.set({
      data: result == null ? {} : result.data,
      context: result == null ? {} : result.context,
    });
    initComplete = true;
  });

  const runPeriTasks = debounce(async (event, cState) => {
    const result = await RunTasks(
      "server",
      "peri",
      cFlow.tasks,
      event.detail.newData,
      cState.context
    );    
    if (result != null) {
      flowData = result.data;
      currentState.set({
        data: result.data,
        context: result.context,
      });
    } else {
      flowData = event.detail.newData;
    }
  }, 300);

  const onChangeValue = (event) => {
    const cState = get(currentState);
    runPeriTasks(event, cState);
  };

</script>

<div class="route-padding">
  {#if initComplete}
    <DynamicComponent
      element={cFlow}
      data={flowData}
      on:valueChange={onChangeValue}
    />
  {/if}
</div>

<style>
  .route-padding {
    padding: 40px;
  }
</style>
