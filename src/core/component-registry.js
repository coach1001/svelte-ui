const ComponentRegistry = new Map();

export const AddComponent = (key, value) => {
  ComponentRegistry.set(key, value);
};

export const GetComponent = (key) => {
  const component = ComponentRegistry.get(key);
  if (!!component) return component;
  console.log(`component (${key}) not registered`);
  return null;
};
