// public/js/admin-reviews.js
console.log("👮 Admin reviews JS loaded");

let decisionInProgress = false;   // >> To prevent multiple clicks while processing

/* =================================================
   TOAST SYSTEM
================================================= */
const toast = document.getElementById("adminToast");

function showToast(message, type = "success") {
  if (!toast) return;

  toast.textContent = message;
  toast.className = `admin-toast ${type}`;

  setTimeout(() => {
    toast.classList.add("hidden");
  }, 2500);
}

/* =================================================
   MODAL + PREVIEW ELEMENTS
================================================= */
const modal = document.getElementById("adminPreviewModal");
const closeBtn = document.getElementById("adminClosePreview");

const previewEls = {
  passport: document.getElementById("adminPassportPreview"),
  idCard: document.getElementById("adminIdCardPreview"),
  license: document.getElementById("adminLicensePreview"),
  selfie: document.getElementById("adminSelfiePreview"),
};

function resetPreviewImages() {
  Object.values(previewEls).forEach(img => {
    if (!img) return;
    img.hidden = true;
    img.src = "";
  });
}

closeBtn?.addEventListener("click", () => {
  modal?.classList.add("hidden");
  resetPreviewImages();
});

/* =================================================
   MAIN CARD LOOP
================================================= */
document.querySelectorAll(".review-card").forEach(card => {

  const userId = card.dataset.user;

  const viewBtn = card.querySelector(".viewDocsBtn");
  const approveBtn = card.querySelector(".approveBtn");
  const rejectBtn = card.querySelector(".rejectBtn");

  /* =============================================
     VIEW DOCUMENTS
  ============================================= */
  viewBtn?.addEventListener("click", async () => {
    try {

      modal?.classList.remove("hidden");

      const res = await fetch(`/admin/preview/${userId}`, {
        credentials: "include",
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();

      if (data.passportUrl) {
        previewEls.passport.src = data.passportUrl;
        previewEls.passport.hidden = false;
      }

      if (data.idCardUrl) {
        previewEls.idCard.src = data.idCardUrl;
        previewEls.idCard.hidden = false;
      }

      if (data.licenseUrl) {
        previewEls.license.src = data.licenseUrl;
        previewEls.license.hidden = false;
      }

      if (data.selfieUrl) {
        previewEls.selfie.src = data.selfieUrl;
        previewEls.selfie.hidden = false;
      }

    } catch (err) {
      console.error(err);
      showToast("Preview load failed", "error");
      modal?.classList.add("hidden");
    }
  });

  /* =============================================
     APPROVE
  ============================================= */
  approveBtn?.addEventListener("click", async () => {

    if (decisionInProgress) return;
    if (!confirm("Approve documents?")) return;
  
    decisionInProgress = true;
  
    try {
      approveBtn.disabled = true;
      rejectBtn.disabled = true;
  
      const res = await fetch(
        `/admin/documents/${userId}/approve`,
        { method: "POST", credentials: "include" }
      );
  
      if (!res.ok) throw new Error("Approve failed");
  
      showToast("Verification approved ✓", "success");
  
      card.classList.add("fade-out");
      setTimeout(() => card.remove(), 400);
  
    } catch (err) {
      console.error(err);
      showToast("Approve failed", "error");
  
      decisionInProgress = false;
      approveBtn.disabled = false;
      rejectBtn.disabled = false;
    }
  });

  // approveBtn?.addEventListener("click", async () => {

  //   if (!confirm("Approve documents?")) return;

  //   try {
  //     approveBtn.disabled = true;
  //     rejectBtn.disabled = true;

  //     const res = await fetch(
  //       `/admin/documents/${userId}/approve`,
  //       { method: "POST", credentials: "include" }
  //     );

  //     if (!res.ok) throw new Error("Approve failed");

  //     /* ---- Update Badge ---- */        // Badge removed completly This is optional since we're removing the card, but it gives instant feedback if the admin wants to keep reviewing before the card disappears
  //     const badges = card.querySelectorAll(".badge");

  //     badges.forEach(b => {
  //       if (b.textContent.includes("Documents")) {
  //         b.textContent = "Documents: Verified";
  //         b.classList.remove("pending");
  //         b.classList.add("ok");
  //       }
  //     });

  //     /* ---- UX Polish ---- */
  //     showToast("Documents approved ✓", "success");

  //     modal?.classList.add("hidden");
  //     resetPreviewImages();

  //     /* ---- Optional: remove card smoothly ---- */
  //     card.classList.add("fade-out");
  //     setTimeout(() => card.remove(), 400);

  //   } catch (err) {
  //     console.error(err);
  //     showToast("Approve failed", "error");
  //     approveBtn.disabled = false;
  //     rejectBtn.disabled = false;
  //   }
  // });



  /* =============================================
     REJECT
  ============================================= */
  rejectBtn?.addEventListener("click", async () => {

    if (decisionInProgress) return;
    if (!confirm("Reject documents?")) return;
  
    decisionInProgress = true;
  
    try {
      approveBtn.disabled = true;
      rejectBtn.disabled = true;
  
      const res = await fetch(
        `/admin/documents/${userId}/reject`,
        { method: "POST", credentials: "include" }
      );
  
      if (!res.ok) throw new Error("Reject failed");
  
      showToast("Verification rejected ✗", "error");
  
      card.classList.add("fade-out");
      setTimeout(() => card.remove(), 400);
  
    } catch (err) {
      console.error(err);
      showToast("Reject failed", "error");
  
      decisionInProgress = false;
      approveBtn.disabled = false;
      rejectBtn.disabled = false;
    }
  });

//   rejectBtn?.addEventListener("click", async () => {

//     if (!confirm("Reject documents?")) return;

//     try {
//       approveBtn.disabled = true;
//       rejectBtn.disabled = true;

//       const res = await fetch(
//         `/admin/documents/${userId}/reject`,
//         { method: "POST", credentials: "include" }
//       );

//       if (!res.ok) throw new Error("Reject failed");

//       /* ---- Update Badge ---- */   // Remove badge manipulation if you want to remove the card immediately, but it gives instant feedback if the admin wants to keep reviewing before the card disappears
//       const badges = card.querySelectorAll(".badge");

//       badges.forEach(b => {
//         if (b.textContent.includes("Documents")) {
//           b.textContent = "Documents: Pending";
//           b.classList.remove("ok");
//           b.classList.add("pending");
//         }
//       });

//       showToast("Documents rejected ✗", "error");

//       modal?.classList.add("hidden");
//       resetPreviewImages();

//     } catch (err) {
//       console.error(err);
//       showToast("Reject failed", "error");
//       approveBtn.disabled = false;
//       rejectBtn.disabled = false;
//     }
//   });

// });














// // // public/js/admin-reviews.js
// console.log("👮 Admin reviews JS loaded");


// const toast = document.getElementById("adminToast");

// function showToast(message, type = "success") {
//   if (!toast) return;

//   toast.textContent = message;
//   toast.className = `admin-toast ${type}`;

//   setTimeout(() => {
//     toast.classList.add("hidden");
//   }, 2500);
// }



// const modal = document.getElementById("adminPreviewModal");
// const closeBtn = document.getElementById("adminClosePreview");

// const previewEls = {
//   passport: document.getElementById("adminPassportPreview"),
//   idCard: document.getElementById("adminIdCardPreview"),
//   license: document.getElementById("adminLicensePreview"),
//   selfie: document.getElementById("adminSelfiePreview"),
// };

// closeBtn?.addEventListener("click", () => {
//   modal.classList.add("hidden");

//   Object.values(previewEls).forEach(img => {
//     img.hidden = true;
//     img.src = "";
//   });
// });

// document.querySelectorAll(".review-card").forEach(card => {
//   const userId = card.dataset.user;

//   const viewBtn = card.querySelector(".viewDocsBtn");
//   const approveBtn = card.querySelector(".approveBtn");
//   const rejectBtn = card.querySelector(".rejectBtn");

//   // 🔥 NEW PREVIEW FLOW
//   viewBtn?.addEventListener("click", async () => {

//     console.log("USER ID:", userId);   // ???

//     try {
//       modal.classList.remove("hidden");

//       const res = await fetch(`/admin/preview/${userId}`, {
//         credentials: "include",
//       });

//       if (!res.ok) throw new Error(`HTTP ${res.status}`);

//       const data = await res.json();

//       if (data.passportUrl) {
//         previewEls.passport.src = data.passportUrl;
//         previewEls.passport.hidden = false;
//       }

//       if (data.idCardUrl) {
//         previewEls.idCard.src = data.idCardUrl;
//         previewEls.idCard.hidden = false;
//       }

//       if (data.licenseUrl) {
//         previewEls.license.src = data.licenseUrl;
//         previewEls.license.hidden = false;
//       }

//       if (data.selfieUrl) {
//         previewEls.selfie.src = data.selfieUrl;
//         previewEls.selfie.hidden = false;
//       }

//     } catch (err) {
//       console.error(err);
//       alert("Preview load failed");
//     }
//   });

//   // APPROVE
//   approveBtn?.addEventListener("click", async () => {
//     if (!confirm("Approve documents?")) return;
  
//     try {
//       approveBtn.disabled = true;
//       rejectBtn.disabled = true;
  
//       const res = await fetch(
//         `/admin/documents/${userId}/approve`,
//         { method: "POST", credentials: "include" }
//       );
  
//       if (!res.ok) throw new Error("Approve failed");
  
//       // 🔥 Update badge UI instantly
//       const docBadge = card.querySelector(".badge:nth-child(1)");
//       if (docBadge) {
//         docBadge.textContent = "Documents: Verified";
//         docBadge.classList.remove("pending");
//         docBadge.classList.add("ok");
//       }
  
//       alert("✅ Documents approved"); 

//       // modal.classList.add("hidden");   // Close preview on approval
  
//     } catch (err) {
//       console.error(err);
//       alert("Approve failed");
//       approveBtn.disabled = false;
//       rejectBtn.disabled = false;
//     }
//   });
  

//   // REJECT
//   rejectBtn?.addEventListener("click", async () => {
//     if (!confirm("Reject documents?")) return;
  
//     try {
//       approveBtn.disabled = true;
//       rejectBtn.disabled = true;
  
//       const res = await fetch(
//         `/admin/documents/${userId}/reject`,
//         { method: "POST", credentials: "include" }
//       );
  
//       if (!res.ok) throw new Error("Reject failed");
  
//       const docBadge = card.querySelector(".badge:nth-child(1)");
//       if (docBadge) {
//         docBadge.textContent = "Documents: Pending";
//         docBadge.classList.remove("ok");
//         docBadge.classList.add("pending");
//       }
  
//       alert("❌ Documents rejected");
  
//     } catch (err) {
//       console.error(err);
//       alert("Reject failed");
//       approveBtn.disabled = false;
//       rejectBtn.disabled = false;
//     }
//   }); 
// }); 





//   // setInterval(async () => {
//   //   try {
//   //     document.querySelectorAll(".review-card").forEach(async card => {
//   //       const userId = card.dataset.user;
  
//   //       const res = await fetch(`/admin/reviews/data/${userId}`, {
//   //         credentials: "include"
//   //       });
  
//   //       if (!res.ok) return;
  
//   //       const data = await res.json();
  
//   //       const docBadge = card.querySelector(".badge:nth-child(1)");
//   //       if (docBadge) {
//   //         if (data.passportKey || data.idCardKey || data.licenseKey) {
//   //           docBadge.textContent = "Documents: Uploaded";
//   //         }
//   //       }
  
//   //     });
//   //   } catch {}
//   // }, 15000); // every 15 sec
  




