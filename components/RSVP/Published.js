import React, { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../../utils/supabaseClient";
import { TrustButton } from "../pageUtils";
import {
  Empty,
  Table,
  Skeleton,
  Menu,
  Dropdown,
  notification,
  Tabs,
} from "antd";
import moment from "moment";
import _ from "lodash";
import { useRouter } from "next/router";
import copy from "copy-to-clipboard";
import TinyURL from "tinyurl";
import DotsVertical from "../Icons/DotsVertical";
import { catchErrors, baseURL } from "../../utils/helper";
import Trash from "../Icons/Trash";

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
        <div className="flex space-x-2 items-center">
          {/* <Trash className="hover:bg-gray-100 rounded hover:border border-gray-200 text-red-600" /> */}
          Delete Event{" "}
        </div>
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

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Location",
      dataIndex: "locations",
      key: "location",
      render: (text) => <span>{text?.name}</span>,
    },
    {
      title: "Date",
      dataIndex: "dateRange",
      key: "dateRange",
      render: (dateRange) => (
        <div>
          {dateRange?.map((date, i) => (
            <span key={i}>
              {i === 1 ? " - " : null}
              {moment(date).format("MM/DD/YYYY")}
            </span>
          ))}
        </div>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text) => <span>{text}</span>,
    },
    {
      key: "action",
      render: (text, record) => (
        <div className="flex justify-center">
          <Dropdown overlay={menu} placement="bottomRight" trigger={["click"]}>
            <DotsVertical
              className="hover:bg-gray-100 rounded hover:border border-gray-200"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSelectedEvent(record);
              }}
            />
          </Dropdown>
        </div>
      ),
    },
  ];

  return (
    <>
      {events != null ? (
        events?.length ? (
          <Table
            rowKey="id"
            rowClassName="cursor-pointer"
            onRow={(record, rowIndex) => {
              return {
                onClick: () => router.push(`/eventInfo?id=${record.id}`),
              };
            }}
            className="mt-12"
            bordered
            columns={columns}
            dataSource={events}
          />
        ) : null
      ) : (
        <Skeleton />
      )}
    </>
  );
}
