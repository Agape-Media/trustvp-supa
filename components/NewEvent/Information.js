import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Select,
  DatePicker,
  BackTop,
  notification,
  Divider,
} from "antd";
import NewLocationModal from "./NewLocation";
import { TrustButton } from "../pageUtils";
import _ from "lodash";
import { timeZones } from "@/utils/selections";
import datesBetween from "dates-between";
import { supabase } from "@/utils/supabaseClient";
import Moment from "moment";
import { extendMoment } from "moment-range";

const moment = extendMoment(Moment);
const { Option } = Select;
const { RangePicker } = DatePicker;

export default function Information({
  goToNext,
  newEventForm,
  saveAsDraft,
  savingDraft,
}) {
  const [optionInfoForm] = Form.useForm();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [locations, setLocations] = useState(null);
  const [dateExclusions, setDateExlusions] = useState([]);

  useEffect(() => {
    optionInfoForm.resetFields();
    newEventForm?.dateExclusions
      ? setDateExlusions(_.compact(newEventForm.dateExclusions))
      : [];
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
  }, [newEventForm]);

  const onFinish = (values) => {
    values.dateExclusions = dateExclusions;
    // console.log("Success:", values);
    goToNext(values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  function onChangeDateRange(value, dateString) {
    if (dateString) {
      const exclusionsArray = [];

      for (const date of datesBetween(value[0]._d, value[1]._d)) {
        exclusionsArray.push(moment(date).format("MM/DD/YYYY"));
      }

      const fields = optionInfoForm.getFieldsValue();
      fields["datesRemoved"] = "";
      optionInfoForm.setFieldsValue(fields);

      setDateExlusions(_.compact(exclusionsArray));
    } else {
      setDateExlusions([]);
    }

    // console.log("Selected Time: ", value);
    // console.log("Formatted Selected Time: ", dateString);
  }

  function onOk(value) {
    console.log("onOk: ", value);
  }

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const newLocationSubmit = (data) => {
    const user = supabase.auth.user();
    const locationsSpread = [...locations];

    const newLoc = async (locationData) => {
      const { data, error } = await supabase.from("locations").insert([
        {
          name: locationData.name,
          street: locationData.street,
          city: locationData.city,
          state: locationData.state,
          zip: locationData.zip,
          user_id: user.id,
        },
      ]);
      setIsModalVisible(false);
      locationsSpread.push(data[0]);
      setLocations(locationsSpread);

      notification["success"]({
        message: "Location Added Successfully",
      });
    };

    newLoc(data).catch((err) => {
      console.log(err);
    });
  };

  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < moment().endOf("day");
  };

  const draft = (data) => {
    // console.log(data);
    saveAsDraft(data);
  };

  return (
    <>
      <NewLocationModal
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        newLocationSubmit={newLocationSubmit}
      />
      <Form
        requiredMark={false}
        layout="vertical"
        name="basicInformation"
        initialValues={{
          name: newEventForm?.name,
          location: newEventForm?.location,
          timeZone: newEventForm?.timeZone,
          description: newEventForm?.description,
          eventRange: newEventForm?.eventRange,
          slotType: newEventForm?.slotType,
          datesRemoved: newEventForm?.datesRemoved,
        }}
        onFinish={onFinish}
        form={optionInfoForm}
        onFinishFailed={onFinishFailed}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div className="col-span-1">
            <Form.Item
              label="Event Name"
              name="name"
              rules={[
                { required: true, message: "Please enter an event name." },
              ]}
            >
              <Input />
            </Form.Item>
          </div>

          <div className="col-span-1">
            <Form.Item
              label="Location"
              name="location"
              rules={[
                {
                  required: true,
                  message: "Please enter your event location.",
                },
              ]}
            >
              <Select
                dropdownRender={(menu) => (
                  <div className="items-center ">
                    {menu}
                    <Divider style={{ margin: "4px 0" }} />
                    <TrustButton
                      label="Add New Location"
                      onClick={(e) => {
                        e.preventDefault;
                        e.stopPropagation;
                        showModal();
                      }}
                      buttonClass="bg-trustBlue text-center flex w-full"
                    />
                  </div>
                )}
              >
                {locations?.map((loc, i) => (
                  <Option key={i} value={loc.id}>
                    {loc.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div className="col-span-1">
            <Form.Item
              label="Time Zone"
              name="timeZone"
              rules={[
                {
                  required: true,
                  message: "Please enter the time zone of your event.",
                },
              ]}
            >
              <Select>
                {timeZones.map((timeZone, i) => (
                  <Option key={i} value={timeZone.value}>
                    {timeZone.text}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div className="col-span-1">
            <Form.Item
              label="Description"
              name="description"
              rules={[
                {
                  required: true,
                  message: "Please enter your event description.",
                },
              ]}
            >
              <Input.TextArea />
            </Form.Item>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div className="col-span-1">
            <Form.Item
              label="Event Date Range"
              name="eventRange"
              rules={[
                {
                  required: true,
                  message:
                    "Please enter the start and end date for your event.",
                },
              ]}
            >
              <RangePicker
                disabledDate={disabledDate}
                showTime={false}
                format="MM/DD/YYYY"
                onChange={onChangeDateRange}
                onOk={onOk}
              />
            </Form.Item>
          </div>
          <div className="col-span-1">
            <Form.Item
              label="Are there dates you want to remove?"
              name="datesRemoved"
            >
              <Select
                disabled={dateExclusions.length == 1}
                mode="multiple"
                allowClear
              >
                {dateExclusions.map((date, i) => (
                  <Option
                    key={i}
                    value={
                      optionInfoForm.getFieldValue("eventRange") ? date : []
                    }
                  >
                    {date}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div className="col-span-1">
            <Form.Item
              label="Time Slots Type:"
              name="slotType"
              rules={[
                {
                  required: true,
                  message: "Please enter a value for this field.",
                },
              ]}
            >
              <Select>
                <Option value="auto">Auto</Option>
                <Option value="manual">Manual</Option>
              </Select>
            </Form.Item>
          </div>
        </div>
        <div className="flex justify-end space-x-4 mt-12">
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
            buttonClass="bg-gray-400 hover:bg-gray-500 transition duration-300 ease-in-out border w-40 h-10"
          />
          <Form.Item>
            <TrustButton
              htmlType="submit"
              label="Next"
              buttonClass="bg-trustBlue transition duration-300 ease-in-out w-40 h-10"
            />
          </Form.Item>
        </div>
      </Form>
      <BackTop />
    </>
  );
}
