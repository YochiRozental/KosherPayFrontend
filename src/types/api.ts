export type ApiSuccess = {
    success: true;
    message?: string;
};

export type ApiError = {
    success: false;
    message: string;
    error?: string;
};

export type ApiResponse<T = unknown> = (ApiSuccess & T) | ApiError;

export type ListResponse<TItem> = ApiResponse<{
    requests: TItem[];
}>;
