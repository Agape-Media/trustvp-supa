import Layout from "../components/layout";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../utils/supabaseClient";
import { Empty, Table } from "antd";
import { TrustButton } from "../components/pageUtils";
import Auth from "../components/Auth";
import { catchErrors } from "../utils/helper";
import moment from "moment";
import _ from "lodash";

export default function RSVP() {
  const [events, setEvents] = useState(null);
  const [locations, setLocations] = useState(null);

  useEffect(() => {
    const fetchLocations = async () => {
      const user = supabase.auth.user();

      let { data, error, status } = await supabase
        .from("locations")
        .select()
        .eq("user_id", user.id);
      setLocations(data);
    };

    catchErrors(fetchLocations());
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "name",
      render: (text) => <a>{_.find(locations, { id: text })?.name}</a>,
    },
    {
      title: "Date",
      dataIndex: "dateRange",
      key: "dateRange",
      render: (dateRange) => (
        <div>
          {JSON.parse(dateRange).map((date, i) => (
            <a>
              {i === 1 ? " - " : null}
              {moment(date).format("MM/DD/YYYY")}
            </a>
          ))}
        </div>
      ),
    },

    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text) => <a>{text}</a>,
    },
  ];

  useEffect(() => {
    const fetchEvents = async () => {
      const user = supabase.auth.user();

      let { data, error, status } = await supabase
        .from("events")
        .select()
        .eq("user_id", user.id);
      setEvents(data);
      console.log(data);
    };

    catchErrors(fetchEvents());
  }, []);

  return (
    <Layout>
      <>
        <Link href="/newEvent" passHref>
          <TrustButton label="Create Event" buttonClass="bg-trustBlue" />
        </Link>
        {events?.length ? (
          <Table
            className="mt-12"
            bordered
            columns={columns}
            dataSource={events}
          />
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            imageStyle={{
              height: 60,
            }}
            description={
              <span>
                You currently have no events.{" "}
                <Link href="/newEvent">
                  <button>Create an event.</button>
                </Link>
              </span>
            }
          />
        )}
      </>
    </Layout>
  );
}
