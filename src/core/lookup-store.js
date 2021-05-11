import Api from "./api";

const lookupsBeingFetched = new Map();

export const GetLookup = async (key, provider) => {
  const lookupBeingFetched = lookupsBeingFetched.get(`${provider}-${key}`);
  if (lookupBeingFetched != null) {
    const request = lookupsBeingFetched.get(`${provider}-${key}`);
    const json = await request;
    return json;
  } else {
    const url = `/lookup/${provider}/${key}`;
    const request = Api.get(url);
    lookupsBeingFetched.set(`${provider}-${key}`, request);
    const json = await request;
    return json;
  }
};
