import jsPDF from "jspdf";
import { formatCurrency } from "./formatCurrency";
import { formatDate } from "./formatDate";

interface PaymentLinkData {
  reference: string;
  amount: number;
  currency: string;
  link: string;
}

/**
 * Downloads a QR code as a PDF file
 * @param qrCanvas - The canvas element containing the QR code
 * @param paymentData - Payment link data to include in the PDF
 */
export const downloadQRCodeAsPDF = async (
  qrCanvas: HTMLCanvasElement,
  paymentData: PaymentLinkData
): Promise<void> => {
  try {
    // Generate QR code as data URL
    const qrDataUrl = qrCanvas.toDataURL('image/png');

    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Add title
    pdf.setFontSize(20);
    pdf.text('Payment Link QR Code', 105, 20, { align: 'center' });

    // Add reference
    pdf.setFontSize(12);
    pdf.text(`Reference: ${paymentData.reference}`, 105, 30, { align: 'center' });

    // Add amount
    pdf.setFontSize(14);
    pdf.text(
      `Amount: ${formatCurrency(paymentData.amount, paymentData.currency)}`,
      105,
      40,
      { align: 'center' }
    );

    // Add QR code (centered)
    const qrSize = 100;
    const xPos = (210 - qrSize) / 2; // Center on A4 width (210mm)
    pdf.addImage(qrDataUrl, 'PNG', xPos, 50, qrSize, qrSize);

    // Add link text below QR code
    pdf.setFontSize(10);
    pdf.text('Scan to pay or visit:', 105, 160, { align: 'center' });
    pdf.setFontSize(9);
    pdf.text(paymentData.link, 105, 167, { align: 'center' });

    // Add footer
    pdf.setFontSize(8);
    pdf.setTextColor(128);
    pdf.text(
      `Generated on ${formatDate(new Date())}`,
      105,
      280,
      { align: 'center' }
    );

    // Save PDF
    pdf.save(`payment-link-${paymentData.reference}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
};
