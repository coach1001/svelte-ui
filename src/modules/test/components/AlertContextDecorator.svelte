<script>
  import { createEventDispatcher } from "svelte";
  import { Alert  } from "svelte-materialify";
  import { currentState } from "../../../core/system-store";

  export let element;
  export let data;
  export let rules;
  
  const dispatcher = createEventDispatcher();

</script>

{#if $currentState.context.alert__message != null }
<div class="alert-text" style={`${element.layout.gridStyle} ${element.layout.elementStyle}`}>
  <Alert dense text tile class="error-text">
    {$currentState.context.alert__message}
  </Alert>
</div>
{/if}
