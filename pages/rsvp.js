import Layout from "../components/Layout";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../utils/supabaseClient";
import {
  Empty,
  Table,
  Skeleton,
  Menu,
  Dropdown,
  notification,
  Tabs,
} from "antd";
import { TrustButton } from "../components/pageUtils";
import Published from "../components/RSVP/Published";
import Drafts from "../components/RSVP/Drafts";
import DeleteEventModal from "../components/RSVP/DeleteEventModal";

import { catchErrors, baseURL } from "../utils/helper";
import moment from "moment";
import _ from "lodash";
import { useRouter } from "next/router";

export default function RSVP() {
  const router = useRouter();

  const [publishedEvents, setPublishedEvents] = useState(null);
  const [drafts, setDrafts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  useEffect(() => {
    const fetchEvents = async () => {
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

      setPublishedEvents(_.filter(data, { isDraft: !true }));
      setDrafts(_.filter(data, { isDraft: true }));

      setLoading(false);
    };

    catchErrors(fetchEvents());
  }, []);

  const handleCancel = () => {
    setDeleteModalVisible(false);
    setSelectedEvent(null);
  };

  const deleteEvent = async (record) => {
    console.log(record);
    setDeleteModalVisible(false);

    try {
      let { error, data } = await supabase.from("events").delete().match({
        id: record,
      });
      if (data) {
        const id = data[0].id;
        const type = _.find(drafts, { id: id }) ? "drafts" : "publishedEvents";
        const dataSpread =
          type == "drafts" ? [...drafts] : [...publishedEvents];
        const removedEventIndex = _.findIndex(dataSpread, {
          id: id,
        });

        dataSpread.splice(removedEventIndex, 1);

        type == "drafts"
          ? setDrafts(dataSpread)
          : setPublishedEvents(dataSpread);
        notification["success"]({
          message: "Location Deleted Successfully",
        });
      }
      if (error) {
        throw error;
      }
    } catch (error) {
      // alert(error.message);
      notification["error"]({
        message: "Location Was Not Deleted",
        description:
          "Make sure location is not associated with an active event",
      });
    } finally {
      setSelectedEvent(null);
    }
  };

  return (
    <Layout>
      <>
        <div>
          <Link href="/newEvent" passHref>
            <TrustButton label="Create Event" buttonClass="bg-trustBlue" />
          </Link>
        </div>
        {drafts?.length || publishedEvents?.length ? (
          <>
            <DeleteEventModal
              visible={isDeleteModalVisible}
              onCancel={handleCancel}
              deleteEvent={deleteEvent}
              data={selectedEvent}
            />
            <Drafts
              setSelectedEvent={setSelectedEvent}
              setDeleteModalVisible={setDeleteModalVisible}
              events={drafts}
            />
            <Published
              setSelectedEvent={setSelectedEvent}
              selectedEvent={selectedEvent}
              setDeleteModalVisible={setDeleteModalVisible}
              events={publishedEvents}
            />{" "}
          </>
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
