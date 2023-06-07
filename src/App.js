import React, { useEffect, useState } from 'react';
import piston from "piston-client";
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import ReportTable from './ReportTable';
import {storage} from './Firebase';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
var detectLang = require('lang-detector');

function App() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [generatedFiles, setGeneratedFiles] = useState([]);
  const [urls, setUrls] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles([...uploadedFiles, ...files]);
  };

  useEffect(() => {
    console.log("genfiles", generatedFiles);
    console.log("urls", urls);
  }, [generatedFiles,urls])

  const generateReport = async() => {

    let generateUrls = [];

    // Perform API calls and generate the report for each file seperately
    uploadedFiles.forEach(async (file) => {
      let content;
      let reader = new FileReader();
      
      reader.onloadend = async() => {
        content = reader.result;
        let lg = detectLang(content).toLowerCase(); // get language of code using a ml model
        
        //use piston client
        (async () => {

          const client = piston({ server: "https://emkc.org" });
          const result = await client.execute(lg, content);

          //use pdf-lib to create pdf
          const pdfDoc = await PDFDocument.create()
          const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)

          let page = pdfDoc.addPage()
          let { width, height } = page.getSize()
          let fontSize = 20;
          page.drawText(`File name: ${file.name}, date and time: ${new Date().toLocaleString()}`, {
            x: 50,
            y: height - 4 * fontSize,
            size: fontSize,
            font: timesRomanFont,
            color: rgb(0, 0.53, 0.71),
          })
          page = pdfDoc.addPage()
          page.drawText(`${content}`, {
            x: 50,
            y: height - 6 * fontSize,
            size: fontSize,
            font: timesRomanFont,
            color: rgb(0, 0.53, 0.71),
          })
          page = pdfDoc.addPage()
          page.drawText(`Language: ${result.language}\n 
          Version: ${result.version}\n 
          Output: ${result.run.stdout}\n 
          Error: ${result.run.stderr}`, {
            x: 50,
            y: height - 8 * fontSize,
            size: fontSize,
            font: timesRomanFont,
            color: rgb(0, 0.53, 0.71),
          })

          const pdfBytes = await pdfDoc.save() //byte array

          // Perform file upload to Firebase Storage
          const storageRef = ref(storage, file.name + '-report.pdf');
          uploadBytes(storageRef, pdfBytes).then((snapshot) => {
              console.log('Uploaded a file!');
          });
          getDownloadURL(storageRef).then((url) => {
            generateUrls.push(url);
            setUrls(generateUrls)
            console.log(generateUrls)
          })
        })();
      }
      reader.readAsText(file);
    });

    // Update the state with the report data
    setGeneratedFiles(uploadedFiles);
    setUploadedFiles([]);
  };

  return (
    <div className='App'>
      <header>
        {/* Logo */}
      </header>
      <input type="file" accept=".txt, .pdf, .docx, .doc" multiple onChange={handleFileChange} />
      <button onClick={generateReport}>Generate Report</button>
      {generatedFiles.length==urls.length?<ReportTable files={generatedFiles} urls={urls} />:null}
    </div>
  );
}

export default App;