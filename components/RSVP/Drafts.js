import { Skeleton } from "antd";
import _ from "lodash";
import { useRouter } from "next/router";

export default function Drafts({
  events,
  setSelectedEvent,
  setDeleteModalVisible,
}) {
  const router = useRouter();
  const data = {
    type: "draft",
    labels: ["Name"],
    data: events.map((item, index) => ({
      id: item.id,
      key: index,
      name: <span>{item.newEventForm.name}</span>,
      action: (
        <span
          className="text-red-600"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setSelectedEvent(item);
            setDeleteModalVisible(true);
          }}
        >
          Delete
        </span>
      ),
    })),
  };

  return (
    <>
      <div className="flex flex-col mb-12">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200 bg-[#F7FAFC]">
                <thead className="bg-[#F7FAFC] min-w-full">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Name
                    </th>

                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.data.map((item, i) => (
                    <tr
                      key={i}
                      className="cursor-pointer hover:bg-[#F7FAFC]"
                      onClick={() => router.push(`/newEvent?id=${item.id}`)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap w-full">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900">
                            {item.name}
                          </div>
                        </div>
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
    </>
  );
}
