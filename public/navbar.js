function checkUserRole() {
    fetch("/checkrole")
        .then((response) => {
            if (!response.ok) {
                // .ok is gives boolean of whether the response status is ok (ok = 200-299, not ok is all others egg 404 or 500)
                throw new Error("User not logged in or error fetching role");
                // creates a new error which will be caught by the .catch(err.....)
            }
            return response.json(); // parse the response to the next .then(....)
        })
        .then((data) => {
            setupNavBar(data.role); // call setupnavbar with role number 1,2,3
        })
        .catch((error) => {
            setupNavBar(0); // call setupnavbar with role 0 or "not logged in"
        });
}

function setupNavBar(role) {
    const cart = document.getElementById("cart");
    const order = document.getElementById("order");
    const account = document.getElementById("account");
    const rightdiv = document.getElementById("rightdiv");
    const login = document.getElementById("login");

    //Create the admin or dev button
    const admindev = document.createElement("a");
    admindev.classList.add(
        "font-afacad",
        "text-gray-900",
        "hover:bg-gray-100",
        "md:hover:bg-transparent",
        "md:border-0",
        "md:hover:text-gray-400",
        "md:p-0",
        "dark:text-white",
        "md:dark:hover:text-gray-400",
        "dark:hover:bg-gray-700",
        "dark:hover:text-white",
        "md:dark:hover:bg-transparent"
    );

    //Create the logout button
    const logoutLink = document.createElement("a");
    logoutLink.innerText = "Logout";
    logoutLink.id = "logout";
    logoutLink.classList.add(
        "font-afacad",
        "text-gray-900",
        "hover:bg-gray-100",
        "md:hover:bg-transparent",
        "md:border-0",
        "md:hover:text-gray-400",
        "md:p-0",
        "dark:text-white",
        "md:dark:hover:text-gray-400",
        "dark:hover:bg-gray-700",
        "dark:hover:text-white",
        "md:dark:hover:bg-transparent"
    );
    if (role == 0) {
        // No users
        if (!login) {
            // admin role bug out for some reason idk, so just to make it not run multiple time
            return;
        }
        // Remove cart
        cart.remove();
        // Remove orders
        order.remove();
        // Remove account
        account.remove();
    } else if (role == 1) {
        // Customer
        // Right most = Logout
        login.remove();
        rightdiv.appendChild(logoutLink);
        logout();
        // Show Cart
        // Show Orders
        // Show account
    } else if (role == 2) {
        // Admin
        // Show Cart
        // Show Orders
        // Show account
        // To the left of Logout Button = Admin Page
        admindev.innerText = "Admin";
        admindev.href = "/admin.html";
        rightdiv.appendChild(admindev);
        // Right most = Logout
        login.remove();
        rightdiv.appendChild(logoutLink);
    } else if (role == 3) {
        // Developer
        // Show Cart
        // Show Orders
        // Show account
        // To the left of Logout Button = Developer Page
        admindev.innerText = "Developer";
        admindev.href = "/developer.html";
        rightdiv.appendChild(admindev);
        // Right most = Logout
        login.remove();
        rightdiv.appendChild(logoutLink);
    }
    logout(); // call add event listener below
}

function logout() {
    document.getElementById("logout").addEventListener("click", function () {
        fetch("/logout", {
            method: "POST",
            headers: {
                // When post/patch need this to inform server what type you are sending, in our case we always send data through json
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (response.ok) {
                    alert("Logged out Successfully!");
                    window.location.href = "/login.html"; // Redirect to login page
                } else {
                    alert("Failed to log out!");
                }
            })
            .catch((error) => {
                console.error(error);
                alert("Error occured while logging out");
            });
    });
}
