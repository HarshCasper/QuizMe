import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import {Provider} from 'react-redux';
import configureStore from './store/configure-store';
import Home from './src/screens/Home';
import Instructions from './src/screens/Instructions';
import Questions from './src/screens/Questions';
import EndScreen from './src/screens/EndScreen';

const AppNavigator = createStackNavigator({
  Home:Home,
  Instructions:Instructions,
  Questions:Questions,
  EndScreen:EndScreen
},
{
  headerMode: 'none',
  navigationOptions: {
    headerVisible: false
  }
})

const AppContainer = createAppContainer(AppNavigator);
const store = configureStore();

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <View style={styles.container}>
          <AppContainer />
        </View>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
