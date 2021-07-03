import React from "react";
import Layout from "../components/layout";
import { Tabs } from "antd";
import AccountSettings from "../components/Settings/AccountSettings";
import RSVPSettings from "../components/Settings/RSVPSettings";
import PayoutSettings from "../components/Settings/PayoutSettings";

const { TabPane } = Tabs;

const Settings = () => {
  return (
    <Layout>
      <Tabs defaultActiveKey="1" centered>
        <TabPane tab="RSVP Settings" key="1">
          <RSVPSettings />
        </TabPane>
        <TabPane tab="Manage Payouts" key="2">
          <PayoutSettings />
        </TabPane>
        <TabPane tab="Account" key="3">
          <AccountSettings />
        </TabPane>
      </Tabs>
    </Layout>
  );
};

export default Settings;
