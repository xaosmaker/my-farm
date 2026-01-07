import { baseRequest } from "@/lib/baseRequest";
import { SERVER_URL } from "@/lib/serverUrl";
import { Supply } from "@/types/sharedTypes";

export async function getAllSupplies() {
  const res = await baseRequest({
    url: `${SERVER_URL}/api/supplies`,
    method: "GET",
    body: undefined,
  });
  if (res.ok) {
    const data: Supply[] = await res.json();
    return data;
  }
  return [];
}

export async function getSupplyById(id: string) {
  const res = await baseRequest({
    url: `${SERVER_URL}/api/supplies/${id}`,
    method: "GET",
    body: undefined,
  });
  if (res.ok) {
    const data: Supply[] = await res.json();
    return data;
  }
  return [];
}
