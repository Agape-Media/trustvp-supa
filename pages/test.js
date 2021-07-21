import React, { useState, useEffect } from "react";

import TinyURL from "tinyurl";

export default function test() {
  useEffect(() => {
    // async function trying() {
    //   const hello = await TinyURL.shorten("http://google.com");
    //   console.log(hello);
    // }
    // trying();
    const data = {
      url: "https://google.com",
    };
    console.log(data.url);
  }, []);
  return <div></div>;
}
