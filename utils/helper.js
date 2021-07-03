import { notification } from "antd";

export const catchErrors = (fn) =>
  function (...args) {
    return fn(...args).catch((err) => {
      console.error(err);
      notification["error"]({
        message: "An Error Occurred",
        description: err.message || err.description || err,
      });
    });
  };
