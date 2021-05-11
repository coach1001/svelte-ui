<script>
  import { TextField, Icon } from "svelte-materialify";
  import { createEventDispatcher } from "svelte";
  import { mdiEye, mdiEyeOff } from "@mdi/js";
  import ControlError from "./ControlError.svelte";

  export let element;
  export let data;
  export let rules;

  let dirty = false;
  let labelClass = "";
  let isPassword = false;
  let viewPassword = false;

  const dispatcher = createEventDispatcher();
  if (element.metadata != null) {
    if (
      element.metadata.isPasswordField != null &&
      element.metadata.isPasswordField
    ) {
      isPassword = true;
    }
  }

  if (element.label == null || element.label === "") {
    labelClass = "no-label";
  }

  const handleInput = (e) => {
    dirty = false;
    dispatcher("valueChange", {
      newData: e.target.value,
    });
  };

  const handleBlur = (e) => {
    dirty = true;
  };

  $: {
    if (element.label == null || element.label === "") {
      labelClass = "no-label";
    } else {
      labelClass = "";
    }
  }
</script>

<TextField
  bind:class={labelClass}
  type={isPassword && !viewPassword ? "password" : "text"}
  disabled={element.disabled}
  style={`${element.layout.elementStyle}`}
  on:input={handleInput}
  on:blur={handleBlur}
  bind:value={data}
  placeholder=" "
>
  {element.label ?? ""}
  <div class="suffix {element.disabled ? 'disabled' : ''}" slot="append">
    {#if isPassword}
      <div
        class="clickable"
        on:click={() => {
          viewPassword = !viewPassword;
        }}
      >
        <Icon path={viewPassword ? mdiEyeOff : mdiEye} />
      </div>
    {:else if !!element.metadata.suffix}
      {element.metadata.suffix}
    {/if}
  </div>
</TextField>
<ControlError id={element.id} {rules} {dirty} {data} on:validationChange/>
