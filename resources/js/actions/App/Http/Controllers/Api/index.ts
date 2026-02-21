import FilialController from './FilialController'
import ProdutoController from './ProdutoController'
const Api = {
    FilialController: Object.assign(FilialController, FilialController),
ProdutoController: Object.assign(ProdutoController, ProdutoController),
}

export default Api