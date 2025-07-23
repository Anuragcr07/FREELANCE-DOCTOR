import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// A valid 1x1 transparent pixel to prevent the corrupt PNG error.
const logoBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

const generateInvoicePDF = (billDetails) => {
  const { billItems, total, patientName, phoneNumber } = billDetails;
  
  const doc = new jsPDF();
  
  // --- Document Header ---
  doc.addImage(logoBase64, 'PNG', 14, 12, 12, 12); 
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('ARTI MEDICINE HOUSE', 30, 20);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('1/005 SHOP NO-2 GROUND FLOOR, VINARM KHAND-1, GOMTI NAGAR', 14, 30);
  doc.text('Phone: 6392143413', 14, 35);
  doc.text('E-Mail: aman7459800883@gmail.com', 14, 40);

  // --- Invoice Details ---
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('GST INVOICE', 200, 20, { align: 'right' });
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const invoiceNumber = `A${String(Math.floor(Math.random() * 9000) + 1000).padStart(4, '0')}`;
  doc.text(`Invoice No: ${invoiceNumber}`, 200, 30, { align: 'right' });
  doc.text(`Date: ${new Date().toLocaleDateString('en-GB')}`, 200, 35, { align: 'right' });

  // --- Patient & GST Details ---
  doc.setLineWidth(0.5);
  doc.line(14, 45, 200, 45); // Horizontal line

  doc.text(`GSTIN: 09DABCU9527B1Z6`, 14, 52); // Using a valid example format
  doc.text(`D.L.No.: UP32200007724, UP32210007720`, 14, 57);
  
  doc.text(`Patient Name: ${patientName || 'N/A'}`, 110, 52);
  doc.text(`Phone Number: ${phoneNumber || 'N/A'}`, 110, 57);
  doc.line(14, 62, 200, 62); // Horizontal line

  // --- Table of Items ---
  const tableColumn = ["SN.", "PRODUCT NAME", "PACK", "HSN", "BATCH", "EXP.", "QTY", "MRP", "RATE", "AMOUNT"];
  const tableRows = [];

  billItems.forEach((item, index) => {
    const itemData = [
      index + 1,
      item.name,
      '1x10', // Placeholder
      '300390', // Placeholder
      item.batchNumber || 'N/A', // Assuming item has batchNumber
      item.expiryDate ? new Date(item.expiryDate).toLocaleDateString('en-GB') : 'N/A', // Assuming item has expiryDate
      item.quantity,
      (item.price * 1.05).toFixed(2), // Placeholder MRP
      item.price.toFixed(2),
      (item.price * item.quantity).toFixed(2),
    ];
    tableRows.push(itemData);
  });

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 65,
    theme: 'grid',
    headStyles: { fillColor: [220, 220, 220], textColor: [0, 0, 0], fontSize: 8 },
    styles: { fontSize: 8, cellPadding: 1.5 },
  });

  // --- Totals Section ---
  const finalY = doc.lastAutoTable.finalY || 100;
  const subTotal = parseFloat(total);
  const discount = subTotal * 0.10;
  const taxableAmount = subTotal - discount;
  const sgst = taxableAmount * 0.06;
  const cgst = taxableAmount * 0.06;
  const grandTotal = taxableAmount + sgst + cgst;
  const roundoff = Math.round(grandTotal) - grandTotal;
  const finalAmount = Math.round(grandTotal);

  doc.setFontSize(10);
  doc.text('Sub Total:', 150, finalY + 10, { align: 'right' });
  doc.text(subTotal.toFixed(2), 200, finalY + 10, { align: 'right' });

  doc.text('Discount 10%:', 150, finalY + 15, { align: 'right' });
  doc.text(discount.toFixed(2), 200, finalY + 15, { align: 'right' });

  doc.text('SGST 6%:', 150, finalY + 20, { align: 'right' });
  doc.text(sgst.toFixed(2), 200, finalY + 20, { align: 'right' });
  
  doc.text('CGST 6%:', 150, finalY + 25, { align: 'right' });
  doc.text(cgst.toFixed(2), 200, finalY + 25, { align: 'right' });

  doc.text('Roundoff:', 150, finalY + 30, { align: 'right' });
  doc.text(roundoff.toFixed(2), 200, finalY + 30, { align: 'right' });

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('GRAND TOTAL:', 150, finalY + 40, { align: 'right' });
  doc.text(`₹${finalAmount.toFixed(2)}`, 200, finalY + 40, { align: 'right' });
  
  // --- Terms and Signature ---
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('Terms & Conditions', 14, finalY + 10);
  doc.setFont('helvetica', 'normal');
  doc.text('Goods once sold will not be taken back or exchanged.', 14, finalY + 15);
  doc.text('Bills not paid by due date will attract 24% interest.', 14, finalY + 20);
  
  doc.setFont('helvetica', 'bold');
  doc.text('For ARTI MEDICINE HOUSE', 14, finalY + 40);
  doc.text('Authorised Signatory', 200, finalY + 55, { align: 'right' });
  
  // Save the PDF
  doc.save(`Invoice-${invoiceNumber}.pdf`);
};

export default generateInvoicePDF;