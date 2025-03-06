// main.js
document.addEventListener("DOMContentLoaded", () => {
console.log("main.js loaded successfully.");

// Debug info for production troubleshooting
console.log("Window location:", window.location.href);
console.log("Document readyState:", document.readyState);

// ====== DOM Elements ======
const uploadForm = document.getElementById("uploadForm");
console.log("Upload form found:", !!uploadForm);

const codeForm = document.getElementById("codeForm");
console.log("Code form found:", !!codeForm);

const resultsSection = document.getElementById("resultsSection");

const tokensTableBody = document.querySelector("#tokensTable tbody");
console.log("Tokens table body found:", !!tokensTableBody);

const parseTreeViz = document.getElementById("parseTreeViz");
console.log("Parse tree viz found:", !!parseTreeViz);

const logsPre = document.getElementById("logs");
console.log("Logs pre found:", !!logsPre);

const downloadTokensBtn = document.getElementById("downloadTokensBtn");
console.log("Download tokens button found:", !!downloadTokensBtn);

const downloadParseTreeBtn = document.getElementById("downloadParseTreeBtn");
console.log("Download parse tree button found:", !!downloadParseTreeBtn);

const downloadLogsBtn = document.getElementById("downloadLogsBtn");
console.log("Download logs button found:", !!downloadLogsBtn);

// Global variables for results
let tokensData = [];
let parseTreeData = "";
let logsData = [];

// ====== CodeMirror Editor Setup ======
console.log("Initializing CodeMirror...");
let codeEditor;
try {
    if (document.getElementById("codeEditor")) {
        codeEditor = CodeMirror(document.getElementById("codeEditor"), {
            lineNumbers: true,
            mode: "text/x-csrc", // Using C-like highlighting as a fallback
            theme: "default",
            readOnly: false
        });
        console.log("CodeMirror initialized.");
    } else {
        console.error("CodeEditor element not found");
    }
} catch (error) {
    console.error("Error initializing CodeMirror:", error);
}

// ====== AJAX Submission Functions ======
async function handleFormSubmit(formData) {
    try {
    console.log("Submitting form data...");
    // Log the form data for debugging (excluding file contents for brevity)
    for (let pair of formData.entries()) {
        if (pair[0] !== 'ada_file' && pair[0] !== 'ada_code') {
            console.log(pair[0] + ': ' + pair[1]);
        } else {
            console.log(pair[0] + ': [content not shown]');
        }
    }
    
    // Get the absolute URL for the process endpoint
    const processUrl = new URL('/process/', window.location.href).href;
    console.log("Submitting to URL:", processUrl);
    
    const response = await fetch(processUrl, {
        method: "POST",
        body: formData,
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        }
    });
    
    console.log("Response status:", response.status);
    
    if (!response.ok) {
        console.error("Server returned error status:", response.status);
        alert("An error occurred. Please try again. Status: " + response.status);
        return;
    }
    
    const contentType = response.headers.get('content-type');
    console.log("Response content type:", contentType);
    
    if (!contentType || !contentType.includes('application/json')) {
        console.error("Unexpected content type:", contentType);
        const text = await response.text();
        console.log("Response text (first 500 chars):", text.substring(0, 500));
        alert("Server returned an unexpected response format. See console for details.");
        return;
    }
    
    const data = await response.json();
    console.log("Received data:", data);
    displayResults(data);
    } catch (error) {
    console.error("AJAX request failed:", error);
    alert("Request failed: " + error.message + ". See console for details.");
    }
}

function updateProgressBar(percentComplete) {
    const progressBar = document.getElementById("progress-bar");
    if (progressBar) {
        progressBar.style.width = percentComplete + "%";
        progressBar.textContent = percentComplete.toFixed(0) + "%";
    }
}

function displayResults(data) {
    console.log("Received data:", data);

    // Clear previous results
    if (tokensTableBody) tokensTableBody.innerHTML = "";
    if (logsPre) logsPre.textContent = "";
    if (parseTreeViz) parseTreeViz.innerHTML = "";

    // Display Tokens
    tokensData = data.tokens || [];
    if (tokensTableBody) {
        tokensData.forEach(([tokenType, lexeme]) => {
            const row = document.createElement("tr");
            row.innerHTML = `<td>${tokenType}</td><td>${lexeme}</td>`;
            tokensTableBody.appendChild(row);
        });
    }

    // Display Parse Tree (as plain text in a <pre>)
    parseTreeData = data.parse_tree || "";
    if (parseTreeViz) {
        const pre = document.createElement("pre");
        pre.id = "parseTree";
        pre.textContent = parseTreeData;
        parseTreeViz.appendChild(pre);
    }

    // Display Logs / Errors
    logsData = data.errors || [];
    if (logsPre) {
        logsPre.textContent = logsData.join("\n");
    }

    // Reveal the results section
    if (resultsSection) {
        resultsSection.classList.remove("d-none");
    }
}

// ====== Event Listeners for Forms ======
if (uploadForm) {
    uploadForm.addEventListener("submit", (e) => {
        e.preventDefault();
        console.log("Upload form submitted via JS.");
        const formData = new FormData(uploadForm);
        formData.append("csrfmiddlewaretoken", getCsrfToken());

        resetProgressBar();

        // Add progress listener
        const xhr = new XMLHttpRequest();
        xhr.upload.addEventListener("progress", (event) => {
            if (event.lengthComputable) {
                const percentComplete = (event.loaded / event.total) * 100;
                updateProgressBar(percentComplete);
            }
        });

        xhr.open("POST", new URL('/process/', window.location.href).href);
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.onload = async () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const data = JSON.parse(xhr.responseText);
                    displayResults(data);
                } catch (error) {
                    console.error("Error parsing JSON:", error);
                    alert("Failed to parse server response. See console for details.");
                }
            } else {
                console.error("Server returned error status:", xhr.status);
                alert("An error occurred. Please try again. Status: " + xhr.status);
            }
        };
        xhr.onerror = () => {
            console.error("Request failed");
            alert("Request failed. See console for details.");
        };

        xhr.send(formData);
    });
}

