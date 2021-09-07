import React, { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/utils/supabaseClient";
import _ from "lodash";
import { Skeleton } from "antd";
import moment from "moment";
import { Divider } from "antd";
import SlotInfoModal from "@/components/Reserve/SlotInfoModal";
import useSWR from "swr";
import { fetcher } from "@/utils/helper";

export default function Event() {
  const router = useRouter();
  const queryKey = "id";
  const paramToken =
    router.query[queryKey] ||
    (router.asPath.match(new RegExp(`[&?]${queryKey}=(.*)(&|$)`))
      ? router.asPath.match(new RegExp(`[&?]${queryKey}=(.*)(&|$)`))[1]
      : null);

  const { data } = useSWR(`/api/getEvents?key=id&value=${paramToken}`, fetcher);

  const [activeSlot, setActiveSlot] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const Slot = ({ startTime, endTime, available, id }) => (
    <div
      onClick={() => selectSlot(id)}
      className={`${
        available < 1 ? "opacity-50" : null
      } h-10 bg-trustBlue text-white flex flex-col items-center justify-center font-bold px-3.5 cursor-pointer`}
    >
      <p className="text-xs">{`${moment(startTime, "HH:mm").format(
        "h:mm a"
      )} - ${moment(endTime, "HH:mm").format("h:mm a")}`}</p>
    </div>
  );

  const SlotContainer = ({ date }) => (
    <>
      {data?.eventSlots[date].length ? (
        <div className="">
          <p className="text-base font-bold">
            {moment(date).format("D MMM, YYYY")}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-2 max-w-lg">
            {data?.eventSlots[date].map((timeSlot, i) => (
              <Slot
                key={i}
                id={timeSlot.id}
                available={timeSlot.available}
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

  return (
    <Layout>
      {data ? (
        <>
          <Card className="space-y-6 mx-auto bg-[#EDF2F7] p-4 rounded-lg">
            <div className="flex-1">
              <p className="text-gray-600 text-base">{data?.locations.name}</p>
              <p className="text-black text-3xl font-bold">{data?.name}</p>
              <EventInfo info={data?.description} />
              <Divider />
              <EventInfo
                info={`Date Start: ${moment(data?.dateRange[0]).format(
                  "D MMM, YYYY"
                )}`}
              />
              <EventInfo
                info={`Date End: ${moment(data?.dateRange[1]).format(
                  "D MMM, YYYY"
                )}`}
              />
              <EventInfo info={`Time Zone: ${data?.timeZone}`} />
              <Divider />
            </div>
            {Object.keys(data?.eventSlots).map((date, i) => (
              <SlotContainer date={date} key={i} />
            ))}
          </Card>
          <SlotInfoModal
            event={_.omit(data, "eventSlots")}
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

// export async function getServerSideProps(context) {
//   return {
//     props: {}, // ONLY TO KEEP QUERY ON REFRESH ----- DO NOT DELETE
//   };
// }

const Layout = ({ children }) => (
  <div className="bg-trustBlue flex flex-col px-4 sm:px-6 lg:px-8 pt-4 md:pt-12 lg:pt-16 pb-32 w-full max-w-9xl">
    {children}
  </div>
);

const Card = ({ children }) => (
  <div className="space-y-6 mx-auto bg-[#EDF2F7] p-4 rounded-lg">
    {children}
  </div>
);

const EventInfo = ({ info }) => <p className="text-gray-600 text-sm">{info}</p>;
