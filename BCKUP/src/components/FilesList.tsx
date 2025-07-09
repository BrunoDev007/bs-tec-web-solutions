
import React from 'react';
import { FileText, Download, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface File {
  id: string;
  name: string;
  size?: string;
  type: string;
  url: string;
  category: string;
  created_at?: string;
}

interface FilesListProps {
  files: File[];
  title: string;
  isAuthenticated: boolean;
  onEditFile: (file: File) => void;
  onDeleteFile: (fileId: string, fileName: string) => void;
  searchTerm: string;
}

const FilesList = ({ 
  files, 
  title, 
  isAuthenticated, 
  onEditFile, 
  onDeleteFile, 
  searchTerm 
}: FilesListProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          {title} ({files.length} arquivos)
        </h3>
      </div>

      <div className="divide-y divide-gray-200">
        {files.length > 0 ? (
          files.map((file, index) => (
            <div key={file.id || index} className="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <FileText className="h-8 w-8 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{file.name}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                      {file.size && <span>{file.size}</span>}
                      {file.size && <span>•</span>}
                      <span>{file.type}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {isAuthenticated && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditFile(file)}
                        className="text-gray-600 hover:text-blue-600"
                        title="Editar arquivo"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteFile(file.id, file.name)}
                        className="text-gray-600 hover:text-red-600"
                        title="Excluir arquivo"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
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
            <p>Nenhum arquivo encontrado{searchTerm && ` para "${searchTerm}"`}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilesList;
