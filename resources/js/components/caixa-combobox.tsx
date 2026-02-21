import { GenericCombobox, type ComboboxOption } from '@/components/generic-combobox';

type CaixaComboboxProps = {
    caixas: ComboboxOption[];
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
};

export function CaixaCombobox({
    caixas,
    value,
    onChange,
    disabled = false,
}: CaixaComboboxProps) {
    return (
        <GenericCombobox
            id="caixa-combobox"
            label="Número do Caixa"
            options={caixas}
            value={value}
            onChange={onChange}
            placeholder="Selecione o número do caixa..."
            emptyMessage="Nenhum caixa encontrado."
            disabled={disabled}
        />
    );
}
