import { useRouter } from "next/router";
import { baseURL } from "@/utils/helper";
import Layout from "@/components/Layout";
import { TrustButton } from "@/components/pageUtils";
import _ from "lodash";
import { Divider, Skeleton, Menu, Dropdown, notification } from "antd";
import moment from "moment";
import copy from "copy-to-clipboard";
import TinyURL from "tinyurl";
import useSWR from "swr";
import { fetcher } from "@/utils/helper";

const EventInfo = () => {
  const router = useRouter();
  const queryKey = "id";
  const paramToken =
    router.query[queryKey] ||
    (router.asPath.match(new RegExp(`[&?]${queryKey}=(.*)(&|$)`))
      ? router.asPath.match(new RegExp(`[&?]${queryKey}=(.*)(&|$)`))[1]
      : null);

  const { data } = useSWR(`/api/getEvents?key=id&value=${paramToken}`, fetcher);

  const menu = (
    <Menu>
      <Menu.Item key="0" onClick={() => copyEventURL()}>
        Copy Link
      </Menu.Item>
      <Menu.Item key="1">
        <a
          target="_blank"
          rel="noopener noreferrer"
          // href="https://www.aliyun.com"
        >
          Share on Facebook
        </a>
      </Menu.Item>
      <Menu.Item key="2">
        <a
          target="_blank"
          rel="noopener noreferrer"
          // href="https://www.luohanacademy.com"
        >
          Share on Instagram
        </a>
      </Menu.Item>
    </Menu>
  );

  const copyEventURL = async () => {
    try {
      const url = `${baseURL}/rsvp/reserve?id=${data?.id}`;
      const coolURL = await TinyURL.shorten(url);
      copy(coolURL);
      notification["success"]({
        message: "Event url coppied to clipboard",
      });
    } catch (error) {
      notification["error"]({
        message: "Uh-oh something went wrong",
      });
    }
  };
  return (
    <Layout>
      {data?.id ? (
        <div className="border border-gray-100 bg-gray-50 p-6 shadow-xl w-full h-96 rounded-lg flex flex-col max-w-lg mx-auto">
          <div className="flex-1">
            <p className="text-gray-600 text-base">{data?.locations.name}</p>
            <p className="text-black text-3xl font-bold">{data?.name}</p>
            <p className="text-gray-600 text-sm">{data?.description}</p>
            <Divider />
            <p className="text-gray-600 text-sm">
              Date Start: {moment(data?.dateRange[0]).format("MM/DD/YYYY")}
            </p>
            <p className="text-gray-600 text-sm">
              Date End: {moment(data?.dateRange[1]).format("MM/DD/YYYY")}
            </p>
            <p className="text-gray-600 text-sm">Time Zone: {data?.timeZone}</p>
          </div>
          <div className="flex items-center justify-between space-x-4">
            <Dropdown
              overlay={menu}
              placement="bottomCenter"
              trigger={["click"]}
            >
              <a
                className="ant-dropdown-link bg-gray-600 w-full px-4 py-2 rounded-lg shadow-sm focus:outline-none text-white text-sm flex items-center justify-center hover:text-white hover:bg-gray-700 transition duration-300 ease-in-out"
                onClick={(e) => e.preventDefault()}
              >
                Share Event
              </a>
            </Dropdown>
            <TrustButton
              onClick={() => router.push(`/eventDetails?id=${data?.id}`)}
              buttonClass="bg-trustBlue w-full hover:opacity-80 transition duration-300 ease-in-out"
              label="Event Stats"
            />
          </div>
        </div>
      ) : (
        <Skeleton active />
      )}
    </Layout>
  );
};

export default EventInfo;

// ONLY TO KEEP QUERY ON REFRESH ----- DO NOT DELETE

// export async function getServerSideProps(context) {
//   return {
//     props: {}, // ONLY TO KEEP QUERY ON REFRESH ----- DO NOT DELETE
//   };
// }
