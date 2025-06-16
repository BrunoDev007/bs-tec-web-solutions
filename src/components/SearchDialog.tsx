
import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

const SearchDialog = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const searchItems = [
    {
      title: "Página Inicial",
      description: "Página principal do site",
      url: "/",
      category: "Páginas"
    },
    {
      title: "Serviços Prestados",
      description: "Lista completa de serviços oferecidos",
      url: "/servicos",
      category: "Páginas"
    },
    {
      title: "Quem Somos",
      description: "Conheça mais sobre a BS Suporte Tec",
      url: "/quem-somos",
      category: "Páginas"
    },
    {
      title: "Suporte",
      description: "Opções de suporte presencial e remoto",
      url: "/suporte",
      category: "Páginas"
    },
    {
      title: "Contato",
      description: "Entre em contato conosco",
      url: "/contato",
      category: "Páginas"
    },
    {
      title: "Manutenção de Notebooks",
      description: "Reparo e manutenção de notebooks",
      url: "/servicos",
      category: "Serviços"
    },
    {
      title: "Reparo de Computadores",
      description: "Manutenção e reparo de computadores desktop",
      url: "/servicos",
      category: "Serviços"
    },
    {
      title: "Suporte Remoto",
      description: "Assistência técnica à distância",
      url: "/suporte",
      category: "Serviços"
    },
    {
      title: "Suporte Presencial",
      description: "Atendimento técnico no local",
      url: "/suporte",
      category: "Serviços"
    },
    {
      title: "Instalação de Software",
      description: "Instalação e configuração de programas",
      url: "/servicos",
      category: "Serviços"
    },
    {
      title: "Limpeza de Vírus",
      description: "Remoção de malware e vírus",
      url: "/servicos",
      category: "Serviços"
    },
    {
      title: "Backup de Dados",
      description: "Proteção e recuperação de arquivos",
      url: "/servicos",
      category: "Serviços"
    }
  ];

  const handleSelect = (url: string) => {
    setOpen(false);
    navigate(url);
  };

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      {/* Search Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">Buscar...</span>
        <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-xs font-mono bg-slate-700 rounded border">
          ⌘K
        </kbd>
      </button>

      {/* Search Dialog */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Digite para buscar páginas e serviços..." />
        <CommandList>
          <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
          
          {/* Group by categories */}
          {['Páginas', 'Serviços'].map((category) => {
            const categoryItems = searchItems.filter(item => item.category === category);
            
            if (categoryItems.length === 0) return null;
            
            return (
              <CommandGroup key={category} heading={category}>
                {categoryItems.map((item) => (
                  <CommandItem
                    key={`${item.title}-${item.url}`}
                    onSelect={() => handleSelect(item.url)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center space-x-2">
                      <Search className="h-4 w-4" />
                      <div>
                        <div className="font-medium">{item.title}</div>
                        <div className="text-sm text-muted-foreground">{item.description}</div>
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            );
          })}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default SearchDialog;
