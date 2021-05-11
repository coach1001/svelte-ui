<script>
  import { GetComponent } from "../component-registry";
  import { createEventDispatcher } from "svelte";
  export let element;
  export let data;
  let rules = element.validations;

  const dispatcher = createEventDispatcher();

  function onValueChange(event) {
    dispatcher("valueChange", {
      newData: event.detail.newData,
    });
  }

</script>

<svelte:component
  this={GetComponent(
    element.renderedElement != null
      ? element.renderedElement
      : element.containerComponent
  )}
  {element}
  {data}
  {rules}
  on:valueChange={onValueChange}
  on:cascadeData
/>
