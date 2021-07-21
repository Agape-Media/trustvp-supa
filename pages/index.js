import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import Auth from "../components/Auth";
import Dashboard from "../components/Dashboard";
import { Skeleton } from "antd";

export default function Home() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    try {
      setLoading(true);
      setSession(supabase.auth.session());

      supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
      });
    } catch (error) {}
    setLoading(false);
  }, []);

  return !loading ? (
    <div>
      {!session ? (
        <Auth />
      ) : (
        <Dashboard key={session.user.id} session={session} />
      )}
    </div>
  ) : (
    <Skeleton />
  );
}
