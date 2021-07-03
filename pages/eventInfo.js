import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../utils/supabaseClient";
import { catchErrors } from "../utils/helper";
import Layout from "../components/layout";
import { TrustButton } from "../components/pageUtils";
import _ from "lodash";
import { Divider, Skeleton } from "antd";
import moment from "moment";

const EventInfo = () => {
  const router = useRouter();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

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
          console.log(data);
        }
      } catch (error) {
        alert(error.message);
      } finally {
      }
    };

    fetchEvent();
  }, []);

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
          <TrustButton buttonClass="bg-trustBlue" label="Edit Event" />
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
