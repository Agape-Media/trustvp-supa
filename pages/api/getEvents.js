import { supabase } from "@/utils/supabaseClient";

// Example of how to verify and get user data server-side.
const getEvents = async (req, res) => {
  const { key, value } = req.query;

  const { data, error } =
    key == "id"
      ? await supabase
          .from("events")
          .select(
            `
*,
locations:location (name)
`
          )
          .eq(key, value)
          .single()
      : await supabase
          .from("events")
          .select(
            `
*,
locations:location (name)
`
          )
          .eq(key, value);

  console.log(data);
  console.log(error);
  if (error) return res.status(401).json({ error: error.message });
  return res.status(200).json(data);
};

export default getEvents;
