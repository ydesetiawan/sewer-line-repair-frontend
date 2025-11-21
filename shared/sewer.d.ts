declare global {
  interface ISlrApiResponse<T> {
    data: T;
    meta?: {
      query: string;
      count: number;
      limit: number;
      pagination: {
        current_page: number;
        next_page: null | number;
        prev_page: null | number;
        total_pages: number;
      };
    };
  }
}

export {};
