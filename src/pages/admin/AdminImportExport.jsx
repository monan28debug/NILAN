import { useState } from 'react';
import * as XLSX from 'xlsx';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import AdminLayout from '../../components/AdminLayout';
import { useCollection } from '../../utils/useCollection';

const SHEETS = [
  ['Users', 'users', ['name', 'gender', 'phone1', 'phone2', 'address', 'landmark', 'email', 'uid']],
  ['Orders', 'orders', ['orderId', 'customerName', 'phone', 'finalAmount', 'paymentMethod', 'orderStatus']],
  ['Products', 'products', ['name', 'price', 'category', 'stock', 'imageUrl']],
  ['Transactions', 'transactions', ['orderId', 'amount', 'paymentMethod', 'paymentStatus']],
  ['CODRequests', 'codRequests', ['orderId', 'customerName', 'phone', 'finalAmount', 'status']],
  ['UPIRequests', 'upiRequests', ['orderId', 'customerName', 'phone', 'finalAmount', 'status']],
  ['ReturnRequests', 'returnRequests', ['orderId', 'productName', 'reason', 'status']],
  ['WholesaleRequests', 'wholesaleRequests', ['name', 'phone', 'address', 'description', 'status']],
  ['Reviews', 'reviews', ['productId', 'name', 'rating', 'comment']],
  ['Coupons', 'coupons', ['code', 'discountType', 'discountValue', 'enabled']],
  ['Tracking', 'trackingUpdates', ['orderId', 'status', 'note', 'adminId']],
  ['LoginHistory', 'loginHistory', ['uid', 'email']],
];

export default function AdminImportExport() {
  const collections = Object.fromEntries(SHEETS.map(([, col]) => [col, useCollection(col)]));
  const [importResult, setImportResult] = useState(null);

  const exportAll = () => {
    const wb = XLSX.utils.book_new();
    SHEETS.forEach(([sheetName, col, fields]) => {
      const rows = (collections[col].data || []).map((row) =>
        Object.fromEntries(fields.map((f) => [f, row[f] ?? '']))
      );
      const ws = XLSX.utils.json_to_sheet(rows.length ? rows : [Object.fromEntries(fields.map((f) => [f, '']))]);
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
    });
    XLSX.writeFile(wb, `nilan-fashion-export-${Date.now()}.xlsx`);
  };

  const importProducts = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const buf = await file.arrayBuffer();
    const wb = XLSX.read(buf);
    const sheet = wb.Sheets['Products'] || wb.Sheets[wb.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);
    let success = 0, errors = 0;
    for (const row of rows) {
      if (!row.name || !row.price) { errors++; continue; }
      try {
        await addDoc(collection(db, 'products'), {
          name: row.name,
          price: Number(row.price),
          category: row.category || '',
          stock: Number(row.stock || 0),
          imageUrl: row.imageUrl || '',
          description: row.description || '',
          shortDetails: row.shortDetails || '',
          enabled: true,
          createdAt: serverTimestamp(),
        });
        success++;
      } catch { errors++; }
    }
    setImportResult({ success, errors, total: rows.length });
  };

  return (
    <AdminLayout title="Excel Import/Export">
      <div className="bg-ivory border border-line/10 p-5 max-w-md mb-8">
        <h3 className="font-display text-lg mb-3">Export</h3>
        <p className="text-sm text-charcoal/60 mb-4">
          Downloads a workbook with a sheet per data type. Passwords and API secrets are never included.
        </p>
        <button onClick={exportAll} className="btn-gold">Export all data (.xlsx)</button>
      </div>

      <div className="bg-ivory border border-line/10 p-5 max-w-md">
        <h3 className="font-display text-lg mb-3">Import products</h3>
        <p className="text-sm text-charcoal/60 mb-4">
          Upload an .xlsx with a "Products" sheet (columns: name, price, category, stock, imageUrl, description, shortDetails). New rows are added — existing products are never overwritten.
        </p>
        <input type="file" accept=".xlsx,.xls" onChange={importProducts} className="text-sm mb-3" />
        {importResult && (
          <p className="text-xs text-charcoal/60">
            Imported {importResult.success} of {importResult.total} rows{importResult.errors ? ` (${importResult.errors} skipped)` : ''}.
          </p>
        )}
      </div>
    </AdminLayout>
  );
}
