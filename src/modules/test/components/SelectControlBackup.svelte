<script>
  import { Select } from "svelte-materialify";
  import { createEventDispatcher, onMount } from "svelte";
  import { GetLookup } from "../../../core/lookup-storeore";

  export let element;
  export let data;
  export let rules;

  let lookup = [];
  const items = [];
  const dispatcher = createEventDispatcher();

  onMount(async () => {
    lookup = await GetLookup(
      element.metadata.serverOptionsConfig.lookupKey,
      element.metadata.serverOptionsConfig.provider
    );
    lookup.forEach((l) => {
      items.push({ name: l.display, value: l.value });
    });
  });

  const handleInput = (e) => {
    dispatcher("valueChange", {
      newData: e.detail,
    });
    const cascadeData = lookup.find(l => l.value === e.detail);
    if (element.metadata.cascadeData != null && cascadeData != null) {
      dispatcher("cascadeData", { cascadeData: cascadeData.data, cascadeDataFields: element.metadata.cascadeData});
    }
  }
</script>

<Select {items} placeholder=" " on:change={handleInput} value={data}>
  {element.label ?? ""}
</Select>

<!-- <Select 
  disabled={element.disabled}
  style={`${element.layout.gridStyle} ${element.layout.elementStyle}`}
  on:input={handleInput}
  value={data}
  placeholder=" "
>
  {element.label ?? ""}
  <div class="suffix {element.disabled ? 'disabled' : ''}" slot="append">
    {#if !!element.metadata.suffix}
      {element.metadata.suffix}
    {/if}
  </div>
</Select> -->
