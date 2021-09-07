import { useEffect } from "react";
import NavBar from "./NavBar";
import Footer from "./Footer";
import { useAppUpdateContext } from "@/context/state";
import { supabase } from "@/utils/supabaseClient";
import useSWR from "swr";
import { fetcher, downloadImage } from "@/utils/helper";

export default function Layout({ children }) {
  const update = useAppUpdateContext();

  const user = supabase.auth.user();
  const profile = useSWR(
    user ? `/api/getProfile?id=${user?.id}` : null,
    fetcher
  );

  useEffect(() => {
    const fetchData = async () => {
      const { url } = await downloadImage(profile?.data.avatar_url);
      const viewSpread = { ...profile?.data };
      viewSpread.avatar_url = url;
      update(viewSpread);
    };

    profile?.data?.avatar_url && fetchData();
    !profile?.data?.avatar_url && update(profile?.data);
  }, [profile?.data]);

  return (
    <>
      <NavBar />

      <main className="flex flex-col sm:px-8 lg:px-0 py-8 lg:py-14 w-full max-w-6xl mx-auto ">
        {children}
        <Footer />
      </main>
    </>
  );
}
