import buscarItensNota from './buscar-itens-nota'
import buscarProdutoDevolucao from './buscar-produto-devolucao'
import notaBranca from './nota-branca'
import produtosPorDescricao from './produtos-por-descricao'
import produtosPorGramatura from './produtos-por-gramatura'
const pesquisarVendas = {
    produtosPorGramatura: Object.assign(produtosPorGramatura, produtosPorGramatura),
produtosPorDescricao: Object.assign(produtosPorDescricao, produtosPorDescricao),
buscarProdutoDevolucao: Object.assign(buscarProdutoDevolucao, buscarProdutoDevolucao),
buscarItensNota: Object.assign(buscarItensNota, buscarItensNota),
notaBranca: Object.assign(notaBranca, notaBranca),
}

export default pesquisarVendas