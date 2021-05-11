<script>
  import { Button, Card } from "svelte-materialify";
  import DynamicComponent from "../../../core/components/DynamicComponent.svelte";
  import { get } from "svelte/store";
  import { currentStepElement } from "../../../core/system-store";
  import { createEventDispatcher } from "svelte";
  import { currentState, RunTasks } from "../../../core/system-store";
  import { Validate, forceValidate } from "../../../core/control-validation";

  export let element;
  export let rules;
  export let data;

  data = data == null ? {} : data;
  const dispatcher = createEventDispatcher();

  let stepElement = get(currentStepElement);
  let stepData = data[stepElement.dataPropertyName];

  
  const onValueChange = (event, childElement) => {
    stepData[childElement.dataPropertyName] = event.detail.newData;
    data[stepElement.dataPropertyName] = stepData;
    dispatcher("valueChange", {
      newData: data,
    });
  };

  const back = async () => {
    const cState = get(currentState);
  };

  const save = async () => {
    const cState = get(currentState);
  };

  const next = async () => {
    forceValidate.set("forceValidate");
    const validStep = Validate();
    const cState = get(currentState);
    if (validStep) {
      const clientResult = await RunTasks(
        "client",
        "post",
        stepElement.tasks,
        data,
        cState.context
      );
      const serverResult = await RunTasks(
        "server",
        "post",
        stepElement.tasks,
        clientResult.data,
        clientResult.context
      );

      currentState.set({
        data: serverResult.data,
        context: serverResult.context,
      });
    }
  };

  $: {
    stepData =
      data[stepElement.dataPropertyName] == null
        ? {}
        : data[stepElement.dataPropertyName];
  }
  $: hideNavigationButtons = stepElement.hideNavigationButtons != null && stepElement.hideNavigationButtons === true;

</script>

<Card raised>
  <div class="flow-container">
    {#if stepElement.backButtonLabel != null && !hideNavigationButtons}
      <Button class="teal white-text" on:click={back}>{stepElement.backButtonLabel}</Button>
    {/if}
    {#if stepElement.saveButtonLabel != null && !hideNavigationButtons}
      <Button class="green white-text" on:click={save}>
        {stepElement.saveButtonLabel}
      </Button>
    {/if}
    {#if stepElement.nextButtonLabel != null && !hideNavigationButtons}
      <Button class="blue white-text" on:click={next}>
        {stepElement.nextButtonLabel}
      </Button>
    {/if}
    {#if !hideNavigationButtons}
      <div style="margin-bottom: 20px;"></div>
    {/if}
    {#each stepElement.elements as childElement (childElement.id)}
      <DynamicComponent
        element={childElement}
        data={stepData[childElement.dataPropertyName]}
        on:valueChange={(event) => onValueChange(event, childElement)}
      />
    {/each}
  </div>
</Card>

<style>
  .flow-container {
    padding: 40px;
  }
</style>
