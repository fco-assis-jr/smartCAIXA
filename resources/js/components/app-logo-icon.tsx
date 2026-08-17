import type { SVGAttributes } from 'react';

/**
 * Marca da SmartCAIXA: uma etiqueta de preço facetada — referência direta ao
 * dia a dia de loja (etiquetagem, caixa, "barato") em vez de um ícone genérico.
 */
export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" d="M8 4 L26 4 L36 14 L36 36 L8 36 Z" />
        </svg>
    );
}
