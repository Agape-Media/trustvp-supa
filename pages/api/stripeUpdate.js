import { baseURL } from "../../utils/helper";
import Stripe from "stripe";

export default async (req, res) => {
  const accountID = req.query.accountID;
  const secret = process.env.NEXT_PUBLIC_STRIPE_SECRET;
  const stripe = new Stripe(secret);
  // const stripe = require("stripe")(secret);

  try {
    const accountLinks = await stripe.accountLinks.create({
      account: accountID,
      refresh_url: baseURL,
      return_url: baseURL,
      type: "account_onboarding",
    });
    console.log(accountLinks);
    return res.status(200).json({ url: accountLinks.url });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: error.message });
  }
};
