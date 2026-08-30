// ==========================================
// CERTIFICATE WEBSITE - SCRIPT.JS
// ==========================================

const LOGIN_USERNAME = "love";
const LOGIN_PASSWORD = "loveyoueveryday";

const $ = (id) => document.getElementById(id);

// ---------- Navbar ----------
const loginNavBtn = $("loginNavBtn");
const userArea = $("userArea");
const userBtn = $("userBtn");
const userMenu = $("userMenu");
const menuUsername = $("menuUsername");
const logoutBtn = $("logoutBtn");

// ---------- Login ----------
const loginModal = $("loginModal");
const closeLoginModal = $("closeLoginModal");
const loginForm = $("loginForm");
const loginError = $("loginError");
const usernameInput = $("username");
const passwordInput = $("password");

// ---------- Loading ----------
const loadingPage = $("loadingPage");

// ---------- Certificate ----------
const certificateGrid = $("certificateGrid");
const detailModal = $("detailModal");
const closeModal = $("closeModal");
const detailImage = $("detailImage");
const detailTitle = $("detailTitle");
const deleteBtn = $("deleteBtn");

// ---------- Add Certificate ----------
const addPage = $("addPage");
const backBtn = $("backBtn");
const certificateForm = $("certificateForm");
const certificateImage = $("certificateImage");
const certificateTitle = $("certificateTitle");
const imagePreview = $("imagePreview");
const uploadText = $("uploadText");

// ==========================================
// STATE
// ==========================================

let certificates = [];
let selectedCertificateIndex = null;
let isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
let currentUser = sessionStorage.getItem("currentUser") || "";

const STORAGE_KEY = "myCertificates";

// ==========================================
// LOAD DATA
// ==========================================

function loadCertificates() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return [];
    }

    const data = JSON.parse(saved);

    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Cannot load certificates:", error);

    return [];
  }
}

function saveCertificates() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(certificates));

    return true;
  } catch (error) {
    console.error("Cannot save certificates:", error);

    alert("ไม่สามารถบันทึกข้อมูลได้");

    return false;
  }
}

certificates = loadCertificates();

// ==========================================
// SMALL HELPERS
// ==========================================

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function lockScroll() {
  document.body.style.overflow = "hidden";
}

function unlockScroll() {
  document.body.style.overflow = "";
}

// ==========================================
// NAVBAR
// ==========================================

function updateNavbar() {
  if (isLoggedIn) {
    loginNavBtn.style.display = "none";

    userArea.classList.add("active");

    userBtn.textContent = currentUser;

    menuUsername.textContent = currentUser;
  } else {
    loginNavBtn.style.display = "";

    userArea.classList.remove("active");

    userMenu.classList.remove("active");
  }
}

// ==========================================
// LOGIN
// ==========================================

function openLogin() {
  loginError.textContent = "";

  usernameInput.value = "";
  passwordInput.value = "";

  loginModal.classList.remove("closing");

  loginModal.classList.add("active");

  lockScroll();

  setTimeout(() => {
    usernameInput.focus();
  }, 350);
}

function closeLogin() {
  loginModal.classList.add("closing");

  setTimeout(() => {
    loginModal.classList.remove("active", "closing");

    unlockScroll();
  }, 350);
}

loginNavBtn.addEventListener("click", openLogin);

closeLoginModal.addEventListener("click", closeLogin);

loginModal.addEventListener("click", (event) => {
  if (event.target === loginModal) {
    closeLogin();
  }
});

// ==========================================
// LOGIN SUBMIT
// ==========================================

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = usernameInput.value.trim();

  const password = passwordInput.value;

  if (username !== LOGIN_USERNAME || password !== LOGIN_PASSWORD) {
    loginError.textContent = "Username หรือ Password ไม่ถูกต้อง";

    loginForm.classList.remove("login-shake");

    void loginForm.offsetWidth;

    loginForm.classList.add("login-shake");

    return;
  }

  // Login สำเร็จ

  isLoggedIn = true;
  currentUser = username;

  sessionStorage.setItem("isLoggedIn", "true");

  sessionStorage.setItem("currentUser", username);

  closeLogin();

  await wait(350);

  // Loading

  loadingPage.classList.remove("closing");

  loadingPage.classList.add("active");

  lockScroll();

  await wait(900);

  loadingPage.classList.add("closing");

  await wait(350);

  loadingPage.classList.remove("active", "closing");

  updateNavbar();

  unlockScroll();
});

// ==========================================
// USER MENU
// ==========================================

userBtn.addEventListener("click", (event) => {
  event.stopPropagation();

  userMenu.classList.toggle("active");
});

document.addEventListener("click", (event) => {
  if (!userMenu.contains(event.target) && event.target !== userBtn) {
    userMenu.classList.remove("active");
  }
});

// ==========================================
// LOGOUT
// ==========================================

logoutBtn.addEventListener("click", () => {
  isLoggedIn = false;
  currentUser = "";

  sessionStorage.removeItem("isLoggedIn");

  sessionStorage.removeItem("currentUser");

  userMenu.classList.remove("active");

  updateNavbar();
});

// ==========================================
// DISPLAY CERTIFICATES
// ==========================================

