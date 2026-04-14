import React, { useState } from 'react';
import { FileText, FileSpreadsheet, Loader2, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const ReportExporter = ({ transactions = [], budgets = [] }) => {
  const [loading, setLoading] = useState(null);

  const exportPDF = async () => {
    setLoading('pdf');
    try {
      const doc = new jsPDF();
      const now = new Date();
      const income = transactions.filter(t => t.type === 'income').reduce((a, t) => a + t.amount, 0);
      const expenses = transactions.filter(t => t.type === 'expense').reduce((a, t) => a + t.amount, 0);

      doc.setFillColor(5, 150, 105);
      doc.rect(0, 0, 210, 35, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20); doc.setFont('helvetica', 'bold');
      doc.text('SpendWise Report', 14, 20);
      doc.setFontSize(9); doc.setFont('helvetica', 'normal');
      doc.text(`Generated: ${now.toLocaleDateString()}`, 14, 30);

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(13); doc.setFont('helvetica', 'bold');
      doc.text('Financial Summary', 14, 50);

      autoTable(doc, {
        startY: 55,
        head: [['Metric', 'Amount']],
        body: [
          ['Total Income', `₹${income.toLocaleString()}`],
          ['Total Expenses', `₹${expenses.toLocaleString()}`],
          ['Net Balance', `₹${(income - expenses).toLocaleString()}`],
          ['Savings Rate', `${income > 0 ? Math.round(((income - expenses) / income) * 100) : 0}%`],
        ],
        headStyles: { fillColor: [5, 150, 105] },
        alternateRowStyles: { fillColor: [240, 253, 244] },
      });

      doc.setFontSize(13); doc.setFont('helvetica', 'bold');
      doc.text('Transaction History', 14, doc.lastAutoTable.finalY + 15);

      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 20,
        head: [['Date', 'Title', 'Category', 'Type', 'Amount']],
        body: transactions.map(t => [
          new Date(t.date).toLocaleDateString(),
          t.title, t.category, t.type,
          `${t.type === 'expense' ? '-' : '+'}₹${t.amount}`
        ]),
        headStyles: { fillColor: [5, 150, 105] },
        alternateRowStyles: { fillColor: [240, 253, 244] },
      });

      doc.save(`SpendWise_${now.toLocaleDateString('en-IN').replace(/\//g, '-')}.pdf`);
    } catch { alert('PDF export failed'); }
    finally { setLoading(null); }
  };

  const exportExcel = async () => {
    setLoading('excel');
    try {
      const wb = XLSX.utils.book_new();
      const now = new Date();
      const income = transactions.filter(t => t.type === 'income').reduce((a, t) => a + t.amount, 0);
      const expenses = transactions.filter(t => t.type === 'expense').reduce((a, t) => a + t.amount, 0);

      const ws1 = XLSX.utils.aoa_to_sheet([
        ['SpendWise Financial Report'],
        [`Generated: ${now.toLocaleDateString()}`],
        [],
        ['Metric', 'Amount'],
        ['Total Income', income],
        ['Total Expenses', expenses],
        ['Net Balance', income - expenses],
        ['Savings Rate', `${income > 0 ? Math.round(((income - expenses) / income) * 100) : 0}%`],
      ]);
      XLSX.utils.book_append_sheet(wb, ws1, 'Summary');

      const ws2 = XLSX.utils.aoa_to_sheet([
        ['Date', 'Title', 'Category', 'Type', 'Amount'],
        ...transactions.map(t => [
          new Date(t.date).toLocaleDateString(),
          t.title, t.category, t.type,
          t.type === 'expense' ? -t.amount : t.amount
        ])
      ]);
      XLSX.utils.book_append_sheet(wb, ws2, 'Transactions');

      if (budgets.length > 0) {
        const ws3 = XLSX.utils.aoa_to_sheet([
          ['Category', 'Limit', 'Spent', 'Remaining', 'Status'],
          ...budgets.map(b => [
            b.category, b.limit, b.spent || 0,
            b.limit - (b.spent || 0),
            (b.spent || 0) > b.limit ? 'Over Budget' : 'On Track'
          ])
        ]);
        XLSX.utils.book_append_sheet(wb, ws3, 'Budgets');
      }

      XLSX.writeFile(wb, `SpendWise_${now.toLocaleDateString('en-IN').replace(/\//g, '-')}.xlsx`);
    } catch { alert('Excel export failed'); }
    finally { setLoading(null); }
  };

  return (
    <div className="rounded-2xl p-6 h-full"
      style={{ background: '#FFFFFF', border: '1px solid #E5EDE9' }}>
      <div className="flex items-center gap-2 mb-2">
        <Download size={17} style={{ color: '#059669' }}/>
        <h3 className="font-black" style={{ color: '#111827' }}>Export Reports</h3>
      </div>
      <p className="text-sm mb-5" style={{ color: '#6B7280' }}>
        Download your complete financial data as a professional report.
      </p>
      <div className="grid grid-cols-2 gap-3">
        <button onClick={exportPDF} disabled={!!loading}
          className="flex flex-col items-center gap-3 p-5 rounded-2xl transition-all hover:shadow-sm disabled:opacity-50"
          style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
          {loading === 'pdf'
            ? <Loader2 size={26} className="animate-spin" style={{ color: '#ef4444' }}/>
            : <FileText size={26} style={{ color: '#ef4444' }}/>}
          <div className="text-center">
            <p className="font-black text-sm" style={{ color: '#991B1B' }}>Export PDF</p>
            <p className="text-xs mt-0.5" style={{ color: '#F87171' }}>Professional report</p>
          </div>
        </button>
        <button onClick={exportExcel} disabled={!!loading}
          className="flex flex-col items-center gap-3 p-5 rounded-2xl transition-all hover:shadow-sm disabled:opacity-50"
          style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
          {loading === 'excel'
            ? <Loader2 size={26} className="animate-spin" style={{ color: '#059669' }}/>
            : <FileSpreadsheet size={26} style={{ color: '#059669' }}/>}
          <div className="text-center">
            <p className="font-black text-sm" style={{ color: '#065F46' }}>Export Excel</p>
            <p className="text-xs mt-0.5" style={{ color: '#059669' }}>3 sheets included</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default ReportExporter;