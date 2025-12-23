# JPG to WebP Converter (Next.js)

A local JPG to WebP image converter built with Next.js. The application runs on a local development server and performs image conversion using **libwebp** installed on the host system.

This project is currently focused on local usage and experimentation, with plans to improve portability and deployment options over time.

---

## Features

* **Convert JPG images**: Transform images to WebP format.
* **Local Processing**: Performs image processing on the host machine.
* **User Interface**: Simple preview-based workflow.
* **Framework**: Built with Next.js and React.
* **System Integration**: Relies on system-installed libwebp.

---

## Project Structure

```text
.
├── components/
├── lib/
├── pages/
├── styles/
├── next.config.js
├── package.json
├── package-lock.json
└── README.md


## Requirements

Before running the project, ensure the following are installed:

- **Node.js** (v18 or later recommended)
- **npm**
- **Windows OS**  
  > Current implementation depends on a Windows `libwebp` binary
- **libwebp** (installed and available in system `PATH`)

---

## Installing libwebp (Windows)

This project depends on **libwebp** being available as a system binary.

### Download

Official downloads are provided by Google:

- **WebP download page**  
  https://developers.google.com/speed/webp/download

- **Direct release index (Windows binaries)**  
  https://storage.googleapis.com/downloads.webmproject.org/releases/webp/index.html

Download the following archive:
libwebp-1.6.0-windows-x64.zip

---

## Extract

1. Extract the downloaded ZIP file.
2. Inside it, locate the `bin` folder:

---

### Add libwebp to System PATH

1. Copy the full path to the `bin` directory, for example:
C:\tools\libwebp-1.6.0-windows-x64\bin


2. Open **System Properties**  
   - Press `Win + R`
   - Type `sysdm.cpl` and press **Enter**

3. Navigate to:
   - **Advanced** tab
   - **Environment Variables**

4. Under **System variables**:
   - Select **Path** → **Edit**
   - Click **New** and paste the `bin` directory path

5. Confirm all dialogs and restart your terminal.

---

## Verify Installation

Open a new terminal and run:

```cwebp -version

If installed correctly, the libwebp version information will be displayed.

---

## Installation
Clone the repository and install dependencies:

```npm install

---

##Running the Development Server

Start the local server with:

```npm run start
or

```npm run dev

Then open your browser and enter the ```localhost:port address provided

---

##Notes on Deployment

This project cannot be deployed directly to static hosts in its current form.
Reasons:
- Dependency on a native Windows libwebp binary
- Prevents execution in serverless or sandboxed environments

---

##The project is currently intended for:
- Local development
- Learning and experimentation

---

##Future refactoring:
- Roadmap / Future Improvements
- Replace native libwebp dependency with a WASM-based encoder
- Enable cross-platform support (Linux/macOS)
- Drag-and-drop file uploads

---

##Contributing

Contributions are welcome 🎉
Feel free to open issues or submit pull requests for:
- Improvements
- Refactors
- Feature additions

License
MIT License