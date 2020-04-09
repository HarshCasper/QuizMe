import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, AppState, BackHandler, ScrollView} from 'react-native';
import Voice from 'react-native-voice';
import Tts from 'react-native-tts';

export default class Instructions extends Component {
  render () {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Instructions</Text>
        <Text style={styles.instructionText}>
          Hello,{'\n'}
          This is the Quiz-App. Each quiz contains 10 coutry-capital questions.{'\n'}
          The app will read out each question to you. You can either select the option by selecting the radio-button, or say the answer.{'\n'}
          You get one point for each correct answer, and the app will automatically move on to the next question.{'\n'}
          In case of an incorrect answer, you get no points, and you will be told the correct answer.{'\n'}
        </Text>
        <Text style={styles.instructionHeading}>Voice Usage</Text>
        <Text style={styles.instructionSubHeading}>Menu Screen</Text>
        <Text style={styles.instructionText}>
          - At the menu-screen, you can ask the app to start the quiz by saying any sentence that has the word 'start' or 'begin' in it.{'\n'}
          {'\n'}
          - You can also say any sentence containing the word 'instructions' to navigate to this instructions-screen.{'\n'}
          {'\n'}
          - To exit the app, say any sentence with the word 'exit', 'quit' or 'close'.{'\n'}
        </Text>
        <Text style={styles.instructionSubHeading}>During Quiz</Text>
        <Text style={styles.instructionText}>
          - During the quiz, you must say the capital EXACTLY as it appears in the options for it to be registered.{'\n'}
          {'\n'}
          - You can also ask for options by saying 'options' or 'options, please'. (Note: Your words must be these exact words and not any sentence containing the same){'\n'}
          {'\n'}
          - To skip a question, say 'skip'. In such a case, you will not be informed of the correct answer to the question.{'\n'}
          {'\n'}
          - After you answer a question using voice, if it turns out to be incorrect, you will be informed of the correct answer. The app will wait for you before moving on to the next question.
          You must say 'next' to do the same.{'\n'}
        </Text>
        <Text style={styles.instructionSubHeading}>End Screen</Text>
        <Text style={styles.instructionText}>
          - At the end-screen, you will be told your score, after which you can say any sentence containing the word 'menu' or 'home' to return to the menu-screen.{'\n'}
          {'\n'}
          - To exit the app from this screen, say any sentence with the word 'exit', 'quit or 'close'.
        </Text>
        <TouchableOpacity style={styles.buttonContainer} onPress={() => {this.props.navigation.navigate('Home')}}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(236, 240, 241, 1.0)',
    paddingVertical: 40,
    // justifyContent: 'center',
    // alignItems: 'center'
  },
  title: {
    //alignSelf: 'center',
    fontSize: 30,
    fontWeight: 'bold',
    marginLeft: '25%',
    marginBottom: 30,
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
    marginTop: 50,
    marginBottom: 100,
    width: '50%',
    alignSelf: 'center'
  },
  buttonText: {
    textAlign: 'center',
    color: 'rgba(52, 73, 94, 1.0)',
    fontSize: 30,
  },
  instructionHeading: {
    marginLeft: 20,
    fontSize: 30,
    fontWeight: 'bold',
  },
  instructionSubHeading: {
    marginLeft: 40,
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 10,
  },
  instructionText: {
    marginHorizontal: 40,
    fontSize: 20,
    textAlign: 'justify',
  }
});
