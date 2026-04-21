// public/js/dashboard.js
// -------------------------
// Dashboard client script
// -------------------------

// Auto year
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

console.log("✅ dashboard.js loaded and running!");

// Read injected user data if present (server-rendered)
const userDataScript = document.getElementById("user-data");
let serverUser = {};
if (userDataScript) {
  try {
    serverUser = JSON.parse(userDataScript.textContent || "{}");
    console.log("👤 User from server:", serverUser);
  } catch (err) {
    console.error("⚠️ Failed to parse user data:", err);
  }
} else {
  console.warn("⚠️ No user-data script found in DOM.");
}

// API base
const API_BASE = window.location.hostname === 'localhost'
  ? 'http://localhost:3000'
  : window.location.origin;

// Helper to refresh access token using HttpOnly refresh token cookie
async function refreshAccessToken() {
  try {
    console.log("📡 Refreshing token:", `${API_BASE}/api/auth/refresh-token`);
    const res = await fetch(`${API_BASE}/api/auth/refresh-token`, {
      method: 'POST',
      credentials: 'include',
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || 'Refresh failed');

    if (data.accessToken) localStorage.setItem('accessToken', data.accessToken);
    return data.accessToken;
  } catch (err) {
    console.error('Refresh failed:', err);
    return null;
  }
}

// Small utility to avoid XSS
function escapeHtml(s) {
  if (!s && s !== 0) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Load dashboard with spinner, retry once after refresh if 401/403
let dashboardLoading = false;
async function loadDashboard() {
  if (dashboardLoading) return;
  dashboardLoading = true;
  console.log("🚀 loadDashboard called");

  const spinner = document.getElementById('loading-spinner');
  const dashboard = document.getElementById('dashboard-content');

  if (!dashboard) {
    console.error('Dashboard container not found (#dashboard-content).');
    return;
  }

  // Defensive spinner
  if (!spinner) {
    console.warn('Spinner element not found (#loading-spinner). Creating fallback.');
    const s = document.createElement('div');
    s.id = 'loading-spinner';
    s.innerHTML = '<div class="spinner" aria-hidden="true"></div><div>Loading your dashboard...</div>';
    dashboard.parentNode.insertBefore(s, dashboard);
  }

  const showSpinner = () => {
    const sp = document.getElementById('loading-spinner');
    if (sp) sp.style.display = 'flex';
    dashboard.style.display = 'none';
  };
  const hideSpinner = () => {
    const sp = document.getElementById('loading-spinner');
    if (sp) sp.style.display = 'none';
    dashboard.style.display = 'block';
  };

  showSpinner();

  // Decide which endpoint to call:
  // - If an accessToken exists in localStorage -> use JWT API (/api/auth/dashboard)
  // - Otherwise use session-protected JSON endpoint -> /api/auth/session
  const accessToken = localStorage.getItem('accessToken') || null;
  const TIMEOUT_MS = 2000;

  try {
    let res;

    //
    // ===========================================
    // 1️⃣  JWT FLOW (Browser has accessToken)
    // ===========================================
    //
    if (accessToken) {
      console.log("📡 Using JWT flow:", `${API_BASE}/api/auth/dashboard`);
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

      res = await fetch(`${API_BASE}/api/auth/dashboard`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${accessToken}` },
        credentials: 'include',
        signal: controller.signal,
      });

      clearTimeout(timeout);

      //
        // JWT expired → attempt refresh
        //
      if (res.status === 401 || res.status === 403) {
        console.warn("🔁 Access token expired, attempting refresh...");
        const newToken = await refreshAccessToken();

        if (!newToken) {
            console.warn("❌ Refresh failed: session fully expired");
            setTimeout(() => window.location.href = "/login", 2000);

            return;
          }

        // retry request with new token
        const controller2 = new AbortController();
        const timeout2 = setTimeout(() => controller2.abort(), TIMEOUT_MS);

        res = await fetch(`${API_BASE}/api/auth/dashboard`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${newToken}` },
          credentials: 'include',
          signal: controller2.signal,
        });

        clearTimeout(timeout2);
      }
    } 
    
    //
    // ===========================================
    // 2️⃣  SESSION FLOW (No accessToken stored)
    // ===========================================
    //
    else {
      console.log(
        "📡 No accessToken found — using session endpoint:", 
        `${API_BASE}/api/auth/session`
      );
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

      res = await fetch(`${API_BASE}/api/auth/session`, {
        method: 'GET',
        credentials: 'include',
        signal: controller.signal,
      });

      clearTimeout(timeout);
    }

    //
    // ===========================================
    // 3️⃣  UNIFIED 401 HANDLER (Auto-logout included)
    // ===========================================
    //
    if (res.status === 401) {
      console.warn("⛔ 401 received — redirecting to login...");
      setTimeout(() => window.location.href = "/login", 2000); // ⬅ THIS IS THE LINE YOU NEEDED
      return;
  }

    //
    // ===========================================
    // 4️⃣  OTHER ERRORS
    // ===========================================
    //
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      const msg = errBody.error || errBody.message || `HTTP ${res.status}`;
      throw new Error(msg);
    }

    //
    // ===========================================
    // 5️⃣  SUCCESS — PARSE DASHBOARD after fetching dashboard data
    // ===========================================
    //

    const data = await res.json();

    console.log("✅ Dashboard data:", data);

  // ⭐ STORE GLOBAL DASHBOARD DATA
    window.dashboardData = data;

  // ⭐ STATUS BADGES GO HERE
  function updateStatusBadges(data) {
    if (!data.verification) return;
  
    const docStatus = document.getElementById('documentStatus');
  
    if (docStatus) {
      docStatus.textContent = data.verification.documentsVerified
          ? 'Verified'
          : 'Pending review';
  
      docStatus.className = data.verification.documentsVerified
          ? 'badge badge-success'
          : 'badge badge-warning';
    }
  }  
 
    
    document.getElementById('viewDocumentsBtn')?.addEventListener('click', async () => {
      const modal = document.getElementById('previewModal');
      modal.classList.remove('hidden');
    
      loadPreview(data.uploads.passport, document.getElementById('passportPreview'));
      loadPreview(data.uploads.idCard, document.getElementById('idCardPreview'));
      loadPreview(data.uploads.license, document.getElementById('licensePreview'));
      loadPreview(data.uploads.selfie, document.getElementById('selfiePreview'));
    });
    

    // //
    // // ===========================================
    // // 5️⃣  SUCCESS — PARSE DASHBOARD DATA
    // // ===========================================
    // //
    // const data = await res.json();
    // console.log("✅ Dashboard data:", data);

    // if (data.uploads) {
    //   loadPreview(data.uploads.passport, document.getElementById("passportPreview"));
    //   loadPreview(data.uploads.idCard, document.getElementById("idCardPreview"));
    //   loadPreview(data.uploads.passport, document.getElementById("licensePreview"));
    //   loadPreview(data.uploads.passport, document.getElementById("selfiePreview"));
    // }
    

    // update DOM
    const userSection = document.getElementById('user-info');
    if (userSection && data.user) {
      userSection.innerHTML = `
        <h2>Hello, ${escapeHtml(data.user.name || '')}</h2>
        <p>Email: ${escapeHtml(data.user.email || '')}</p>
        <p>User ID: ${escapeHtml(String(data.user.id || ''))}</p>
      `;
    } else if (userSection && serverUser && serverUser.name) {
      // fallback to server-rendered user object
      userSection.innerHTML = `<h2>Hello, ${escapeHtml(serverUser.name || '')}</h2><p>Email: ${escapeHtml(serverUser.email || '')}</p>`;
    }

    hideSpinner();
  } catch (err) {
    console.error('❌ Dashboard load error:', err);

    // show helpful error block
    dashboard.innerHTML = `
      <div style="text-align:center; padding:1rem;">
        <p style="color: #f44; font-weight:600;">Failed to load dashboard</p>
        <p style="color:#ddd; margin:0.5rem 0;">${escapeHtml(err.message || 'Unknown error')}</p>
        <p style="margin-top:12px;">
          <a href="/login" style="padding:10px 14px; background:orange; color:#fff; border-radius:6px; text-decoration:none;">Sign in</a>
        </p>
      </div>
    `;

    // ensure spinner hidden and dashboard visible (show error UI)
    const sp = document.getElementById('loading-spinner');
    if (sp) sp.style.display = 'none';
    dashboard.style.display = 'block';

    // if expired, redirect after short delay
    if (/expired|session|log in/i.test((err.message || '').toLowerCase())) {
      setTimeout(() => { window.location.href = '/login'; }, 2000);
    }
  } finally {
    // ensure loading lock released so user can attempt again if desired
    dashboardLoading = false;
  }
}

