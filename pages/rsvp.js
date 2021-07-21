import Layout from "../components/AuthLayout";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../utils/supabaseClient";
import { Empty, Table, Skeleton } from "antd";
import { TrustButton } from "../components/pageUtils";

import { catchErrors } from "../utils/helper";
import moment from "moment";
import _ from "lodash";
import { useRouter } from "next/router";

export default function RSVP() {
  const router = useRouter();

  const [events, setEvents] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const user = supabase.auth.user();

        let { data, error, status } = await supabase
          .from("events")
          .select(
            `
        *,
        locations:location (name)
       `
          )
          .eq("user_id", user.id);

        if (error && status !== 406) {
          throw error;
        }

        if (data) {
          setEvents(data);
        }
      } catch (error) {
        alert(error.message);
      }
      setLoading(false);
    };

    fetchEvents();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Location",
      dataIndex: "locations",
      key: "location",
      render: (text) => <span>{text.name}</span>,
    },
    {
      title: "Date",
      dataIndex: "dateRange",
      key: "dateRange",
      render: (dateRange) => (
        <div>
          {dateRange.map((date, i) => (
            <span key={i}>
              {i === 1 ? " - " : null}
              {moment(date).format("MM/DD/YYYY")}
            </span>
          ))}
        </div>
      ),
    },

    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text) => <span>{text}</span>,
    },
  ];
  return (
    <Layout>
      <>
        <div>
          <Link href="/newEvent" passHref>
            <TrustButton label="Create Event" buttonClass="bg-trustBlue" />
          </Link>
        </div>
        {!loading ? (
          events?.length ? (
            <Table
              rowKey="id"
              rowClassName="cursor-pointer"
              onRow={(record, rowIndex) => {
                return {
                  onClick: () => router.push(`/eventInfo?id=${record.id}`),
                };
              }}
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
          )
        ) : (
          <Skeleton />
        )}
      </>
    </Layout>
  );
}
