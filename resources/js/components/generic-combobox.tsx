import { useRef, useState } from 'react';
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from '@/components/ui/combobox';
import { Label } from '@/components/ui/label';

export type ComboboxOption = {
    value: string;
    label: string;
};

type GenericComboboxProps = {
    id: string;
    label: string;
    options: ComboboxOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    emptyMessage?: string;
    disabled?: boolean;
};

export function GenericCombobox({
    id,
    label,
    options,
    value,
    onChange,
    placeholder = 'Selecione...',
    emptyMessage = 'Nenhum item encontrado.',
    disabled = false,
}: GenericComboboxProps) {
    const [searchValue, setSearchValue] = useState('');
    const [open, setOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);

    // Garantir que options seja sempre um array
    const safeOptions = Array.isArray(options) ? options : [];

    const validOptions = safeOptions.filter(
        (o) => o.value && o.label && o.value !== 'null' && o.value !== '',
    );

    const filteredOptions = validOptions.filter(
        (option) =>
            option.label.toLowerCase().includes(searchValue.toLowerCase()) ||
            option.value.toLowerCase().includes(searchValue.toLowerCase()),
    );

    const selectedOption = validOptions.find((o) => o.value === value);

    return (
        <div className="space-y-2">
            <Label htmlFor={id} className="text-sm">{label}</Label>
            <Combobox
                value={value}
                onValueChange={(values) => {
                    const nextValue = Array.isArray(values)
                        ? (values[0] || '')
                        : ((values as string) || '');
                    onChange(nextValue);
                    setOpen(false);
                    setSearchValue('');
                    if (inputRef.current) {
                        inputRef.current.blur();
                    }
                }}
                disabled={disabled}
                open={open}
                onOpenChange={setOpen}
            >
                <ComboboxInput
                    id={id}
                    ref={inputRef}
                    placeholder={selectedOption ? selectedOption.label : placeholder}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    showClear={!!value}
                    showTrigger
                    disabled={disabled}
                />
                <ComboboxContent>
                    <ComboboxList>
                        {filteredOptions.length === 0 && (
                            <ComboboxEmpty>{emptyMessage}</ComboboxEmpty>
                        )}
                        {filteredOptions.map((option) => (
                            <ComboboxItem key={option.value} value={option.value}>
                                {option.label}
                            </ComboboxItem>
                        ))}
                    </ComboboxList>
                </ComboboxContent>
            </Combobox>
        </div>
    );
}
