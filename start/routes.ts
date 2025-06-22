import router from '@adonisjs/core/services/router'
import AuthController from '#controllers/auth_controller'
import { middleware } from '#start/kernel'
import KategoriController from '#controllers/kategori_controller'
import SupplierController from '#controllers/suppliers_controller' 
import ProdukController from '#controllers/produks_controller'
import PenjualanController from '#controllers/penjualans_controller'
import StokController from '#controllers/stok_logs_controller'
import DashboardController from '#controllers/dashboard_controller'

router.get('/', async ({ view }) => {
  return view.render('pages/home')
})

router.get('/login', [AuthController, 'showLogin']).as('login')
router.post('/login', [AuthController, 'login'])

router.get('/register', [AuthController, 'showRegister']).as('register')
router.post('/register', [AuthController, 'register'])

router.post('/logout', [AuthController, 'logout']).as('logout')

router.get('/dashboard', [DashboardController, 'index']).middleware(middleware.auth())

router
  .resource('kategori', KategoriController)
  .only(['index', 'create', 'store', 'edit', 'update', 'destroy'])
  .as('kategori')

router.resource('supplier', SupplierController).as('supplier')
router.resource('produk', ProdukController).as('produk')

router.get('/penjualan', [PenjualanController, 'index']).as('penjualan.index')
router.get('/penjualan/baru', [PenjualanController, 'create']).as('penjualan.create')
router.post('/penjualan', [PenjualanController, 'store']).as('penjualan.store')

router.get('/stok', [StokController, 'index']).as('stok.index')
router.get('/stok/tambah', [StokController, 'create']).as('stok.create')
router.post('/stok', [StokController, 'store']).as('stok.store')