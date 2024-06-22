interface ApiDocSchema {
  "GET /api/ping": {
    response: {
      name: string;
    };
  };
  "GET /api/{id}": {
    params: {
      type: string;
    };
    response: {
      name: string;
    };
  };
}

type ExtractStringTempParameters<S extends string> =
  S extends `${string}/{${infer Param}}${infer Suffix}`
    ? {
        [Key in Param]: string | number;
      } & ExtractStringTempParameters<`/${Suffix}`>
    : unknown;

// type Params =
//   ExtractStringTempParameters<"GET /api/{id}">;

type RequestSchema = {
  [ApiRequestKey in keyof ApiDocSchema]: ApiDocSchema[ApiRequestKey] extends {
    params: infer P;
  }
    ? Omit<ApiDocSchema[ApiRequestKey], 'params'> & {
          params: P & ExtractStringTempParameters<ApiRequestKey>;
        }
      : ExtractStringTempParameters<ApiRequestKey> extends { [key: string]: string | number } // 如果请求方法没有定义 params, 则看看请求路径上是否有参数，有则提出添加到 params
      ? ApiDocSchema[ApiRequestKey] & {
          params: ExtractStringTempParameters<ApiRequestKey>;
        }
    : ApiDocSchema[ApiRequestKey];
};

export type SchemaType = RequestSchema;
