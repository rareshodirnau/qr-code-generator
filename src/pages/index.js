import { useState, useRef } from 'react';
import { QRCodeCanvas, QRCodeSVG } from 'qrcode.react';
import jsPDF from 'jspdf';

export default function Home() {
  const [url, setUrl] = useState('');
  const canvasRef = useRef();
  const svgRef = useRef();

  const padding = 20; 
  const qrSize = 600; 

  const downloadPNG = () => {
    const canvas = canvasRef.current.querySelector('canvas');

    
    const paddedCanvas = document.createElement('canvas');
    paddedCanvas.width = qrSize + padding * 2; 
    paddedCanvas.height = qrSize + padding * 2; 
    const context = paddedCanvas.getContext('2d');

    
    context.fillStyle = 'white';
    context.fillRect(0, 0, paddedCanvas.width, paddedCanvas.height);

    context.drawImage(canvas, padding, padding);

    const pngUrl = paddedCanvas.toDataURL('image/png', 1.0);
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = 'qrcode.png';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const downloadSVG = () => {
    const svg = svgRef.current.innerHTML;
    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = 'qrcode.svg';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(svgUrl);
  };

  const downloadPDF = () => {
    const canvas = canvasRef.current.querySelector('canvas');
    const imgData = canvas.toDataURL('image/png', 1.0);

    const pdfSize = 300; 
    const pdf = new jsPDF('p', 'mm', [pdfSize, pdfSize]); 

    const padding = 20; 
    const x = padding; 
    const y = padding; 
    const imgWidth = pdfSize - padding * 2; 
    const imgHeight = imgWidth; 

    pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);

    pdf.save('qrcode.pdf');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-3xl font-bold mb-4">QR Code Generator</h1>
      <input
        type="text"
        placeholder="Introduce URL-ul"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="p-2 border border-gray-300 rounded mb-4"
      />
      {url ? (
        <>
          <div ref={canvasRef} className="mb-4">
            <QRCodeCanvas
              value={url}
              size={qrSize}
              fgColor="#000000"
              style={{ padding }} 
            />
          </div>
          <div ref={svgRef} style={{ display: 'none' }}>
            <QRCodeSVG
              value={url}
              size={qrSize}
              fgColor="#000000"
            />
          </div>
          <div className="flex space-x-4">
            <button
              onClick={downloadPNG}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Descarcă PNG
            </button>
            <button
              onClick={downloadSVG}
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              Descarcă SVG
            </button>
            <button
              onClick={downloadPDF}
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              Descarcă PDF
            </button>
          </div>
        </>
      ) : (
        <p className="text-gray-500">Introdu un URL pentru a genera un cod QR</p>
      )}
    </div>
  );
}
