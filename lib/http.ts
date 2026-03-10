import { NextRequest, NextResponse } from "next/server";

export async function getJson<T>(req: NextRequest): Promise<T> {
  return req.json() as Promise<T>;
}

export function ok(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export function fail(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}
