/* =========================================
   KL-STEAM
   Firebase Authentication + Application JS
========================================= */


/* =========================================
   FIREBASE IMPORTS
========================================= */

import { initializeApp }
    from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
    onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";


/* =========================================
   FIREBASE CONFIGURATION
========================================= */

const firebaseConfig = {

    apiKey: "AIzaSyDlRnpcojYesiSVz4crJ2A9sD85e-eVxJs",

    authDomain: "kl-stream.firebaseapp.com",

    projectId: "kl-stream",

    storageBucket: "kl-stream.firebasestorage.app",

    messagingSenderId: "370608292425",

    appId: "1:370608292425:web:65dc469ca703d613747598",

    measurementId: "G-XMKDX56PMM"

};


/* =========================================
   INITIALIZE FIREBASE
========================================= */

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);


/* =========================================
   DEFAULT VIDEOS
========================================= */

const defaultVideos = [

    {
        id: 1,
        title: "Big Buck Bunny",
        category: "Movies",
        image: "https://i.ytimg.com/vi/aqz-KE-bpKQ/hqdefault.jpg",
        url: "https://www.youtube.com/embed/aqz-KE-bpKQ",
        description: "A popular animated short film."
    },

    {
        id: 2,
        title: "Technology Video",
        category: "Technology",
        image: "https://i.ytimg.com/vi/aircAruvnKk/hqdefault.jpg",
        url: "https://www.youtube.com/embed/aircAruvnKk",
        description: "An educational technology video."
    },

    {
        id: 3,
        title: "Live News",
        category: "Live",
        image: "https://i.ytimg.com/vi/21X5lGlDOfg/hqdefault.jpg",
        url: "https://www.youtube.com/embed/21X5lGlDOfg",
        description: "Sample live content from YouTube."
    }

];


/* =========================================
   LOCAL STORAGE INITIALIZATION
========================================= */

if (!localStorage.getItem("users")) {

    localStorage.setItem(
        "users",
        JSON.stringify([])
    );

}


if (!localStorage.getItem("videos")) {

    localStorage.setItem(
        "videos",
        JSON.stringify(defaultVideos)
    );

}


/* =========================================
   SHOW SIGNUP
========================================= */

function showSignup() {

    const loginSection =
        document.getElementById("loginSection");

    const signupSection =
        document.getElementById("signupSection");


    if (loginSection) {

        loginSection.classList.add("hidden");

    }


    if (signupSection) {

        signupSection.classList.remove("hidden");

    }

}


/* =========================================
   SHOW LOGIN
========================================= */

function showLogin() {

    const signupSection =
        document.getElementById("signupSection");

    const loginSection =
        document.getElementById("loginSection");


    if (signupSection) {

        signupSection.classList.add("hidden");

    }


    if (loginSection) {

        loginSection.classList.remove("hidden");

    }

}


/* =========================================
   SIGNUP
   FIREBASE AUTHENTICATION
========================================= */

async function signup() {

    const nameInput =
        document.getElementById("signupName");

    const emailInput =
        document.getElementById("signupEmail");

    const passwordInput =
        document.getElementById("signupPassword");

    const message =
        document.getElementById("signupMessage");


    const name =
        nameInput.value.trim();

    const email =
        emailInput.value.trim();

    const password =
        passwordInput.value;


    if (
        name === "" ||
        email === "" ||
        password === ""
    ) {

        message.textContent =
            "Please fill all fields.";

        return;

    }


    if (password.length < 6) {

        message.textContent =
            "Password must contain at least 6 characters.";

        return;

    }


    try {

        /* Create Firebase account */

        const userCredential =
            await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );


        const firebaseUser =
            userCredential.user;


        /* Get existing local users */

        let users =
            JSON.parse(
                localStorage.getItem("users")
            ) || [];


        /* Create application user */

        const newUser = {

            uid: firebaseUser.uid,

            name: name,

            email: email,

            watchlist: [],

            subscription: false,

            parentalControl: false,

            parentalPin: ""

        };


        users.push(newUser);


        localStorage.setItem(
            "users",
            JSON.stringify(users)
        );


        message.textContent =
            "Account created successfully. Please login.";


        /* Clear signup fields */

        nameInput.value = "";

        emailInput.value = "";

        passwordInput.value = "";


        /* Sign out after signup */

        await signOut(auth);


        /* Return to login */

        setTimeout(function () {

            showLogin();

        }, 1000);

    }


    catch (error) {

        console.error(
            "Signup error:",
            error
        );


        if (
            error.code ===
            "auth/email-already-in-use"
        ) {

            message.textContent =
                "This email is already registered.";

        }

        else if (
            error.code ===
            "auth/invalid-email"
        ) {

            message.textContent =
                "Please enter a valid email.";

        }

        else if (
            error.code ===
            "auth/weak-password"
        ) {

            message.textContent =
                "Password is too weak.";

        }

        else {

            message.textContent =
                "Signup failed: " +
                error.message;

        }

    }

}


