import { TabNavigator, TabBarBottom, StackNavigator } from 'react-navigation';
import Pagadas from '../screens/Pagadas'
import Validadas from '../screens/Validadas'
import Todas from '../screens/Todas'

const DetallesVentas = TabNavigator({
	Pagadas: {
		screen: Pagadas
	},
	Validadas: {
		screen: Validadas
	},
	Todas: {
		screen: Todas
	}
},{
	tabBarPosition: 'bottom',
	tabBarOptions: {
		style: {
			backgroundColor: "#01DAC9",
			elevation: 0
		},
		inactiveTintColor: "#000000",
		activeTintColor: "#ffffff",
		tabStyle: {
			height: 52,
			elevation: 1.5
		},
		iconStyle: { height: 45, width: 45 },
		indicatorStyle: {
			backgroundColor:"#FFFFFF",
			top: 0
		},
		showIcon: false,
		showLabel: true,
		lazy: false
	}
});

export default DetallesVentas;