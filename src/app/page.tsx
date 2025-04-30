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

interface MigrationData {
  currentIP: string;
  macAddress: string;
  sector: string;
  location: string;
}
export default function Home() {
  const [computers, setComputers] = useState<Computer[]>([]
  );
  const [search, setSearch] = useState('');
  const [filteredComputers, setFilteredComputers] = useState<Computer[]>([]);
  const [showWizard, setShowWizard] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedComputer, setSelectedComputer] = useState<Computer | null>(null);
  const [migrationData, setMigrationData] = useState<MigrationData>({
    currentIP: '',
    macAddress: '',
    sector: '',
    location: ''
  });

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

  const startMigration = (computer: Computer) => {
    setSelectedComputer(computer);
    setShowWizard(true);
    setCurrentStep(1);
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const previousStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleMigrationDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMigrationData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const copyMigrationMessage = () => {
    if (!selectedComputer) return;

    const message = `*Migração INICIADA!*

Host antigo: ${selectedComputer.hostnameAntigo}
Usuário legado: ${selectedComputer.usuarioLegado}
Host novo: ${selectedComputer.novoHostname}
IP: ${migrationData.currentIP}
MAC: ${migrationData.macAddress}

Setor: ${migrationData.sector}
Localização: ${migrationData.location}`;

    navigator.clipboard.writeText(message);
  };

  const renderWizardStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="p-4 border rounded mb-4">
            <h2 className="text-xl font-bold mb-4">Passo 1: Login Inicial</h2>
            <p>1. Logar com .\tic.local</p>
            <p>2. Senha: ADMlocal-CP@2018</p>
            <div className="mt-4">
              <button
                onClick={nextStep}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Próximo
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="p-4 border rounded mb-4">
            <h2 className="text-xl font-bold mb-4">Passo 2: Remover Configurações</h2>
            <p>1. Remover BGinfo</p>
            <p>2. Ir no agendador de tarefas</p>
            <p>3. Remover o atualizar papel de parede</p>
            <div className="mt-4">
              <button
                onClick={previousStep}
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
              >
                Anterior
              </button>
              <button
                onClick={nextStep}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Próximo
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="p-4 border rounded mb-4">
            <h2 className="text-xl font-bold mb-4">Passo 3: Configurar RustDesk</h2>
            <p>Ativar o IP no RustDesk</p>
            <div className="mt-4">
              <button
                onClick={previousStep}
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
              >
                Anterior
              </button>
              <button
                onClick={nextStep}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Próximo
              </button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="p-4 border rounded mb-4">
            <h2 className="text-xl font-bold mb-4">Passo 4: Configurar Administrador</h2>
            <p>1. Adicionar o adm.rededor</p>
            <p>2. Dar permissão de administrador</p>
            <div className="mt-4">
              <button
                onClick={previousStep}
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
              >
                Anterior
              </button>
              <button
                onClick={nextStep}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Próximo
              </button>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="p-4 border rounded mb-4">
            <h2 className="text-xl font-bold mb-4">Passo 5: Configurar Domínio</h2>
            <p>1. Renomear computador com o novo host</p>
            <p>2. Colocar no domínio rededor.corp</p>
            <p>3. Utilizar seu usuário da hexa</p>
            <div className="mt-4">
              <button
                onClick={previousStep}
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
              >
                Anterior
              </button>
              <button
                onClick={nextStep}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Próximo
              </button>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="p-4 border rounded mb-4">
            <h2 className="text-xl font-bold mb-4">Passo 6: Configurar Rede</h2>
            <p>1. Acessar a rede \\rededor.corp</p>
            <p>2. Usar credenciais da hexa</p>
            <p>3. Configurar autologon</p>
            <div className="mt-4">
              <button
                onClick={previousStep}
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
              >
                Anterior
              </button>
              <button
                onClick={nextStep}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Próximo
              </button>
            </div>
          </div>
        );
      case 7:
        return (
          <div className="p-4 border rounded mb-4">
            <h2 className="text-xl font-bold mb-4">Passo 7: Iniciar Migração</h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-2">IP Atual:</label>
                <input
                  type="text"
                  name="currentIP"
                  value={migrationData.currentIP}
                  onChange={handleMigrationDataChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-2">MAC:</label>
                <input
                  type="text"
                  name="macAddress"
                  value={migrationData.macAddress}
                  onChange={handleMigrationDataChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-2">Setor:</label>
                <input
                  type="text"
                  name="sector"
                  value={migrationData.sector}
                  onChange={handleMigrationDataChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-2">Localização:</label>
                <input
                  type="text"
                  name="location"
                  value={migrationData.location}
                  onChange={handleMigrationDataChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <button
                onClick={copyMigrationMessage}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Copiar Mensagem de Migração
              </button>
            </div>
            <div className="mt-4">
              <button
                onClick={previousStep}
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
              >
                Anterior
              </button>
              <button
                onClick={nextStep}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Próximo
              </button>
            </div>
          </div>
        );
      case 8:
        return (
          <div className="p-4 border rounded mb-4">
            <h2 className="text-xl font-bold mb-4">Passo 8: Backup</h2>
            <p>Fazer backup do usuário</p>
            <div className="mt-4">
              <button
                onClick={previousStep}
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
              >
                Anterior
              </button>
              <button
                onClick={nextStep}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Próximo
              </button>
            </div>
          </div>
        );
      case 9:
        return (
          <div className="p-4 border rounded mb-4">
            <h2 className="text-xl font-bold mb-4">Passo 9: Certificados e Conexão</h2>
            <p>1. Instalar certificados</p>
            <p>2. Conectar ao \\cp-file-01</p>
            <p>3. Usar usuário legado da máquina</p>
            <div className="mt-4">
              <button
                onClick={previousStep}
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
              >
                Anterior
              </button>
              <button
                onClick={nextStep}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Próximo
              </button>
            </div>
          </div>
        );
      case 10:
        return (
          <div className="p-4 border rounded mb-4">
            <h2 className="text-xl font-bold mb-4">Passo 10: Configurações Finais</h2>
            <p>1. Executar gerenciamento do computador como usuário diferente</p>
            <p>2. Passar permissão de adm para o adm.rededor</p>
            <p>3. Renomear o administrador para tic.local</p>
            <div className="mt-4">
              <button
                onClick={previousStep}
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
              >
                Anterior
              </button>
              <button
                onClick={nextStep}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Próximo
              </button>
            </div>
          </div>
        );
      case 11:
        return (
          <div className="p-4 border rounded mb-4">
            <h2 className="text-xl font-bold mb-4">Passo 11: Finalização</h2>
            <p>1. Finalizar migração no grupo</p>
            <p>2. Solicitar configuração do smart</p>
            <div className="mt-4">
              <button
                onClick={previousStep}
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
              >
                Anterior
              </button>
              <button
                onClick={() => setShowWizard(false)}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Finalizar
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
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

      {showWizard && renderWizardStep()}

      <div className="space-y-2">
        {filteredComputers.map((computer, idx) => (
          <div key={idx} className="border p-3 rounded shadow">
            <p><strong>Old Hostname:</strong> {computer.hostnameAntigo}</p>
            <p><strong>Old User:</strong> {computer.usuarioLegado}</p>
            <p><strong>New Hostname:</strong> {computer.novoHostname}</p>
            <p><strong>Uso:</strong> {computer.tipoDeUso}</p>
            <p><strong>Avaliacao:</strong> {computer.avaliacao}</p>
            <button
              onClick={() => startMigration(computer)}
              className="mt-2 bg-green-500 text-white px-4 py-1 rounded"
            >
              Iniciar Migração
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
