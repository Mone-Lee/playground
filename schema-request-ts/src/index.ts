import Client from "./client";
import { SchemaType } from "./schema";

const client = Client<SchemaType>({
  timeout: 1000,
})

client('POST /api/ping')
client('GET /api/ping')
client('GET /api/{id}', {
  id: 1,
  type: '2'
})
client('GET /api/{id}', {
  type: '2'
})

