import axios, { AxiosRequestConfig } from "axios";

// 替换url上的变量 并把 params 对应的属性移除
function replaceUrlVariables(url: string, params: Record<string, unknown>) {
  const result = { url, params: { ...params } };

  if (result.params) {
    Object.entries(result.params).forEach(([key, value]) => {
      const replaceKey = `{${key}}`;

      if (
        url.includes(replaceKey) &&
        (typeof value === "string" || typeof value === "number")
      ) {
        result.url = result.url.replace(`{${key}}`, encodeURIComponent(value));
        delete result.params?.[key];
      }
    });
  }

  return result;
}

const Client = <S extends {}>(
  config: AxiosRequestConfig,
  customConfig?: AxiosRequestConfig
) => {
  const instance = axios.create(config);

  return async function fetch<U extends keyof S, P = S[U]>(
    url: Exclude<U, number | symbol>,
    params: P extends Record<"params", unknown> ? P["params"] : undefined
  ) {
    let [requestMethod, requestUrl] = url.split(" ");
    let requestParams = {};

    // 替换url上的变量
    if (params) {
      const { url: newUrl, params: newParams } = replaceUrlVariables(
        requestUrl,
        params
      );
      requestUrl = newUrl;
      requestParams =
        requestMethod === "GET" ? { params: newParams } : { data: newParams };
    }

    return await instance<P extends Record<"response", unknown> ? P["response"] : undefined>({
      method: requestMethod,
      url: requestUrl,
      ...(requestParams ?? {}),
      ...customConfig,
    });
  };
};

export default Client;
