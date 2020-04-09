import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, AppState, BackHandler} from 'react-native';
import Voice from 'react-native-voice';
import Tts from 'react-native-tts';
import {withNavigationFocus, NavigationEvents} from 'react-navigation';

class Home extends Component {

  componentWillMount () {
    // this.welcomeMessage ();
  }

  componentDidMount () {
    Tts.setDucking(true);
    // Tts.setDefaultVoice('en-us-x-sfg#female_1-local');
    Tts.addEventListener('tts-finish', (event) => {this.startRecog ()});
    // Voice.onSpeechStart = this.onSpeechStartHandler.bind(this);
    // Voice.onSpeechEnd = this.onSpeechEndHandler.bind(this);
    Voice.onSpeechResults = this.onSpeechResultsHandler.bind(this);
    //AppState.addEventListener ('change', this._handleAppStateChange);
    this.focusListener = this.props.navigation.addListener("didFocus", () => {
      // The screen is focused
      setTimeout (this.welcomeMessage, 100);
    });
    this.blurListener = this.props.navigation.addListener("willBlur", () => {
      // The screen is unfocused
      Tts.stop();
      Voice.destroy();
    });
  }

  componentWillUnmount () {
    Tts.stop ();
    Voice.destroy ();
    this.focusListener.remove();
    this.blurListener.remove();
    //AppState.removeEventListener ('change', this._handleAppStateChange);
  }

  // _handleAppStateChange = (nextAppState) => {
  //     if (nextAppState === 'inactive') {
  //       Tts.stop ();
  //       Voice.destroy ();
  //     }
  // }

  welcomeMessage () {
    var speakText = 'Welcome to the quiz-app. Click on the Start button, or say start, to begin the quiz';
    Tts.getInitStatus().then(() => {
      Tts.speak(speakText);
    });

  }

  startRecog = () => {
    Voice.start ('en-IN');
  }

  onSpeechResultsHandler (event) {
    var understood = false;
    var negatives = ['NO', 'ISN\'T', 'NOT', 'DON\'T'];
    var startWords = ['Ok', 'Sure', 'Cool', 'Alright', 'Fine'];
    var sentence = event.value [0];
    //console.log (sentence);
    var words = sentence.split (' ');
    for (var i = 0; i < words.length; i++) {
      //console.log (words[i].toUpperCase())
      if (words[i].toUpperCase() === 'START' || words[i].toUpperCase() === 'BEGIN') {
        usedWord = words[i];
        understood = true;
        for  (var i = 0; i < words.length; i++) {
          if (this.isInArray (words[i].toUpperCase (), negatives)) {
              var startWord = startWords [Math.floor (Math.random () * startWords.length)];
              var utterance = startWord + '! I will not ' + usedWord + ' the quiz. So what would you like me to do?'
              Tts.speak (utterance);
              return;
          }
        }
        this.props.navigation.navigate ('Questions');
      }
      else if (words[i].toUpperCase () === 'INSTRUCTIONS') {
        understood = true;
        for  (var i = 0; i < words.length; i++) {
          if (this.isInArray (words[i].toUpperCase (), negatives)) {
              var startWord = startWords [Math.floor (Math.random () * startWords.length)];
              var utterance = startWord + '! I will not open the instructions. So what would you like me to do?'
              Tts.speak (utterance);
              return;
          }
        }
        this.props.navigation.navigate ('Instructions');
      }
      else if (words[i].toUpperCase() === 'EXIT' || words[i].toUpperCase () === 'QUIT' || words[i].toUpperCase () === 'CLOSE') {
        usedWord = words[i];
        understood = true;
        for  (var i = 0; i < words.length; i++) {
          if (this.isInArray (words[i].toUpperCase (), negatives)) {
              var startWord = startWords [Math.floor (Math.random () * startWords.length)];
              var utterance = startWord + '! I will not ' + usedWord + ' the app. So what would you like me to do?'
              Tts.speak (utterance);
              return;
          }
        }
        this.handleBackPress();
      }
    }
    //No matches
    if (!understood) {
      var utterance = 'Sorry, I didn\'t get that.';
      Tts.speak (utterance);
    }
  }

  isInArray (element, array) {
    for (var i = 0; i < array.length; i++) {
      if (element === array[i]) {
        return true;
      }
    }
    return false;
  }

  startButton = () => {
    // Tts.stop ();
    // Voice.destroy ();
    this.props.navigation.navigate ('Questions');
  }

  instructionsButton = () => {
    // Tts.stop ();
    // Voice.destroy ();
    this.props.navigation.navigate ('Instructions');
  }

  handleBackPress = () => {
      //modal code goes here
      BackHandler.exitApp();
      return true;
  }

  render() {
    return (
      <View style = {styles.container}>
        <Text style = {styles.welcome}>Welcome</Text>
        <TouchableOpacity style = {styles.buttonContainer}
          onPress={() => this.startButton ()}>
          <Text style = {styles.buttonText}>Start Quiz</Text>
        </TouchableOpacity>
        <TouchableOpacity style = {styles.buttonContainer}
          onPress={() => this.instructionsButton ()}>
          <Text style = {styles.buttonText}>Instructions</Text>
        </TouchableOpacity>
        <TouchableOpacity style = {styles.buttonContainer}
          onPress={() => this.handleBackPress ()}>
          <Text style = {styles.buttonText}>Exit</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default withNavigationFocus(Home);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(236, 240, 241, 1.0)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  welcome: {
    color: 'rgba(52, 73, 94, 1.0)',
    fontSize: 40,
    marginBottom: 20,
  },
  buttonContainer: {
    backgroundColor: 'rgba(189, 195, 199, 1.0)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    textAlign: 'center',
    color: 'rgba(52, 73, 94, 1.0)',
    fontSize: 30,
  }
});
