import { buffer } from "micro";

const secret = process.env.NEXT_PUBLIC_STRIPE_SECRET;
const stripe = require("stripe")(secret);
const endpointSecret = "whsec_WddzmWWyFINF2KQihbKgzfqD7sNfoZTn";

const fulfillOrder = (session) => {
  // TODO: fill me in
  console.log("Fulfilling order", session);
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req, res) => {
  if (req.method === "POST") {
    const buf = await buffer(req);
    const sig = req.headers["stripe-signature"];
    // const payload = req.body;

    let event;

    try {
      event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
    } catch (err) {
      console.log("made error");
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the checkout.session.completed event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      // Fulfill the purchase...
      fulfillOrder(session);
    }

    res.status(200);
    // return res.status(200).json({ hello: "matt" });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};
