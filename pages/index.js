import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";

import Link from "next/link";
import useSWR from "swr";
import { Auth, Card, Typography, Space, Button, Icon } from "@supabase/ui";
import Layout from "../components/Layout";

const fetcher = (url, token) =>
  fetch(url, {
    method: "GET",
    headers: new Headers({ "Content-Type": "application/json", token }),
    credentials: "same-origin",
  }).then((res) => res.json());

export default function Home() {
  // const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, session } = Auth.useUser();
  const { data, error } = useSWR(
    session ? ["/api/getUser", session.access_token] : null,
    fetcher
  );

  const [authView, setAuthView] = useState("sign_in");

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "PASSWORD_RECOVERY") setAuthView("forgotten_password");
        if (event === "USER_UPDATED")
          setTimeout(() => setAuthView("sign_in"), 1000);
        // Send session to /api/auth route to set the auth cookie.
        // NOTE: this is only needed if you're doing SSR (getServerSideProps)!
        fetch("/api/auth", {
          method: "POST",
          headers: new Headers({ "Content-Type": "application/json" }),
          credentials: "same-origin",
          body: JSON.stringify({ event, session }),
        }).then((res) => res.json());
      }
    );

    return () => {
      authListener.unsubscribe();
    };
  }, []);

  if (!user)
    return (
      <Card>
        <Space direction="vertical" size={8}>
          <div>
            <img
              src="https://app.supabase.io/img/supabase-dark.svg"
              width="96"
            />
            <Typography.Title level={3}>
              Welcome to Supabase Auth
            </Typography.Title>
          </div>
          <Auth
            supabaseClient={supabase}
            providers={["google", "github"]}
            view={authView}
            socialLayout="horizontal"
            socialButtonSize="xlarge"
          />
        </Space>
      </Card>
    );

  return (
    <Layout>
      <Space direction="vertical" size={6}>
        {authView === "forgotten_password" && (
          <Auth.UpdatePassword supabaseClient={supabase} />
        )}
        {user && (
          <>
            <Typography.Text>You're signed in</Typography.Text>
            <Typography.Text strong>Email: {user.email}</Typography.Text>

            <Button
              icon={<Icon type="LogOut" />}
              type="outline"
              onClick={() => supabase.auth.signOut()}
            >
              Log out
            </Button>
            {error && (
              <Typography.Text type="danger">
                Failed to fetch user!
              </Typography.Text>
            )}
            {data && !error ? (
              <>
                <Typography.Text type="success">
                  User data retrieved server-side (in API route):
                </Typography.Text>

                <Typography.Text>
                  <pre>{JSON.stringify(data, null, 2)}</pre>
                </Typography.Text>
              </>
            ) : (
              <div>Loading...</div>
            )}

            <Typography.Text>
              <Link href="/profile">
                <a>SSR example with getServerSideProps</a>
              </Link>
            </Typography.Text>
          </>
        )}
      </Space>
    </Layout>
  );

  // return (
  //   <div style={{ maxWidth: "420px", margin: "96px auto" }}>
  //     <Card>
  //       <View />
  //     </Card>
  //   </div>
  // );

  // useEffect(() => {
  //   try {
  //     setLoading(true);

  //     const supabaseAuthSession = supabase.auth.session();
  //     setSession(supabaseAuthSession);

  //     supabase.auth.onAuthStateChange((event, supabaseAuthSession) => {
  //       setSession(session);
  //       console.log("here");
  //       fetch("http://localhost:3000/api/auth", {
  //         method: "POST",
  //         headers: new Headers({ "Content-Type": "application/json" }),
  //         credentials: "same-origin",
  //         body: JSON.stringify({ event, session }),
  //       }).then((res) => {
  //         console.log(res);
  //         res.json();
  //       });
  //       setSession(supabaseAuthSession);
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  //   setLoading(false);
  // }, []);

  // return !loading ? (
  //   <div>
  //     {!session ? (
  //       <AuthComp />
  //     ) : (
  //       <Dashboard key={session.user.id} session={session} />
  //     )}
  //   </div>
  // ) : (
  //   <Skeleton />
  // );
}
