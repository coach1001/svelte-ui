<script>
  import { Tabs, Tab, TabContent } from "svelte-materialify";
  import DynamicComponent from "../../../core/components/DynamicComponent.svelte";
  import { createEventDispatcher } from "svelte";

  export let element;
  export let data;
  export let rules;

  const dispatcher = createEventDispatcher();

  const onValueChange = (event, childElement) => {
    data[childElement.dataPropertyName] = event.detail.newData;
    dispatcher("valueChange", {
      newData: data,
    });
  }
</script>

<div style={`${element.layout.gridStyle} ${element.layout.elementStyle}`} class="tab-container">
  <Tabs vertical centerActive>
    <div slot="tabs">
      {#each element.elements as childElement (childElement.id)}
        <Tab>{childElement.label}</Tab>
      {/each}
    </div>
    {#each element.elements as childElement (childElement.id)}
      <TabContent>
        <div class="tab-content-container">
          <DynamicComponent
            element={childElement}
            data={data[childElement.dataPropertyName]}
            on:valueChange={ (event) => onValueChange(event, childElement) }
          />
        </div>
      </TabContent>
    {/each}
  </Tabs>
</div>

<style>
  .tab-content-container {
    padding: 0 20px 0 20px;
  }
</style>
