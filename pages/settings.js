import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { Tabs, Skeleton } from "antd";
import AccountSettings from "../components/Settings/AccountSettings";
import RSVPSettings from "../components/Settings/RSVPSettings";
import _ from "lodash";
import { supabase } from "../utils/supabaseClient";

const { TabPane } = Tabs;

const Settings = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({});
  useEffect(() => {
    const session = supabase.auth.session();
    setSession(session);
    getProfile();
  }, []);

  async function getProfile() {
    try {
      setLoading(true);
      const user = supabase.auth.user();

      let { data, error, status } = await supabase
        .from("profiles")
        .select()
        .eq("id", user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        // console.log(data);
        setUserData(data);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
      {!loading ? (
        <Layout>
          <Tabs defaultActiveKey="1" centered>
            <TabPane tab="RSVP Settings" key="1">
              <RSVPSettings />
            </TabPane>
            <TabPane tab="Account" key="2">
              <AccountSettings
                setLoadingStripe={setLoading}
                session={session}
                userData={userData}
              />
            </TabPane>
          </Tabs>
        </Layout>
      ) : (
        <Skeleton active />
      )}
    </>
  );
};

export default Settings;
