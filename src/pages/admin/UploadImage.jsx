// src/pages/admin/UploadImage.jsx

import { useState } from "react";
import ErrorMessage from "../../components/common/ErrorMessage";
import SuccessMessage from "../../components/common/SuccessMessage";
import { uploadImage } from "../../api/uploadApi";

const UploadImage = () => {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select an image.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const data = await uploadImage(file);

      const url =
        data?.url ||
        data?.imageUrl ||
        data?.secure_url ||
        data;

      setImageUrl(url);

      setSuccess("Image uploaded successfully.");
    } catch (err) {
      console.error(err);
      setError("Unable to upload image.");
    } finally {
      setLoading(false);
    }
  };

  const copyUrl = async () => {
    if (!imageUrl) return;

    await navigator.clipboard.writeText(
      imageUrl
    );

    setSuccess("Image URL copied.");
  };

  return (
    <div className="p-6 max-w-2xl space-y-5">
      <div>
        <h1 className="text-3xl font-bold">
          Upload Image
        </h1>

        <p className="text-gray-600 mt-1">
          Upload restaurant/menu images.
        </p>
      </div>

      {error && <ErrorMessage message={error} />}
      {success && (
        <SuccessMessage message={success} />
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow space-y-4"
      >
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setFile(e.target.files?.[0] || null)
          }
          className="w-full border p-3 rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-5 py-3 rounded disabled:opacity-60"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {imageUrl && (
        <div className="bg-white p-4 rounded-lg shadow space-y-4">
          <img
            src={imageUrl}
            alt="Uploaded"
            className="w-full max-h-80 object-contain rounded"
          />

          <input
            value={imageUrl}
            readOnly
            className="w-full border p-3 rounded"
          />

          <button
            onClick={copyUrl}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Copy URL
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadImage;