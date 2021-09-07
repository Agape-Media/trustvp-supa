import Layout from "@/components/Layout";
import React, { useState, useEffect } from "react";
import { Steps, Button, message, BackTop, notification } from "antd";
import Information from "@/components/NewEvent/Information";
import AutoNewEvent from "@/components/NewEvent/AutoNewEvent.js";
import Review from "@/components/NewEvent/Review.js";
import ManualNewEvent from "@/components/NewEvent/ManualNewEvent";
import { supabase } from "@/utils/supabaseClient";
import { useRouter } from "next/router";
import Moment from "moment";
import { extendMoment } from "moment-range";

const moment = extendMoment(Moment);
const { Step } = Steps;

export default function NewEvent() {
  const router = useRouter();

  const [current, setCurrent] = React.useState(0);
  const [newEventForm, setNewEventForm] = useState(null);
  const [locations, setLocations] = useState(null);
  const [savingDraft, setSavingDraft] = useState(false);

  useEffect(() => {
    const fetchDraft = async () => {
      //  const { data, error, status } =  await fetch("/api/create-checkout-session")
      let { data, error, status } = await supabase
        .from("events")
        .select()
        .eq("id", router.query.id);

      if (error && status !== 406) {
        throw error;
      }
      // console.log(data);
      if (data) {
        const draftData = data[0].newEventForm;

        if (draftData.eventRange) {
          draftData.eventRange[0] = moment(draftData.eventRange[0]);
          draftData.eventRange[1] = moment(draftData.eventRange[1]);
        }

        if (
          draftData.slotType == "auto" &&
          draftData?.autoInfo?.timeRange?.length
        ) {
          draftData.autoInfo.timeRange[0] = moment(
            draftData.autoInfo.timeRange[0]
          );
          draftData.autoInfo.timeRange[1] = moment(
            draftData?.autoInfo?.timeRange[1]
          );
        }

        setNewEventForm({
          id: data[0].id,
          ...draftData,
        });
        // console.log(data[0]);
      }
    };
    router.query.id
      ? fetchDraft().catch((err) => {
          console.log(err);
        })
      : null;
  }, []);

  useEffect(() => {
    const fetchLocations = async () => {
      const user = supabase.auth.user();

      let { data, error, status } = await supabase
        .from("locations")
        .select()
        .eq("user_id", user.id);
      setLocations(data);
    };
    fetchLocations().catch((err) => {
      console.log(err);
    });
  }, []);

  const goToNext = (data) => {
    setNewEventForm({
      ...newEventForm,
      ...data,
    });
    setCurrent(current + 1);
  };

  const goToPrevious = () => {
    setCurrent(current - 1);
  };

  const onChange = (current) => {
    setCurrent(current);
  };

  const saveAsDraft = async (data) => {
    setSavingDraft(true);
    const payload = {
      ...newEventForm,
      ...data,
    };
    if (payload.name) {
      try {
        const user = supabase.auth.user();

        let { data, error } = await supabase.from("events").upsert({
          id: newEventForm?.id,
          user_id: user.id,
          isDraft: true,
          newEventForm: payload,
        });

        // TODO -- IF ERROR DETE EVENT FROM DATABASE OR DELETE SLOTS FROM DATABASE
        if (error && status !== 406) {
          throw error;
        }
        if (data) {
          notification["success"]({
            message: "Draft saved!",
          });
          router.push("/rsvp");
        }
      } catch (error) {
        console.log(error.message);
        notification["error"]({
          message: "There was an error saving draft.",
        });
      } finally {
      }
    } else {
      notification["warning"]({
        message:
          "Please include the name of your event in order to save draft.",
      });
    }
    setSavingDraft(false);
  };

  const steps = [
    {
      title: "Information",
      content: (
        <Information
          savingDraft={savingDraft}
          saveAsDraft={saveAsDraft}
          newEventForm={newEventForm}
          goToNext={goToNext}
        />
      ),
    },
    {
      title: "Second",
      content:
        newEventForm?.slotType == "auto" ? (
          <AutoNewEvent
            savingDraft={savingDraft}
            saveAsDraft={saveAsDraft}
            newEventForm={newEventForm}
            goToNext={goToNext}
          />
        ) : (
          <ManualNewEvent
            savingDraft={savingDraft}
            saveAsDraft={saveAsDraft}
            newEventForm={newEventForm}
            goToNext={goToNext}
          />
        ),
    },
    {
      title: "Review",
      content: (
        <Review
          savingDraft={savingDraft}
          saveAsDraft={saveAsDraft}
          locations={locations}
          newEventForm={newEventForm}
        />
      ),
    },
  ];

  return (
    <Layout>
      <>
        <Steps current={current} onChange={onChange}>
          {steps.map((item, i) => (
            <Step disabled={current < i} key={item.title} title={item.title} />
          ))}
        </Steps>
        <div className="pt-10">{steps[current].content}</div>
        <BackTop />
      </>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  return {
    props: {}, // ONLY TO KEEP QUERY ON REFRESH ----- DO NOT DELETE
  };
}
