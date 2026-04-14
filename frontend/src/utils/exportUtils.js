export const exportToCSV = (transactions) => {
  if (!transactions || transactions.length === 0) {
    alert("No data to export!");
    return;
  }

  // 1. Define Headers
  const headers = ["Date", "Title", "Category", "Type", "Amount"];
  
  // 2. Format Rows
  const rows = transactions.map(t => [
    new Date(t.date || Date.now()).toLocaleDateString(),
    t.title,
    t.category,
    t.type,
    t.amount
  ]);

  // 3. Convert to CSV String
  const csvContent = [headers, ...rows]
    .map(e => e.join(","))
    .join("\n");

  // 4. Create and Trigger Download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `SpendWise_Report_${new Date().toLocaleDateString()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};