/* =========================================
   LOGIN
   FIREBASE AUTHENTICATION
========================================= */

async function login() {

    const emailInput =
        document.getElementById("loginEmail");

    const passwordInput =
        document.getElementById("loginPassword");

    const message =
        document.getElementById("loginMessage");


    const email =
        emailInput.value.trim();

    const password =
        passwordInput.value;


    if (
        email === "" ||
        password === ""
    ) {

        message.textContent =
            "Please enter email and password.";

        return;

    }


    /* =====================================
       ADMIN LOGIN
    ===================================== */

    if (
        email === "admin@klsteam.com" &&
        password === "admin123"
    ) {

        const admin = {

            name: "Administrator",

            email: email,

            role: "admin"

        };


        localStorage.setItem(
            "currentUser",
            JSON.stringify(admin)
        );


        window.location.href =
            "admin.html";


        return;

    }


    /* =====================================
       NORMAL USER LOGIN
    ===================================== */

    try {

        const userCredential =
            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );


        const firebaseUser =
            userCredential.user;


        let users =
            JSON.parse(
                localStorage.getItem("users")
            ) || [];


        let user =
            users.find(function (storedUser) {

                return (
                    storedUser.uid ===
                    firebaseUser.uid
                );

            });


        /* =================================
           CREATE LOCAL PROFILE IF MISSING
        ================================= */

        if (!user) {

            user = {

                uid: firebaseUser.uid,

                name:
                    firebaseUser.displayName ||
                    "KL-STEAM User",

                email:
                    firebaseUser.email,

                watchlist: [],

                subscription: false,

                parentalControl: false,

                parentalPin: ""

            };


            users.push(user);


            localStorage.setItem(
                "users",
                JSON.stringify(users)
            );

        }


        /* =================================
           CREATE CURRENT USER
        ================================= */

        const currentUser = {

            uid:
                firebaseUser.uid,

            name:
                user.name,

            email:
                firebaseUser.email,

            role:
                "user",

            watchlist:
                user.watchlist || [],

            subscription:
                user.subscription || false,

            parentalControl:
                user.parentalControl || false

        };


        localStorage.setItem(
            "currentUser",
            JSON.stringify(currentUser)
        );


        /* Go to home */

        window.location.href =
            "home.html";

    }


    catch (error) {

        console.error(
            "Login error:",
            error
        );


        if (
            error.code ===
            "auth/invalid-credential"
        ) {

            message.textContent =
                "Invalid email or password.";

        }

        else if (
            error.code ===
            "auth/user-not-found"
        ) {

            message.textContent =
                "Account not found.";

        }

        else if (
            error.code ===
            "auth/wrong-password"
        ) {

            message.textContent =
                "Incorrect password.";

        }

        else if (
            error.code ===
            "auth/invalid-email"
        ) {

            message.textContent =
                "Please enter a valid email.";

        }

        else {

            message.textContent =
                "Login failed: " +
                error.message;

        }

    }

}


/* =========================================
   FORGOT PASSWORD
========================================= */

