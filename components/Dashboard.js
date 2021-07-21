import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import Layout from "./AuthLayout";

export default function Dashboard({ session }) {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [website, setWebsite] = useState(null);
  const [avatar_url, setAvatarUrl] = useState(null);

  useEffect(() => {
    getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      const user = supabase.auth.user();

      let { data, error, status } = await supabase
        .from("profiles")
        .select(`username, website, avatar_url`)
        .eq("id", user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <Card>Active Events</Card>
      <Card>last Payouts</Card>
      <Card>Total Payouts</Card>
      <Card>Total rsvps</Card>
    </Layout>
  );
}

const Card = ({ children }) => (
  <div className="border border-gray-100 bg-gray-50 p-6 shadow-xl w-96 h-36 rounded-lg flex flex-col">
    {children}
  </div>
);
