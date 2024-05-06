import { getAllEntries } from "../../../lib/MongoDB/queries";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const documents = await getAllEntries("logs");
    return NextResponse.json({ data: documents });
  } catch (err) {
    return NextResponse.json({ msg: err.message });
  }
}
