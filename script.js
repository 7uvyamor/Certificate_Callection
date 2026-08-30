// ==========================================
// LOGIN ACCOUNT
// ==========================================

const LOGIN_USERNAME = "love";

const LOGIN_PASSWORD = "loveyoueveryday";


// ==========================================
// ELEMENTS
// ==========================================

// Navigation

const loginNavBtn =
    document.getElementById(
        "loginNavBtn"
    );

const userArea =
    document.getElementById(
        "userArea"
    );

const userBtn =
    document.getElementById(
        "userBtn"
    );

const userMenu =
    document.getElementById(
        "userMenu"
    );

const menuUsername =
    document.getElementById(
        "menuUsername"
    );

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );


// Login

const loginModal =
    document.getElementById(
        "loginModal"
    );

const closeLoginModal =
    document.getElementById(
        "closeLoginModal"
    );

const loginForm =
    document.getElementById(
        "loginForm"
    );

const loginError =
    document.getElementById(
        "loginError"
    );


// Loading

const loadingPage =
    document.getElementById(
        "loadingPage"
    );


// Certificate

const certificateGrid =
    document.getElementById(
        "certificateGrid"
    );

const detailModal =
    document.getElementById(
        "detailModal"
    );

const closeModal =
    document.getElementById(
        "closeModal"
    );

const detailImage =
    document.getElementById(
        "detailImage"
    );

const detailTitle =
    document.getElementById(
        "detailTitle"
    );

const deleteBtn =
    document.getElementById(
        "deleteBtn"
    );


// Add page

const addPage =
    document.getElementById(
        "addPage"
    );

const backBtn =
    document.getElementById(
        "backBtn"
    );

const certificateForm =
    document.getElementById(
        "certificateForm"
    );

const certificateImage =
    document.getElementById(
        "certificateImage"
    );

const certificateTitle =
    document.getElementById(
        "certificateTitle"
    );

const imagePreview =
    document.getElementById(
        "imagePreview"
    );

const uploadText =
    document.getElementById(
        "uploadText"
    );


// ==========================================
// STORAGE
// ==========================================

const STORAGE_KEY =
    "myCertificates";


// ==========================================
// CERTIFICATE DATA
// ==========================================

let certificates =
    JSON.parse(
        localStorage.getItem(
            STORAGE_KEY
        )
    ) || [];


let selectedCertificateIndex =
    null;


// ==========================================
// LOGIN STATE
// ==========================================

let isLoggedIn =
    sessionStorage.getItem(
        "isLoggedIn"
    ) === "true";


let currentUser =
    sessionStorage.getItem(
        "currentUser"
    ) || "";


// ==========================================
// UPDATE NAVBAR
// ==========================================

function updateNavbar() {

    if (isLoggedIn) {

        // ซ่อน Login

        loginNavBtn.style.display =
            "none";


        // แสดง User

        userArea.classList.add(
            "active"
        );


        // แสดงชื่อ

        userBtn.textContent =
            currentUser;


        menuUsername.textContent =
            currentUser;

    }

    else {

        // แสดง Login

        loginNavBtn.style.display =
            "block";


        // ซ่อน User

        userArea.classList.remove(
            "active"
        );


        userMenu.classList.remove(
            "active"
        );

    }

}


// ==========================================
// OPEN LOGIN
// ==========================================

function openLogin() {

    loginModal.classList.add(
        "active"
    );


    loginError.textContent = "";


    document.getElementById(
        "username"
    ).value = "";


    document.getElementById(
        "password"
    ).value = "";


    setTimeout(
        function () {

            document.getElementById(
                "username"
            ).focus();

        },
        100
    );

}


// ==========================================
// CLOSE LOGIN
// ==========================================

function closeLogin() {

    loginModal.classList.remove(
        "active"
    );

}


// ==========================================
// NAV LOGIN BUTTON
// ==========================================

loginNavBtn.addEventListener(
    "click",
    function () {

        openLogin();

    }
);


// ==========================================
// CLOSE LOGIN
// ==========================================

