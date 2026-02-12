// public/js/r2Upload.js
async function uploadFile(file, type) {
    const res = await fetch("/api/upload/presign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        mime: file.type,
      }),
    });
  
    const { uploadUrl, key } = await res.json();
  
    const upload = await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });
  
    if (!upload.ok) throw new Error("Upload failed");
  
    return key;
  }
  