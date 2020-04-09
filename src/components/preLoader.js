import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image} from 'react-native';

export default class PreLoader extends Component {
  _renderLoader = () => {
    if (this.props.preLoaderVisible) return (
      <View style={styles.background}>
        <Image source={require('../assets/preLoader.gif')} />
      </View>
    )
    else return null;
  }

  render () {
    return (
      this._renderLoader()
    )
  }
}

const styles = StyleSheet.create ({
  background: {
    backgroundColor: 'rgba(236, 240, 241, 1.0)',
    flex: 1,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
