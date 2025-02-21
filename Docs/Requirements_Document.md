# **Project Requirements Document: Ada Web Analyzer**

**Project Title:** Ada Web Analyzer

**Prepared For:** Senior Developer

**Prepared By:** [Your Name]

**Date:** [Today's Date]

**Version:** 1.0

---

## **1. Project Overview**

Ada Web Analyzer is a web-based tool that provides **Lexical Analysis, Parsing, and Parse Tree Visualization** for a subset of the  **Ada programming language** . Users will be able to **upload Ada source files** or  **paste code into an editor** , and the application will analyze it to:

* **Extract tokens** (Lexical Analysis)
* **Perform syntax verification** (Parsing)
* **Generate a parse tree** with proper indentation
* **Highlight errors** in the input code
* **Show logs in real-time**
* **Allow users to download results** as text files

The **core logic** (Lexical Analyzer & Recursive Descent Parser) has already been developed in Python. The **web application** will be built using **Django** (or Flask if necessary) and deployed via **Namecheap hosting (cPanel), Cloudflare Workers, or GitHub Pages (if a frontend-only approach is considered).**

---

## **2. Functional Requirements**

### **2.1 User Interaction**

* **File Upload:** Users can upload `.ada` files for analysis.
* **Code Editor:** Users can paste Ada source code into a text box.
* **Token Extraction:** The application extracts tokens from the code using the **Lexical Analyzer** and displays them in a table format.
* **Syntax Analysis:** The application verifies syntactic correctness using the **Recursive Descent Parser** and reports any errors.
* **Parse Tree Visualization:** The application displays an **indented parse tree** with proper formatting, allowing easy tracing of grammar rules.
* **Logging:** Users can view the **real-time logs** for debugging purposes.
* **Download Options:** Users can download:
  * Extracted tokens (`tokens.txt`)
  * Parse tree output (`parse_tree.txt`)
  * Error report (`errors.txt`)

---

### **2.2 Backend Processing**

#### **2.2.1 Lexical Analyzer**

* Reads Ada source code and produces tokens.
* Supports  **Ada reserved words, identifiers, numbers, literals, and operators** .
* Logs warnings for **invalid tokens** (e.g., excessively long identifiers).
* Outputs tokenized content in a structured format.

#### **2.2.2 Recursive Descent Parser**

* Receives a list of tokens from the Lexical Analyzer.
* Verifies syntax based on the given  **Ada grammar rules** .
* Stops on errors if `stop_on_error=True` or recovers if `panic_mode_recover=True`.
* Generates an **indented parse tree** for easy visualization.
* Summarizes errors and logs them.

#### **2.2.3 Logging Mechanism**

* Captures **real-time logs** of lexical and parsing steps.
* Users can view logs in the browser.
* Errors and warnings are clearly highlighted.

---

## **3. Non-Functional Requirements**

### **3.1 Performance**

* The application must process Ada source files **under 2MB** in less than  **3 seconds** .
* The tokenization and parsing should be  **efficient and handle nested structures well** .

### **3.2 Scalability**

* Should support multiple users  **simultaneously** .
* Must be easy to deploy and expand in the future.

### **3.3 Security**

* **Input Validation:** Prevent execution of malicious code via input sanitization.
* **File Upload Restrictions:** Only allow `.ada` files under  **2MB** .
* **Logging Restrictions:** Logs should  **not expose sensitive data** .

### **3.4 Usability**

* Simple **drag-and-drop** file upload.
* Clean UI with **editor-like experience** for pasting code.
* Clear error messages with **line numbers** and descriptions.

---

## **4. System Architecture**

### **4.1 Tech Stack**

| Component                      | Technology Used                                       |
| ------------------------------ | ----------------------------------------------------- |
| **Frontend**             | HTML, CSS, JavaScript (or React for better UI)        |
| **Backend**              | Django (preferred) or Flask                           |
| **Database (if needed)** | SQLite (local) or PostgreSQL (for production)         |
| **Logging**              | Python’s `logging`module                           |
| **Deployment**           | Namecheap cPanel, Cloudflare Workers, or GitHub Pages |
| **Version Control**      | GitHub                                                |

### **4.2 Modules**

#### **Frontend**

* **Upload & Editor Interface** : Allows users to drop `.ada` files or paste code.
* **Display Tokens Table** : Shows extracted tokens in a structured way.
* **Show Parse Tree** : Displays the parse tree with proper indentation.
* **Real-time Log Display** : Shows errors and warnings.
* **Download Buttons** : Enables users to download results.

#### **Backend**

* **Lexical Analyzer Module** : Extracts tokens from the source code.
* **Parser Module** : Parses the tokenized input and checks for syntax errors.
* **Parse Tree Generator** : Builds a structured representation of the parse tree.
* **Logging System** : Tracks errors, warnings, and debugging info.

---

## **5. UI/UX Design**

A simple **dashboard-style UI** with:

* **File Upload Section** (Drag and Drop or Browse)
* **Code Editor Box** (For pasting Ada code)
* **Analyze Button** (Triggers lexical and syntax analysis)
* **Tabs for Viewing** :
* **Tokens**
* **Parse Tree**
* **Logs**
* **Errors**
* **Download Buttons** (for saving results)

---

## **6. Deployment Plan**

### **6.1 Steps to Deploy via cPanel (Namecheap)**

1. **Zip the Django Project** and upload it to  **cPanel’s File Manager** .
2. Set up a **Python application** in cPanel.
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure  **WSGI for Apache** .
5. Set up a **database (if needed)** via MySQL or SQLite.
6. Ensure **static files** are properly served.

### **6.2 Alternative Deployment Options**

* **Cloudflare Workers** : If switching to a lightweight frontend + API backend.
* **GitHub Pages + API** : If a React frontend is preferred with Django as an API.

---

## **7. Development Timeline**

| Task                                    | Estimated Time     |
| --------------------------------------- | ------------------ |
| Set up Django project & models          | 2 hours            |
| Implement Lexical Analyzer in Django    | 1 hour             |
| Implement Parser & Parse Tree Generator | 2 hours            |
| Design UI & Integrate with Backend      | 3 hours            |
| Logging System & Error Handling         | 1 hour             |
| Testing & Debugging                     | 1 hour             |
| Deployment & Hosting                    | 2 hours            |
| **Total Development Time**        | **12 hours** |

---

## **8. Expected Deliverables**

1. **Fully functional Django Web App**
   * Hosted and deployed
   * User-friendly interface for uploading and analyzing Ada code
   * Real-time logging and error tracking
   * Downloadable results
2. **Source Code Repository** (GitHub)
   * Well-structured project with modular components
   * Clear documentation and installation guide
3. **Deployment Guide**
   * Steps to maintain and update the system
4. **Testing Report**
   * Ensuring correctness of Lexical Analyzer and Parser

---

## **9. Future Enhancements**

* **Syntax Highlighting in Code Editor** for better readability.
* **Visualization Improvements** for the parse tree (using D3.js or Graphviz).
* **Integration with AI-powered Code Review** to provide insights on syntax corrections.

---

## **10. Notes for the Developer**

* **Focus on modularity** : Keep Lexical Analyzer and Parser as separate modules.
* **Ensure error handling is robust** : Users should be notified clearly of issues.
* **Make logs accessible in the frontend** : Use WebSockets or periodic updates.
* **Keep deployment simple** : Prioritize **cPanel** or **GitHub Pages** to get it online  **fast** .

---

# **Conclusion**

This document provides a **detailed roadmap** for building and deploying the  **Ada Web Analyzer** . The goal is to have a **fully functional** and **user-friendly web application** by the end of today. 🚀
