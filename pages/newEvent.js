import Layout from "../components/layout";
import React, { useState, useEffect } from "react";
import { Steps, Button, message, BackTop } from "antd";
import Information from "../components/NewEvent/Information";
import AutoNewEvent from "../components/NewEvent/AutoNewEvent.js";
import Review from "../components/NewEvent/Review.js";
import ManualNewEvent from "../components/NewEvent/ManualNewEvent";
import { supabase } from "../utils/supabaseClient";
import { catchErrors } from "../utils/helper";

const { Step } = Steps;

export default function NewEvent() {
  const [current, setCurrent] = React.useState(0);
  const [newEventForm, setNewEventForm] = useState({});

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

  const goToNext = (data) => {
    setCurrent(current + 1);
    setNewEventForm({
      ...newEventForm,
      ...data,
    });
  };

  const goToPrevious = () => {
    setCurrent(current - 1);
  };

  const onChange = (current) => {
    setCurrent(current);
  };

  const steps = [
    {
      title: "Information",
      content: <Information newEventForm={newEventForm} goToNext={goToNext} />,
    },
    {
      title: "Second",
      content:
        newEventForm.slotType == "auto" ? (
          <AutoNewEvent newEventForm={newEventForm} goToNext={goToNext} />
        ) : (
          <ManualNewEvent newEventForm={newEventForm} goToNext={goToNext} />
        ),
    },
    {
      title: "Review",
      content: <Review locations={locations} newEventForm={newEventForm} />,
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
