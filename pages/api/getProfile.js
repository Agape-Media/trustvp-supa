import { supabase } from "@/utils/supabaseClient";

// Example of how to verify and get user data server-side.
const getProfile = async (req, res) => {
  const id = req.query.id;

  const { data, error } = await supabase
    .from("profiles")
    .select()
    .eq("id", id)
    .single();
  console.log(data);
  if (error) return res.status(401).json({ error: error.message });
  return res.status(200).json(data);
};

export default getProfile;
