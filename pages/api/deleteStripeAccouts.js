import Stripe from "stripe";

export default async (req, res) => {
  const secret = process.env.NEXT_PUBLIC_STRIPE_SECRET;
  const stripe = new Stripe(secret);
  // const stripe = require("stripe")(secret);
  const accounts = await stripe.accounts.list();
  for (const account of accounts.data) {
    if (account.id != "acct_1JG8ClR17Mj2hTvI") {
      const deleted = await stripe.accounts.del(account.id);
    }
  }
  res.statusCode = 200;
  res.json({ name: "John Doe" });

  /////////////////////////////
  // const account = await stripe.accounts.retrieve(data[0].stripeID);
};
