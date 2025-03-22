const upload = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "ml_default");

  try {
    const response = await fetch("https://api.cloudinary.com/v1_1/dn64jwhq9/image/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Image upload failed with status: " + response.status);
    }

    const result = await response.json();

    if (result.secure_url) {
      return result.secure_url; // URL of the uploaded image
    } else {
      throw new Error("Image upload failed, no secure_url in the response");
    }
  } catch (error) {
    console.error("Error uploading image: ", error);
  }
};

// Export the `upload` function as default
export default upload;