function resetProgressBar() {
    updateProgressBar(0);
}

if (codeForm) {
    codeForm.addEventListener("submit", (e) => {
        e.preventDefault();
        console.log("Code form submitted via JS.");
        const formData = new FormData();
        if (codeEditor) {
            const codeContent = codeEditor.getValue();
            formData.append("ada_code", codeContent);
        } else {
            console.error("CodeEditor not initialized");
        }
        formData.append("csrfmiddlewaretoken", getCsrfToken());
        handleFormSubmit(formData);
    });
}

// ====== File Drag & Drop Handling ======
const dropZone = document.getElementById("drop-zone");
const fileInput = document.getElementById("file-input");
const filePreview = document.getElementById("file-preview");

if (dropZone && fileInput) {
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
}

if (fileInput) {
    fileInput.addEventListener("change", (e) => {
        if (fileInput.files.length) {
        previewFile(fileInput.files[0]);
        }
    });
}

function previewFile(file) {
    if (!filePreview) return;
    
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
    if (!csrfInput) {
        console.error("CSRF token input not found in the document");
        // Try to get from cookie as fallback
        return getCsrfCookie();
    }
    return csrfInput.value;
}

function getCsrfCookie() {
    const name = 'csrftoken';
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    console.log("CSRF cookie found:", !!cookieValue);
    return cookieValue;
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
if (downloadTokensBtn) {
    downloadTokensBtn.addEventListener("click", () => {
        const content = tokensData.map(([t, l]) => `${t}: ${l}`).join("\n");
        downloadFile("tokens.txt", content);
    });
}

if (downloadParseTreeBtn) {
    downloadParseTreeBtn.addEventListener("click", () => {
        downloadFile("parse_tree.txt", parseTreeData);
    });
}

if (downloadLogsBtn) {
    downloadLogsBtn.addEventListener("click", () => {
        downloadFile("logs.txt", logsData.join("\n"));
    });
}

// ====== Copy Button Event Listeners ======
const copyTokensBtn = document.getElementById("copyTokensBtn");
if (copyTokensBtn) {
    copyTokensBtn.addEventListener("click", () => {
        copyText("tokensTable");
    });
}

const copyParseTreeBtn = document.getElementById("copyParseTreeBtn");
if (copyParseTreeBtn) {
    copyParseTreeBtn.addEventListener("click", () => {
        copyText("parseTree");
    });
}

const copyLogsBtn = document.getElementById("copyLogsBtn");
if (copyLogsBtn) {
    copyLogsBtn.addEventListener("click", () => {
        copyText("logs");
    });
}

// ====== Optional: Live Log Refresh (Demo) ======
function updateLogs() {
    // This is a placeholder for potential future functionality
    // console.log("Checking for log updates...");
}

// Uncomment if you want to enable periodic log refreshing
// setInterval(updateLogs, 5000);
});
