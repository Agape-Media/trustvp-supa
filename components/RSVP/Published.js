import { Menu, Dropdown, notification } from "antd";
import moment from "moment";
import _ from "lodash";
import { useRouter } from "next/router";
import copy from "copy-to-clipboard";
import TinyURL from "tinyurl";
import DotsVertical from "../Icons/DotsVertical";
import { baseURL } from "@/utils/helper";

export default function Published({
  events,
  setSelectedEvent,
  selectedEvent,
  setDeleteModalVisible,
}) {
  const router = useRouter();
  const menu = (
    <Menu
      onClick={(e) => {
        e.domEvent.preventDefault();
        e.domEvent.stopPropagation();
      }}
    >
      <Menu.Item
        key="0"
        onClick={() => {
          copyEventURL(selectedEvent.id);
        }}
      >
        Copy Link
      </Menu.Item>
      <Menu.Item key="1">
        <a
          target="_blank"
          rel="noopener noreferrer"
          // href="https://www.aliyun.com"
        >
          View Event Details
        </a>
      </Menu.Item>
      <Menu.Item
        key="2"
        onClick={() => {
          // setSelectedEvent(record);
          console.log(selectedEvent);
          setDeleteModalVisible(true);
        }}
      >
        <div className="flex space-x-2 items-center">Delete Event </div>
      </Menu.Item>
    </Menu>
  );

  const copyEventURL = async (id) => {
    console.log(id);
    try {
      const url = `${baseURL}/rsvp/reserve?id=${id}`;
      const coolURL = await TinyURL.shorten(url);
      copy(coolURL);
      notification["success"]({
        message: "Event url coppied to clipboard",
      });
    } catch (error) {
      console.log(error);
      notification["error"]({
        message: "Uh-oh something went wrong",
      });
    }
  };
  const data = {
    labels: ["Name", "Location", "Date", "Description"],
    data: events.map((item, index) => ({
      key: index,
      name: <span>{item.name}</span>,
      location: <span>{item.locations.name}</span>,
      dateRange: (
        <div>
          {item.dateRange?.map((date, i) => (
            <span key={i}>
              {i === 1 ? " - " : null}
              {moment(date).format("MM/DD/YYYY")}
            </span>
          ))}
        </div>
      ),
      description: <span>{item.description}</span>,
      action: (
        <div className="flex justify-end">
          <Dropdown overlay={menu} placement="bottomRight" trigger={["click"]}>
            <DotsVertical
              className="hover:bg-gray-100 rounded hover:border border-gray-200"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSelectedEvent(item);
              }}
            />
          </Dropdown>
        </div>
      ),
    })),
  };

  return (
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
                  <tr className="cursor-pointer hover:bg-[#F7FAFC]" key={i}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">
                          {item.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {item.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {item.dateRange}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <a
                        href="#"
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        {item.action}
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
  );
}
