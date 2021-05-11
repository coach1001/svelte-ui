const ControlValidationStatuses = new Map();
import { writable } from "svelte/store";

export const forceValidate = writable("");

export const ClearAllControlValidationStatuses = () => {
  ControlValidation.clear();
}

export const SetControlValidationStatus = (id, valid) => {
  ControlValidationStatuses.set(id, valid);
}

export const RemoveControlValidationStatus = (id) => {
  ControlValidationStatuses.delete(id);
}

export const Validate = () => {
  let valid = true;
  ControlValidationStatuses.forEach(value => {
    if (valid) {
      valid = value;
    }
  })
  return valid;
}

