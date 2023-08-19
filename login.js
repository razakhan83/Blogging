// LoginJS

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js";
import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
} from "https://www.gstatic.com/firebasejs/10.2.0/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD0N75TuxiR4cBF2yOOds87i5Gc0YCl5FU",
    authDomain: "mini-hackathon-8b5bf.firebaseapp.com",
    projectId: "mini-hackathon-8b5bf",
    storageBucket: "mini-hackathon-8b5bf.appspot.com",
    messagingSenderId: "369396590749",
    appId: "1:369396590749:web:9fa9586e669ddcf0df8c74",
    measurementId: "G-7L8RZGFYCE"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

const toggleForm = (event) => {
    let btnText = event.target;
    let signInForm = document.getElementById("signInForm");
    let signUpForm = document.getElementById("signUpForm");
    let regText = document.getElementById("regText");
    let haveAccountText = document.getElementById("haveAccountText");
    let regOrLogText = document.querySelectorAll(".regOrLogText");
    regOrLogText.forEach((btn) => {
        btn.classList.remove("active-sign-head");
    });
    if (btnText.textContent === "Sign Up") {
        btnText.classList.add("active-sign-head");
        signInForm.classList.add("d-none");
        signUpForm.classList.remove("d-none");
        regText.textContent = "Log In";
        haveAccountText.textContent = "already";
    } else {
        btnText.classList.add("active-sign-head");
        signInForm.classList.remove("d-none");
        signUpForm.classList.add("d-none");
        regText.textContent = "Register";
        haveAccountText.textContent = "don’t";
    }
};
let regOrLogText = document.querySelectorAll(".regOrLogText");
regOrLogText.forEach((btn) => {
    btn.addEventListener("click", toggleForm);
});

const togglePass = (event) => {
    let eye = event.target;
    let input = eye.previousElementSibling;
    if (input.type == "password") {
        input.type = "text";
        eye.src = "./assets/invisible.svg";
        eye.previousElementSibling.focus();
    } else {
        input.type = "password";
        eye.src = "./assets/visible.svg";
        eye.previousElementSibling.focus();
    }
};
let passwordInput = document.querySelectorAll(
    'input.form-input[type="password"]'
);
passwordInput.forEach(function (input) {
    input.nextElementSibling.addEventListener("click", togglePass);
});

let form = document.getElementById("signUpForm");
form.addEventListener("submit", async function (event) {
    let newFirstName = document.getElementById("newFirstName");
    let newLastName = document.getElementById("newLastName");
    let newEmail = document.getElementById("newEmail");
    let emailExistError = document.getElementById("emailExistError");
    let newPassword = document.getElementById("newPassword");
    let newConfirmPassword = document.getElementById("newConfirmPassword");
    let newPassMatchError = document.getElementById("newPassMatchError");
    let currentDate = new Date();
    currentDate = currentDate.toISOString();
    emailExistError.classList.add("d-none");
    if (newPassword.value !== newConfirmPassword.value) {
        newPassMatchError.classList.remove("v-hidden");
        return;
    }
    newPassMatchError.classList.add("v-hidden");

    try {
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            newEmail.value,
            newPassword.value
        );
        const user = userCredential.user;
        await setDoc(doc(db, "users", user.uid), {
            firstName: newFirstName.value,
            lastName: newLastName.value,
            fullName: newFirstName.value + " " + newLastName.value,
            joined: currentDate,
            src: "https://static.thenounproject.com/png/4035889-200.png",
        });
        console.log(user);
        newFirstName.value = "";
        newLastName.value = "";
        newEmail.value = "";
        newPassword.value = "";
        newConfirmPassword.value = "";
        window.location.replace("./dashboard.html");
        const docRef = doc(db, "users", user.uid);
        const userdocSnap = await getDoc(docRef);
        const userData = userdocSnap.data();
        localStorage.setItem("userDb", JSON.stringify(userData));
    } catch (error) {
        console.log(error.code);
        if (error.code === "auth/email-already-in-use") {
            emailExistError.classList.remove("d-none");
        }
    }
});

const loginUser = async () => {
    console.log("Login");
    let email = document.getElementById("email");
    let password = document.getElementById("password");
    let invalidUser = document.getElementById("invalidUser");
    signInWithEmailAndPassword(auth, email.value, password.value)
        .then(async (userCredential) => {
            invalidUser.classList.add("v-hidden");
            const user = userCredential.user;
            console.log(user);
            const docRef = doc(db, "users", user.uid);
            const userdocSnap = await getDoc(docRef);
            if (userdocSnap.exists()) {
                const userData = userdocSnap.data();
                localStorage.setItem("userDb", JSON.stringify(userData));
            }
            // Redirect to dashboard.html after successful login
            window.location.replace("./dashboard.html");
        })
        .catch((error) => {
            invalidUser.classList.remove("v-hidden");
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage);
            console.log(errorCode);
        });
};

let signInForm = document.getElementById("signInForm");
signInForm.addEventListener("submit", loginUser);
//End of Login

onAuthStateChanged(auth, (user) => {
    if (user) {
        // https://firebase.google.com/docs/reference/js/auth.user
        localStorage.setItem("user", JSON.stringify(user));
        const uid = user.uid;
        console.log("Uid ==>", uid);
    } else {
        console.log("User Signed Out");
    }
});
