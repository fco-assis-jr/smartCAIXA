import ProdutosPorGramaturaController from './ProdutosPorGramaturaController'
import ProdutosPorDescricaoController from './ProdutosPorDescricaoController'
import BuscarProdutoDevolucaoController from './BuscarProdutoDevolucaoController'
import BuscarItensNotaController from './BuscarItensNotaController'
const PesquisarVendas = {
    ProdutosPorGramaturaController: Object.assign(ProdutosPorGramaturaController, ProdutosPorGramaturaController),
ProdutosPorDescricaoController: Object.assign(ProdutosPorDescricaoController, ProdutosPorDescricaoController),
BuscarProdutoDevolucaoController: Object.assign(BuscarProdutoDevolucaoController, BuscarProdutoDevolucaoController),
BuscarItensNotaController: Object.assign(BuscarItensNotaController, BuscarItensNotaController),
}

export default PesquisarVendas