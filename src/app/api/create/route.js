import { insertEntry } from "../../../lib/MongoDB/queries";
import { CloudImage } from "../../../../cloudinary/CloudImage";
import { NextResponse } from "next/server";

export async function POST(request) {
  const body = await request.formData()
  const text = body.get('msg');
  const file = body.get('img')
  const date = body.get('date');

  const data = {
    "image": null,
    "message": text,
    "date": (!date || typeof date === "undefined") ? new Date() : date,
  }

  if (!file) {
    return NextResponse.json({ status: 400, msg: "No image uploaded" });
  }

  try {
    const form_data = new FormData();
    form_data.append("upload_preset", "nextbit");
    form_data.append(
      "cloud_name",
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUDNAME
    );
    form_data.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY);
    form_data.append(
      "api_secret",
      process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET
    );
    form_data.append("file", file);

    const imageUrl = await CloudImage(form_data);
    data.image = imageUrl;
  } catch (err) {
    return NextResponse.json({ status: 400, msg: `Cloudinary: ${err.message}` });
  }

  try {
    const document = await insertEntry("logs", data);
    return NextResponse.json({ status: 201, data: document });
  } catch (err) {
    return NextResponse.json({ status: 400, msg: err.message });
  }
}