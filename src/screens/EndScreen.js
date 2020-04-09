import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, NetInfo, BackHandler, AsyncStorage, AppState} from 'react-native';
import  {Content, Container, Header, Row} from 'native-base';
import Voice from 'react-native-voice';
import Tts from 'react-native-tts';

export default class EndScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      score: 0,
    }
  }

  componentWillMount () {

  }

  componentDidMount () {
    const score = this.props.navigation.getParam ('score');
    this.setState({
      score: score,
      loading: false,
    }, () => {
      this.announceResults ();
    })
    //AppState.addEventListener ('change', this._handleAppStateChange);
    Voice.onSpeechResults = this.onSpeechResultsHandler.bind(this);
    BackHandler.addEventListener ('hardwareBackPress', this.handleBackPress);
  }

  componentWillUnmount () {
    Tts.stop ();
    Voice.destroy ();
    //AppState.removeEventListener ('change', this._handleAppStateChange);
    BackHandler.removeEventListener ('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = () => {
    this.props.navigation.navigate ('Home');
    return true;
  }

  // _handleAppStateChange = (nextAppState) => {
  //     if (nextAppState === 'inactive') {
  //       Tts.stop ();
  //       Voice.destroy ();
  //     }
  // }

  showRank = () => {
    if (this.state.score === 10) {
      return (<Text style={styles.rankText}>Perfect!!</Text>);
    }
    else if (this.state.score > 7) {
      return (<Text style={styles.rankText}>Good Job!</Text>);
    }
    else if (this.score > 5) {
      return (<Text style={styles.rankText}>Average</Text>);
    }
    else if (this.state.score > 1) {
      return (<Text style={styles.rankText}>Better Luck Next Time</Text>);
    }
    else {
      return (<Text style={styles.rankText}>Fail</Text>);
    }
  }

  //Voice commands
  announceResults () {
    var speakText = 'Quiz finished. Your score is ' + this.state.score + ' out of 10.'
    Tts.getInitStatus().then(() => {
      Tts.speak(speakText);
    });
  }

  onSpeechResultsHandler (event) {
    var understood = false;
    var negatives = ['NO', 'ISN\'T', 'NOT', 'DON\'T'];
    var startWords = ['Ok', 'Sure', 'Cool', 'Alright', 'Fine'];
    var sentence = event.value [0];
    var words = sentence.split (' ');
    for (var i = 0; i < words.length; i++) {
      if (words[i].toUpperCase () === 'RESTART') {
        understood = true;
        for  (var i = 0; i < words.length; i++) {
          if (this.isInArray (words[i].toUpperCase (), negatives)) {
              var startWord = startWords [Math.floor (Math.random () * startWords.length)];
              var utterance = startWord + ', I won\'t restart the quiz. So what would you like me to do?'
              Tts.speak (utterance);
              return;
          }
        }
        this.props.navigation.navigate ('Questions');
      }
      else if (words[i].toUpperCase () === 'MENU') {
        understood = true;
        for  (var i = 0; i < words.length; i++) {
          if (this.isInArray (words[i].toUpperCase (), negatives)) {
              var startWord = startWords [Math.floor (Math.random () * startWords.length)];
              var utterance = startWord + ', I won\'t return to the menu. So what would you like me to do?'
              Tts.speak (utterance);
              return;
          }
        }
        this.props.navigation.navigate ('Home');
      }
      else if (words[i].toUpperCase () === 'EXIT' || words[i].toUpperCase () === 'QUIT' || words[i].toUpperCase () === 'CLOSE') {
        understood = true;
        usedWord = words[i];
        for  (var i = 0; i < words.length; i++) {
          if (this.isInArray (words[i].toUpperCase (), negatives)) {
              var startWord = startWords [Math.floor (Math.random () * startWords.length)];
              var utterance = startWord + ', I won\'t ' + usedWord + ' the app. So what would you like me to do?'
              Tts.speak (utterance);
              return;
          }
        }
        BackHandler.exitApp ();
      }
    }
    //No matches
    if (!understood) {
      utterance = 'Sorry, I didn\'t get that.';
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

  render () {
    const  {loading, score} = this.state;
    return (
      <Container style={styles.container}>
        <Content>
          <View style={styles.textContainer}>
            <Text style={styles.finishedText}>Quiz Finished!</Text>
            <Text style={styles.scoreText}>Your Score: {score}/10</Text>
            {this.showRank()}
          </View>
          <View style={styles.textContainer}>
            <TouchableOpacity style={styles.btnStyle} onPress={() => {this.props.navigation.navigate('Home')}}>
              <Text style={styles.buttonText}>Menu</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnStyle} onPress={() => {BackHandler.exitApp()}}>
              <Text style={styles.buttonText}>Exit</Text>
            </TouchableOpacity>
          </View>
        </Content>
      </Container>
    )
  }
}

const styles = StyleSheet.create ({
  container: {
    flex: 1,
    backgroundColor: 'rgba(236, 240, 241, 1.0)',
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center'
  },
  finishedText: {
    marginTop: 150,
    marginBottom: 5,
    color: 'rgba(52, 73, 94, 1.0)',
    fontSize: 24,
  },
  scoreText: {
    marginBottom: 5,
    color: 'rgba(52, 73, 94, 1.0)',
    fontSize: 34,
  },
  rankText: {
    color: 'rgba(52, 73, 94, 1.0)',
    fontSize: 34
  },
  btnStyle: {
    backgroundColor: 'rgba(189, 195, 199, 1.0)',
    height: 80,
    width: 200,
    borderRadius: 25,
    marginTop: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    color: 'rgba(52, 73, 94, 1.0)',
    fontSize: 30,
  }
});
