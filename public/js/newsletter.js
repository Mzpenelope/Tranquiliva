import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// Firebase configuration (replace with your credentials from Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyCMaQr_VITQGJnkO0MOgePT3ydi_6Zv6I8",
  authDomain: "tranquiliva.firebaseapp.com",
  projectId: "tranquiliva",
  storageBucket: "tranquiliva.firebasestorage.app",
  messagingSenderId: "1001580200917",
  appId: "1:1001580200917:web:427d88d3dc8fd5b5a6b35c",
  measurementId: "G-SX94Q5X28N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Get the necessary elements
const newsletterForm = document.querySelector("#newsletter-form");
const newsletterInput = document.querySelector("#newsletter-email");
const messageBox = document.querySelector("#newsletter-message");
const modal = document.querySelector(".newsletter.section");

// Function to set a cookie to track if the user is subscribed
const setCookie = (name, value, days) => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`;
};

// Function to get the value of a cookie
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

// Check if the user is already subscribed by cookie
if (getCookie("subscribed")) {
  modal.style.display = "none"; // Hide the modal if already subscribed
}

// Handle form submission
newsletterForm.addEventListener("submit", async function (event) {
  event.preventDefault(); // Prevent default form submission

  const email = newsletterInput.value.trim();

  // Validate email
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    messageBox.textContent = "Please enter a valid email address.";
    messageBox.style.color = "red";
    return;
  }

  // Show loading message
  messageBox.textContent = "Submitting...";
  messageBox.style.color = "blue";

  try {
    // Add email to Firestore
    await addDoc(collection(db, "subscribers"), { email });

    // Set the subscription cookie for 365 days
    setCookie("subscribed", "true", 365);

    // Hide the modal after successful subscription
    modal.style.display = "none";

    // Show success message
    messageBox.textContent = "Subscribed successfully!";
    messageBox.style.color = "green";

    // Clear the input field
    newsletterInput.value = "";
  } catch (error) {
    // Show error message if subscription fails
    messageBox.textContent = "Error subscribing. Please try again.";
    messageBox.style.color = "red";
    console.error("Error adding document: ", error);
  }
});