function displayCertificates() {
  certificateGrid.innerHTML = "";

  certificates.forEach((certificate, index) => {
    const card = document.createElement("div");

    card.className = "certificate-card";

    card.innerHTML = `

                <img
                    src="${certificate.image}"
                    alt="${certificate.title}"
                >

                <div class="card-info">

                    <h3>
                        ${certificate.title}
                    </h3>

                </div>

            `;

    card.addEventListener("click", () => {
      openDetail(index);
    });

    certificateGrid.appendChild(card);
  });

  // Add Certificate

  const addCard = document.createElement("div");

  addCard.className = "add-card";

  addCard.innerHTML = `

        <div class="plus">
            ＋
        </div>

        <p>
            เพิ่ม Certificate
        </p>

    `;

  addCard.addEventListener("click", () => {
    if (!isLoggedIn) {
      openLogin();

      return;
    }

    openAddPage();
  });

  certificateGrid.appendChild(addCard);
}

// ==========================================
// DETAIL MODAL
// ==========================================

function openDetail(index) {
  const certificate = certificates[index];

  if (!certificate) {
    return;
  }

  selectedCertificateIndex = index;

  detailImage.src = certificate.image;

  detailTitle.textContent = certificate.title;

  detailModal.classList.remove("closing");

  detailModal.classList.add("active");

  lockScroll();
}

function closeDetail() {
  detailModal.classList.add("closing");

  setTimeout(() => {
    detailModal.classList.remove("active", "closing");

    detailImage.src = "";

    selectedCertificateIndex = null;

    unlockScroll();
  }, 350);
}

closeModal.addEventListener("click", closeDetail);

detailModal.addEventListener("click", (event) => {
  if (event.target === detailModal) {
    closeDetail();
  }
});

// ==========================================
// DELETE
// ==========================================

deleteBtn.addEventListener("click", async () => {
  if (!isLoggedIn) {
    openLogin();

    return;
  }

  if (selectedCertificateIndex === null) {
    return;
  }

  const certificate = certificates[selectedCertificateIndex];

  if (!certificate) {
    return;
  }

  const confirmed = confirm(`ต้องการลบ "${certificate.title}" หรือไม่?`);

  if (!confirmed) {
    return;
  }

  const index = selectedCertificateIndex;

  const cards = certificateGrid.querySelectorAll(".certificate-card");

  if (cards[index]) {
    cards[index].style.opacity = "0";

    cards[index].style.transform = "scale(.94) translateY(10px)";
  }

  await wait(300);

  certificates.splice(index, 1);

  if (!saveCertificates()) {
    return;
  }

  closeDetail();

  await wait(350);

  displayCertificates();
});

// ==========================================
// ADD CERTIFICATE PAGE
// ==========================================

function openAddPage() {
  if (!isLoggedIn) {
    openLogin();

    return;
  }

  userMenu.classList.remove("active");

  addPage.classList.remove("closing");

  addPage.classList.add("active");

  lockScroll();

  setTimeout(() => {
    addPage.scrollTop = 0;
  }, 50);
}

function closeAddPage() {
  addPage.classList.add("closing");

  setTimeout(() => {
    addPage.classList.remove("active", "closing");

    unlockScroll();

    resetForm();
  }, 400);
}

backBtn.addEventListener("click", closeAddPage);

// ==========================================
// RESET FORM
// ==========================================

function resetForm() {
  certificateForm.reset();

  imagePreview.src = "";

  imagePreview.style.display = "none";

  uploadText.style.display = "flex";
}

// ==========================================
// IMAGE PREVIEW
// ==========================================

certificateImage.addEventListener("change", (event) => {
  const file = event.target.files[0];

  if (!file) {
    return;
  }

  if (!file.type.startsWith("image/")) {
    alert("กรุณาเลือกไฟล์รูปภาพ");

    certificateImage.value = "";

    return;
  }

  const reader = new FileReader();

  reader.onload = (event) => {
    imagePreview.src = event.target.result;

    imagePreview.style.display = "block";

    uploadText.style.display = "none";
  };

  reader.readAsDataURL(file);
});

// ==========================================
// SAVE NEW CERTIFICATE
// ==========================================

certificateForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!isLoggedIn) {
    openLogin();

    return;
  }

  const title = certificateTitle.value.trim();

  const file = certificateImage.files[0];

  if (!file) {
    alert("กรุณาเลือกรูป Certificate");

    return;
  }

  if (!title) {
    alert("กรุณาใส่ชื่อ Certificate");

    certificateTitle.focus();

    return;
  }

  const reader = new FileReader();

  reader.onload = (event) => {
    certificates.push({
      id: Date.now(),

      title: title,

      image: event.target.result,
    });

    if (!saveCertificates()) {
      certificates.pop();

      return;
    }

    displayCertificates();

    closeAddPage();
  };

  reader.readAsDataURL(file);
});

// ==========================================
// ESC KEY
// ==========================================

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") {
    return;
  }

  if (userMenu.classList.contains("active")) {
    userMenu.classList.remove("active");

    return;
  }

  if (detailModal.classList.contains("active")) {
    closeDetail();

    return;
  }

  if (loginModal.classList.contains("active")) {
    closeLogin();

    return;
  }

  if (addPage.classList.contains("active")) {
    closeAddPage();
  }
});

// ==========================================
// INITIALIZE
// ==========================================

updateNavbar();

displayCertificates();

unlockScroll();