async function forgotPassword() {

    const emailInput =
        document.getElementById("loginEmail");

    const message =
        document.getElementById("resetMessage");


    if (!emailInput) {

        return;

    }


    const email =
        emailInput.value.trim();


    /* User must enter email */

    if (email === "") {

        if (message) {

            message.textContent =
                "Enter your email above, then click Forgot Password.";

        }

        return;

    }


    /* Validate basic email format */

    if (
        !email.includes("@") ||
        !email.includes(".")
    ) {

        if (message) {

            message.textContent =
                "Please enter a valid email address.";

        }

        return;

    }


    try {

        await sendPasswordResetEmail(
            auth,
            email
        );


        if (message) {

            message.textContent =
                "Password reset email sent. Check your inbox and spam folder.";

        }

    }


    catch (error) {

        console.error(
            "Password reset error:",
            error
        );


        if (
            error.code ===
            "auth/invalid-email"
        ) {

            message.textContent =
                "Please enter a valid email address.";

        }

        else if (
            error.code ===
            "auth/user-not-found"
        ) {

            message.textContent =
                "No Firebase account was found with this email.";

        }

        else if (
            error.code ===
            "auth/too-many-requests"
        ) {

            message.textContent =
                "Too many requests. Please wait and try again.";

        }

        else {

            message.textContent =
                "Password reset failed: " +
                error.message;

        }

    }

}


/* =========================================
   LOGOUT
========================================= */

async function logout() {

    try {

        await signOut(auth);

    }

    catch (error) {

        console.error(
            "Logout error:",
            error
        );

    }


    localStorage.removeItem(
        "currentUser"
    );


    window.location.href =
        "index.html";

}


/* =========================================
   GET VIDEOS
========================================= */

function getVideos() {

    return JSON.parse(
        localStorage.getItem("videos")
    ) || [];

}


/* =========================================
   HOME PAGE
========================================= */

function displayVideos() {

    const videoList =
        document.getElementById("videoList");


    if (!videoList) {

        return;

    }


    const searchInput =
        document.getElementById("searchInput");

    const categoryFilter =
        document.getElementById("categoryFilter");


    const search =
        searchInput
            ? searchInput.value.toLowerCase()
            : "";


    const category =
        categoryFilter
            ? categoryFilter.value
            : "All";


    const videos =
        getVideos();


    const filteredVideos =
        videos.filter(function (video) {

            const searchMatch =
                video.title
                    .toLowerCase()
                    .includes(search);


            const categoryMatch =
                category === "All" ||
                video.category === category;


            return (
                searchMatch &&
                categoryMatch
            );

        });


    if (
        filteredVideos.length === 0
    ) {

        videoList.innerHTML =
            "<p>No videos found.</p>";

        return;

    }


    videoList.innerHTML =
        filteredVideos
            .map(createVideoCard)
            .join("");

}


/* =========================================
   VIDEO CARD
========================================= */

function createVideoCard(video) {

    return `

        <div class="video-card">

            <img
                src="${video.image}"
                alt="${video.title}"
            >

            <div class="content">

                <h3>
                    ${video.title}
                </h3>

                <p>
                    Category: ${video.category}
                </p>

                <p>
                    ${video.description}
                </p>

                <button
                    onclick="watchVideo(${video.id})"
                >
                    Watch Now
                </button>

                <button
                    onclick="addToWatchlist(${video.id})"
                >
                    Add to Watchlist
                </button>

            </div>

        </div>

    `;

}


/* =========================================
   WATCH VIDEO
========================================= */

function watchVideo(id) {

    window.location.href =
        "watch.html?id=" + id;

}


/* =========================================
   WATCH PAGE
========================================= */

function loadWatchPage() {

    const parameters =
        new URLSearchParams(
            window.location.search
        );


    const id =
        Number(
            parameters.get("id")
        );


    if (!id) {

        return;

    }


    const videos =
        getVideos();


    const video =
        videos.find(function (video) {

            return video.id === id;

        });


    if (!video) {

        return;

    }


    const title =
        document.getElementById(
            "watchTitle"
        );


    const description =
        document.getElementById(
            "watchDescription"
        );


    const player =
        document.getElementById(
            "videoPlayer"
        );


    if (title) {

        title.textContent =
            video.title;

    }


    if (description) {

        description.textContent =
            video.description;

    }


    if (player) {

        player.src =
            video.url;

    }

}


