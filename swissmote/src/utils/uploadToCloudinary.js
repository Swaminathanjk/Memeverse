const uploadToCloudinary = async (file) => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    console.error("Cloudinary credentials are missing!");
    return null;
  }

  console.log("Uploading to Cloudinary...", { cloudName, uploadPreset });

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    console.log("Cloudinary Response:", data);

    if (!response.ok || !data.secure_url) {
      throw new Error(data.error?.message || "Failed to upload image to Cloudinary");
    }

    return data.secure_url; // ✅ Return Cloudinary image URL
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return null;
  }
};

export default uploadToCloudinary;
