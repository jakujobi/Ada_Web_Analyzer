document.addEventListener("DOMContentLoaded", () => {
    const uploadForm = document.getElementById("uploadForm");
    const codeForm = document.getElementById("codeForm");
    const resultsSection = document.getElementById("resultsSection");

    const tokensTableBody = document.querySelector("#tokensTable tbody");
    // Removed old parseTree <pre> reference; now we use D3 container:
    const parseTreeViz = document.getElementById("parseTreeViz");
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
        logsPre.textContent = "";

        // Tokens
        tokensData = data.tokens || [];
        tokensData.forEach(([tokenType, lexeme]) => {
            const row = document.createElement("tr");
            row.innerHTML = `<td>${tokenType}</td><td>${lexeme}</td>`;
            tokensTableBody.appendChild(row);
        });

        // Capture parse tree text (it might be a text version; convert into JSON tree if needed)
        parseTreeData = data.parse_tree || "";
        // For demonstration, we assume parseTreeData is a JSON string representing the tree.
        // Otherwise, you may need to convert the textual representation into nodes.
        renderParseTree(parseTreeData);

        // Logs / Errors
        logsData = data.errors || [];
        logsPre.textContent = logsData.join("\n");

        // Show the results section
        resultsSection.classList.remove("d-none");
    }

    // Render parse tree using D3.js for interactivity and zooming
    function renderParseTree(treeData) {
        // Clear previous visualization
        parseTreeViz.innerHTML = "";
        // For demonstration, assuming treeData is a JSON object.
        // In practice, modify your backend to send JSON parse tree structure.
        let treeJSON = {};
        try {
            treeJSON = JSON.parse(treeData);
        } catch (e) {
            // Fallback: use plain text if JSON parsing fails.
            parseTreeViz.innerHTML = "<pre>" + treeData + "</pre>";
            return;
        }

        // Setup dimensions
        const width = parseTreeViz.clientWidth;
        const height = parseTreeViz.clientHeight;

        // Create an SVG container
        const svg = d3.select(parseTreeViz).append("svg")
            .attr("width", width)
            .attr("height", height)
            .call(d3.zoom().on("zoom", (event) => {
                g.attr("transform", event.transform);
            }))
            .append("g");

        const g = svg.append("g");

        // Create a tree layout
        const treeLayout = d3.tree().size([width - 40, height - 40]);
        const root = d3.hierarchy(treeJSON);
        treeLayout(root);

        // Draw links
        g.selectAll(".link")
            .data(root.links())
            .enter()
            .append("line")
            .attr("class", "link")
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y)
            .attr("stroke", "#0087F7")
            .attr("stroke-width", 2);

        // Draw nodes
        const node = g.selectAll(".node")
            .data(root.descendants())
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", d => `translate(${d.x},${d.y})`);

        node.append("circle")
            .attr("r", 20)
            .attr("fill", "#E8F0FE")
            .attr("stroke", "#0087F7")
            .attr("stroke-width", 2);

        node.append("text")
            .attr("dy", 4)
            .attr("text-anchor", "middle")
            .text(d => d.data.name)
            .attr("fill", "#333")
            .style("font-size", "12px");
    }

    // Download and Copy utilities (same as before)
    function copyText(elementId) {
        const text = document.getElementById(elementId).innerText;
        navigator.clipboard.writeText(text).then(() => {
            alert("Text copied to clipboard!");
        }).catch(() => {
            alert("Failed to copy text.");
        });
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

    function tokensToText(tokensArr) {
        return tokensArr.map(([type, lex]) => `${type}: ${lex}`).join("\n");
    }

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

    document.getElementById("copyTokensBtn").addEventListener("click", () => {
        copyText("tokensTable");
    });
    document.getElementById("copyParseTreeBtn").addEventListener("click", () => {
        copyText("parseTreeViz");
    });
    document.getElementById("copyLogsBtn").addEventListener("click", () => {
        copyText("logs");
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
        const formData = new FormData();
        // Get content directly from CodeMirror editor
        const codeContent = codeEditor.getValue();
        formData.append("ada_code", codeContent);
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

    // Simulated live Log refresh remains as before
    function updateLogs() {
        const logPre = document.getElementById("logs");
        const timestamp = new Date().toLocaleTimeString();
        logPre.textContent += `[${timestamp}] Live log update...\n`;
    }
    setInterval(updateLogs, 5000);

    // Simulated confirmation message on analysis completion
    setTimeout(() => {
        const logsContent = document.getElementById("logs").innerText;
        const message = logsContent.includes("error") ? "Analysis completed with errors." : "Analysis successful. No errors found.";
        document.getElementById("confirmation").textContent = message;
        resultsSection.classList.remove("d-none");
    }, 2000);
});