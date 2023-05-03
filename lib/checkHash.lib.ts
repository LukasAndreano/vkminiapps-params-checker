import * as crypto from "crypto";

interface QueryParamsInterface {
  key: string;
  value: string;
}

const checkHash = (
  params: string,
  key: string,
  lifetime: number = 86400
): boolean => {
  // init sign variable
  let sign;

  // array for storing vk_ params
  const queryParams: QueryParamsInterface[] = [];

  // func for processing query params, filtering with vk_ prefix and sign
  const processQueryParam = ({ key, value }: QueryParamsInterface) => {
    if (typeof value === "string") {
      if (key === "sign") {
        sign = value;
      } else if (key.startsWith("vk_")) {
        queryParams.push({ key, value });
      }
    }
  };

  // check if params starts with "?"
  const formattedSearch = params.startsWith("?") ? params.slice(1) : params;

  // split params by "&" and process each param
  for (const param of formattedSearch.split("&")) {
    const [key, value] = param.split("=");
    processQueryParam({ key, value });
  }

  // check if sign exists and if there are any vk_ params
  if (!sign || queryParams.length === 0) return false;

  // check if lifetime is not expired
  if (
    lifetime !== 0 &&
    Math.floor(Date.now() / 1000) - lifetime >
      +params.split("vk_ts=")[1].split("&")[0]
  )
    return false;

  // sort params by key and create query string
  const queryString = queryParams
    .sort((a, b) => a.key.localeCompare(b.key))
    .reduce((acc, { key, value }, idx) => {
      return (
        acc + (idx === 0 ? "" : "&") + `${key}=${encodeURIComponent(value)}`
      );
    }, "");

  // create hash from query string and compare it with sign
  const paramsHash = crypto
    .createHmac("sha256", key)
    .update(queryString)
    .digest()
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=$/, "");

  return paramsHash === sign;
};

export default checkHash;
