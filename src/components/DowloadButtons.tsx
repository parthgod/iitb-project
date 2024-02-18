import React from "react";
import { Button } from "./ui/button";

const DowloadButtons = ({ onDownload, downloadPDF }: any) => {
  return (
    <div className="flex justify-center items-center gap-3 relative">
      <Button
        onClick={(e) => {
          onDownload;
          location.reload();
        }}
      >
        {" "}
        Export excel{" "}
      </Button>
      <Button onClick={downloadPDF}> Export PDF </Button>
    </div>
  );
};

export default DowloadButtons;
