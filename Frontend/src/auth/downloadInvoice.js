import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const downloadPdf = async () => {
  const element = document.getElementById("invoice-print");

  const canvas = await html2canvas(element, {
    scale: 1.3,
    backgroundColor: "#ffffff"
  });

  const imgData = canvas.toDataURL("image/png",0.7);

  const pdf = new jsPDF("p", "mm", "a4");
  const pdfWidth = 210;
  const maxHeight = 297;
  let pdfHeight = (canvas.height * pdfWidth) / canvas.width;

if (pdfHeight > maxHeight) {
  pdfHeight = maxHeight;
}

  pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
  pdf.save(`invoice.pdf`);
};

export default downloadPdf;