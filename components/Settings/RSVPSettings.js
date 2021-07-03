import React, { useState, useEffect } from "react";
import { supabase } from "../../utils/supabaseClient";
import {
  Form,
  Input,
  Select,
  DatePicker,
  BackTop,
  notification,
  Radio,
  Empty,
  Table,
  InputNumber,
  Skeleton,
  Divider,
} from "antd";
import { TrustButton } from "../pageUtils";
import _ from "lodash";
import { catchErrors } from "../../utils/helper";
import NewLocationModal from "../NewEvent/NewLocation";

export default function RSVPSettings() {
  //   const [optionInfoForm] = Form.useForm();

  const [loading, setLoading] = useState(true);

  const [locations, setLocations] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    const fetchLocations = async () => {
      const user = supabase.auth.user();

      let { data, error, status } = await supabase
        .from("locations")
        .select()
        .eq("user_id", user.id);
      const newLocations = data.map((item, i) => {
        return {
          ...item,
          key: i,
        };
      });
      setLocations(newLocations);
      setLoading(false);
    };

    catchErrors(fetchLocations());
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Street",
      dataIndex: "street",
      key: "street",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "State",
      dataIndex: "state",
      key: "state",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Zip",
      dataIndex: "zip",
      key: "zip",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <a
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            deleteLocation(record);
          }}
          className="text-red-600"
        >
          Delete
        </a>
      ),
    },
  ];

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedLocation(null);
  };

  const newLocationSubmit = (data) => {
    const user = supabase.auth.user();
    const locationsSpread = [...locations];

    const upsertData = {
      id: data.id,
      name: data.name,
      street: data.street,
      city: data.city,
      state: data.state,
      zip: data.zip,
      user_id: user.id,
    };
    const newLoc = async (locationData) => {
      const { data, error } = await supabase
        .from("locations")
        .upsert(locationData);
      if (!_.isEmpty(selectedLocation)) {
        const locationIndex = _.findIndex(locationsSpread, {
          id: selectedLocation.id,
        });
        locationsSpread[locationIndex] = upsertData;
      } else {
        locationsSpread.push(data[0]);
      }

      setLocations(locationsSpread);

      handleCancel();
      notification["success"]({
        message: "Location Added Successfully",
      });
    };

    catchErrors(newLoc(upsertData));
  };

  // //   async function updateProfile({ username, website, avatar_url }) {
  // async function updateProfile(values) {
  //   try {
  //     setLoading(true);
  //     const user = supabase.auth.user();

  //     const updates = {
  //       id: user.id,
  //       username: values.username,
  //       website: values.website,
  //       avatar_url: values.avatar,
  //       updated_at: new Date(),
  //     };

  //     let { error } = await supabase.from("profiles").upsert(updates, {
  //       returning: "minimal", // Don't return the value after inserting
  //     });

  //     if (error) {
  //       throw error;
  //     }
  //   } catch (error) {
  //     alert(error.message);
  //   } finally {
  //     setFormData({
  //       ...formData,
  //       ...values,
  //     });
  //     setLoading(false);
  //   }
  // }

  async function deleteLocation(record) {
    try {
      const user = supabase.auth.user();

      let { error, data } = await supabase.from("locations").delete().match({
        user_id: user.id,
        id: record.id,
      });
      if (data) {
        const locationsSpread = [...locations];
        const removedLocationIndex = _.findIndex(locationsSpread, {
          id: record.id,
        });

        locationsSpread.splice(removedLocationIndex, 1);

        setLocations(locationsSpread);
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
    }
  }

  return (
    <>
      <TrustButton
        onClick={() => {
          setIsModalVisible(true);
        }}
        label="Add New Location"
        buttonClass="bg-trustBlue"
      />

      {!loading ? (
        <>
          <NewLocationModal
            visible={isModalVisible}
            onCancel={handleCancel}
            newLocationSubmit={newLocationSubmit}
            data={selectedLocation}
          />
          <div className="mt-12">
            {locations?.length ? (
              <Table
                onRow={(record, rowIndex) => {
                  return {
                    onClick: () => {
                      setSelectedLocation(record);
                      setIsModalVisible(true);
                    },
                  };
                }}
                bordered
                columns={columns}
                dataSource={locations}
              />
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                imageStyle={{
                  height: 60,
                }}
                description={
                  <span>
                    You currently have no locations.{" "}
                    <Link href="/newEvent">
                      <button>Add a location.</button>
                    </Link>
                  </span>
                }
              />
            )}
          </div>
          {/* <Form
            requiredMark={false}
            layout="vertical"
            name="basicInformation"
            initialValues={{
              username: formData.username,
              email: session.user.email,
              website: formData.website,
            }}
            onFinish={updateProfile}
            // form={optionInfoForm}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              <div className="col-span-1">
                <Form.Item
                  label="Name"
                  name="username"
                  rules={[
                    { required: true, message: "Please enter your name." },
                  ]}
                >
                  <Input defaultValue={username} />
                </Form.Item>
              </div>

              <div className="col-span-1">
                <Form.Item label="Email" name="email">
                  <Input disabled />
                </Form.Item>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              <div className="col-span-1">
                <Form.Item label="Website" name="website">
                  <Input />
                </Form.Item>
              </div>
            </div>
            <Form.Item>
              <TrustButton
                htmlType="submit"
                label="Update"
                buttonClass="bg-trustBlue mx-auto w-80 h-12 mt-12"
              />
            </Form.Item>
          </Form> */}
        </>
      ) : (
        <Skeleton active />
      )}
    </>
  );
}
