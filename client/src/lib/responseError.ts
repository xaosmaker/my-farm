export type ResponseError = {
  message: string;
  meta?: { [key: string]: string };
};

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

  const errormessage: ResponseError = { message: "Unknown Format Error!" };
  if (
    typeof data === "object" &&
    data &&
    "message" in data &&
    typeof data.message === "string"
  ) {
    errormessage.message = data.message;
  }

  if (
    typeof data === "object" &&
    data &&
    "appCode" in data &&
    typeof data.appCode === "string"
  ) {
    errormessage.message = data.appCode;
  }

  if (
    typeof data === "object" &&
    data &&
    "meta" in data &&
    typeof data.meta === "object"
  ) {
    errormessage.meta = data.meta as ResponseError["meta"];
  }

  return errormessage;
}