/* =========================================
   GO HOME
========================================= */

function goHome() {

    window.location.href =
        "home.html";

}


/* =========================================
   WATCHLIST
========================================= */

function addToWatchlist(id) {

    const currentUser =
        JSON.parse(
            localStorage.getItem(
                "currentUser"
            )
        );


    if (!currentUser) {

        return;

    }


    let users =
        JSON.parse(
            localStorage.getItem("users")
        ) || [];


    const userIndex =
        users.findIndex(function (user) {

            return (
                user.uid ===
                currentUser.uid
            );

        });


    if (userIndex === -1) {

        return;

    }


    if (!users[userIndex].watchlist) {

        users[userIndex].watchlist = [];

    }


    if (
        !users[userIndex]
            .watchlist
            .includes(id)
    ) {

        users[userIndex]
            .watchlist
            .push(id);


        currentUser.watchlist =
            users[userIndex].watchlist;


        localStorage.setItem(
            "users",
            JSON.stringify(users)
        );


        localStorage.setItem(
            "currentUser",
            JSON.stringify(currentUser)
        );


        alert(
            "Video added to watchlist."
        );

    }

    else {

        alert(
            "Video is already in your watchlist."
        );

    }

}


/* =========================================
   DISPLAY WATCHLIST
========================================= */

function displayWatchlist() {

    const list =
        document.getElementById(
            "watchlist"
        );


    if (!list) {

        return;

    }


    const currentUser =
        JSON.parse(
            localStorage.getItem(
                "currentUser"
            )
        );


    if (!currentUser) {

        return;

    }


    const users =
        JSON.parse(
            localStorage.getItem(
                "users"
            )
        ) || [];


    const user =
        users.find(function (user) {

            return (
                user.uid ===
                currentUser.uid
            );

        });


    if (!user) {

        return;

    }


    const videos =
        getVideos();


    const watchlistVideos =
        videos.filter(function (video) {

            return (
                user.watchlist || []
            ).includes(video.id);

        });


    if (
        watchlistVideos.length === 0
    ) {

        list.innerHTML =
            "<p>Your watchlist is empty.</p>";

        return;

    }


    list.innerHTML =
        watchlistVideos
            .map(createWatchlistCard)
            .join("");

}


/* =========================================
   WATCHLIST CARD
========================================= */

function createWatchlistCard(video) {

    return `

        <div class="video-card">

            <img
                src="${video.image}"
                alt="${video.title}"
            >

            <div class="content">

                <h3>
                    ${video.title}
                </h3>

                <p>
                    Category: ${video.category}
                </p>

                <p>
                    ${video.description}
                </p>

                <button
                    onclick="watchVideo(${video.id})"
                >
                    Watch Now
                </button>

            </div>

        </div>

    `;

}


/* =========================================
   RECOMMENDATIONS
========================================= */

function displayRecommendations() {

    const list =
        document.getElementById(
            "recommendationList"
        );


    if (!list) {

        return;

    }


    const videos =
        getVideos();


    const currentUser =
        JSON.parse(
            localStorage.getItem(
                "currentUser"
            )
        );


    if (!currentUser) {

        return;

    }


    const users =
        JSON.parse(
            localStorage.getItem(
                "users"
            )
        ) || [];


    const user =
        users.find(function (user) {

            return (
                user.uid ===
                currentUser.uid
            );

        });


    if (!user) {

        return;

    }


    const recommendations =
        videos.filter(function (video) {

            return !(
                user.watchlist || []
            ).includes(video.id);

        });


    list.innerHTML =
        recommendations
            .slice(0, 3)
            .map(createVideoCard)
            .join("");

}


/* =========================================
   SUBSCRIPTION
========================================= */

