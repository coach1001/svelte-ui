const ClientTaskRegistry = new Map();

export const AddTask = (key, value) => {
    ClientTaskRegistry.set(key, value);
};

export const GetTask = (key) => {
  const task = ClientTaskRegistry.get(key);
  if (!!task) return task;
  console.log(`client task (${key}) not registered`);
  return null;
};
