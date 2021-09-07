import { supabase } from "@/utils/supabaseClient";
export const baseURL =
  process.env.NODE_ENV == "development"
    ? "http://localhost:3000"
    : "http://trustvp.co";

export const fetcher = (...args) => fetch(...args).then((res) => res.json());

export const downloadImage = async (path) => {
  try {
    const { data, error } = await supabase.storage
      .from("avatars")
      .download(path);
    if (error) {
      throw error;
    }
    const url = URL.createObjectURL(data);
    // setAvatarUrl(url);

    return { url: url };
  } catch (error) {
    console.log("Error downloading image: ", error.message);
    return { error: error.message };
  }
};
