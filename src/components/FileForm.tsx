
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
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{file ? 'Editar Arquivo' : 'Adicionar Novo Arquivo'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome do Arquivo</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Categoria</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="thermal">Drivers Impressoras Térmicas</SelectItem>
                <SelectItem value="multifunction">Drivers Impressoras Multifuncionais</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="url">URL do Arquivo</Label>
            <Input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="size">Tamanho</Label>
            <Input
              id="size"
              type="text"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              placeholder="Ex: 58.4 MB"
            />
          </div>

          <div>
            <Label htmlFor="type">Tipo</Label>
            <Input
              id="type"
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder="Ex: ZIP, PDF"
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default FileForm;
