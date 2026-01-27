import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const downloadPdf = async () => {
  const element = document.getElementById("invoice-print");

  const canvas = await html2canvas(element, {
    scale: 2,
    backgroundColor: "#ffffff"
  });

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");
  const width = 210;
  const height = (canvas.height * width) / canvas.width;

  pdf.addImage(imgData, "PNG", 0, 0, width, height);
  pdf.save(`invoice.pdf`);
};

export default downloadPdf;