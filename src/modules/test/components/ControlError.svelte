<script>
  import { onDestroy } from "svelte";
  import { GetRule } from "../../../core/rule-registry";
  import { forceValidate } from "../../../core/control-validation";
  import {
    SetControlValidationStatus,
    RemoveControlValidationStatus,
  } from "../../../core/control-validation";

  export let id;
  export let rules;
  export let data;
  export let dirty;

  let showError = false;
  let errorMessage = "";

  const unsubscribe = forceValidate.subscribe((value) => {
    if (value === "forceValidate" || value === id) {
      dirty = true;
      let valid = true;
      if (rules != null) {
        for (let i = 0; i < rules.length; i++) {
          const rule = rules[i];
          const ruleFunc = GetRule(rule.name);
          const result = ruleFunc(data, rule.metadata);
          if (typeof result === "string" || result instanceof String) {
            valid = false;
            errorMessage = result;
            break;
          }
        }
      }
      if (dirty) {
        showError = !valid;
      } else {
        showError = false;
        errorMessage = "";
      }
      SetControlValidationStatus(id, valid);
    }
  });

  onDestroy(() => {
    unsubscribe();
    RemoveControlValidationStatus(id);
  });

  $: {
    let valid = true;
    if (rules != null) {
      for (let i = 0; i < rules.length; i++) {
        const rule = rules[i];
        const ruleFunc = GetRule(rule.name);
        const result = ruleFunc(data, rule.metadata);
        if (typeof result === "string" || result instanceof String) {
          valid = false;
          errorMessage = result;
          break;
        }
      }
    }
    if (dirty) {
      showError = !valid;
    } else {
      showError = false;
      errorMessage = "";
    }
    SetControlValidationStatus(id, valid);
  }
</script>

{#if dirty && showError}
  <div class="control-error red-text">
    {errorMessage}
  </div>
{/if}

<style>
  .control-error {
    font-size: 10px;
    min-height: 20px;
    margin-top: -20px;
  }
</style>
