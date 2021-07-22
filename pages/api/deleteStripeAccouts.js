export default async (req, res) => {
  const stripe = require("stripe")(
    "sk_test_51JFhNuJM5OCIlNWKzxjdOkYBEWKKyJKwOxv4Wztk5IRtq6JQaZu6Fmc9jRDwImgGhrRvmp7zRKIIY62Z8tQig19j00TsHgQoCc"
  );
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
