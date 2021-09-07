import React, { useState, useEffect } from "react";
import { TrustButton } from "../pageUtils";
import _ from "lodash";
import moment from "moment";
import { supabase } from "@/utils/supabaseClient";
import { useRouter } from "next/router";

export default function Review({ newEventForm, locations }) {
  const router = useRouter();

  const [showTimeSlots, setShowTimeSlots] = useState(false);

  useEffect(() => {
    console.log(newEventForm);
  }, []);

  const Slot = ({ startTime, endTime, occupants, price }) => (
    <div className=" h-16 bg-trustBlue text-white flex flex-col items-center justify-center font-bold px-4">
      <p>{`${moment(startTime, "HH:mm").format("H:mm a")} - ${moment(
        endTime,
        "HH:mm"
      ).format("H:mm a")}`}</p>
      <p className="text-xs"># Occupants: {occupants}</p>
      <p className="text-xs">Price: ${price}</p>
    </div>
  );

  const SlotContainer = ({ date }) => (
    <>
      {newEventForm.dateTimeObj[date].length ? (
        <div className="w-full">
          <p className="text-base font-bold">{date}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-2 max-w-lg">
            {newEventForm.dateTimeObj[date].map((timeSlot, i) => (
              <Slot
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

  const formData = [
    { label: "Name", value: newEventForm.name },
    {
      label: "Location",
      value: _.find(locations, { id: newEventForm.location })?.name,
    },
    { label: "Time Zone", value: newEventForm.timeZone },
    { label: "Description", value: newEventForm.description },
    { label: "Event Date Range", value: newEventForm.eventRange },
    { label: "Dates Removed", value: newEventForm.datesRemoved },
    { label: "Event Slots", value: newEventForm.dateTimeObj },
  ];

  async function submitEvent() {
    try {
      const slotsFlat = _.flatMap(newEventForm.dateTimeObj);

      const user = supabase.auth.user();

      let { data, error } = await supabase.from("events").upsert([
        {
          id: newEventForm.id,
          user_id: user.id,
          name: newEventForm.name,
          location: newEventForm.location,
          timeZone: newEventForm.timeZone,
          description: newEventForm.description,
          datesRemoved: newEventForm.datesRemoved.length
            ? newEventForm.datesRemoved
            : null,
          eventSlots: newEventForm.dateTimeObj,
          dateRange: newEventForm.eventRange,
          isDraft: false,
        },
      ]);

      let SlotData = await supabase.from("slots").insert(slotsFlat);

      // TODO -- IF ERROR DETE EVENT FROM DATABASE OR DELETE SLOTS FROM DATABASE
      if ((error || SlotData.error) && status !== 406) {
        throw error || SlotData.error;
      }
      if (data && SlotData.data) {
        // console.log("success");
        router.push("/rsvp");
      }
    } catch (error) {
      alert(error.message);
    } finally {
    }
  }

  return (
    <>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Event Information
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Personal details and application.
          </p>
        </div>
        {/* {JSON.stringify(formData)} */}
        <RowContainer>
          {formData.map((data, i) => (
            <Row
              key={i}
              index={i}
              label={data.label}
              value={
                (i === 4 &&
                  `${moment(data.value[0]).format("MM/DD/YYYY")} - ${moment(
                    data.value[1]
                  ).format("MM/DD/YYYY")}`) ||
                (i === 5 &&
                  !_.isEmpty(data.value) &&
                  data?.value?.map((date, i) => (
                    <p>
                      {date}
                      {i != data.value.length - 1 ? "," : null}
                    </p>
                  ))) ||
                (i === 6 &&
                  (!showTimeSlots ? (
                    <TrustButton
                      label="Show Time Slots"
                      onClick={() => setShowTimeSlots(true)}
                      buttonClass="bg-trustBlue w-60 "
                    />
                  ) : (
                    <div className="space-y-6">
                      <TrustButton
                        label="Hide Time Slots"
                        onClick={() => setShowTimeSlots(false)}
                        buttonClass="bg-trustBlue w-60 "
                      />
                      <div className="space-y-6 ">
                        {Object.keys(data.value).map((date, i) => (
                          <SlotContainer date={date} key={i} />
                        ))}
                      </div>
                    </div>
                  ))) ||
                data.value
              }
            />
          ))}

          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Attachments</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                  <div className="w-0 flex-1 flex items-center">
                    {/* Heroicon name: solid/paper-clip */}
                    <svg
                      className="flex-shrink-0 h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="ml-2 flex-1 w-0 truncate">
                      resume_back_end_developer.pdf
                    </span>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <a
                      href="#"
                      className="font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Download
                    </a>
                  </div>
                </li>
                <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                  <div className="w-0 flex-1 flex items-center">
                    {/* Heroicon name: solid/paper-clip */}
                    <svg
                      className="flex-shrink-0 h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="ml-2 flex-1 w-0 truncate">
                      coverletter_back_end_developer.pdf
                    </span>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <a
                      href="#"
                      className="font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Download
                    </a>
                  </div>
                </li>
              </ul>
            </dd>
          </div>
        </RowContainer>
      </div>

      <TrustButton
        htmlType="button"
        label="Submit Event"
        onClick={submitEvent}
        buttonClass="bg-trustBlue w-60 h-12 mt-12 float-right"
      />
    </>
  );
}

const RowContainer = ({ children }) => (
  <div className="border-t border-gray-200">
    <dl>{children}</dl>
  </div>
);

const Row = ({ label, value, index }) => (
  <div
    className={`${
      index % 2 === 0 ? "bg-gray-50 " : "bg-white"
    } px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6`}
  >
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex space-x-2">
      {value}
    </dd>
  </div>
);
