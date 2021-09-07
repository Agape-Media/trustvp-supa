import Stripe from "stripe";

export default async (req, res) => {
  const id = req.query.id;
  const secret = process.env.NEXT_PUBLIC_STRIPE_SECRET;

  try {
    const stripe = new Stripe(secret);
    const account = await stripe.accounts.retrieve(id);
    return res.status(200).json(account);
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};