closeLoginModal.addEventListener(
    "click",
    function () {

        closeLogin();

    }
);


// คลิกด้านนอก Login

loginModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target === loginModal
        ) {

            closeLogin();

        }

    }
);


// ==========================================
// LOGIN
// ==========================================

loginForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const username =
            document.getElementById(
                "username"
            ).value.trim();


        const password =
            document.getElementById(
                "password"
            ).value;


        // ตรวจสอบ

        if (
            username === LOGIN_USERNAME &&
            password === LOGIN_PASSWORD
        ) {

            isLoggedIn = true;

            currentUser =
                username;


            sessionStorage.setItem(
                "isLoggedIn",
                "true"
            );


            sessionStorage.setItem(
                "currentUser",
                username
            );


            // ปิด Login

            closeLogin();


            // แสดง Loading

            loadingPage.classList.add(
                "active"
            );


            // รอ 1.2 วินาที

            setTimeout(
                function () {

                    loadingPage.classList.remove(
                        "active"
                    );


                    updateNavbar();


                    // ถ้ามาจากการกดลบ
                    // จะกลับไป Certificate เดิม

                    if (
                        selectedCertificateIndex !== null
                    ) {

                        openDetail(
                            selectedCertificateIndex
                        );

                    }

                },
                1200
            );

        }

        else {

            loginError.textContent =
                "Username หรือ Password ไม่ถูกต้อง";

        }

    }
);


// ==========================================
// USER MENU
// ==========================================

userBtn.addEventListener(
    "click",
    function (event) {

        event.stopPropagation();


        userMenu.classList.toggle(
            "active"
        );

    }
);


// คลิกพื้นที่อื่น

document.addEventListener(
    "click",
    function (event) {

        if (
            !userMenu.contains(
                event.target
            ) &&
            event.target !== userBtn
        ) {

            userMenu.classList.remove(
                "active"
            );

        }

    }
);


// ==========================================
// LOGOUT
// ==========================================

logoutBtn.addEventListener(
    "click",
    function () {

        isLoggedIn = false;

        currentUser = "";


        sessionStorage.removeItem(
            "isLoggedIn"
        );


        sessionStorage.removeItem(
            "currentUser"
        );


        userMenu.classList.remove(
            "active"
        );


        updateNavbar();

    }
);


// ==========================================
// DISPLAY CERTIFICATES
// ==========================================

function displayCertificates() {

    certificateGrid.innerHTML = "";


    certificates.forEach(
        function (
            certificate,
            index
        ) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "certificate-card";


            card.innerHTML = `

                <img
                    src="${certificate.image}"
                    alt="Certificate"
                >

                <div class="card-info">

                    <h3>
                        ${escapeHTML(
                            certificate.title
                        )}
                    </h3>

                </div>

            `;


            card.addEventListener(
                "click",
                function () {

                    openDetail(index);

                }
            );


            certificateGrid.appendChild(
                card
            );

        }
    );


    // ======================================
    // ADD CARD
    // ======================================

    const addCard =
        document.createElement(
            "div"
        );


    addCard.className =
        "add-card";


    addCard.innerHTML = `

        <div class="plus">
            ＋
        </div>

        <p>
            เพิ่ม Certificate
        </p>

    `;


    addCard.addEventListener(
        "click",
        function () {

            // การเพิ่มก็ให้เฉพาะ
            // คนที่ Login แล้ว

            if (!isLoggedIn) {

                openLogin();

                return;

            }


            openAddPage();

        }
    );


    certificateGrid.appendChild(
        addCard
    );

}


// ==========================================
// OPEN DETAIL
// ==========================================

function openDetail(index) {

    const certificate =
        certificates[index];


    if (!certificate) {

        return;

    }


    selectedCertificateIndex =
        index;


    detailImage.src =
        certificate.image;


    detailTitle.textContent =
        certificate.title;


    detailModal.classList.add(
        "active"
    );


    document.body.style.overflow =
        "hidden";

}


// ==========================================
// CLOSE DETAIL
// ==========================================

