import { baseRequest } from "@/lib/baseRequest";
import { SERVER_URL } from "@/lib/serverUrl";
import { Field } from "@/features/fields/types";

export async function getAllFields() {
  const res = await baseRequest({
    url: `${SERVER_URL}/api/fields`,
    method: "GET",
    body: undefined,
  });

  if (res.ok) {
    return res.json();
  }
  return [];
}

export async function getFieldById(id: string): Promise<Field[]> {
  const res = await baseRequest({
    url: `${SERVER_URL}/api/fields/${id}`,
    method: "GET",
    body: undefined,
  });
  if (res.ok) {
    return res.json();
  }
  return [];
}
