const RuleRegistry = new Map();

export const AddRule = (key, value) => {
  RuleRegistry.set(key, value);
};

export const GetRule = (key) => {
  const rule = RuleRegistry.get(key);
  if (!!rule) return rule;
  console.log(`rule (${key}) not registered`);
  return null;
};
