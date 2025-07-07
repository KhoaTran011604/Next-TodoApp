// Định nghĩa kiểu cho từng task (bạn có thể sửa theo cấu trúc thật)
export type Task = {
  _id: string;
  title: string;
  completed: boolean;
};

export type SortOrder = 1 | -1;

export type Filter = {
  keySearch: string;
  sort: Record<string, SortOrder>;
  page: number;
  pageSize: number;
};