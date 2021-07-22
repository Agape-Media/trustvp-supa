import { baseURL } from "../../utils/helper";

export default async (req, res) => {
  const email = req.query.email;
  const secret = process.env.NEXT_PUBLIC_STRIPE_SECRET;

  const stripe = require("stripe")(secret);
  const account = await stripe.accounts.create({
    type: "standard",
    email: email,
  });
  const accountID = account.id;
  try {
    const accountLinks = await stripe.accountLinks.create({
      account: accountID,
      refresh_url: `${baseURL}/stripeReturn/?accountID=${accountID}`,
      return_url: `${baseURL}/stripeReturn/?accountID=${accountID}`,
      type: "account_onboarding",
    });

    // if (error) return res.status(401).json({ error: error.message });
    return res.status(200).json({ url: accountLinks.url });
  } catch (error) {
    const deleted = await stripe.accounts.del(accountID);
    return res.status(401).json({ error: error.message });
  }
};