function subscribeUser() {

    const currentUser =
        JSON.parse(
            localStorage.getItem(
                "currentUser"
            )
        );


    if (!currentUser) {

        return;

    }


    currentUser.subscription =
        true;


    localStorage.setItem(
        "currentUser",
        JSON.stringify(currentUser)
    );


    const users =
        JSON.parse(
            localStorage.getItem(
                "users"
            )
        ) || [];


    const user =
        users.find(function (user) {

            return (
                user.uid ===
                currentUser.uid
            );

        });


    if (user) {

        user.subscription =
            true;


        localStorage.setItem(
            "users",
            JSON.stringify(users)
        );

    }


    const status =
        document.getElementById(
            "subscriptionStatus"
        );


    if (status) {

        status.textContent =
            "Subscription: Active";

    }


    alert(
        "Subscription activated."
    );

}


/* =========================================
   PARENTAL CONTROL
========================================= */

function setParentalControl() {

    const currentUser =
        JSON.parse(
            localStorage.getItem(
                "currentUser"
            )
        );


    if (!currentUser) {

        return;

    }


    const pinInput =
        document.getElementById(
            "parentalPin"
        );


    if (!pinInput) {

        return;

    }


    const pin =
        pinInput.value.trim();


    if (
        pin.length !== 4 ||
        !/^\d{4}$/.test(pin)
    ) {

        alert(
            "Please enter a 4-digit PIN."
        );

        return;

    }


    currentUser.parentalControl =
        true;


    localStorage.setItem(
        "currentUser",
        JSON.stringify(currentUser)
    );


    const users =
        JSON.parse(
            localStorage.getItem(
                "users"
            )
        ) || [];


    const user =
        users.find(function (user) {

            return (
                user.uid ===
                currentUser.uid
            );

        });


    if (user) {

        user.parentalControl =
            true;

        user.parentalPin =
            pin;


        localStorage.setItem(
            "users",
            JSON.stringify(users)
        );

    }


    const status =
        document.getElementById(
            "parentalStatus"
        );


    if (status) {

        status.textContent =
            "Parental Control: Enabled";

    }


    pinInput.value = "";


    alert(
        "Parental Control enabled."
    );

}


/* =========================================
   DISPLAY USER SETTINGS
========================================= */

function displayUserSettings() {

    const currentUser =
        JSON.parse(
            localStorage.getItem(
                "currentUser"
            )
        );


    if (!currentUser) {

        return;

    }


    const subscriptionStatus =
        document.getElementById(
            "subscriptionStatus"
        );


    const parentalStatus =
        document.getElementById(
            "parentalStatus"
        );


    if (
        subscriptionStatus &&
        currentUser.subscription
    ) {

        subscriptionStatus.textContent =
            "Subscription: Active";

    }


    if (
        parentalStatus &&
        currentUser.parentalControl
    ) {

        parentalStatus.textContent =
            "Parental Control: Enabled";

    }

}


/* =========================================
   ADMIN - ADD VIDEO
========================================= */

function addVideo() {

    const titleInput =
        document.getElementById(
            "videoTitle"
        );

    const categoryInput =
        document.getElementById(
            "videoCategory"
        );

    const urlInput =
        document.getElementById(
            "videoUrl"
        );

    const descriptionInput =
        document.getElementById(
            "videoDescription"
        );

    const message =
        document.getElementById(
            "adminMessage"
        );


    const title =
        titleInput.value.trim();

    const category =
        categoryInput.value;

    const url =
        urlInput.value.trim();

    const description =
        descriptionInput.value.trim();


    if (
        title === "" ||
        category === "" ||
        url === "" ||
        description === ""
    ) {

        message.textContent =
            "Please fill all fields.";

        return;

    }


    const videoId =
        getYouTubeId(url);


    if (!videoId) {

        message.textContent =
            "Please enter a valid YouTube URL.";

        return;

    }


    const videos =
        getVideos();


    const newVideo = {

        id:
            Date.now(),

        title:
            title,

        category:
            category,

        image:
            "https://i.ytimg.com/vi/" +
            videoId +
            "/hqdefault.jpg",

        url:
            "https://www.youtube.com/embed/" +
            videoId,

        description:
            description

    };


    videos.push(
        newVideo
    );


    localStorage.setItem(
        "videos",
        JSON.stringify(videos)
    );


    message.textContent =
        "Video added successfully.";


    titleInput.value = "";

    categoryInput.value = "";

    urlInput.value = "";

    descriptionInput.value = "";


    displayAdminVideos();

}


