'use client';

import { useState, ChangeEvent, useEffect } from 'react';
import * as XLSX from 'xlsx';

interface AdAccount {
  adConta: string;
  adSenha: string;
}

interface MigrationData {
  currentIP: string;
  macAddress: string;
  sector: string;
  location: string;
}

export default function AdAccountsPage() {
  const [adAccounts, setAdAccounts] = useState<AdAccount[]>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<AdAccount[]>([]);
  const [showWizard, setShowWizard] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAccount, setSelectedAccount] = useState<AdAccount | null>(null);
  const [migrationData, setMigrationData] = useState<MigrationData>({
    currentIP: '',
    macAddress: '',
    sector: '',
    location: ''
  });

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedAccounts = localStorage.getItem('adAccounts');
    if (savedAccounts) {
      const parsedAccounts = JSON.parse(savedAccounts);
      setAdAccounts(parsedAccounts);
      setFilteredAccounts(parsedAccounts);
    }
  }, []);

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

      const normalized = (data as any[]).map(row => ({
        adConta: row.adConta || '',
        adSenha: row.adSenha || '',
      }));

      setAdAccounts(normalized);
      setFilteredAccounts(normalized);
      // Save to localStorage
      localStorage.setItem('adAccounts', JSON.stringify(normalized));
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

  const startMigration = (account: AdAccount) => {
    setSelectedAccount(account);
    setShowWizard(true);
    setCurrentStep(1);
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const previousStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleMigrationDataChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMigrationData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const copyMigrationMessage = () => {
    if (!selectedAccount) return;

    const message = `*Migração INICIADA!*

Host antigo: ${selectedAccount.adConta}
Usuário legado: ${selectedAccount.adConta}
Host novo: ${selectedAccount.adConta}
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

      {showWizard && renderWizardStep()}

      <ul className="space-y-2">
        {filteredAccounts.map((account, index) => (
          <li key={index} className="p-2 border rounded">
            <strong>Conta:</strong> {account.adConta}<br />
            <strong>Senha:</strong> {account.adSenha}
            <button
              onClick={() => startMigration(account)}
              className="ml-4 bg-green-500 text-white px-4 py-1 rounded"
            >
              Iniciar Migração
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
