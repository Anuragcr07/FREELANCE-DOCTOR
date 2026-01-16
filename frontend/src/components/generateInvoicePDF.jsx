import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const logoBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

const generateInvoicePDF = (billDetails) => {
  const { 
    billItems, 
    subTotal, 
    discountPercent, 
    taxPercent, 
    total, 
    patientName, 
    phoneNumber, 
    storeInfo 
  } = billDetails;
  
  const doc = new jsPDF();
  
  // --- Header ---
  doc.addImage(logoBase64, 'PNG', 14, 12, 12, 12); 
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(storeInfo.name.toUpperCase(), 30, 20);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(storeInfo.address.toUpperCase(), 14, 30);
  doc.text(`Phone: ${storeInfo.phone} | E-Mail: ${storeInfo.email}`, 14, 35);

  // --- Invoice Details ---
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('RETAIL INVOICE', 200, 20, { align: 'right' });
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;
  doc.text(`Invoice No: ${invoiceNumber}`, 200, 28, { align: 'right' });
  doc.text(`Date: ${new Date().toLocaleDateString('en-GB')}`, 200, 33, { align: 'right' });

  doc.setLineWidth(0.3);
  doc.line(14, 40, 200, 40);

  doc.text(`GSTIN: ${storeInfo.gstin}`, 14, 46);
  doc.text(`D.L.No.: ${storeInfo.dlNo}`, 14, 51);
  
  doc.text(`Patient: ${patientName || 'WALK-IN'}`, 110, 46);
  doc.text(`Phone: ${phoneNumber || 'N/A'}`, 110, 51);
  doc.line(14, 55, 200, 55);

  // --- Table ---
  const tableColumn = ["SN.", "PRODUCT", "BATCH", "EXP.", "QTY", "MRP", "RATE", "AMOUNT"];
  const tableRows = [];

  billItems.forEach((item, index) => {
    tableRows.push([
      index + 1,
      item.name.toUpperCase(),
      item.batchNumber || '---',
      // FIXED: changed '2y' to '2-digit'
      item.expiryDate ? new Date(item.expiryDate).toLocaleDateString('en-GB', { month: 'short', year: '2-digit' }) : 'N/A',
      item.quantity,
      (item.price * 1.1).toFixed(2),
      item.price.toFixed(2),
      (item.price * item.quantity).toFixed(2),
    ]);
  });

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 60,
    theme: 'grid',
    headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontSize: 8, fontStyle: 'bold' },
    styles: { fontSize: 8, cellPadding: 2 },
  });

  // --- Totals ---
  const finalY = doc.lastAutoTable.finalY || 100;
  const discVal = subTotal * (discountPercent / 100);
  const taxVal = (subTotal - discVal) * (taxPercent / 100);
  
  doc.setFontSize(9);
  const rX = 165;
  const vX = 200;

  doc.text('Sub Total:', rX, finalY + 10, { align: 'right' });
  doc.text(subTotal.toFixed(2), vX, finalY + 10, { align: 'right' });

  doc.text(`Discount (${discountPercent}%):`, rX, finalY + 15, { align: 'right' });
  doc.text(`- ${discVal.toFixed(2)}`, vX, finalY + 15, { align: 'right' });

  doc.text(`GST (${taxPercent}%):`, rX, finalY + 20, { align: 'right' });
  doc.text(`+ ${taxVal.toFixed(2)}`, vX, finalY + 20, { align: 'right' });

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('GRAND TOTAL:', rX, finalY + 30, { align: 'right' });
  doc.text(`INR ${total}`, vX, finalY + 30, { align: 'right' });
  
  doc.setFontSize(8);
  doc.text(`For ${storeInfo.name.toUpperCase()}`, 14, finalY + 30);
  doc.text('Authorized Signatory', 200, finalY + 45, { align: 'right' });
  
  doc.save(`Invoice-${invoiceNumber}.pdf`);
};

export default generateInvoicePDF;