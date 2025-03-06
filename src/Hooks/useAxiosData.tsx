import axios from "axios";
import { cookies } from "next/headers";

interface FetchOptions {
  endpoint: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  data?: any;
  sendFile?: boolean;
  setProgress?: (progress: number) => void;
}

const useAxiosData = async <T = unknown,>({
  endpoint,
  method = "GET",
  data,
  sendFile = false,
  setProgress,
}: FetchOptions): Promise<T> => {
  const token = cookies().get("Template_Token")?.value;
  const language = cookies().get("NEXT_LOCALE")?.value || "en";
  const url = `${process.env.NEXT_PUBLIC_API}${endpoint}`;

  try {
    const headers: Record<string, string> = {
      Accept: "application/json",
      "Content-Type": sendFile ? "multipart/form-data" : "application/json",
      "Accept-Language": language,
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    const response = await axios({
      url,
      method,
      headers,
      data,
      onUploadProgress: sendFile
        ? (progressEvent) => {
            if (setProgress && progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded / progressEvent.total) * 100
              );
              setProgress(percentCompleted);
            }
          }
        : undefined,
    });

    return response.data as T;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Something went wrong");
  }
};

export default useAxiosData;
