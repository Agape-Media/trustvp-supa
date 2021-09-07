import { useEffect } from "react";
import { supabase } from "@/utils/supabaseClient";
import { useRouter } from "next/router";
import { baseURL } from "@/utils/helper";
import { Skeleton } from "antd";
import { getStripe } from "@/utils/stripe-client";

export default function stripeReturn() {
  const router = useRouter();

  useEffect(() => {
    async function updateProfile() {
      try {
        const user = supabase.auth.user();
        const updates = {
          id: user.id,
          stripeID: router.query.accountID,
          updated_at: new Date(),
        };
        let { error, data } = await supabase.from("profiles").upsert(updates);

        if (data) {
          console.log(data);
        }
        if (error) {
          throw error;
        }
      } catch (error) {
        const stripe = await getStripe();
        const deleted = await stripe.accounts.del(router.query.accountID);
      } finally {
        router.push(baseURL);
      }
    }

    router.query.accountID ? updateProfile() : null;
  }, [router.query]);
  return <Skeleton itemLayout="vertical" size="large" active />;
}
