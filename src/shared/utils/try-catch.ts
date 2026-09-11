type Result<TData, TError> = { data: TData; error: null } | { data: null; error: TError };

// Turns a promise that may reject into a result to branch on, so a failure is handled where it
// happens instead of escaping to the nearest error boundary
export const tryCatch = async <TData, TError = Error>(
  promise: Promise<TData>,
): Promise<Result<TData, TError>> => {
  try {
    return { data: await promise, error: null };
  } catch (error) {
    return { data: null, error: error as TError };
  }
};
