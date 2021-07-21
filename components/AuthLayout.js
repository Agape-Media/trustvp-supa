import { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import { supabase } from "../utils/supabaseClient";
import Auth from "./Auth";

export default function Layout({ children }) {
  const [session, setSession] = useState(null);

  useEffect(() => {
    setSession(supabase.auth.session());
  }, []);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <>
      {!session ? (
        <Auth />
      ) : (
        <div className="lg:flex">
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

          <main className="flex flex-col px-4 sm:px-6 lg:px-8 py-4 lg:py-16 w-full max-w-9xl mx-auto">
            {children}
            <Footer />
          </main>
        </div>
      )}
    </>
  );
}