function closeDetail() {

    detailModal.classList.remove(
        "active"
    );


    document.body.style.overflow =
        "";


    selectedCertificateIndex =
        null;

}


closeModal.addEventListener(
    "click",
    closeDetail
);


// คลิกด้านนอก

detailModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target === detailModal
        ) {

            closeDetail();

        }

    }
);


// ==========================================
// DELETE CERTIFICATE
// ==========================================

deleteBtn.addEventListener(
    "click",
    function () {

        // ==============================
        // ถ้ายังไม่ Login
        // ==============================

        if (!isLoggedIn) {

            // เปิด Login
            // โดยยังจำ Certificate
            // ที่ต้องการลบไว้

            openLogin();

            return;

        }


        // ==============================
        // Login แล้ว
        // ==============================

        if (
            selectedCertificateIndex === null
        ) {

            return;

        }


        const certificate =
            certificates[
                selectedCertificateIndex
            ];


        if (!certificate) {

            return;

        }


        const confirmDelete =
            confirm(
                `ต้องการลบ "${certificate.title}" หรือไม่?`
            );


        if (!confirmDelete) {

            return;

        }


        // ลบ

        certificates.splice(
            selectedCertificateIndex,
            1
        );


        // บันทึก

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(
                certificates
            )
        );


        // ปิด Popup

        closeDetail();


        // แสดงใหม่

        displayCertificates();

    }
);


// ==========================================
// OPEN ADD PAGE
// ==========================================

function openAddPage() {

    if (!isLoggedIn) {

        openLogin();

        return;

    }


    addPage.classList.add(
        "active"
    );


    window.scrollTo(
        0,
        0
    );

}


// ==========================================
// CLOSE ADD PAGE
// ==========================================

function closeAddPage() {

    addPage.classList.remove(
        "active"
    );


    certificateForm.reset();


    imagePreview.src = "";


    imagePreview.style.display =
        "none";


    uploadText.style.display =
        "flex";


    window.scrollTo(
        0,
        0
    );

}


backBtn.addEventListener(
    "click",
    closeAddPage
);


// ==========================================
// IMAGE PREVIEW
// ==========================================

certificateImage.addEventListener(
    "change",
    function () {

        const file =
            this.files[0];


        if (!file) {

            return;

        }


        // ตรวจว่าเป็นรูป

        if (
            !file.type.startsWith(
                "image/"
            )
        ) {

            alert(
                "กรุณาเลือกไฟล์รูปภาพ"
            );


            this.value = "";

            return;

        }


        const reader =
            new FileReader();


        reader.onload =
            function (event) {

                imagePreview.src =
                    event.target.result;


                imagePreview.style.display =
                    "block";


                uploadText.style.display =
                    "none";

            };


        reader.readAsDataURL(
            file
        );

    }
);


// ==========================================
// SAVE CERTIFICATE
// ==========================================

certificateForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        // ต้อง Login

        if (!isLoggedIn) {

            openLogin();

            return;

        }


        const title =
            certificateTitle.value.trim();


        const file =
            certificateImage.files[0];


        if (!file) {

            alert(
                "กรุณาเลือกรูป Certificate"
            );

            return;

        }


        if (!title) {

            alert(
                "กรุณาใส่ชื่อ Certificate"
            );

            return;

        }


        const reader =
            new FileReader();


        reader.onload =
            function (event) {

                const newCertificate = {

                    id:
                        Date.now(),

                    title:
                        title,

                    image:
                        event.target.result

                };


                certificates.push(
                    newCertificate
                );


                localStorage.setItem(
                    STORAGE_KEY,
                    JSON.stringify(
                        certificates
                    )
                );


                displayCertificates();


                closeAddPage();


                alert(
                    "เพิ่ม Certificate เรียบร้อยแล้ว!"
                );

            };


        reader.readAsDataURL(
            file
        );

    }
);


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text;


    return div.innerHTML;

}


// ==========================================
// INITIALIZE
// ==========================================

updateNavbar();

displayCertificates();  