import FileSaver from "file-saver";
import pdfMake from "pdfmake/build/pdfmake";
import vfsFonts from "pdfmake/build/vfs_fonts";

export const createPDF = (diag, pacient, doctor) => {
  const { vfs } = vfsFonts.pdfMake;
  pdfMake.vfs = vfs;

  const def = {
    pageSize: "A4",
    info: {
      title: "Консультативное заключение",
      author: "tmed.kz",
      subject: "tmed.kz",
      keywords: "tmed.kz",
    },
    styles: {
      header: {
        fontSize: 12,
        bold: true,
        alignment: "center",
      },
      anotherStyle: {
        italics: true,
        alignment: "right",
      },
    },
    content: [
      { text: "ГКП на ПХВ «Алматинская многопрофильная клиническая больница»", style: "header" },
      "\n",
      { text: "Г. Алматы,  ул. Демченко  д.83а,  телефон 8-727-399-38-02, Факс 8-727-399-38-89.", fontSize: 11, alignment: "center" },
      "\n",
      { text: "Консультативное заключение ", style: "header" },
      "\n\n",
      { text: ["Ф.И.О.: ", { text: pacient, decoration: "underline" }], fontSize: 11 },
      "\n",
      {
        text: [
          "Записи: \n",
          {
            text: diag,
            decoration: "underline",
          },
        ],
        fontSize: 11,
      },
      "\n",
      { text: ["Врач: ", { text: doctor, decoration: "underline" }], fontSize: 11 },
    ],
  };

  const pdfDocGenerator = pdfMake.createPdf(def);
  pdfDocGenerator.getBlob((blob) => {
    window.open(URL.createObjectURL(blob));
  });
};

// export const createPDF = (diag, fileName, diagTitle, returnSize = false) => {
//   const doc = new jsPDF();
//   // const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
//   const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

//   doc.setFont("Roboto"); // set font
//   doc.setFontSize(14);
//   doc.text(diagTitle, pageWidth / 2, 20, { align: "center" });

//   doc.setFontSize(12);
//   doc.text(diag, 15, 30, { maxWidth: 180 });

//   // doc.addPage();

//   // doc.setFontSize(14);
//   // doc.text(nazTitle, pageWidth / 2, 20, { align: "center" });

//   // doc.setFontSize(12);
//   // doc.text(naz, 15, 30, { maxWidth: 180 });

//   if (returnSize) {
//     return doc.output().length;
//   }

//   doc.setProperties({
//     title: fileName,
//     subject: fileName,
//     author: "tmed.kz",
//     creator: "tmed.kz",
//   });

//   // doc.save(fileName + ".pdf");
//   window.open(URL.createObjectURL(doc.output("blob")));
// };

export const createFile = (name, data, mime) => {
  const blob = new Blob([data], { type: mime });
  FileSaver.saveAs(blob, name);
};