// ----------------------------------------------------------
// FALLBACK REDIRECT (Fallback login global scope)
// ----------------------------------------------------------
function fallbackRedirect() {
  const path = window.location.pathname;
  const langMatch = path.match(/^\/(ar|en|fr)/);

  const lang = langMatch ? langMatch[1] : 'en';

  window.location.href = `/${lang}/login`;
}
// ----------------------------------------------------------
// MANUAL LOGOUT (logout button)
// ----------------------------------------------------------
async function doLogout() {
  console.log("🚪 Manual logout triggered");

   // STEP 1 — show spinner immediately (same as auto)
  showLogoutSpinner();

    // STEP 2 — allow DOM to repaint (same 100ms as auto!)
  setTimeout(async () => {
     // STEP 3 — backend logout
    try {
      const res = await fetch(`${API_BASE}/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: { Accept: 'application/json' }
      });

      // const data = await res.json();
      let data = {};
      try {
        data = await res.json();
     } catch (e) {
       console.warn("Invalid JSON response");
     }


      // ✅ Always clean tokens
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

        // STEP 4 — keep spinner visible for smooth UX
      setTimeout(() => {
        // ✅ Use backend redirect if available
        if (data?.redirect) {
           // STEP 5 — redirect to login
          window.location.href = data.redirect;
        } else {
          fallbackRedirect(); // safety
        }
      }, 800);

    } catch (err) {
      console.error("Logout error:", err);
      fallbackRedirect(); // ✅ smart fallback
    }
  }, 100);
}

// ----------------------------------------------------------
// AUTO-LOGOUT ON INACTIVITY (15 minutes)
// ----------------------------------------------------------

let inactivityTimer;
const INACTIVITY_LIMIT = 15 * 60 * 1000; // 15 minutes

function showLogoutSpinner() {
  const sp = document.getElementById('loading-spinner');
  const dash = document.getElementById('dashboard-content');

  if (sp) {
    sp.style.display = 'flex';
    sp.querySelector('.spinner')?.classList.add('active');
  }

  if (dash) dash.style.display = 'none';
}

function resetInactivityTimer() {
  clearTimeout(inactivityTimer);

  inactivityTimer = setTimeout(() => {
    console.warn("⏳ User inactive — logging out...");

    // STEP 1 — show spinner
    showLogoutSpinner();

    // STEP 2 — same repaint delay
    setTimeout(async () => {

      // STEP 3 — do backend logout (same function)
      await doLogout();  // no redirect here (redirect is inside doLogout!)

      // IMPORTANT: doLogout already handles redirect

    }, 100);

  }, INACTIVITY_LIMIT);
}

// Reset timer on any user activity
["mousemove", "keydown", "click", "scroll", "touchstart"].forEach(evt => {
  window.addEventListener(evt, resetInactivityTimer);
});

// Start timer on load
resetInactivityTimer();


// DOM ready wiring
document.addEventListener('DOMContentLoaded', () => {
  console.log("📦 DOM ready — calling loadDashboard once");

  // call loadDashboard once
  loadDashboard().catch(err => console.error("Initial load failed:", err));

  // periodic silent refresh of access token (optional)
  setInterval(() => {
    refreshAccessToken().catch(() => {});
  }, 14 * 60 * 1000);

  const logoutBtn = document.querySelector('.btn-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      doLogout();
    });
  }
});


async function loadPreview(imgEl, key) {
  if (!key || !imgEl) return;

  console.log("🖼️ loadPreview called with:", key);


    const res = await fetch(
      `/api/upload/preview?key=${encodeURIComponent(key)}`, { 
        credentials: 'include' 
      });

    if (!res.ok) return;

    const { url } = await res.json();
    imgEl.src = url;
    // imgEl.style.display = 'block';
    imgEl.hidden = false;
}


    
    
    
    
    
    
    
    