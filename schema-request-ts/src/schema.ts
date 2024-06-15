// 翻页类接口返回数据体
export interface CommonListResponse<T = unknown> {
  msg: string;
  trace_id: string;
  code: string;
  data: {
    list: T[];
    page_info: {
      last_page: boolean;
      page_num: number;
      page_size: number;
      total: number;
    };
  };
  success: boolean;
}

export interface CommonResponse<T = unknown> {
  msg: string;
  trace_id: string;
  code: string;
  data: T;
  success: boolean;
}

export interface ApiDocSchema {
  /** 广播 - 获取列表 */
  "POST /admin/api/broadcast/query": {
    params: {
      page: number;
      pageSize: number;
      status?: string;
      keyword?: string;
    };
    response: CommonListResponse<{ key: string; label: string }>;
  };
  /** 广播 - 删除 */
  "DELETE /admin/api/broadcast/{broadcastId}": {
    params: { broadcastId: string };
    response: CommonResponse<boolean>;
  };
}

