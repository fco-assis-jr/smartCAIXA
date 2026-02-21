import Auth from './Auth'
import Api from './Api'
import BaixaProduto from './BaixaProduto'
import Ferramentas from './Ferramentas'
import PesquisarVendas from './PesquisarVendas'
const Controllers = {
    Auth: Object.assign(Auth, Auth),
Api: Object.assign(Api, Api),
BaixaProduto: Object.assign(BaixaProduto, BaixaProduto),
Ferramentas: Object.assign(Ferramentas, Ferramentas),
PesquisarVendas: Object.assign(PesquisarVendas, PesquisarVendas),
}

export default Controllers