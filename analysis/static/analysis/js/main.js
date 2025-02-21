document.addEventListener("DOMContentLoaded", () => {
    const uploadForm = document.getElementById("uploadForm");
    const codeForm = document.getElementById("codeForm");
    const resultsSection = document.getElementById("resultsSection");

    const tokensTableBody = document.querySelector("#tokensTable tbody");
    const parseTreePre = document.getElementById("parseTree");
    const logsPre = document.getElementById("logs");

    const downloadTokensBtn = document.getElementById("downloadTokensBtn");
    const downloadParseTreeBtn = document.getElementById("downloadParseTreeBtn");
    const downloadLogsBtn = document.getElementById("downloadLogsBtn");

    // Store results in global variables for easy download
    let tokensData = [];
    let parseTreeData = "";
    let logsData = [];

    // Helper function to handle form submission via AJAX
    async function handleFormSubmit(formData) {
    // POST to process endpoint
    const response = await fetch("/process/", {
        method: "POST",
        body: formData
    });
    if (!response.ok) {
        alert("An error occurred. Please try again.");
        return;
    }
    const data = await response.json();

    // Display results
    displayResults(data);
    }

    // Display results in the UI
    function displayResults(data) {
    // Clear previous results
    tokensTableBody.innerHTML = "";
    parseTreePre.textContent = "";
    logsPre.textContent = "";

    // Tokens
    tokensData = data.tokens || [];
    tokensData.forEach(([tokenType, lexeme]) => {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${tokenType}</td><td>${lexeme}</td>`;
        tokensTableBody.appendChild(row);
    });

    // Parse Tree
    parseTreeData = data.parse_tree || "";
    parseTreePre.textContent = parseTreeData;

    // Logs / Errors
    logsData = data.errors || [];
    logsPre.textContent = logsData.join("\n");

    // Show the results section
    resultsSection.classList.remove("d-none");
    }

    // Convert an array of [tokenType, lexeme] to text for download
    function tokensToText(tokensArr) {
    return tokensArr.map(([type, lex]) => `${type}: ${lex}`).join("\n");
    }

    // Download a text file
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

    // Download Buttons
    downloadTokensBtn.addEventListener("click", () => {
    const content = tokensToText(tokensData);
    downloadFile("tokens.txt", content);
    });
    downloadParseTreeBtn.addEventListener("click", () => {
    downloadFile("parse_tree.txt", parseTreeData);
    });
    downloadLogsBtn.addEventListener("click", () => {
    downloadFile("logs.txt", logsData.join("\n"));
    });

    // Handle file upload form
    uploadForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(uploadForm);
    // CSRF token must be included manually if using fetch
    formData.append("csrfmiddlewaretoken", getCsrfToken());
    handleFormSubmit(formData);
    });

    // Handle code form
    codeForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(codeForm);
    formData.append("csrfmiddlewaretoken", getCsrfToken());
    handleFormSubmit(formData);
    });

    // Utility: Grab the CSRF token from the rendered template
    function getCsrfToken() {
    const csrfInput = document.querySelector(
        "input[name='csrfmiddlewaretoken']"
    );
    return csrfInput ? csrfInput.value : "";
    }
});