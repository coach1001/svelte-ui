<script>
  import { TextField } from "svelte-materialify";
  import { FormatNumber } from "../../../core/number-util";
  import { createEventDispatcher } from "svelte";
  import { IsNumeric } from "../../../core/number-util";
  import ControlError from "./ControlError.svelte";
  
  export let element;
  export let data;
  export let rules;

  let dirty = false;
  let labelClass = "";
  let textValue;
  let prevTextValue;
  const dispatcher = createEventDispatcher();

  if (element.label == null || element.label === "") {
    labelClass = "no-label";
  }

  if (element.disabled) {
    textValue = FormatNumber(
      data,
      element.metadata.decimalPlaces,
      element.metadata.leadingZeros
    );
  } else {
    textValue = data;
    prevTextValue = data;
  }

  const handleInput = (e) => {
    dirty = false;
    if (IsNumeric(e.target.value)) {
      dispatcher("valueChange", {
        newData: Number(e.target.value),
      });
      prevTextValue = e.target.value;
    } else if (e.target.value == null || e.target.value === "") {
      dispatcher("valueChange", {
        newData: null,
      });
      prevTextValue = e.target.value;
    } else {
      textValue = prevTextValue;
    }
  }

  const formatOnBlur = () => {
    dirty = true;
    if (IsNumeric(textValue)) {
      textValue = FormatNumber(
        data,
        element.metadata.decimalPlaces,
        element.metadata.leadingZeros
      );
    }
  }

  $: {
    if (element.disabled) {
      textValue = FormatNumber(
        data,
        element.metadata.decimalPlaces,
        element.metadata.leadingZeros
      );
    }
    if (element.label == null || element.label === "") {
      labelClass = "no-label";
    } else {
      labelClass = "";
    }
  }
</script>

<TextField
  bind:class={labelClass}
  disabled={element.disabled}
  dense
  style={`${element.layout.elementStyle}`}
  on:input={handleInput}
  on:blur={formatOnBlur}
  bind:value={textValue}
  placeholder=" "
>
  {element.label ?? ""}
  <div class="suffix {element.disabled ? 'disabled' : ''}" slot="append">
    {#if !!element.metadata.unit}
      {element.metadata.unit}
    {/if}
  </div>
</TextField>
<ControlError id={element.id} {rules} {dirty} {data} on:validationChange/>

<style type="scss">
  .s-input {
    &.disabled {
      .s-text-field__wrapper:before {
        border-style: dashed !important;
      }
    }
  }
</style>
