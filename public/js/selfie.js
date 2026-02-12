/* public/js/selfie.js — R2 presign canonical version */
document.addEventListener("DOMContentLoaded", () => {
  console.log("📷 selfie.js loaded!");

  const form = document.getElementById("selfie-form");
  const input = document.getElementById("selfieInput");
  const snapBtn = document.getElementById("snap");
  const video = document.getElementById("video");
  const canvas = document.getElementById("canvas");
  const preview = document.getElementById("preview");

  if (!form || !input || !snapBtn || !video || !canvas || !preview) {
    console.error("❌ Missing element(s)");
    return;
  }

  function dataURLtoBlob(dataURL) {
    const [meta, data] = dataURL.split(",");
    const mime = meta.match(/:(.*?);/)[1];
    const bin = atob(data);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    return new Blob([arr], { type: mime });
  }

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = stream;
      await video.play();
      console.log("📷 Camera started");
    } catch (err) {
      console.error("Camera error:", err);
      alert("Camera access denied.");
    }
  }
  startCamera();

  snapBtn.addEventListener("click", () => {
    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth || 320;
    canvas.height = video.videoHeight || 240;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    preview.src = canvas.toDataURL("image/png");
    preview.style.display = "block";
    video.style.display = "none";
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("➡ Submit selfie (R2 flow)");

    let file;

    // 1️⃣ Determine selfie source
    if (input.files && input.files[0]) {
      file = input.files[0];
      console.log("📁 Using file:", file.name, file.size);
    } else if (preview.src) {
      const blob = dataURLtoBlob(preview.src);
      file = new File([blob], "selfie.png", { type: blob.type });
      console.log("📸 Using snapshot");
    } else {
      alert("No selfie selected or captured.");
      return;
    }

    try {
      // 2️⃣ Presign
      const presignRes = await fetch("/api/upload/presign", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "selfie",
          mimeType: file.type,
        }),
      });

      // if (presignRes.status === 401) {
      //   alert("Session expired. Please log in again.");
      //   window.location.href = "/login";
      //   return;
      // }

      if (!presignRes.ok) {
        const t = await presignRes.text();
        throw new Error("Presign failed: " + t);
      }
      
      const { uploadUrl, key } = await presignRes.json();
      console.log("🔑 R2 key:", key);

      // 3️⃣ Upload to R2
      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!uploadRes.ok) {
        throw new Error("R2 upload failed");
      }

      console.log("☁️ Upload OK");

      // 4️⃣ Save key
      const saveRes = await fetch("/api/upload/selfie", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });

      if (!saveRes.ok) {
        const t = await saveRes.text();
        throw new Error("Save failed: " + t);
      }

      alert("Selfie uploaded successfully");
      window.location.href = "/protect/selfie/success";

    } catch (err) {
      console.error("❌ Selfie upload error:", err);
      alert(err.message);
    }
  });
});
