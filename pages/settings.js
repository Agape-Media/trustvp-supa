import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabaseClient";
import { useRouter } from "next/router";
import { Auth } from "@supabase/ui";
import { notification } from "antd";
import { TrustButton } from "@/components/pageUtils";
import _ from "lodash";
import AvatarUpload from "@/components/Avatar";
import { Avatar } from "antd";
import { AiOutlineUser } from "react-icons/ai";
import { useAppContext, useAppUpdateContext } from "@/context/state";
import { FaInfinity } from "react-icons/fa";

export default function Settings() {
  const view = useAppContext();
  const update = useAppUpdateContext();

  const { user, session } = Auth.useUser();

  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState(null);
  const [website, setWebsite] = useState(null);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const [formData, setFormData] = useState();

  useEffect(() => {
    setFormData(view);
    setUsername(view?.username);
    setWebsite(view?.website);
  }, [view]);

  async function updateProfile(values) {
    try {
      setLoading(true);
      setButtonDisabled(true);
      const user = supabase.auth.user();
      console.log(values);
      const updates = {
        id: user.id,
        username: values.username,
        website: values.website,
        avatar_url: values.avatar_url,
        updated_at: new Date(),
      };

      let { error, data } = await supabase.from("profiles").upsert(updates);

      if (data) {
        notification["success"]({
          message: "Profile Updated Successfully",
        });
      }
      if (error) {
        throw error;
      }
    } catch (error) {
      // alert(error.message);
      notification["error"]({
        message: "Error Updating Profile",
        description:
          "Ensure you have a good connection, then contact support if error persists",
      });
    } finally {
      setFormData({
        ...formData,
        ...values,
      });
      setLoading(false);
      setButtonDisabled(false);
    }
  }

  const getLink = async () => {
    const response = await fetch(
      formData?.stripeID
        ? `/api/stripeUpdate?accountID=${formData?.stripeID}`
        : `/api/onboard?email=${session?.user?.email}`
    );
    if (!response.ok) {
      const message = `An error has occured ${
        formData?.stripeID
          ? "retrieving your account"
          : "onboarding your account"
      }. Contact support if error persists`;

      notification["error"]({
        message: "Error",
        description: message,
      });
      throw new Error(message);
    }
    const data = await response.json();
    router.push(data.url);
  };

  return (
    <Layout>
      <div className="px-4 mb-6">
        {user ? (
          <div className="form-widget mb-3">
            <AvatarUpload
              url={view?.avatar_url}
              onUpload={(url) => {
                updateProfile({ username, website, avatar_url: url });
              }}
            />
          </div>
        ) : (
          <div className="flex sm:justify-center">
            <Avatar
              size={96}
              className="grid place-items-center"
              icon={<AiOutlineUser />}
            />
          </div>
        )}
        <p className="text-left sm:text-center font-bold text-3xl mb-0.5">
          {username}
        </p>
        <p className="text-left sm:text-center text-base">
          {session?.user?.email}
        </p>
      </div>

      <div className="max-w-[650px] mx-auto w-full px-6">
        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg mt-12 ">
          <div className="px-6 bg-[#F7FAFC] py-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Settings
          </div>
          <div className="px-6 py-6 bg-white ">
            <div className="flex items-center justify-between mb-6">
              <Stats title="Events" info="Unlimited Events" />
              <Stats title="Locations" info="Unlimited Locations" />
              <div></div>
            </div>
            <p className="text-base mb-8">
              Trustvp uses Stripe to update, change, or cancel your account. You
              can also update card information and billing addresses through the
              secure portal.
            </p>
            <div className="flex items-center justify-end space-x-6">
              <p
                onClick={() => {
                  update(null);
                  supabase.auth.signOut();
                }}
                className="text-base cursor-pointer"
              >
                Log Out
              </p>
              <TrustButton
                disabled={buttonDisabled}
                onClick={() => getLink()}
                label="Manage Billing"
                buttonClass="bg-trustBlue w-32 h-10"
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

const Stats = ({ title, info }) => (
  <div className="flex flex-col space-y-2">
    <p className="font-medium">{title}</p>
    <FaInfinity className="text-xl" />
    <p className="text-gray-500">{info}</p>
  </div>
);
