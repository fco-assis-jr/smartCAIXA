import { GenericCombobox, type ComboboxOption } from '@/components/generic-combobox';

type TipoBaixaComboboxProps = {
    tipos: ComboboxOption[];
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
};

export function TipoBaixaCombobox({
    tipos,
    value,
    onChange,
    disabled = false,
}: TipoBaixaComboboxProps) {
    return (
        <GenericCombobox
            id="tipo-baixa-combobox"
            label="Tipo de Baixa"
            options={tipos}
            value={value}
            onChange={onChange}
            placeholder="Selecione um tipo..."
            emptyMessage="Nenhum tipo encontrado."
            disabled={disabled}
        />
    );
}
