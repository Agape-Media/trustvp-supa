import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../utils/supabaseClient";
import { baseURL } from "../utils/helper";
import Layout from "../components/Layout";
import { TrustButton } from "../components/pageUtils";
import _ from "lodash";
import { Divider, Skeleton, Menu, Dropdown, notification } from "antd";
import moment from "moment";
import copy from "copy-to-clipboard";
import TinyURL from "tinyurl";

const EventInfo = () => {
  const router = useRouter();

  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const user = supabase.auth.user();

        let { data, error, status } = await supabase
          .from("events")
          .select(
            ` 
          *,
        locations:location (name)
        `
          )
          .eq("id", router.query.id)
          .single();

        if (error && status !== 406) {
          throw error;
        }

        if (data) {
          setEvent(data);
          // console.log(data);
        }
      } catch (error) {
        alert(error.message);
      } finally {
      }
    };

    fetchEvent();
  }, []);

  const menu = (
    <Menu>
      <Menu.Item key="0" onClick={() => copyEventURL()}>
        Copy Link
      </Menu.Item>
      <Menu.Item key="1">
        <a
          target="_blank"
          rel="noopener noreferrer"
          // href="https://www.aliyun.com"
        >
          Share on Facebook
        </a>
      </Menu.Item>
      <Menu.Item key="2">
        <a
          target="_blank"
          rel="noopener noreferrer"
          // href="https://www.luohanacademy.com"
        >
          Share on Instagram
        </a>
      </Menu.Item>
    </Menu>
  );

  const copyEventURL = async () => {
    try {
      const url = `${baseURL}/rsvp/reserve?id=${event?.id}`;
      const coolURL = await TinyURL.shorten(url);
      copy(coolURL);
      notification["success"]({
        message: "Event url coppied to clipboard",
      });
    } catch (error) {
      notification["error"]({
        message: "Uh-oh something went wrong",
      });
    }
  };
  return (
    <Layout>
      {!_.isEmpty(event) ? (
        <div className="border border-gray-100 bg-gray-50 p-6 shadow-xl w-full h-96 rounded-lg flex flex-col max-w-lg mx-auto">
          <div className="flex-1">
            <p className="text-gray-600 text-base">{event?.locations.name}</p>
            <p className="text-black text-3xl font-bold">{event?.name}</p>
            <p className="text-gray-600 text-sm">{event?.description}</p>
            <Divider />
            <p className="text-gray-600 text-sm">
              Date Start: {moment(event?.dateRange[0]).format("MM/DD/YYYY")}
            </p>
            <p className="text-gray-600 text-sm">
              Date End: {moment(event?.dateRange[1]).format("MM/DD/YYYY")}
            </p>
            <p className="text-gray-600 text-sm">
              Time Zone: {event?.timeZone}
            </p>
          </div>
          <div className="flex items-center justify-between space-x-4">
            <Dropdown
              overlay={menu}
              placement="bottomCenter"
              trigger={["click"]}
            >
              <a
                className="ant-dropdown-link bg-gray-600 w-full px-4 py-2 rounded-lg shadow-sm focus:outline-none text-white text-sm flex items-center justify-center hover:text-white hover:bg-gray-700 transition duration-300 ease-in-out"
                onClick={(e) => e.preventDefault()}
              >
                Share Event
              </a>
            </Dropdown>
            <TrustButton
              onClick={() => router.push(`/eventDetails?id=${event?.id}`)}
              buttonClass="bg-trustBlue w-full hover:opacity-80 transition duration-300 ease-in-out"
              label="Event Stats"
            />
          </div>
        </div>
      ) : (
        <Skeleton active />
      )}
    </Layout>
  );
};

export default EventInfo;

export async function getServerSideProps(context) {
  return {
    props: {}, // ONLY TO KEEP QUERY ON REFRESH ----- DO NOT DELETE
  };
}
