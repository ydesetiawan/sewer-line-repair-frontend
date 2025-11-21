declare global {
  interface ISlrApiResponse<T> {
    data: T;
    meta?: {
      query: string;
      count: number;
      limit: number;
      pagination: IMetaPagination;
    };
  }

  interface IMetaPagination {
    current_page: number
    prev_page: number | null
    next_page: number | null
    total_items: number
    total_pages: number
  }
}
export {};
