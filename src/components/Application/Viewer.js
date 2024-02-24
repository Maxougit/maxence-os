import React, { useState, useEffect } from "react";
import Image from "next/image";

const FileViewer = ({ file }) => {
  const [textContent, setTextContent] = useState("");

  useEffect(() => {
    if (file.extension === "txt") {
      fetch(file.path)
        .then((response) => response.text())
        .then((text) => setTextContent(text));
    }
  }, [file]);

  if (file.extension === "pdf") {
    return <iframe src={file.path} style={{ width: "100%", height: "100%" }} />;
  } else if (file.extension === "jpg") {
    return <Image src={file.path} alt={file.name} height={300} width={300} />;
  } else if (file.extension === "txt") {
    return <pre style={{ whiteSpace: "pre-wrap" }}>{textContent}</pre>;
  } else {
    return <div>Unsupported file type</div>;
  }
};

export default FileViewer;
