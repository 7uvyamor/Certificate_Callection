// ==========================================
// Certificate Collection
// ==========================================

const STORAGE_KEY = "myCertificates";


// ==========================================
// ELEMENTS
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
// LOAD DATA
// ==========================================

let certificates =
    JSON.parse(
        localStorage.getItem(STORAGE_KEY)
    ) || [];


// Certificate ที่กำลังเปิดอยู่

let selectedCertificateIndex = null;


// ==========================================
// DISPLAY CERTIFICATES
// ==========================================

function displayCertificates() {

    certificateGrid.innerHTML = "";


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
    // ADD CARD
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
// OPEN DETAIL
// ==========================================

function openDetail(index) {

    const certificate =
        certificates[index];


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


// ==========================================
// CLICK OUTSIDE POPUP
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

        if (
            selectedCertificateIndex === null
        ) {
            return;
        }


        const certificate =
            certificates[
                selectedCertificateIndex
            ];


        const confirmDelete =
            confirm(
                `ต้องการลบ "${certificate.title}" หรือไม่?`
            );


        if (!confirmDelete) {
            return;
        }


        // ลบ Certificate

        certificates.splice(
            selectedCertificateIndex,
            1
        );


        // Save ใหม่

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(
                certificates
            )
        );


        // ปิด Popup

        closeDetail();


        // Refresh Grid

        displayCertificates();

    }
);


// ==========================================
// OPEN ADD PAGE
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
// CLOSE ADD PAGE
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


        // ตรวจสอบว่าเป็นรูป

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
// SAVE CERTIFICATE
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


        const reader =
            new FileReader();


        reader.onload =
            function (event) {

                const newCertificate = {

                    id: Date.now(),

                    title:
                        title,

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


                // Refresh

                displayCertificates();


                // กลับหน้าหลัก

                closeAddPage();

            };


        reader.readAsDataURL(file);

    }
);


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHTML(text) {

    const div =
        document.createElement("div");


    div.textContent =
        text;


    return div.innerHTML;
}


// ==========================================
// START
// ==========================================

displayCertificates();

