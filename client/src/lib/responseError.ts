type ResponseError = { message: string };
export function toResponseError(data: unknown): ResponseError[] | undefined {
  if (typeof data === "object" && data && "errors" in data) {
    if (Array.isArray(data.errors) && data.errors) {
      const errors: Array<ResponseError> = data.errors.map((item: unknown) =>
        toMessages(item),
      );
      return errors;
    }
    return undefined;
  }
  return undefined;
  // {
  //    status: 400,
  //    errors: [ { name: 'Name should contain only chars spaces and number' } ]
  //  }
}

function toMessages(data: unknown): ResponseError {
  if (typeof data === "string") {
    return { message: data };
  }
  if (
    typeof data === "object" &&
    data &&
    "message" in data &&
    typeof data.message === "string"
  ) {
    return data as ResponseError;
  }
  return { message: "Unknown Format Error!" };
}
