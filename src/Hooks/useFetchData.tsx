import { cookies } from "next/headers";

interface FetchOptions {
  endpoint: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  data?: any;
}

const useFetchData = async <T = unknown,>({
  endpoint,
  method = "GET",
  data,
}: FetchOptions): Promise<T> => {
  const token = cookies().get("Template_Token")?.value;
  const language = cookies().get("NEXT_LOCALE")?.value || "en";
  const url = `${process.env.NEXT_PUBLIC_API}${endpoint}`;

  try {
    const headers: HeadersInit = {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Accept-Language": language,
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    const response = await fetch(url, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || "Something went wrong");
    }

    return (await response.json()) as T;
  } catch (error: any) {
    throw new Error(error.message || "Something went wrong");
  }
};

export default useFetchData;
