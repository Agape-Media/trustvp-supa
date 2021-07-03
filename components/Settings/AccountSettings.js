import { useState, useEffect } from "react";
import { supabase } from "../../utils/supabaseClient";
import {
  Form,
  Input,
  Select,
  DatePicker,
  BackTop,
  notification,
  InputNumber,
  Skeleton,
  Divider,
} from "antd";
import { TrustButton } from "../pageUtils";
import _ from "lodash";
import { catchErrors } from "../../utils/helper";

export default function AccountSettings() {
  //   const [optionInfoForm] = Form.useForm();

  const [loading, setLoading] = useState(true);

  const [username, setUsername] = useState(null);
  const [website, setWebsite] = useState(null);
  const [avatar_url, setAvatarUrl] = useState(null);
  const [email, setEmail] = useState(null);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const [formData, setFormData] = useState({
    username: null,
    website: null,
    avatar_url: null,
  });

  const [session, setSession] = useState(null);

  useEffect(() => {
    const session = supabase.auth.session();
    setSession(session);

    getProfile();
  }, []);

  async function getProfile() {
    try {
      setLoading(true);
      const user = supabase.auth.user();

      let { data, error, status } = await supabase
        .from("profiles")
        .select(`username, website, avatar_url`)
        .eq("id", user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setFormData({
          ...formData,
          username: data.username,
          website: data.website,
          avatar_url: data.avatar_url,
        });
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  //   async function updateProfile({ username, website, avatar_url }) {
  async function updateProfile(values) {
    try {
      setButtonDisabled(true);
      const user = supabase.auth.user();

      const updates = {
        id: user.id,
        username: values.username,
        website: values.website,
        avatar_url: values.avatar,
        updated_at: new Date(),
      };

      let { error, data } = await supabase.from("profiles").upsert(updates);
      console.log(data);
      if (data) {
        notification["success"]({
          message: "Profile Updated Successfully",
        });
      }
      if (error) {
        throw error;
      }
    } catch (error) {
      // alert(error.message);
      notification["error"]({
        message: "Error Updating Profile",
        description:
          "Ensure you have a good connection, then contact support if error persists",
      });
    } finally {
      setFormData({
        ...formData,
        ...values,
      });
      setButtonDisabled(false);
    }
  }

  return (
    <>
      {!loading ? (
        <>
          <Form
            requiredMark={false}
            layout="vertical"
            name="basicInformation"
            initialValues={{
              username: formData.username,
              email: session.user.email,
              website: formData.website,
            }}
            onFinish={updateProfile}
            // form={optionInfoForm}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              <div className="col-span-1">
                <Form.Item
                  label="Name"
                  name="username"
                  rules={[
                    { required: true, message: "Please enter your name." },
                  ]}
                >
                  <Input defaultValue={username} />
                </Form.Item>
              </div>

              <div className="col-span-1">
                <Form.Item label="Email" name="email">
                  <Input disabled />
                </Form.Item>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              <div className="col-span-1">
                <Form.Item label="Website" name="website">
                  <Input />
                </Form.Item>
              </div>
            </div>
            <Form.Item>
              <TrustButton
                disabled={buttonDisabled}
                htmlType="submit"
                label={buttonDisabled ? "Updating" : "Update"}
                buttonClass={`bg-trustBlue mx-auto w-80 h-12 mt-12 ${
                  buttonDisabled ? "opacity-75" : null
                }`}
              />
            </Form.Item>
          </Form>
        </>
      ) : (
        <Skeleton active />
      )}
    </>
  );
}
