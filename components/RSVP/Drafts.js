import React, { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../../utils/supabaseClient";
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
import Trash from "../Icons/Trash";
import { catchErrors, baseURL } from "../../utils/helper";

export default function Drafts({
  events,
  setSelectedEvent,
  setDeleteModalVisible,
}) {
  const router = useRouter();

  const columns = [
    {
      title: "Name",
      dataIndex: "newEventForm",
      key: "name",
      render: (text) => <span>{text.name}</span>,
    },
    {
      key: "action",
      width: 80,
      render: (text, record) => (
        <div className="flex justify-center">
          <Trash
            className="hover:bg-gray-100 rounded hover:border border-gray-200 text-red-600"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // console.log(record);
              setSelectedEvent(record);
              setDeleteModalVisible(true);
            }}
          />
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
                onClick: () => router.push(`/newEvent?id=${record.id}`),
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
