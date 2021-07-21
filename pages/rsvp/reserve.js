import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../utils/supabaseClient";
import _ from "lodash";
import { Skeleton } from "antd";
import moment from "moment";
import { Divider } from "antd";
import SlotInfoModal from "../../components/Reserve/SlotInfoModal";

export default function Event() {
  const router = useRouter();

  const [event, setEvent] = useState(null);
  const [activeSlot, setActiveSlot] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  useEffect(() => {
    const fetchEvent = async () => {
      try {
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
        console.log(error);
      } finally {
      }
    };

    fetchEvent();
  }, []);

  const Slot = ({ startTime, endTime, occupants, price, id }) => (
    <div
      onClick={() => selectSlot(id)}
      className=" h-10 bg-trustBlue text-white flex flex-col items-center justify-center font-bold px-3.5 cursor-pointer"
    >
      <p className="text-xs">{`${moment(startTime, "HH:mm").format(
        "h:mm a"
      )} - ${moment(endTime, "HH:mm").format("h:mm a")}`}</p>
      {/* <p className="text-xs"># Occupants: {occupants}</p>
      <p className="text-xs">Price: ${price}</p> */}
    </div>
  );

  const SlotContainer = ({ date }) => (
    <>
      {event?.eventSlots[date].length ? (
        <div className="">
          <p className="text-base font-bold">{date}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-2 max-w-lg">
            {event?.eventSlots[date].map((timeSlot, i) => (
              <Slot
                key={i}
                id={timeSlot.id}
                occupants={timeSlot.occupants}
                price={timeSlot.price}
                startTime={timeSlot.startTime}
                endTime={timeSlot.endTime}
              />
            ))}
          </div>
        </div>
      ) : null}
    </>
  );

  const selectSlot = async (slotID) => {
    setIsModalVisible(true);
    try {
      let { data, error, status } = await supabase
        .from("slots")
        .select()
        .eq("id", slotID)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setActiveSlot(data);
        console.log(data);
      }
    } catch (error) {
      alert(error.message);
    } finally {
    }
  };

  const handleCancel = () => {
    setActiveSlot(null);
    setIsModalVisible(false);
  };

  const getSlotInfoFromServer = async () => {};

  return (
    <Layout>
      {event ? (
        <>
          <Card className="space-y-6 mx-auto bg-[#f0f2f8] p-4 rounded-lg">
            <div className="flex-1">
              <p className="text-gray-600 text-base">{event?.locations.name}</p>
              <p className="text-black text-3xl font-bold">{event?.name}</p>
              <EventInfo info={event?.description} />
              <Divider />
              <EventInfo
                info={`Date Start: ${moment(event?.dateRange[0]).format(
                  "MM/DD/YYYY"
                )}`}
              />
              <EventInfo
                info={`Date End: ${moment(event?.dateRange[1]).format(
                  "MM/DD/YYYY"
                )}`}
              />
              <EventInfo info={`Time Zone: ${event?.timeZone}`} />
              <Divider />
            </div>
            {Object.keys(event?.eventSlots).map((date, i) => (
              <SlotContainer date={date} key={i} />
            ))}
          </Card>
          <SlotInfoModal
            event={_.omit(event, "eventSlots")}
            activeSlot={activeSlot}
            title="Basic Modal"
            visible={isModalVisible}
            onCancel={handleCancel}
          />
        </>
      ) : (
        <Skeleton active />
      )}
    </Layout>
  );
}

export async function getServerSideProps(context) {
  return {
    props: {}, // ONLY TO KEEP QUERY ON REFRESH ----- DO NOT DELETE
  };
}

const Layout = ({ children }) => (
  <div className="bg-trustBlue flex flex-col px-4 sm:px-6 lg:px-8 pt-4 md:pt-12 lg:pt-16 pb-32 w-full max-w-9xl">
    {children}
  </div>
);

const Card = ({ children }) => (
  <div className="space-y-6 mx-auto bg-[#f0f2f8] p-4 rounded-lg">
    {children}
  </div>
);

const EventInfo = ({ info }) => <p className="text-gray-600 text-sm">{info}</p>;
