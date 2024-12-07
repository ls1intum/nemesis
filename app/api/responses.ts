import { NextResponse } from "next/server";

interface ResponseBody {
  message?: string;
  error?: unknown;
}

export const JSONResponse = (status: number, body: ResponseBody) => {
  return NextResponse.json(
    {
      message: body.message,
      error: body.error?.toString(),
    },
    { status: status },
  );
};
