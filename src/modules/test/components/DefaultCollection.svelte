<script>
  import { createEventDispatcher } from "svelte";
  import { Button, Icon } from "svelte-materialify";
  import { mdiPlus, mdiMinus } from "@mdi/js";
  import DefaultGroup from "./DefaultGroup.svelte";

  export let element;
  export let data;
  export let rules;

  const dispatcher = createEventDispatcher();

  let horizontalRow = !(
    !!element.metadata.rowOrientation &&
    element.metadata.rowOrientation === "vertical"
  );

  const onValueChange = (event, index) => {
    data[index] = event.detail.newData;
    dispatcher("valueChange", {
      newData: data,
    });
  };

  const addRow = () => {
    data.push({});
    dispatcher("valueChange", {
      newData: data,
    });
  };

  const removeRow = (event, index) => {
    data.splice(index, 1);
    dispatcher("valueChange", {
      newData: data,
    });
  };
</script>

<div style={element.layout.elementStyle}>
  {#if element.metadata.showAddAndDelete && data.length < element.metadata.maxItems}
    <Button on:click={addRow} fab size="small" class="blue white-text">
      <Icon path={mdiPlus} />
    </Button>
    <div style="padding-bottom: 16px;" />
  {/if}
  <div style={element.rowLayout.gridStyle}>
    {#each data as value, index}
      <div class={horizontalRow ? "horizontal-row" : "vertical-row"}>
        <div>
          <DefaultGroup
            {element}
            data={data[index]}
            on:valueChange={(event) => onValueChange(event, index)}
            rules={[]}
          />
        </div>
        {#if element.metadata.showAddAndDelete}
          <Button
            on:click={(event) => removeRow(event, index)}
            fab
            size="x-small"
            class="red white-text"
          >
            <Icon size="16px" path={mdiMinus} />
          </Button>
          <div style="padding-bottom: 16px;" />
        {/if}
      </div>
    {/each}
  </div>
</div>

<style type="scss">
  .horizontal-row {
    display: grid;
    grid-template-columns: 1fr auto;
    grid-template-rows: 1fr;
    //gap: 0px 20px;
  }
  .vertical-row {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr auto;
  }
</style>
