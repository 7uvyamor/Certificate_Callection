// ==========================================
// Certificate Collection
// ==========================================

const STORAGE_KEY = "myCertificates";


// ==========================================
// Elements
// ==========================================

const certificateGrid =
    document.getElementById("certificateGrid");

const detailModal =
    document.getElementById("detailModal");

const closeModal =
    document.getElementById("closeModal");

const detailImage =
    document.getElementById("detailImage");

const detailTitle =
    document.getElementById("detailTitle");

const deleteBtn =
    document.getElementById("deleteBtn");

const addPage =
    document.getElementById("addPage");

const certificateForm =
    document.getElementById("certificateForm");

const certificateImage =
    document.getElementById("certificateImage");

const imagePreview =
    document.getElementById("imagePreview");

const uploadText =
    document.getElementById("uploadText");

const homeBtn =
    document.getElementById("homeBtn");

const backBtn =
    document.getElementById("backBtn");


// ==========================================
// Load Data
// ==========================================

let certificates =
    JSON.parse(
        localStorage.getItem(STORAGE_KEY)
    ) || [];


// เก็บ index ของ Certificate
// ที่กำลังเปิดอยู่ใน Popup

let selectedCertificateIndex = null;


// ==========================================
// Display Certificates
// ==========================================

function displayCertificates() {

    certificateGrid.innerHTML = "";


    // สร้าง Certificate Card

    certificates.forEach(
        (certificate, index) => {

            const card =
                document.createElement("div");

            card.className =
                "certificate-card";


            card.innerHTML = `

                <img
                    src="${certificate.image}"
                    alt="Certificate">

                <div class="card-info">

                    <h3>
                        ${escapeHTML(
                            certificate.title
                        )}
                    </h3>

                </div>

            `;


            // กด Card

            card.addEventListener(
                "click",
                () => {

                    openDetail(index);

                }
            );


            certificateGrid.appendChild(card);

        }
    );


    // ======================================
    // Add Certificate Card
    // ======================================

    const addCard =
        document.createElement("div");

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
        openAddPage
    );


    certificateGrid.appendChild(addCard);
}


// ==========================================
// Open Detail
// ==========================================

function openDetail(index) {

    const certificate =
        certificates[index];


    // จำว่าเปิด Certificate อันไหน

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
// Close Detail
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


// ==========================================
// Click Outside Popup
// ==========================================

detailModal.addEventListener(
    "click",
    (event) => {

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
    () => {

        // ป้องกันกรณีไม่มี Certificate
        if (
            selectedCertificateIndex === null
        ) {
            return;
        }


        const certificate =
            certificates[
                selectedCertificateIndex
            ];


        // ยืนยันก่อนลบ

        const confirmDelete =
            confirm(
                `ต้องการลบ "${certificate.title}" หรือไม่?`
            );


        if (!confirmDelete) {
            return;
        }


        // ลบข้อมูล

        certificates.splice(
            selectedCertificateIndex,
            1
        );


        // บันทึกกลับ LocalStorage

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(certificates)
        );


        // ปิด Popup

        closeDetail();


        // แสดงข้อมูลใหม่

        displayCertificates();

    }
);


// ==========================================
// Open Add Page
// ==========================================

function openAddPage() {

    document.querySelector(
        ".container"
    ).style.display = "none";


    addPage.classList.add(
        "active"
    );


    window.scrollTo(
        0,
        0
    );
}


// ==========================================
// Close Add Page
// ==========================================

function closeAddPage() {

    addPage.classList.remove(
        "active"
    );


    document.querySelector(
        ".container"
    ).style.display = "block";


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


homeBtn.addEventListener(
    "click",
    closeAddPage
);


// ==========================================
// Image Preview
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


        reader.readAsDataURL(file);

    }
);


// ==========================================
// Save Certificate
// ==========================================

certificateForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const title =
            document.getElementById(
                "certificateTitle"
            ).value.trim();


        const file =
            certificateImage.files[0];


        if (!file) {

            alert(
                "กรุณาเลือกรูป Certificate"
            );

            return;
        }


        // อ่านรูป

        const reader =
            new FileReader();


        reader.onload =
            function (event) {


                const newCertificate = {

                    id: Date.now(),

                    title: title,

                    image:
                        event.target.result

                };


                // เพิ่มข้อมูล

                certificates.push(
                    newCertificate
                );


                // Save LocalStorage

                localStorage.setItem(
                    STORAGE_KEY,
                    JSON.stringify(
                        certificates
                    )
                );


                alert(
                    "เพิ่ม Certificate เรียบร้อยแล้ว!"
                );


                // อัปเดตหน้า

                displayCertificates();


                // กลับหน้าหลัก

                closeAddPage();

            };


        reader.readAsDataURL(file);

    }
);


// ==========================================
// Escape HTML
// ==========================================

function escapeHTML(text) {

    const div =
        document.createElement("div");


    div.textContent =
        text;


    return div.innerHTML;
}


// ==========================================
// Start
// ==========================================

displayCertificates();

