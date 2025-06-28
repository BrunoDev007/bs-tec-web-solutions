
import React, { useState } from 'react';
import { FileText, Download, Search } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Arquivos = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const thermalPrinterFiles = [
    { name: 'Driver Epson TM-T20', size: '58.4 MB', type: 'ZIP', url: 'https://mega.nz/file/HUUARCwJ#VxyvGhHL6z5rDBPG7dcgxrQIE8xQa3I4NOA1UhDWegA' },
    { name: 'Driver Epson TM-T20X', size: '2.5 MB', type: 'PDF', url: 'https://mega.nz/file/iVND1YaD#ut1bl9z0gQioChxxJyfdNSSuKa7FfEbto1Ps8dmXpZ4' },
    { name: 'Driver Epson TM-T81-FBII', size: '598 KB', type: 'ZIP', url: 'https://mega.nz/file/DAkCVYKT#mefI5f3drtdqqUGTVhr0f9Oq9CR-NIEwrBM59u7OmnU' },
    { name: 'Driver Bematech MP-4200 TH', size: '1.2 MB', type: 'ZIP', url: 'https://mega.nz/file/example1' },
    { name: 'Driver Elgin i9', size: '3.1 MB', type: 'ZIP', url: 'https://mega.nz/file/example2' },
  ];

  const multifunctionPrinterFiles = [
    { name: 'Driver HP LaserJet Pro MFP M428', size: '125 MB', type: 'ZIP', url: 'https://mega.nz/file/example3' },
    { name: 'Driver Canon PIXMA G3110', size: '89 MB', type: 'ZIP', url: 'https://mega.nz/file/example4' },
    { name: 'Driver Epson EcoTank L3150', size: '156 MB', type: 'ZIP', url: 'https://mega.nz/file/example5' },
    { name: 'Driver Brother DCP-L2540DW', size: '78 MB', type: 'ZIP', url: 'https://mega.nz/file/example6' },
  ];

  const filterFiles = (files) => {
    return files.filter(file =>
      file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredThermalFiles = filterFiles(thermalPrinterFiles);
  const filteredMultifunctionFiles = filterFiles(multifunctionPrinterFiles);

  const FilesList = ({ files, title }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          {title} ({files.length} arquivos)
        </h3>
      </div>

      <div className="divide-y divide-gray-200">
        {files.length > 0 ? (
          files.map((file, index) => (
            <div key={index} className="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <FileText className="h-8 w-8 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{file.name}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                      <span>{file.size}</span>
                      <span>•</span>
                      <span>{file.type}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <a
                    href={file.url}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                    title={`Download ${file.name}`}
                  >
                    <Download className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="px-6 py-8 text-center text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Nenhum arquivo encontrado para "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Arquivos Técnicos
            </h1>
            <p className="text-gray-600">
              Repositório de drivers e ferramentas técnicas organizados por categoria
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar arquivos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Tabs for File Categories */}
        <Tabs defaultValue="thermal" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="thermal">Drivers Impressoras Térmicas</TabsTrigger>
            <TabsTrigger value="multifunction">Drivers Impressoras Multifuncionais</TabsTrigger>
          </TabsList>
          
          <TabsContent value="thermal" className="space-y-4">
            <FilesList 
              files={filteredThermalFiles} 
              title="Drivers para Impressoras Térmicas" 
            />
          </TabsContent>
          
          <TabsContent value="multifunction" className="space-y-4">
            <FilesList 
              files={filteredMultifunctionFiles} 
              title="Drivers para Impressoras Multifuncionais" 
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Arquivos;
