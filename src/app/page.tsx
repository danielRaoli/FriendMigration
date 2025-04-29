'use client'; // Adicione isso se for Next 13+ usando app/

import { useState } from 'react';
import * as XLSX from 'xlsx';

type Computer = {
  avaliacao: string,
  setor: string,
  tipoDeUso: string,
  hostnameAntigo: string,
  usuarioLegado: string,
  senhaLegado: string,
  novoHostname: string,
  usuario: string
};

export default function Home() {
  const [computers, setComputers] = useState<Computer[]>([]);
  const [search, setSearch] = useState('');
  const [filteredComputers, setFilteredComputers] = useState<Computer[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json<Computer>(ws);
      setComputers(data);
      setFilteredComputers(data);
    };
    reader.readAsBinaryString(file);
  };

  const handleSearch = (e: string) => {

    setSearch(e);

    const filtered = computers.filter(c =>
      c.hostnameAntigo?.toLowerCase().includes(e.toLowerCase())
    );


    setFilteredComputers(filtered);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Migração de Computadores</h1>

      <div className="mb-4">
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          className="border p-2"
        />
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por Hostname antigo..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="border p-2 w-full"
        />
      </div>

      <div className="space-y-2">
        {filteredComputers.map((computer, idx) => (
          <div key={idx} className="border p-3 rounded shadow">
            <p><strong>Old Hostname:</strong> {computer.hostnameAntigo}</p>
            <p><strong>Old password:</strong> {computer.senhaLegado}</p>
            <p><strong>New Hostname:</strong> {computer.novoHostname}</p>
            <p><strong>Uso</strong> {computer.tipoDeUso}</p>
            <p><strong>Avaliacao:</strong> {computer.avaliacao}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
