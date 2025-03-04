// main.js
document.addEventListener("DOMContentLoaded", () => {
console.log("main.js loaded successfully.");

// ====== DOM Elements ======
const uploadForm = document.getElementById("uploadForm");
const codeForm = document.getElementById("codeForm");
const resultsSection = document.getElementById("resultsSection");

const tokensTableBody = document.querySelector("#tokensTable tbody");
const parseTreeViz = document.getElementById("parseTreeViz");
const logsPre = document.getElementById("logs");

const downloadTokensBtn = document.getElementById("downloadTokensBtn");
const downloadParseTreeBtn = document.getElementById("downloadParseTreeBtn");
const downloadLogsBtn = document.getElementById("downloadLogsBtn");

// Global variables for results
let tokensData = [];
let parseTreeData = "";
let logsData = [];

// ====== CodeMirror Editor Setup ======
console.log("Initializing CodeMirror...");
const codeEditor = CodeMirror(document.getElementById("codeEditor"), {
    lineNumbers: true,
    mode: "text/x-csrc", // Using C-like highlighting as a fallback
    theme: "default",
    readOnly: false
});
console.log("CodeMirror initialized.");

// ====== AJAX Submission Functions ======
async function handleFormSubmit(formData) {
    try {
    const response = await fetch("/process/", {
        method: "POST",
        body: formData,
    });
    if (!response.ok) {
        console.error("Server returned error status:", response.status);
        alert("An error occurred. Please try again.");
        return;
    }
    const data = await response.json();
    displayResults(data);
    } catch (error) {
    console.error("AJAX request failed:", error);
    alert("Request failed. See console for details.");
    }
}

function displayResults(data) {
    console.log("Received data:", data);

    // Clear previous results
    tokensTableBody.innerHTML = "";
    logsPre.textContent = "";
    parseTreeViz.innerHTML = "";

    // Display Tokens
    tokensData = data.tokens || [];
    tokensData.forEach(([tokenType, lexeme]) => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${tokenType}</td><td>${lexeme}</td>`;
    tokensTableBody.appendChild(row);
    });

    // Display Parse Tree (as plain text in a <pre>)
    parseTreeData = data.parse_tree || "";
    const pre = document.createElement("pre");
    pre.id = "parseTree";
    pre.textContent = parseTreeData;
    parseTreeViz.appendChild(pre);

    // Display Logs / Errors
    logsData = data.errors || [];
    logsPre.textContent = logsData.join("\n");

    // Reveal the results section
    resultsSection.classList.remove("d-none");
}

// ====== Event Listeners for Forms ======
uploadForm.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("Upload form submitted via JS.");
    const formData = new FormData(uploadForm);
    formData.append("csrfmiddlewaretoken", getCsrfToken());
    handleFormSubmit(formData);
});

codeForm.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("Code form submitted via JS.");
    const formData = new FormData();
    const codeContent = codeEditor.getValue();
    formData.append("ada_code", codeContent);
    formData.append("csrfmiddlewaretoken", getCsrfToken());
    handleFormSubmit(formData);
});

// ====== File Drag & Drop Handling ======
const dropZone = document.getElementById("drop-zone");
const fileInput = document.getElementById("file-input");
const filePreview = document.getElementById("file-preview");

dropZone.addEventListener("click", () => fileInput.click());

dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.add("hover");
});

dropZone.addEventListener("dragleave", (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.remove("hover");
});

dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.remove("hover");
    if (e.dataTransfer.files.length) {
    fileInput.files = e.dataTransfer.files;
    previewFile(e.dataTransfer.files[0]);
    }
});

fileInput.addEventListener("change", (e) => {
    if (fileInput.files.length) {
    previewFile(fileInput.files[0]);
    }
});

function previewFile(file) {
    filePreview.classList.add("d-none");
    filePreview.textContent = "";
    if (!file.name.endsWith(".ada")) {
    filePreview.textContent = "Error: Invalid file type. Please select a .ada file.";
    filePreview.classList.remove("d-none");
    return;
    }
    const reader = new FileReader();
    reader.onload = function(e) {
    const content = e.target.result;
    const previewText = `File: ${file.name}\nSize: ${file.size} bytes\n\nPreview:\n${content.substring(0, 200)}\n...`;
    filePreview.textContent = previewText;
    filePreview.classList.remove("d-none");
    };
    reader.onerror = function() {
    filePreview.textContent = "Error reading file.";
    filePreview.classList.remove("d-none");
    };
    reader.readAsText(file);
}

// ====== Utility Functions ======
function getCsrfToken() {
    const csrfInput = document.querySelector("input[name='csrfmiddlewaretoken']");
    return csrfInput ? csrfInput.value : "";
}

function copyText(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return alert("Element not found to copy.");
    const text = element.innerText;
    navigator.clipboard.writeText(text)
    .then(() => alert("Text copied to clipboard!"))
    .catch(() => alert("Failed to copy text."));
}

function downloadFile(filename, content) {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// ====== Download Button Event Listeners ======
downloadTokensBtn.addEventListener("click", () => {
    const content = tokensData.map(([t, l]) => `${t}: ${l}`).join("\n");
    downloadFile("tokens.txt", content);
});
downloadParseTreeBtn.addEventListener("click", () => {
    downloadFile("parse_tree.txt", parseTreeData);
});
downloadLogsBtn.addEventListener("click", () => {
    downloadFile("logs.txt", logsData.join("\n"));
});

// ====== Copy Button Event Listeners ======
document.getElementById("copyTokensBtn").addEventListener("click", () => {
    copyText("tokensTable");
});
document.getElementById("copyParseTreeBtn").addEventListener("click", () => {
    copyText("parseTreeViz");
});
document.getElementById("copyLogsBtn").addEventListener("click", () => {
    copyText("logs");
});

// ====== Optional: Live Log Refresh (Demo) ======
function updateLogs() {
    const timestamp = new Date().toLocaleTimeString();
    logsPre.textContent += `[${timestamp}] Live log update...\n`;
}
setInterval(updateLogs, 5000);
});
