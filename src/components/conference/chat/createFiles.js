import { jsPDF } from "jspdf";
import "./Roboto-normal";
import FileSaver from "file-saver";

export const createPDF = (diag, naz, fileName, diagTitle, nazTitle, returnSize = false) => {
  const doc = new jsPDF();
  // const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

  doc.setFont("Roboto"); // set font
  doc.setFontSize(14);
  doc.text(diagTitle, pageWidth / 2, 20, { align: "center" });

  doc.setFontSize(12);
  doc.text(diag, 15, 30, { maxWidth: 180 });

  doc.addPage();

  doc.setFontSize(14);
  doc.text(nazTitle, pageWidth / 2, 20, { align: "center" });

  doc.setFontSize(12);
  doc.text(naz, 15, 30, { maxWidth: 180 });

  if (returnSize) {
    return doc.output().length;
  }

  doc.setProperties({
    title: fileName,
    subject: fileName,
    author: "tmed.kz",
    creator: "tmed.kz",
  });

  // doc.save(fileName + ".pdf");
  window.open(URL.createObjectURL(doc.output("blob")));
};

export const createFile = (name, data, mime) => {
  const blob = new Blob([data], { type: mime });
  FileSaver.saveAs(blob, name);
};
