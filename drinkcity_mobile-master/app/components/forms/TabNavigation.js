import Ionicons from 'react-native-vector-icons/Ionicons';
import { TabNavigator, TabBarBottom } from 'react-navigation';
import ProfileScreen from '../screens/ProfileScreen';
import ChatsScreen from '../screens/ChatsScreen';

export default TabNavigator({
	{
		Profile: { screen: ProfileScreen },
		chats: { screen: ChatsScreen }
	}
});