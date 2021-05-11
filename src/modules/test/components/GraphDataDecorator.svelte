<script>
  import { createEventDispatcher } from "svelte";

  export let element;
  export let data;
  export let rules;
  
  const dispatcher = createEventDispatcher();

</script>

<div style={`${element.layout.gridStyle} ${element.layout.elementStyle}`}>Graph Data Decorator</div>
