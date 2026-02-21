import { GenericCombobox, type ComboboxOption } from '@/components/generic-combobox';

type FilialComboboxProps = {
    filiais: ComboboxOption[];
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
};

export function FilialCombobox({
    filiais,
    value,
    onChange,
    disabled = false,
}: FilialComboboxProps) {
    return (
        <GenericCombobox
            id="filial-combobox"
            label="Filial"
            options={filiais}
            value={value}
            onChange={onChange}
            placeholder="Selecione uma filial..."
            emptyMessage="Nenhuma filial encontrada."
            disabled={disabled}
        />
    );
}
