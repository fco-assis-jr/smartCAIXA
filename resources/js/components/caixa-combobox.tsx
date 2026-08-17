import { useMemo } from 'react';
import {
    GenericCombobox,
    type ComboboxOption,
} from '@/components/generic-combobox';

export type CaixaInfo = {
    codFilial: string;
    numeroCaixa: number;
    descricao: string;
};

type CaixaComboboxProps = {
    caixas: CaixaInfo[];
    codFilial: string;
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
};

export function CaixaCombobox({
    caixas,
    codFilial,
    value,
    onChange,
    disabled = false,
}: CaixaComboboxProps) {
    const options = useMemo<ComboboxOption[]>(() => {
        return caixas
            .filter((caixa) => caixa.codFilial === codFilial)
            .map((caixa) => ({
                value: String(caixa.numeroCaixa),
                label: caixa.descricao || `Caixa ${caixa.numeroCaixa}`,
            }));
    }, [caixas, codFilial]);

    return (
        <GenericCombobox
            id="caixa-combobox"
            label="Número do Caixa"
            options={options}
            value={value}
            onChange={onChange}
            placeholder={
                codFilial
                    ? 'Selecione o caixa...'
                    : 'Selecione a filial primeiro'
            }
            emptyMessage="Nenhum caixa ativo encontrado nessa filial."
            disabled={disabled || !codFilial}
        />
    );
}
