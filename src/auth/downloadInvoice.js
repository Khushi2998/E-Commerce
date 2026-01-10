import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const downloadPdf=()=>{
    const invoice=document.querySelector(".invoice");

    if(!invoice){
        alert("Invoice not found");
        return;
    }

     html2canvas(invoice).then((canvas) => {
    const imgData = canvas.toDataURL("image/png"); 
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("invoice.pdf");
  });
};

export default downloadInvoice;