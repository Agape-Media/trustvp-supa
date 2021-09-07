import React, { useState, useEffect } from "react";
import { supabase } from "@/utils/supabaseClient";
import { notification } from "antd";
import { TrustButton, Panel } from "@/components/pageUtils";
import _ from "lodash";
import NewLocationModal from "@/components/NewEvent/NewLocation";
import DeleteLocationsModal from "@/components/Location/DeleteLocationsModal";
import Layout from "@/components/Layout";
import Header from "@/components/Header";
import TableLoadingShell from "@/components/TableLoadingShell";

export default function Locations() {
  const [locations, setLocations] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    const fetchLocations = async () => {
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
    };

    fetchLocations().catch((err) => {
      console.log(err);
    });
  }, []);

  const data = {
    labels: ["Name", "Street", "City", "State", "Zip"],
    data: locations?.map((item, index) => ({
      key: index,
      ...item,
    })),
  };

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

    newLoc(upsertData).catch((err) => {
      console.log(err);
    });
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
  if (!locations) {
    return (
      <Layout>
        <Header title="Manage Locations" subtitle="Locations" />
        <TableLoadingShell
          labels={["Name", "Street", "City", "State", "Zip"]}
        />
      </Layout>
    );
  }

  if (!locations?.length) {
    return (
      <Layout>
        <Header title="Manage RSVP's" subtitle="RSVPS" />
        <Panel>
          <p className="text-trustDark text-2xl font-medium">
            You currently have no locations
          </p>
          <p className="text-trustDark text-base ">
            Create a location to get started
          </p>
          <TrustButton
            onClick={() => {
              setIsModalVisible(true);
            }}
            label="Add New Location"
            buttonClass="bg-trustBlue"
          />
        </Panel>
        <NewLocationModal
          visible={isModalVisible}
          onCancel={handleCancel}
          newLocationSubmit={newLocationSubmit}
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <Header title="Manage Locations" subtitle="Locations" />
      <div className="px-4 pb-4">
        <TrustButton
          onClick={() => {
            setIsModalVisible(true);
          }}
          label="Add New Location"
          buttonClass="bg-trustBlue"
        />
      </div>

      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200 bg-[#F7FAFC]">
                <thead className="bg-[#F7FAFC] min-w-full">
                  <tr>
                    {data.labels.map((item, index) => (
                      <th
                        key={index}
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {item}
                      </th>
                    ))}
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.data.map((item, i) => (
                    <tr
                      className="cursor-pointer hover:bg-[#F7FAFC]"
                      key={i}
                      onClick={() => {
                        setSelectedLocation(item);
                        setIsModalVisible(true);
                      }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900">
                            {item.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {item.street}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{item.city}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.state}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.zip}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <a
                          href="#"
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <span
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setSelectedLocation(item);
                              setDeleteModalVisible(true);
                            }}
                            className="text-red-600"
                          >
                            Delete
                          </span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

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
    </Layout>
  );
}
