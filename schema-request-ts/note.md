### 思路

1. Schema 是一个对象结构的类型： 不同的 key，对应的 value 类型不同
2. 创建 axios 实例， 透出的 fetch 方法统一处理 get、post 等请求
3. fetch 方法内接受 Schema 类型为泛型， 根据 Schema 声明参数和返回值类型

---

### 疑问

1. `fetch<U extends keyof S, P = S[U]>`, 为什么 U 如果写成 `U = keyof S`时，`P = S[U]`报错无法推导

在 TypeScript 中，keyof S 表示一个类型，它包含 S 对象中所有键的类型。这意味着，U 的类型应该是 S 对象的键的类型。然而，这段代码中，U 被用作索引类型，这意味着它应该是一个 string 类型。因此，这段代码中出现了类型错误。  
要修复这个错误，我们需要确保 U 的类型是 S 对象的键的类型，而不是 string 类型。我们可以通过将 U 的类型约束为 keyof S 来做到这一点。这样，U 的类型将被推断为 S 对象的键的类型，而不是 string 类型。

2. Type 'ApiDocSchema' does not satisfy the constraint 'Record<string, unknown>'.
   Index signature for type 'string' is missing in type 'ApiDocSchema'.

```
const client = Client<ApiDocSchema>({
  timeout: 1000,
})
```

3. 想要针对不同 key，控制 params 是否可选，一般写法：

```
type FetchParams<T extends keyof ApiDocSchema> = T extends 'GET /api/ping'
  ? {
      url: T;
      params?: never;
    }
  : T extends 'GET /api/{id}'
  ? {
      url: T;
      params: {
        type: string;
      };
    }
  : never;
```

如果 ApiDocSchema 的 key 很多时，如何抽象简化？

4. `ExtractStringTempParameters`的错误，`${infer Suffix}`前不应该有`/`，否则`{xxx}`在最末尾时无法解析。
