import "antd/dist/antd.css";
import "../styles/globals.css";
import { Auth } from "@supabase/ui";
import { supabase } from "@/utils/supabaseClient";
import { ContextProvider } from "../context/state";

function MyApp({ Component, pageProps }) {
  return (
    // <main className={"dark"}>
    <Auth.UserContextProvider supabaseClient={supabase}>
      <ContextProvider>
        <Component {...pageProps} />
      </ContextProvider>
    </Auth.UserContextProvider>
    // </main>
  );
}

export default MyApp;
