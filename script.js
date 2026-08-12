// ===============================
// MOBILE MENU
// ===============================

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
        navMenu.classList.toggle("active");

        const icon = menuToggle.querySelector("i");

        if (navMenu.classList.contains("active")) {
            icon.classList.remove("fa-bars");
            icon.classList.add("fa-xmark");
        } else {
            icon.classList.remove("fa-xmark");
            icon.classList.add("fa-bars");
        }
    });
}


// Close mobile menu when a link is clicked

document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
        navMenu.classList.remove("active");

        const icon = menuToggle?.querySelector("i");

        if (icon) {
            icon.classList.remove("fa-xmark");
            icon.classList.add("fa-bars");
        }
    });
});


// ===============================
// SUPPORT AMOUNT BUTTONS
// ===============================

const amountButtons = document.querySelectorAll(
    ".amount-buttons button"
);

const amountInput = document.getElementById("supportAmount");

amountButtons.forEach((button) => {

    button.addEventListener("click", () => {

        const amount = button.dataset.amount;

        amountInput.value = amount;

        amountButtons.forEach((btn) => {
            btn.classList.remove("selected");
        });

        button.classList.add("selected");

    });

});


// ===============================
// M-PESA SUPPORT FORM
// ===============================

const supportForm = document.getElementById("supportForm");
const supportButton = document.getElementById("supportButton");
const paymentMessage = document.getElementById("paymentMessage");

if (supportForm) {

    supportForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const name = document.getElementById("supportName").value.trim();
        const phone = document.getElementById("supportPhone").value.trim();
        const amount = document.getElementById("supportAmount").value;

        // Validate name
        if (!name) {
            paymentMessage.textContent = "Please enter your name.";
            return;
        }

        // Validate phone
        if (!phone) {
            paymentMessage.textContent =
                "Please enter your M-Pesa phone number.";
            return;
        }

        // Validate amount
        if (!amount || Number(amount) <= 0) {
            paymentMessage.textContent =
                "Please enter a valid amount.";
            return;
        }


        // Change button while processing

        supportButton.disabled = true;

        supportButton.innerHTML = `
            <i class="fas fa-spinner fa-spin"></i>
            Sending STK Push...
        `;

        paymentMessage.textContent =
            "Connecting to M-Pesa...";


        try {

           const response = await fetch(
    "https://george-portfolio-pe0k.onrender.com/api/support",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name,
                        phone,
                        amount: Number(amount)
                    })
                }
            );


            const data = await response.json();


            if (!response.ok || !data.success) {

                throw new Error(
                    data.message ||
                    "Payment request failed."
                );

            }


            // SUCCESS

            paymentMessage.textContent =
                "✅ STK Push sent! Check your M-Pesa phone and enter your PIN.";

            paymentMessage.style.color = "#19d3ae";


            supportButton.innerHTML = `
                <i class="fas fa-check"></i>
                STK Sent
            `;


            // Reset after a few seconds

            setTimeout(() => {

                supportButton.disabled = false;

                supportButton.innerHTML = `
                    <i class="fas fa-heart"></i>
                    Support Me
                `;

            }, 5000);


        } catch (error) {

            console.error("Payment error:", error);


            paymentMessage.textContent =
                "❌ " + error.message;

            paymentMessage.style.color = "#ff6b6b";


            supportButton.disabled = false;

            supportButton.innerHTML = `
                <i class="fas fa-heart"></i>
                Try Again
            `;

        }

    });

}


// ===============================
// ACTIVE NAVIGATION
// ===============================

const sections = document.querySelectorAll("section[id]");
const navigationLinks = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", () => {

    let currentSection = "";

    sections.forEach((section) => {

        const sectionTop = section.offsetTop - 120;
        const sectionHeight = section.offsetHeight;

        if (
            window.scrollY >= sectionTop &&
            window.scrollY < sectionTop + sectionHeight
        ) {
            currentSection = section.getAttribute("id");
        }

    });


    navigationLinks.forEach((link) => {

        link.classList.remove("active");

        if (
            link.getAttribute("href") ===
            `#${currentSection}`
        ) {
            link.classList.add("active");
        }

    });

});
