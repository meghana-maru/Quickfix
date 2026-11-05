
// ========================================
// QUICKFIX - BOOKING AND REPAIRER SYSTEM
// ========================================

// Sample repairer information.
// These are demonstration profiles, not real professionals.

const repairers = {
    "Electrical Repair": {
        name: "Ravi Kumar",
        service: "Electrical Repair",
        experience: "5 Years",
        location: "Hanamkonda, Warangal",
        phone: "",
        icon: "⚡",
        description: "Specializes in wiring, fans, switches and electrical repairs."
    },

    "Plumbing": {
        name: "Suresh Reddy",
        service: "Plumbing",
        experience: "6 Years",
        location: "Warangal",
        phone: "",
        icon: "🚰",
        description: "Specializes in water leakage, pipe repairs and plumbing."
    },

    "Carpentry": {
        name: "Mahesh Kumar",
        service: "Carpentry",
        experience: "5 Years",
        location: "Hanamkonda, Warangal",
        phone: "",
        icon: "🪚",
        description: "Specializes in furniture, doors and wooden repairs."
    },

    "AC Repair": {
        name: "Arun Kumar",
        service: "AC Repair",
        experience: "4 Years",
        location: "Warangal",
        phone: "",
        icon: "❄️",
        description: "Specializes in AC servicing and cooling problems."
    },

    "Appliance Repair": {
        name: "Kiran Kumar",
        service: "Appliance Repair",
        experience: "5 Years",
        location: "Warangal",
        phone: "",
        icon: "🔧",
        description: "Specializes in refrigerators and washing machines."
    },

    "General Maintenance": {
        name: "Rajesh Kumar",
        service: "General Maintenance",
        experience: "5 Years",
        location: "Warangal",
        phone: "",
        icon: "🏠",
        description: "Specializes in general household maintenance."
    }
};


// ========================================
// COMMON ELEMENTS
// ========================================

const bookingForm = document.getElementById("bookingForm");
const result = document.getElementById("result");

document.getElementById("year").textContent =
    new Date().getFullYear();


// ========================================
// MOBILE NAVIGATION
// ========================================

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", function () {
    const isOpen = navLinks.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", function () {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
    });
});


// ========================================
// SERVICE SELECTION
// ========================================

document.querySelectorAll(".choose-service").forEach(button => {

    button.addEventListener("click", function () {

        const selectedService = this.dataset.service;

        document.getElementById("service").value = selectedService;

        document.getElementById("booking").scrollIntoView({
            behavior: "smooth"
        });

    });

});


// ========================================
// DATE VALIDATION
// ========================================

const dateInput = document.getElementById("date");

function getToday() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

dateInput.min = getToday();


// ========================================
// SAFE HTML DISPLAY
// ========================================

function escapeHTML(value) {

    return String(value).replace(/[&<>"']/g, function (character) {

        const characters = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return characters[character];
    });

}


// ========================================
// BOOKING FORM SUBMISSION
// ========================================

bookingForm.addEventListener("submit", function (event) {

    event.preventDefault();

    // Get customer information

    const name = document.getElementById("name").value.trim();

    const phone = document.getElementById("phone").value.trim();

    const address = document.getElementById("address").value.trim();

    const service = document.getElementById("service").value;

    const date = document.getElementById("date").value;

    const message = document.getElementById("message").value.trim();


    // Validate customer information

    if (name.length < 2) {
        alert("Please enter your full name.");
        return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
        alert("Please enter a valid 10-digit mobile number.");
        return;
    }

    if (address.length < 5) {
        alert("Please enter your complete address.");
        return;
    }

    if (!repairers[service]) {
        alert("Please select a valid repair service.");
        return;
    }

    if (!date || date < getToday()) {
        alert("Please select today or a future date.");
        return;
    }


    // ====================================
    // GENERATE BOOKING ID
    // ====================================

    const bookingId =
        "QF" + Date.now().toString().slice(-8);


    // ====================================
    // FIND MATCHING REPAIRER
    // ====================================

    const repairer = repairers[service];


    // ====================================
    // CREATE BOOKING
    // ====================================

    const booking = {

        bookingId: bookingId,

        customerName: name,

        phone: phone,

        address: address,

        service: service,

        preferredDate: date,

        problem: message || "Not provided",

        suggestedRepairer: repairer.name,

        status: "Request Submitted",

        submittedAt: new Date().toLocaleString()

    };


    // ====================================
    // SAVE BOOKING IN LOCAL STORAGE
    // ====================================

    try {

        const savedBookings = JSON.parse(
            localStorage.getItem("quickfixBookings") || "[]"
        );

        if (!Array.isArray(savedBookings)) {
            throw new Error("Invalid booking storage");
        }

        savedBookings.push(booking);

        localStorage.setItem(
            "quickfixBookings",
            JSON.stringify(savedBookings)
        );

    } catch (error) {

        alert("Unable to save booking. Please check your browser storage.");
        return;

    }


    // ====================================
    // DISPLAY CUSTOMER BOOKING DETAILS
    // ====================================

    document.getElementById("requestSummary").innerHTML = `

        <div class="summary-card">

            <h3>📋 Booking Information</h3>

            <p><strong>Booking ID:</strong> ${bookingId}</p>

            <p><strong>Customer:</strong> ${escapeHTML(name)}</p>

            <p><strong>Phone:</strong> ${escapeHTML(phone)}</p>

            <p><strong>Address:</strong> ${escapeHTML(address)}</p>

            <p><strong>Service:</strong> ${escapeHTML(service)}</p>

            <p><strong>Preferred Date:</strong> ${escapeHTML(date)}</p>

            <p><strong>Problem:</strong> ${escapeHTML(message || "Not provided")}</p>

            <p><strong>Status:</strong> ${booking.status}</p>

        </div>

    `;


    // ====================================
    // DISPLAY REPAIRER SUGGESTION
    // ====================================

    let contactButton = "";

    if (repairer.phone && /^[0-9]{10}$/.test(repairer.phone)) {

        contactButton = `
            <a class="contact-repairer"
               href="tel:+91${repairer.phone}">
               Contact Repairer
            </a>
        `;

    }

    document.getElementById("repairerDetails").innerHTML = `

        <div class="repairer-card">

            <div class="repairer-icon">${repairer.icon}</div>

            <h3>Recommended Repairer</h3>

            <h3>${escapeHTML(repairer.name)}</h3>

            <p class="rating">✓ Service Category Match</p>

            <p>
                <strong>Specialization:</strong>
                ${escapeHTML(repairer.service)}
            </p>

            <p>
                <strong>Experience:</strong>
                ${escapeHTML(repairer.experience)}
            </p>

            <p>
                <strong>Location:</strong>
                ${escapeHTML(repairer.location)}
            </p>

            <p>${escapeHTML(repairer.description)}</p>

            ${contactButton}

            <p class="demo-note">
                This is a sample repairer suggestion for demonstration.
                The repairer's identity, availability and assignment
                have not been verified.
            </p>

        </div>

    `;


    // ====================================
    // SHOW BOOKING RESULT
    // ====================================

    bookingForm.style.display = "none";

    result.hidden = false;

    result.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

});


// ========================================
// BOOK ANOTHER SERVICE
// ========================================

document.getElementById("newBooking").addEventListener("click", function () {

    bookingForm.reset();

    dateInput.min = getToday();

    bookingForm.style.display = "block";

    result.hidden = true;

    document.getElementById("requestSummary").innerHTML = "";

    document.getElementById("repairerDetails").innerHTML = "";

    document.getElementById("booking").scrollIntoView({
        behavior: "smooth"
    });

});



