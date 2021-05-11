<script>
  import DynamicComponent from "../../../core/components/DynamicComponent.svelte";
  import { createEventDispatcher } from "svelte";

  export let element;
  export let data;
  export let rules;

  data = data == null ? {} : data;
  const dispatcher = createEventDispatcher();
  
  const onValueChange = (event, childElement) => {
    data[childElement.dataPropertyName] = event.detail.newData;
    dispatcher("valueChange", {
      newData: data,
    });
  }
  
  const onCascadeData = (cascade) => {
    const eventDetail = cascade.detail;
    if (eventDetail.cascadeDataFields != null) {
      Object.keys(eventDetail.cascadeDataFields).forEach((k) => {
        data[k] = eventDetail.cascadeData[eventDetail.cascadeDataFields[k]];
      });
    }
    dispatcher("valueChange", {
      newData: data,
    });
  }

</script>

<div style={`${element.layout.gridStyle} ${element.layout.elementStyle}`}>
  {#each element.elements as childElement (childElement.id)}
    <DynamicComponent
      element={childElement}
      data={data[childElement.dataPropertyName]}
      on:valueChange={(event) => onValueChange(event, childElement)}
      on:cascadeData={onCascadeData}
    />
  {/each}
</div>

<style>
</style>
