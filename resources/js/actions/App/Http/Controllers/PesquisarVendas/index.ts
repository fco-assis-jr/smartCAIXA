import BuscarItensNotaController from './BuscarItensNotaController'
import BuscarProdutoDevolucaoController from './BuscarProdutoDevolucaoController'
import NotaBrancaController from './NotaBrancaController'
import ProdutosPorDescricaoController from './ProdutosPorDescricaoController'
import ProdutosPorGramaturaController from './ProdutosPorGramaturaController'
const PesquisarVendas = {
    ProdutosPorGramaturaController: Object.assign(ProdutosPorGramaturaController, ProdutosPorGramaturaController),
ProdutosPorDescricaoController: Object.assign(ProdutosPorDescricaoController, ProdutosPorDescricaoController),
BuscarProdutoDevolucaoController: Object.assign(BuscarProdutoDevolucaoController, BuscarProdutoDevolucaoController),
BuscarItensNotaController: Object.assign(BuscarItensNotaController, BuscarItensNotaController),
NotaBrancaController: Object.assign(NotaBrancaController, NotaBrancaController),
}

export default PesquisarVendas