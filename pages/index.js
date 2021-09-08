import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabaseClient";
import Header from "@/components/Header";
import Link from "next/link";
import { Auth, Card, Typography, Space, Button, Icon } from "@supabase/ui";
import Layout from "@/components/Layout";

export default function Home() {
  const { user, session } = Auth.useUser();

  const [authView, setAuthView] = useState("sign_in");

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "PASSWORD_RECOVERY") setAuthView("forgotten_password");
        if (event === "USER_UPDATED")
          setTimeout(() => setAuthView("sign_in"), 1000);
      }
    );

    return () => {
      authListener.unsubscribe();
    };
  }, []);

  if (!user)
    return (
      <div className="mx-auto my-auto px-2">
        <Card className="w-[500px]">
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
      </div>
    );

  return (
    <Layout>
      <Header title="My Dashboard" subtitle="Dashboard" />
      <Space direction="vertical" size={6}>
        {authView === "forgotten_password" && (
          <Auth.UpdatePassword supabaseClient={supabase} />
        )}
        {user && (
          <>
            <Typography.Text>You're signed in</Typography.Text>
            <Typography.Text strong>Email: {user.email}</Typography.Text>
            {/* <Button
              icon={<Icon type="LogOut" />}
              type="outline"
              onClick={() => supabase.auth.signOut()}
            >
              Log out
            </Button>
            <>
              <Typography.Text type="success">
                User data retrieved server-side (in API route):
              </Typography.Text>

              <Typography.Text>
                <pre>{JSON.stringify(user, null, 2)}</pre>
              </Typography.Text>
            </>
            )
            <Typography.Text>
              <Link href="/profile">
                <a>SSR example with getServerSideProps</a>
              </Link>
            </Typography.Text> */}
          </>
        )}
      </Space>
    </Layout>
  );
}
