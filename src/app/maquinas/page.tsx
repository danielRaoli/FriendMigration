'use client';

import { useState, ChangeEvent } from 'react';
import * as XLSX from 'xlsx';

interface AdAccount {
  adConta: string;
  adSenha: string;
}

export default function AdAccountsPage() {
  const [adAccounts, setAdAccounts] = useState<AdAccount[]>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<AdAccount[]>([]);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);

      console.log(data)

      const normalized = (data as any[]).map(row => ({
        adConta: row.adConta || '',
        adSenha: row.adSenha || '',
      }));

      setAdAccounts(normalized);
      setFilteredAccounts(normalized);
    };
    reader.readAsBinaryString(file);
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    const filtered = adAccounts.filter(account =>
      account.adConta?.toLowerCase().includes(value)
    );
    setFilteredAccounts(filtered);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Importar Contas AD</h1>

      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        className="mb-4"
      />

      <input
        type="text"
        placeholder="Buscar AD Conta"
        onChange={handleSearch}
        className="mb-4 block w-full p-2 border rounded"
      />

      <ul className="space-y-2">
        {filteredAccounts.map((account, index) => (
          <li key={index} className="p-2 border rounded">
            <strong>Conta:</strong> {account.adConta}<br />
            <strong>Senha:</strong> {account.adSenha}
          </li>
        ))}
      </ul>
    </div>
  );
}
