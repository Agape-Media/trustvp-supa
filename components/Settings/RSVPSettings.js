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
import DeleteLocationsModal from "./DeleteLocationsModal";
import Link from "next/link";

export default function RSVPSettings() {
  //   const [optionInfoForm] = Form.useForm();

  const [loading, setLoading] = useState(true);

  const [locations, setLocations] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        const user = supabase.auth.user();

        let { data, error, status } = await supabase
          .from("locations")
          .select()
          .eq("user_id", user.id);

        if (error && status !== 406) {
          throw error;
        }

        if (data) {
          const newLocations = data.map((item, i) => {
            return {
              ...item,
              key: i,
            };
          });
          setLocations(newLocations);
        }
      } catch (error) {
        alert(error.message);
      }

      setLoading(false);
    };

    fetchLocations();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Street",
      dataIndex: "street",
      key: "street",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "State",
      dataIndex: "state",
      key: "state",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Zip",
      dataIndex: "zip",
      key: "zip",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <span
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setSelectedLocation(record);
            setDeleteModalVisible(true);
            // deleteLocation(record);
          }}
          className="text-red-600"
        >
          Delete
        </span>
      ),
    },
  ];

  const handleCancel = () => {
    setIsModalVisible(false);
    setDeleteModalVisible(false);
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

  async function deleteLocation(record) {
    setDeleteModalVisible(false);
    try {
      const user = supabase.auth.user();

      let { error, data } = await supabase.from("locations").delete().match({
        user_id: user.id,
        id: record,
      });
      if (data) {
        const locationsSpread = [...locations];
        const removedLocationIndex = _.findIndex(locationsSpread, {
          id: record,
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
    } finally {
      setSelectedLocation(null);
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
          <DeleteLocationsModal
            visible={isDeleteModalVisible}
            onCancel={handleCancel}
            deleteLocation={deleteLocation}
            data={selectedLocation}
            selectedLocation={selectedLocation}
          />
          <div className="mt-12">
            {locations?.length ? (
              <Table
                rowClassName="cursor-pointer"
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
        </>
      ) : (
        <Skeleton active />
      )}
    </>
  );
}
