import { useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export type GramaturaOption = {
    value: string;
    label: string;
};

const gramaturaOptions: GramaturaOption[] = [
    { value: '0.50', label: '0.50 KG' },
    { value: '0.20', label: '0.20 KG' },
    { value: '0.15', label: '0.15 KG' },
    { value: '0.10', label: '0.10 KG' },
    { value: '0.09', label: '0.09 KG' },
    { value: '0.08', label: '0.08 KG' },
    { value: '0.07', label: '0.07 KG' },
    { value: '0.06', label: '0.06 KG' },
    { value: '0.05', label: '0.05 KG' },
    { value: '0.04', label: '0.04 KG' },
    { value: '0.03', label: '0.03 KG' },
    { value: '0.02', label: '0.02 KG' },
    { value: '0.01', label: '0.01 KG' },
];

type GramaturaComboboxProps = {
    value: string;
    onValueChange: (value: string) => void;
    disabled?: boolean;
};

export function GramaturaCombobox({ value, onValueChange, disabled = false }: GramaturaComboboxProps) {
    const [open, setOpen] = useState(false);

    const selectedOption = gramaturaOptions.find((option) => option.value === value);

    return (
        <div className="space-y-2">
            <Label htmlFor="gramatura" className="text-sm">Gramatura</Label>
            <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                    disabled={disabled}
                >
                    {selectedOption ? selectedOption.label : 'Selecione a gramatura...'}
                    <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
                <Command>
                    <CommandInput placeholder="Buscar gramatura..." />
                    <CommandList>
                        <CommandEmpty>Nenhuma gramatura encontrada.</CommandEmpty>
                        <CommandGroup>
                            {gramaturaOptions.map((option) => (
                                <CommandItem
                                    key={option.value}
                                    value={option.value}
                                    onSelect={(currentValue: string) => {
                                        onValueChange(currentValue === value ? '' : currentValue);
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            'mr-2 size-4',
                                            value === option.value ? 'opacity-100' : 'opacity-0',
                                        )}
                                    />
                                    {option.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
        </div>
    );
}
