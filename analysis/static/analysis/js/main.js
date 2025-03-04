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

    // Global arrays/strings for easy download
    let tokensData = [];
    let parseTreeData = "";
    let logsData = [];

    // ====== CodeMirror Editor Setup ======
    console.log("Initializing CodeMirror...");
    const codeEditor = CodeMirror(document.getElementById("codeEditor"), {
        lineNumbers: true,
        mode: "text/x-csrc", // Ada doesn't have a built-in mode
        theme: "default"
    });
    console.log("CodeMirror initialized.");

    // ====== Handle Upload Form Submission ======
    uploadForm.addEventListener("submit", (e) => {
        e.preventDefault();
        console.log("Upload form submitted via JS.");

        const formData = new FormData(uploadForm);
        // Append CSRF token if needed
        formData.append("csrfmiddlewaretoken", getCsrfToken());

        handleFormSubmit(formData);
    });

    // ====== Handle Code Form Submission ======
    codeForm.addEventListener("submit", (e) => {
        e.preventDefault();
        console.log("Code form submitted via JS.");

        const formData = new FormData();
        const codeContent = codeEditor.getValue();
        formData.append("ada_code", codeContent);
        formData.append("csrfmiddlewaretoken", getCsrfToken());

        handleFormSubmit(formData);
    });

    // ====== Main AJAX Submission ======
    async function handleFormSubmit(formData) {
        try {
        const response = await fetch("/process/", {
            method: "POST",
            body: formData,
        });
        if (!response.ok) {
            console.error("Server returned an error:", response.status);
            alert("An error occurred. Please check the logs or try again.");
            return;
        }
        const data = await response.json();
        displayResults(data);
        } catch (error) {
        console.error("AJAX request failed:", error);
        alert("Request failed. See console for details.");
        }
    }

    // ====== Display Results in the UI ======
    function displayResults(data) {
        console.log("Received data:", data);

        // Clear previous
        tokensTableBody.innerHTML = "";
        logsPre.textContent = "";
        parseTreeViz.innerHTML = "";

        // 1. Tokens
        tokensData = data.tokens || [];
        tokensData.forEach(([tokenType, lexeme]) => {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${tokenType}</td><td>${lexeme}</td>`;
        tokensTableBody.appendChild(row);
        });

        // 2. Parse Tree
        parseTreeData = data.parse_tree || "";
        // If your backend returns a text-based parse tree, just show as <pre>
        // If it's JSON, parse and visualize with D3
        // For now, let's assume text-based:
        const pre = document.createElement("pre");
        pre.id = "parseTree";
        pre.textContent = parseTreeData;
        parseTreeViz.appendChild(pre);

        // 3. Logs / Errors
        logsData = data.errors || [];
        logsPre.textContent = logsData.join("\n");

        // Show results
        resultsSection.classList.remove("d-none");
    }

    // ====== Utility: CSRF Token ======
    function getCsrfToken() {
        const csrfInput = document.querySelector("input[name='csrfmiddlewaretoken']");
        return csrfInput ? csrfInput.value : "";
    }

    // ====== Download Buttons ======
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

    // ====== Copy Buttons ======
    document.getElementById("copyTokensBtn").addEventListener("click", () => {
        copyText("tokensTable");
    });
    document.getElementById("copyParseTreeBtn").addEventListener("click", () => {
        copyText("parseTreeViz");
    });
    document.getElementById("copyLogsBtn").addEventListener("click", () => {
        copyText("logs");
    });

    // ====== Copy & Download Helpers ======
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

    // ====== Optional: Live Log Refresh (demo) ======
    function updateLogs() {
        const timestamp = new Date().toLocaleTimeString();
        logsPre.textContent += `[${timestamp}] Live log update...\n`;
    }
    setInterval(updateLogs, 5000);
});
