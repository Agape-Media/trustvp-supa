import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabaseClient";
import { useRouter } from "next/router";
import { Auth } from "@supabase/ui";
import { Input, notification, Skeleton } from "antd";
import { TrustButton } from "@/components/pageUtils";
import _ from "lodash";
import useSWR from "swr";
import { fetcher } from "@/utils/helper";
import Avatar from "@/components/Avatar";

export default function Settings() {
  const { user, session } = Auth.useUser();
  const { data, error } = useSWR(
    user ? `/api/getProfile?id=${user.id}` : null,
    fetcher
  );

  const router = useRouter();

  const [hasStripeAccount, setHasStripeAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState(null);
  const [website, setWebsite] = useState(null);
  const [avatar_url, setAvatarUrl] = useState(null);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const [formData, setFormData] = useState();

  useEffect(() => {
    setFormData(data);
    data?.stripeID ? setHasStripeAccount(true) : setHasStripeAccount(false);
    setUsername(data?.username);
    setWebsite(data?.website);
    setAvatarUrl(data?.avatar_url);
  }, [data]);

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
      console.log(data);
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
      hasStripeAccount
        ? `/api/stripeUpdate?accountID=${formData?.stripeID}`
        : `/api/onboard?email=${session?.user?.email}`
    );
    if (!response.ok) {
      const message = `An error has occured ${
        hasStripeAccount ? "retrieving your account" : "onboarding your account"
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
        <div className="form-widget mb-3">
          <Avatar
            url={avatar_url}
            onUpload={(url) => {
              setAvatarUrl(url);
              updateProfile({ username, website, avatar_url: url });
            }}
          />
        </div>
        <p className="text-left sm:text-center font-bold text-3xl mb-0.5">
          {username}
        </p>
        <p className="text-left sm:text-center text-base">
          {session?.user?.email}
        </p>
      </div>
      <div>
        <div className="mb-6">
          <a onClick={() => getLink()} className="stripe-connect">
            <span>Connect with</span>
          </a>
        </div>
        {formData?.id && !loading ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              <div className="col-span-1">
                <Input
                  id="username"
                  type="text"
                  value={username || ""}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              <div className="col-span-1">
                <Input
                  id="website"
                  type="website"
                  value={website || ""}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>
            </div>

            <TrustButton
              disabled={buttonDisabled}
              onClick={() => updateProfile({ username, website, avatar_url })}
              label={buttonDisabled ? "Updating" : "Update"}
              buttonClass={`bg-trustBlue mx-auto w-80 h-12 mt-12 ${
                buttonDisabled ? "opacity-75" : null
              }`}
            />
          </>
        ) : (
          <Skeleton active />
        )}
      </div>

      <div className="max-w-xl mx-auto w-full px-6">
        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg mt-12 ">
          <div className="px-6 bg-gray-50 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Settings
          </div>
          <div className="px-6 py-4 bg-white ">
            <p className="text-base mb-8">
              Trustvp uses Stripe to update, change, or cancel your account. You
              can also update card information and billing addresses through the
              secure portal.
            </p>
            <div className="flex items-center justify-end space-x-6">
              <p
                onClick={() => supabase.auth.signOut()}
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
