import Client from "./client";
import { ApiDocSchema } from "./schema";

const client = Client<ApiDocSchema>({
  timeout: 1000,
})

const res = await client('DELETE /admin/api/broadcast/{broadcastId}', {
  broadcastId: '1234',
})
res.data.data // CommonResponse<boolean>.data: boolean

