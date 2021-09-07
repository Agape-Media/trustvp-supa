import { useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import { Avatar } from "antd";
import { AiOutlineUser } from "react-icons/ai";
import { useAppContext, useAppUpdateContext } from "@/context/state";
import { downloadImage } from "@/utils/helper";

export default function Defualt({ onUpload }) {
  const view = useAppContext();
  const update = useAppUpdateContext();

  const [uploading, setUploading] = useState(false);

  async function uploadAvatar(event) {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      let { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }
      const { url } = await downloadImage(filePath);
      const viewSpread = { ...view };
      viewSpread.avatar_url = url;
      update(viewSpread);
      onUpload(filePath);
    } catch (error) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex sm:justify-center">
      <label className="button" htmlFor="single">
        {view?.avatar_url ? (
          <img
            src={view?.avatar_url}
            alt="Avatar"
            className=" object-cover rounded-full w-12 h-12 sm:w-[96px] sm:h-[96px] cursor-pointer"
          />
        ) : (
          <Avatar
            size={96}
            className="grid place-items-center cursor-pointer"
            icon={<AiOutlineUser />}
          />
        )}
      </label>
      <input
        style={{
          visibility: "hidden",
          position: "absolute",
        }}
        type="file"
        id="single"
        accept="image/*"
        onChange={uploadAvatar}
        disabled={uploading}
      />
    </div>
  );
}
