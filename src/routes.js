import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'

import Main from './pages/Main'
import Profile from './pages/Profile'

const Routes = createAppContainer(
  createStackNavigator(
    {
      Main: {
        screen: Main,
        navigationOptions: {
          title: 'Dev Locator'
        }
      },
      Profile: {
        screen: Profile,
        navigationOptions: {
          title: 'GitHub'
        }
      }
    }, {
      defaultNavigationOptions: {
        headerStyle: {
          backgroundColor: '#7d40e7',
        },
        headerTitleAlign: 'center',
        headerTintColor: 'white'
      }
    }

  )
)

export default Routes