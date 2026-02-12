document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("document-form");
  if (!form) return;

  // 🔍 Preview helper (PRIVATE R2 via backend)
  async function preview(key, imgEl) {
    const res = await fetch(
      `/api/upload/preview?key=${encodeURIComponent(key)}`,
      { credentials: "include" }
    );

    if (!res.ok) throw new Error("Preview failed");
    
    const { url } = await res.json();
    imgEl.src = url;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const accessToken = localStorage.getItem("accessToken");
    const formData = new FormData(form);

    // 1️⃣ Guard: at least one document
    const hasAnyFile =
      formData.get("passport_file")?.size ||
      formData.get("id_card_file")?.size ||
      formData.get("license_file")?.size;

    if (!hasAnyFile) {
      alert("No documents selected");
      return;
    }

    const keys = {};

    // 2️⃣ Upload ONE document to R2
    async function uploadOne(file, subtype) {
      const presignRes = await fetch("/api/upload/presign", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({
          type: "document",
          subtype,              // passport | id_card | license
          mimeType: file.type,
        }),
      });

      if (!presignRes.ok) {
        const t = await presignRes.text();
        throw new Error("Presign failed: " + t);
      }

      const { uploadUrl, key } = await presignRes.json();

      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!uploadRes.ok) {
        throw new Error("R2 upload failed");
      }

      return key;
    }

    try {
      // 3️⃣ Upload selected documents
      if (formData.get("passport_file")?.size) {
        keys.passportKey = await uploadOne(
          formData.get("passport_file"),
          "passport"
        );
      }

      if (formData.get("id_card_file")?.size) {
        keys.idCardKey = await uploadOne(
          formData.get("id_card_file"),
          "id_card"
        );
      }

      if (formData.get("license_file")?.size) {
        keys.licenseKey = await uploadOne(
          formData.get("license_file"),
          "license"
        );
      }

      // 4️⃣ Save keys to backend DB
      const res = await fetch("/protect/upload/document", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify(keys),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(json?.error || "Failed to save documents");
      }

      // 5️⃣ OPTIONAL: Preview uploaded documents (SAFE await)
      if (keys.passportKey) {
        const img = document.getElementById("passportPreview");
        if (img) {
          img.style.display = "block";
          await preview(keys.passportKey, img);
        }
      }

      if (keys.idCardKey) {
        const img = document.getElementById("idCardPreview");
        if (img) {
          img.style.display = "block";
          await preview(keys.idCardKey, img);
        }
      }

      if (keys.licenseKey) {
        const img = document.getElementById("licensePreview");
        if (img) {
          img.style.display = "block";
          await preview(keys.licenseKey, img);
        }
      }

      // 6️⃣ Continue flow
      window.location.href = "/protect/upload/selfie";

    } catch (err) {
      console.error("❌ Document upload error:", err);
      alert(err.message || "Upload failed");
    }
  });
});