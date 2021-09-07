import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import Link from "next/link";
import { supabase } from "@/utils/supabaseClient";
import { notification } from "antd";
import { TrustButton, Spinner, Panel } from "@/components/pageUtils";
import Published from "@/components/RSVP/Published";
import Drafts from "@/components/RSVP/Drafts";
import DeleteEventModal from "@/components/RSVP/DeleteEventModal";
import useSWR from "swr";
import _ from "lodash";
import { useRouter } from "next/router";
import { fetcher } from "@/utils/helper";
import Header from "@/components/Header";
import TableLoadingShell from "@/components/TableLoadingShell";
import { useAppContext } from "@/context/state";

export default function RSVP() {
  const view = useAppContext();
  const router = useRouter();

  const [publishedEvents, setPublishedEvents] = useState(null);
  const [drafts, setDrafts] = useState(null);
  const [loadingStripe, setLoadingStripe] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);

  const user = supabase.auth.user();

  const events = useSWR(
    user ? `/api/getEvents?key=user_id&value=${user?.id}` : null,
    fetcher
  );
  const account = useSWR(
    view?.stripeID ? `/api/getStripeAccount?id=${view.stripeID}` : null,
    fetcher
  );

  useEffect(() => {
    setPublishedEvents(_.filter(events.data, { isDraft: !true }));
    setDrafts(_.filter(events.data, { isDraft: true }));
  }, [events]);

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

  const getLink = async () => {
    setLoadingStripe(true);
    const response = await fetch(
      view?.stripeID
        ? `/api/stripeUpdate?accountID=${view?.stripeID}`
        : `/api/onboard?email=${sessionData?.user?.email}`
    );
    if (!response.ok) {
      const message = `An error has occured ${
        view?.stripeID ? "retrieving your account" : "onboarding your account"
      }. Contact support if error persists`;

      notification["error"]({
        message: "Error",
        description: message,
      });
      throw new Error(message);
    }
    const { url } = await response.json();
    router.push(url);
  };

  const OnboardMessage = () => (
    <p>
      Please onboard with stripe by going to settings then the account tab.{" "}
      <span onClick={() => getLink()}>Or click here</span>
    </p>
  );

  if (loadingStripe) {
    <Spinner />;
  }

  if (!events.data || !account.data) {
    return (
      <Layout>
        <Header title="Manage RSVP's" subtitle="RSVPS" />
        <TableLoadingShell
          labels={["Name", "Location", "Date", "Description"]}
        />
      </Layout>
    );
  }

  if (!account?.data?.charges_enabled) {
    return (
      <Layout>
        <Header title="Manage RSVP's" subtitle="RSVPS" />
        <Panel>
          <p className="text-trustDark text-2xl font-medium">
            Your account cant be charged
          </p>
          <p className="text-trustDark text-base ">charge</p>
          <OnboardMessage />
        </Panel>
      </Layout>
    );
  }

  if (!drafts?.length && !publishedEvents?.length) {
    return (
      <Layout>
        <Header title="Manage RSVP's" subtitle="RSVPS" />
        <Panel>
          <p className="text-trustDark text-2xl font-medium">
            You currently have no events
          </p>
          <p className="text-trustDark text-base ">
            Create an event to get started
          </p>
          <Link href="/newEvent" passHref>
            <TrustButton label="Create Event" buttonClass="bg-trustBlue" />
          </Link>
        </Panel>
      </Layout>
    );
  }

  return (
    <>
      <Layout>
        <>
          <Header title="Manage RSVP's" subtitle="RSVPS" />
          <div className="px-4 pb-4">
            <Link href="/newEvent" passHref>
              <TrustButton label="Create Event" buttonClass="bg-trustBlue" />
            </Link>
          </div>
          <>
            <DeleteEventModal
              visible={isDeleteModalVisible}
              onCancel={handleCancel}
              deleteEvent={deleteEvent}
              data={selectedEvent}
            />

            {drafts.length ? (
              <Drafts
                setSelectedEvent={setSelectedEvent}
                setDeleteModalVisible={setDeleteModalVisible}
                events={drafts}
              />
            ) : null}
            {publishedEvents.length ? (
              <Published
                setSelectedEvent={setSelectedEvent}
                selectedEvent={selectedEvent}
                setDeleteModalVisible={setDeleteModalVisible}
                events={publishedEvents}
              />
            ) : null}
          </>
        </>
      </Layout>
    </>
  );
}