/* =========================================
   GET YOUTUBE ID
========================================= */

function getYouTubeId(url) {

    const match =
        url.match(
            /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&?\/]+)/
        );


    if (match) {

        return match[1];

    }


    return null;

}


/* =========================================
   ADMIN VIDEO LIST
========================================= */

function displayAdminVideos() {

    const list =
        document.getElementById(
            "adminVideoList"
        );


    if (!list) {

        return;

    }


    const videos =
        getVideos();


    list.innerHTML =
        videos
            .map(function (video) {

                return `

                    <div class="admin-item">

                        <div>

                            <strong>
                                ${video.title}
                            </strong>

                            <br>

                            <small>
                                ${video.category}
                            </small>

                        </div>

                        <button
                            onclick="deleteVideo(${video.id})"
                        >
                            Delete
                        </button>

                    </div>

                `;

            })
            .join("");

}


/* =========================================
   DELETE VIDEO
========================================= */

function deleteVideo(id) {

    const videos =
        getVideos()
            .filter(function (video) {

                return video.id !== id;

            });


    localStorage.setItem(
        "videos",
        JSON.stringify(videos)
    );


    displayAdminVideos();

}


/* =========================================
   PAGE SECURITY
========================================= */

function handlePage() {

    const page =
        window.location.pathname;


    /* =====================================
       LOGIN / INDEX PAGE
    ===================================== */

    if (
        page.endsWith("index.html") ||
        page.endsWith("/")
    ) {

        return;

    }


    /* =====================================
       CURRENT LOCAL USER
    ===================================== */

    const currentUser =
        JSON.parse(
            localStorage.getItem(
                "currentUser"
            )
        );


    /* =====================================
       ADMIN PAGE
    ===================================== */

    if (
        page.endsWith("admin.html")
    ) {

        if (
            !currentUser ||
            currentUser.role !== "admin"
        ) {

            window.location.href =
                "index.html";

            return;

        }


        displayAdminVideos();

        return;

    }


    /* =====================================
       USER PAGES
    ===================================== */

    onAuthStateChanged(
        auth,
        function (firebaseUser) {

            const storedUser =
                JSON.parse(
                    localStorage.getItem(
                        "currentUser"
                    )
                );


            if (
                !firebaseUser ||
                !storedUser ||
                storedUser.role !== "user"
            ) {

                window.location.href =
                    "index.html";

                return;

            }


            /* =============================
               HOME
            ============================= */

            if (
                page.endsWith("home.html")
            ) {

                displayVideos();

                displayRecommendations();

                displayUserSettings();

            }


            /* =============================
               WATCHLIST
            ============================= */

            if (
                page.endsWith("watchlist.html")
            ) {

                displayWatchlist();

            }


            /* =============================
               WATCH
            ============================= */

            if (
                page.endsWith("watch.html")
            ) {

                loadWatchPage();

            }

        }
    );

}


/* =========================================
   START APPLICATION
========================================= */

window.addEventListener(
    "load",
    function () {

        handlePage();

    }
);


/* =========================================
   MAKE FUNCTIONS AVAILABLE TO HTML
========================================= */

window.showSignup =
    showSignup;

window.showLogin =
    showLogin;

window.signup =
    signup;

window.login =
    login;

window.forgotPassword =
    forgotPassword;

window.logout =
    logout;

window.displayVideos =
    displayVideos;

window.watchVideo =
    watchVideo;

window.goHome =
    goHome;

window.addToWatchlist =
    addToWatchlist;

window.subscribeUser =
    subscribeUser;

window.setParentalControl =
    setParentalControl;

window.addVideo =
    addVideo;

window.deleteVideo =
    deleteVideo;