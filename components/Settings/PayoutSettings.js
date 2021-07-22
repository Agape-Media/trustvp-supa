import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Skeleton, notification } from "antd";

export default function PayoutSettings({ userData, session, setLoading }) {
  const router = useRouter();

  const [hasStripeAccount, setHasStripeAccount] = useState(null);
  const [sessionData, setSessionData] = useState(null);

  useEffect(() => {
    // console.log(userData);
    setSessionData(session);
    userData?.stripeID ? setHasStripeAccount(true) : setHasStripeAccount(false);
  }, [userData]);

  const getLink = async () => {
    setLoading(true);
    const response = await fetch(
      hasStripeAccount
        ? `/api/stripeUpdate?accountID=${userData?.stripeID}`
        : `/api/onboard?email=${sessionData?.user?.email}`
    );
    if (!response.ok) {
      setLoading(false);
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
    <>
      <div>
        <a onClick={() => getLink()} className="stripe-connect">
          <span>Connect with</span>
        </a>
      </div>
    </>
  );
}
