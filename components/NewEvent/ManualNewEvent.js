import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Checkbox,
  Select,
  DatePicker,
  notification,
  Space,
  Alert,
  InputNumber,
  TimePicker,
  Divider,
  Popconfirm,
  Switch,
  message,
  BackTop,
} from "antd";
import _ from "lodash";
import { v4 as uuidv4 } from "uuid";

import { TrustButton } from "../pageUtils";
import datesBetween from "dates-between";

import Moment from "moment";
import { extendMoment } from "moment-range";

const moment = extendMoment(Moment);

const { Option } = Select;
const { RangePicker } = DatePicker;

const ManualNewEvent = ({
  newEventForm,
  goToNext,
  saveAsDraft,
  savingDraft,
}) => {
  const [datesFiltered, setDatesFiltered] = useState([]);
  const [dateTimeObj, setDateTimeObj] = useState({});
  const [condition, setCondition] = useState(false);

  useEffect(() => {
    // console.log(newEventForm);
    if (
      !_.isEmpty(newEventForm) &&
      (_.isUndefined(newEventForm?.dateTimeObj) ||
        _.isNil(newEventForm?.dateTimeObj) ||
        _.isEmpty(newEventForm?.dateTimeObj))
    ) {
      const filteredDates = getDatesFilterd(newEventForm);

      const newDateTimeObj = {};
      filteredDates.map((date, i) => {
        newDateTimeObj[date] = [];
      });

      setDateTimeObj(newDateTimeObj);
    } else if (
      !_.isEmpty(newEventForm) &&
      !_.isEmpty(newEventForm?.dateTimeObj)
    ) {
      getDatesFilterd(newEventForm);
      setDateTimeObj(newEventForm?.dateTimeObj);
    }
  }, [newEventForm]);

  const getDatesFilterd = (data) => {
    const dateRanges = [];
    const eventInfo = data;
    // console.log(eventInfo);
    for (const date of datesBetween(
      eventInfo.eventRange[0]._d,
      eventInfo.eventRange[1]._d
    )) {
      dateRanges.push(moment(date).format("MM/DD/YYYY"));
    }
    const filteredDates = _.filter(
      dateRanges.map((date, i) => {
        if (!_.includes(eventInfo.datesRemoved, date)) {
          return date;
        }
        return null;
      }),
      (someDate) => {
        return someDate != null;
      }
    );

    setDatesFiltered(filteredDates);
    return filteredDates;
  };

  const [optionInfoForm] = Form.useForm();

  const Slot = ({ startTime, endTime, index, date }) => (
    <Popconfirm
      title="Are you sure to DELETE this time slot?"
      onConfirm={() => removeTimeSlot(index, date)}
      okText="Delete"
      cancelText="Cancel"
    >
      <div className="cursor-pointer col-span-1 h-12 bg-trustBlue text-white flex items-center justify-center font-bold">
        <p>{`${moment(startTime, "HH:mm").format("h:mm a")} - ${moment(
          endTime,
          "HH:mm"
        ).format("h:mm a")}`}</p>
      </div>
    </Popconfirm>
  );

  const SlotContainer = ({ date }) => (
    <>
      <div className="w-full">
        <p className="text-base font-bold">{date}</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 ">
          {dateTimeObj[date].map((timeSlot, i) => (
            <Slot
              key={i}
              index={i}
              date={date}
              startTime={timeSlot.startTime}
              endTime={timeSlot.endTime}
            />
          ))}
        </div>
      </div>
    </>
  );

  const removeTimeSlot = (index, date) => {
    const dateTimeObjSpread = { ...dateTimeObj };

    dateTimeObjSpread[date].splice(index, 1);
    setDateTimeObj(dateTimeObjSpread);
  };

  const addSlot = (values) => {
    // console.log(_.flatMap(dateTimeObj, null));
    const startTime = values.timeRange[0]._d;
    const endTime = values.timeRange[1]._d;
    const occupants = values.occupants;
    const price = values.price;
    const datesSelected = values.datesSelected;

    const dateTimeObjSpread = { ...dateTimeObj };

    const objToPush = {
      startTime: startTime,
      endTime: endTime,
      occupants: occupants,
      price: price,
      available: occupants,
    };

    _.forEach(datesSelected, function (date) {
      if (dateTimeObjSpread[date].length) {
        const checkOverlap = _.some(dateTimeObjSpread[date], function (item) {
          let range1 = moment.range(item.startTime, item.endTime);
          let range2 = moment.range(startTime, endTime);

          return range1.overlaps(range2, { adjacent: false });
        });

        condition
          ? dateTimeObjSpread[date].push({
              ...objToPush,
              date: date,
              id: uuidv4(),
            })
          : checkOverlap === false &&
            dateTimeObjSpread[date].push({
              ...objToPush,
              date: date,
              id: uuidv4(),
            });
      } else {
        dateTimeObjSpread[date].push({
          ...objToPush,
          date: date,
          id: uuidv4(),
        });
      }
    });

    setDateTimeObj(dateTimeObjSpread);
  };

  const next = () => {
    if (_.every(dateTimeObj, _.isEmpty)) {
      notification["warning"]({
        message: "Please add at least one time slot for your event.",
      });
    } else {
      goToNext({
        dateTimeObj: dateTimeObj,
      });
    }
  };

  const changeCondition = (value) => {
    setCondition(value);
  };

  const draft = (data) => {
    console.log(data);
    saveAsDraft({
      dateTimeObj: dateTimeObj,
    });
  };

  return (
    <>
      <div>
        <p className="text-base font-bold">Manual Time Entry</p>
      </div>

      <div className="my-6">
        Whether to let time slots overlap：
        <Switch onChange={changeCondition} />
      </div>

      <Form
        requiredMark={false}
        layout="vertical"
        name="AutoNewEvent"
        onFinish={addSlot}
        form={optionInfoForm}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div className="col-span-1">
            <Form.Item
              label="Dates you want to add slots to:"
              name="datesSelected"
              rules={[{ required: true, message: "Please add dates." }]}
            >
              <Select mode="multiple" allowClear>
                {datesFiltered.map((date, i) => (
                  <Option key={i} value={date}>
                    {date}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>
          <div className="col-span-1">
            <Form.Item
              label="Slot Time Range"
              name="timeRange"
              rules={[
                { required: true, message: "Please enter an event name." },
              ]}
            >
              <TimePicker.RangePicker use12Hours format="h:mm a" />
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
              <InputNumber min={1} />
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
        <div className="flex justify-center items-center space-x-4 mt-12">
          <TrustButton
            htmlType="submit"
            label="Add Time Slot"
            buttonClass="bg-trustBlue w-60 h-12"
          />
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
            disabled={savingDraft}
            onClick={(e) => {
              e.preventDefault();
              console.log(
                _.compact(_.flatMap(optionInfoForm.getFieldsValue())).length
              );
              draft(optionInfoForm.getFieldsValue());
            }}
            label="Save as Draft"
            buttonClass="bg-gray-400 hover:bg-gray-500 mx-auto transition duration-300 ease-in-out border w-60 h-12"
          />
        </div>
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

export default ManualNewEvent;
