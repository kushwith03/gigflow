export const downloadCSV = (data: Record<string, unknown>[], filename: string) => {
  if (data.length === 0) return;

  // Define the fields we want to export and their display names
  const fields = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'status', label: 'Status' },
    { key: 'source', label: 'Source' },
    { key: 'createdAt', label: 'Date' },
  ];

  const headers = fields.map(f => f.label).join(',');
  
  const rows = data.map((obj) => 
    fields.map(field => {
      let val = obj[field.key];
      if (field.key === 'createdAt' && typeof val === 'string') {
        val = new Date(val).toLocaleDateString();
      }
      // Escape quotes and wrap in quotes
      return `"${String(val ?? '').replace(/"/g, '""')}"`;
    }).join(',')
  );

  const csvContent = [headers, ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
