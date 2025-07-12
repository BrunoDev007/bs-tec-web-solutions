
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface FileFormProps {
  file?: any;
  onClose: () => void;
  onSuccess: () => void;
}

const FileForm = ({ file, onClose, onSuccess }: FileFormProps) => {
  const [name, setName] = useState(file?.name || '');
  const [url, setUrl] = useState(file?.url || '');
  const [category, setCategory] = useState(file?.category || '');
  const [size, setSize] = useState(file?.size || '');
  const [type, setType] = useState(file?.type || 'ZIP');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const fileData = {
        name,
        url,
        category,
        size,
        type,
        updated_at: new Date().toISOString()
      };

      if (file?.id) {
        // Editar arquivo existente
        const { error } = await supabase
          .from('files')
          .update(fileData)
          .eq('id', file.id);

        if (error) throw error;
        toast.success('Arquivo atualizado com sucesso!');
      } else {
        // Criar novo arquivo
        const { error } = await supabase
          .from('files')
          .insert([fileData]);

        if (error) throw error;
        toast.success('Arquivo adicionado com sucesso!');
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar arquivo:', error);
      toast.error('Erro ao salvar arquivo');
    }

    setLoading(false);
  };

  return (
    <Card className="w-full border-0 shadow-none">
      <CardHeader className="px-0 pb-4">
        <CardTitle className="text-lg sm:text-xl">
          {file ? 'Editar Arquivo' : 'Adicionar Novo Arquivo'}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0 space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-sm font-medium">Nome do Arquivo</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="category" className="text-sm font-medium">Categoria</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="thermal">Drivers Impressoras Térmicas</SelectItem>
                <SelectItem value="multifunction">Drivers Impressoras Multifuncionais</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="url" className="text-sm font-medium">URL do Arquivo</Label>
            <Input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="size" className="text-sm font-medium">Tamanho</Label>
            <Input
              id="size"
              type="text"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              placeholder="Ex: 58.4 MB"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="type" className="text-sm font-medium">Tipo</Label>
            <Input
              id="type"
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder="Ex: ZIP, PDF"
              className="mt-1"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default FileForm;
