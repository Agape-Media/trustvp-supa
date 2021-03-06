import React, { useState, useEffect } from "react";
import { Form, InputNumber, TimePicker, BackTop } from "antd";
import _ from "lodash";

import { TrustButton } from "../pageUtils";
import datesBetween from "dates-between";
import Moment from "moment";
import { extendMoment } from "moment-range";
import { v4 as uuidv4 } from "uuid";

const moment = extendMoment(Moment);

const AutoNewEvent = ({ newEventForm, goToNext, saveAsDraft, savingDraft }) => {
  const [dateTimeObj, setDateTimeObj] = useState({});
  const [autoInfo, setAutoInfo] = useState({
    increment: null,
    timeBetweenSlots: null,
    startTime: null,
    endTime: null,
  });

  const [optionInfoForm] = Form.useForm();

  const Slot = ({ startTime, endTime }) => (
    <div className="col-span-1 h-12 bg-trustBlue text-white flex items-center justify-center font-bold">
      <p>{`${moment(startTime, "HH:mm").format("h:mm a")} - ${moment(
        endTime,
        "HH:mm"
      ).format("h:mm a")}`}</p>
    </div>
  );

  const SlotContainer = ({ children, date }) => (
    <>
      <div className="w-full">
        <p className="text-base font-bold">{date}</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 ">
          {dateTimeObj[date].map((timeSlot, i) => (
            <Slot
              key={i}
              startTime={timeSlot.startTime}
              endTime={timeSlot.endTime}
            />
          ))}
        </div>
      </div>
    </>
  );

  const onFinish = (values) => {
    const increment = values.increment;
    const timeBetweenSlots = values.timeBetweenSlots;
    const startTime = values.timeRange[0]._d;
    const endTime = values.timeRange[1]._d;
    const datesRemoved = newEventForm.datesRemoved;

    setAutoInfo({
      increment: increment,
      price: values.price,
      occupants: values.occupants,
      timeBetweenSlots: timeBetweenSlots,
      timeRange: values.timeRange,
    });
    // ----------------------------------------------------------------

    const newStartTime = moment(startTime, "HH:mm");

    const times = [];
    while (newStartTime < moment(endTime, "HH:mm")) {
      times.push({
        startTime: newStartTime.format("HH:mm"),
        endTime: moment(newStartTime).add(increment, "m").format("HH:mm"),
        occupants: values.occupants,
        price: values.price,
        available: values.occupants,
      });
      newStartTime.add(increment + timeBetweenSlots, "m").format("HH:mm");
    }
    // Remove last slot if outside range
    if (times[times.length - 1].endTime > moment(endTime).format("HH:mm")) {
      times.splice(-1, 1);
    }

    // ----------------------------------------------------------------

    const dateRanges = [];
    for (const date of datesBetween(
      newEventForm.eventRange[0],
      newEventForm.eventRange[1]
    )) {
      dateRanges.push(moment(date).format("MM/DD/YYYY"));
    }

    const filteredDates = _.filter(
      dateRanges.map((date, i) => {
        if (!_.includes(datesRemoved, date)) {
          return date;
        }
        return null;
      }),
      (someDate) => {
        return someDate != null;
      }
    );

    // ----------------------------------------------------------------

    const dateTime = {};

    filteredDates.map((date, i) => {
      const timesWithDate = times.map((time, i) => {
        return {
          ...time,
          date: date,
          id: uuidv4(),
        };
      });
      dateTime[date] = timesWithDate;
    });

    setDateTimeObj(dateTime);
  };

  const next = () => {
    goToNext({
      dateTimeObj: dateTimeObj,
      autoInfo: autoInfo,
    });
  };

  const draft = (data) => {
    saveAsDraft({
      autoInfo: data,
    });
  };

  return (
    <>
      <div>
        <p className="text-base font-bold">Auto Time Entry</p>
      </div>
      <Form
        requiredMark={false}
        layout="vertical"
        name="AutoNewEvent"
        initialValues={{
          timeRange: newEventForm?.autoInfo?.timeRange,
          occupants: newEventForm?.autoInfo?.occupants,
          increment: newEventForm?.autoInfo?.increment,
          timeBetweenSlots: newEventForm?.autoInfo?.timeBetweenSlots,
          price: newEventForm?.autoInfo?.price,
        }}
        onFinish={onFinish}
        form={optionInfoForm}
        // onFinishFailed={onFinishFailed}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div className="col-span-1">
            <Form.Item
              label="Event Time Range"
              name="timeRange"
              rules={[
                { required: true, message: "Please enter an event name." },
              ]}
            >
              <TimePicker.RangePicker
                disabled={!_.isEmpty(dateTimeObj)}
                use12Hours
                format="h:mm a"
              />
            </Form.Item>
          </div>

          <div className="col-span-1">
            <Form.Item
              label="Max number of Occupants"
              name="occupants"
              rules={[
                { required: true, message: "Please enter an event name." },
              ]}
            >
              <InputNumber disabled={!_.isEmpty(dateTimeObj)} min={1} />
            </Form.Item>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div className="col-span-1">
            <Form.Item
              label="Length of Slot(Increment):"
              name="increment"
              rules={[
                { required: true, message: "Please enter an event name." },
              ]}
            >
              <InputNumber disabled={!_.isEmpty(dateTimeObj)} min={1} />
            </Form.Item>
          </div>

          <div className="col-span-1">
            <Form.Item
              label="Time between slots"
              name="timeBetweenSlots"
              rules={[
                { required: true, message: "Please enter an event name." },
              ]}
            >
              <InputNumber disabled={!_.isEmpty(dateTimeObj)} min={0} />
            </Form.Item>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div className="col-span-1">
            <Form.Item
              label="Ticket Price"
              name="price"
              rules={[{ required: true, message: "Please enter a price." }]}
            >
              <InputNumber
                disabled={!_.isEmpty(dateTimeObj)}
                min={0}
                // formatter={(value) =>
                //   `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                // }
                // parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              />
            </Form.Item>
          </div>
        </div>

        {_.isEmpty(dateTimeObj) ? (
          <div className="space-y-2">
            <TrustButton
              htmlType="submit"
              label="Create Time Slots"
              buttonClass="bg-trustBlue mx-auto w-80 h-12 mt-12"
            />
            <TrustButton
              disabled={savingDraft}
              onClick={(e) => {
                e.preventDefault();
                draft(optionInfoForm.getFieldsValue());
              }}
              label="Save as Draft"
              buttonClass="bg-gray-400 hover:bg-gray-500 mx-auto transition duration-300 ease-in-out border w-80 h-12"
            />
          </div>
        ) : (
          <div className="flex justify-center items-center space-x-4 mt-12">
            <TrustButton
              htmlType="button"
              label="Review Event"
              onClick={(e) => {
                e.preventDefault();
                next();
              }}
              buttonClass="bg-trustBlue w-60 h-12"
            />
            <TrustButton
              htmlType="button"
              label="Delete Time Slots"
              onClick={(e) => {
                e.preventDefault();
                setDateTimeObj({});
              }}
              buttonClass="bg-red-600 w-60 h-12"
            />
            <TrustButton
              disabled={savingDraft}
              onClick={(e) => {
                e.preventDefault();
                draft(optionInfoForm.getFieldsValue());
              }}
              label="Save as Draft"
              buttonClass="bg-gray-400 hover:bg-gray-500 transition duration-300 ease-in-out border w-60 h-12"
            />
          </div>
        )}
      </Form>

      <div className="space-y-6 max-w-xl mx-auto mt-12">
        {!_.isEmpty(dateTimeObj) &&
          Object.keys(dateTimeObj).map((date, i) => (
            <SlotContainer date={date} key={i} />
          ))}
      </div>
      <BackTop>
        <div className="bg-red-600">UP</div>
      </BackTop>
    </>
  );
};

export default AutoNewEvent;
