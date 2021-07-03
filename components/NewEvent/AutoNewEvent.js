import React, { useState, useEffect } from "react";
import { Form, InputNumber, TimePicker, BackTop } from "antd";
import _ from "lodash";

import { TrustButton } from "../pageUtils";
import datesBetween from "dates-between";
import Moment from "moment";
import { extendMoment } from "moment-range";

const moment = extendMoment(Moment);

const AutoNewEvent = ({ newEventForm, goToNext }) => {
  const [dateTimeObj, setDateTimeObj] = useState({});

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
            <Slot startTime={timeSlot.startTime} endTime={timeSlot.endTime} />
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

    // ----------------------------------------------------------------

    const newStartTime = moment(startTime, "HH:mm");

    const times = [];
    while (newStartTime < moment(endTime, "HH:mm")) {
      times.push({
        startTime: newStartTime.format("HH:mm"),
        endTime: moment(newStartTime).add(increment, "m").format("HH:mm"),
        uuid: "",
        occupants: values.occupants,
        price: values.price,
      });
      newStartTime.add(increment + timeBetweenSlots, "m").format("HH:mm");
      console.log(newStartTime.format("HH:mm"));
    }
    // Remove last slot if outside range
    if (times[times.length - 1].endTime > moment(endTime).format("HH:mm")) {
      times.splice(-1, 1);
    }
    // console.log(times);

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
      dateTime[date] = times;
    });

    setDateTimeObj(dateTime);
  };

  const next = () => {
    goToNext({
      dateTimeObj: dateTimeObj,
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
        // initialValues={{
        //   name: newEventForm.name,
        //   location: newEventForm.location,
        //   timeZone: newEventForm.timeZone,
        //   description: newEventForm.description,
        //   eventRange: newEventForm.eventRange,
        //   slotType: newEventForm.slotType,
        //   datesRemoved: newEventForm.datesRemoved,
        // }}
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
          <TrustButton
            htmlType="submit"
            label="Create Time Slots"
            buttonClass="bg-trustBlue mx-auto w-80 h-12 mt-12"
          />
        ) : (
          <div className="flex justify-center items-center space-x-4">
            <TrustButton
              htmlType="button"
              label="Review Event"
              onClick={(e) => {
                e.preventDefault();
                next();
              }}
              buttonClass="bg-trustBlue w-60 h-12 mt-12"
            />
            <TrustButton
              htmlType="button"
              label="Delete Time Slots"
              onClick={(e) => {
                e.preventDefault();
                setDateTimeObj({});
              }}
              buttonClass="bg-red-600 w-60 h-12 mt-12"
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
