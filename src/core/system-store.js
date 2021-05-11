import { writable, get } from "svelte/store";
import Api from "./api";
import { GetTask } from "./client-task-store";

export const currentSystemName = writable("");
export const currentModule = writable({});
export const currentFlow = writable({});
export const currentStepElement = writable([]);
export const currentState = writable({
  data: {},
  context: {},
});
export const modules = writable([]);

export const SetContextKey = (key, value) => {
  let cState = get(currentState);
  cState.context[key] = value;
  currentState.set(cState);
};

export const GetModule = async (route) => {
  const moduleName = route.userData.moduleName;
  let modulesVal = get(modules);
  if (modulesVal.length > 0) {
    const routeModule = modulesVal.find((m) => m.name === moduleName);
    if (!!routeModule) {
      currentModule.set(routeModule);
      return;
    }
  }
  const systemName = get(currentSystemName);
  const url = `/module-definition/${systemName}/${moduleName}`;
  const json = await Api.get(url);
  modulesVal.push(json);
  modules.set(modulesVal);
  currentModule.set(json);
};

export const RunTasks = async (domain, taskTrigger, tasks, data, context) => {
  const tasksToRun = tasks
    .filter(
      (t) =>
        t.taskExecutionDomain === domain &&
        t.taskExecutionTrigger === taskTrigger
    )
    .map((t) => t.taskDomainId);

  if (tasksToRun.length === 0) {
    return {
      data,
      context,
    };
  }
  if (domain === "server") {
    const request = ConvertJsonToMultipart(
      {
        elementData: data,
        contextData: context,
      },
      tasksToRun
    );
    const url = `/execute-task`;
    const json = await Api.post(url, request);
    return {
      data: json.elementData,
      context: json.contextData,
    };
  } else if (domain === "client") {
    for (const task of tasksToRun) {
      const runTask = GetTask(task);
      if (runTask != null) {
        const result = await runTask(data, context);
        data = result.data;
        context = result.context;
      }
    }
    return {
      data,
      context,
    };
  } else {
    return {
      data,
      context,
    };
  }

};

export const ConvertJsonToMultipart = (taskData, taskDomainIds) => {
  let formData = new FormData();
  formData.set(
    "json",
    JSON.stringify({
      taskData,
      taskDomainIds,
      fileIds: [],
    })
  );
  return formData;
};
