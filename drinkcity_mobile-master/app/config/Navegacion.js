import { StackNavigator } from 'react-navigation';
import Home from '../screens/Home';
import Perfil from '../screens/Perfil';
import CrearProducto from '../screens/CrearProducto';
import PublicacionEstandar from '../screens/publicaciones/PublicacionEstandar';
import Productos from '../screens/Productos';
import Funcionarios from '../screens/Funcionarios';
import AboutFuncionario from '../screens/AboutFuncionario';
import QRScaner from '../screens/QRScaner';
import Streaming from '../screens/Streaming';
import Transmit from '../screens/Transmit';
import Receive from '../screens/Receive';
import VideoDetail from '../screens/VideoDetail';
import onQRScann from '../screens/onQRScann';
import Videos from '../screens/Videos';
import Invitados from '../screens/Invitados'
import ListFormsEvents from '../screens/ListFormsEvents';
import Login from '../screens/Login';
import ListaEventos from '../screens/ListaEventos';
import RrppListaEventos from '../screens/RrppListaEventos';
import Graphics from '../screens/Graphics';
import Splash from '../screens/Splash';
import SlideScreen from '../screens/SlideScreen';
import StoreRegister from '../screens/StoreRegister';
import Ventas from '../screens/Ventas';
import SelectStore from '../screens/SelectStore';
import Entrada from '../screens/Entrada';
import Eventos from '../screens/Eventos';
import ProductoEvento from '../screens/ProductoEvento';
import PorProducto from '../screens/PorProducto';
import Portada from '../screens/Portada';
import DetallesVentas from './DetallesVentas';

import { Platform, StatusBar } from 'react-native';

import FormEvent from '../components/forms/FormEvent';
import FormGuest from '../components/forms/FormGuest';

const Navigation = StackNavigator({
	Splash: {
		screen: Splash
	},
	RootScreen: {
		screen: Login,
		navigationOptions: {
			header: false
		}
	},
	SlideScreen: {
		screen: SlideScreen
	},
	HomeScreen: {
		screen: Home,
		navigationOptions: {
			header: false
		}
	},
	PerfilScreen: {
		screen: Perfil
	},
	CrearProductosScreen: {
		screen: CrearProducto
	},
	Estandar: {
		screen: PublicacionEstandar
	},
	Productos:{
		screen: Productos
	},
	BtnFuncionarios:{
		screen: Funcionarios
	},
	FormFuncionario: {
		screen: AboutFuncionario
	},
	QRScanner:{
		screen: QRScaner
	},
	Streaming:{
		screen: Streaming
	},
	Transmit:{
		screen: Transmit
	},
	Receive:{
		screen: Receive
	},
	VideoDetail: {
		screen: VideoDetail
	},
	onScanner:{
		screen:onQRScann
	},
	Videos:{
		screen:Videos
	},
	FormsEvents: {
		screen: ListFormsEvents
	},
	FormGuest: {
		screen: FormGuest
	},
	FormEvent:{
		screen: FormEvent
	},
	Eventos:{
		screen: ListaEventos
	},
	RrppEventos: {
		screen: RrppListaEventos
	},
	Invitados:{
		screen: Invitados
	},
	VentasScreen: {
		screen: Ventas
	},
	GraphicsScreen: {
		screen: Graphics
	},
	RegisterScreen: {
		screen: StoreRegister
	},
	SelectStoreScreen: {
		screen: SelectStore,
			navigationOptions: {
			title:  'MIS TIENDAS DRINKSCITY',
			headerTintColor: "#ffffff",
			headerStyle: { backgroundColor: "#01DAC9" },
			headerLeft: ()=> null
		}
	},
	Entrada:{
		screen: Entrada
	},
	EventoDetalle: {
		screen: Eventos
	},
	ProductoEvento: {
		screen: ProductoEvento
	},
	PorProducto: {
		screen: PorProducto
	},
	Detalles:{
		screen: DetallesVentas,
		navigationOptions:{
			headerTintColor: "#ffffff",
			title: 'MIS VENTAS'
		}
	},
	portada: {
		screen: Portada
	}
});

export {
	Navigation
}