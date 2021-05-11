<script>
  import { TextField } from "svelte-materialify";
  import { createEventDispatcher, onMount } from "svelte";
  import { GetLookup } from "../../../core/lookup-store";
  import { Menu, List, ListItem } from "svelte-materialify";

  export let element = {};
  export let data;
  export let rules;
  let labelClass = "";
  let searchTerm;
  let prevSearchTerm;
  let menuActive = false;

  const dispatcher = createEventDispatcher();

  let lookup = [];
  let filteredLookup = [];
  let activatorWidth;

  if (element.label == null || element.label === "") {
    labelClass = "no-label";
  }

  onMount(async () => {
    lookup = await GetLookup(
      element.metadata.serverOptionsConfig.lookupKey,
      element.metadata.serverOptionsConfig.provider
    );
    if (data != null) {
      const selectedItem = lookup.find((l) => l.value === data);
      if (selectedItem != null) {
        searchTerm = selectedItem.display;
        prevSearchTerm = searchTerm;
      }
    }
    filteredLookup = lookup;
  });

  const handleInput = (e) => {
    filteredLookup = lookup.filter((l) => l.display.includes(e.target.value));
  }

  const onBlur = (e) => {
    menuActive = false;
    const selectedItem = lookup.find((f) => f.display === e.target.value);
    if (selectedItem != null) {
      dispatcher("valueChange", {
        newData: selectedItem.value,
      });
      searchTerm = selectedItem.display;
      prevSearchTerm = selectedItem.display;
      const cascadeData = lookup.find((l) => l.value === selectedItem.value);
      if (element.metadata.cascadeData != null && cascadeData != null) {
        dispatcher("cascadeData", {
          cascadeData: cascadeData.data,
          cascadeDataFields: element.metadata.cascadeData,
        });
      }
    } else {
      searchTerm = prevSearchTerm;
    }
    filteredLookup = lookup;
  }

  const select = (item) => {
    searchTerm = item.display;
    prevSearchTerm = item.display;
    dispatcher("valueChange", {
      newData: item.value,
    });
    const cascadeData = lookup.find((l) => l.value === item.value);
    if (element.metadata.cascadeData != null && cascadeData != null) {
      dispatcher("cascadeData", {
        cascadeData: cascadeData.data,
        cascadeDataFields: element.metadata.cascadeData,
      });
    }
  }

  $: {
    if (element.label == null || element.label === "") {
      labelClass = "no-label";
    } else {
      labelClass = "";
    }
  }
</script>

<Menu bind:active={menuActive} offsetY={true} nudgeY={-25}>
  <div bind:clientWidth={activatorWidth} slot="activator">
    <TextField
      bind:class={labelClass}
      disabled={element.disabled}
      style={`${element.layout?.elementStyle}`}
      on:blur={onBlur}
      on:input={handleInput}
      bind:value={searchTerm}
      placeholder=" "
    >
      {element.label ?? ""}
    </TextField>
  </div>
  <List style={`width:${activatorWidth - 20}px`}>
    {#each filteredLookup as item, index}
      <ListItem on:click={() => select(item)}>{item.display}</ListItem>
    {/each}
  </List>
</Menu>
