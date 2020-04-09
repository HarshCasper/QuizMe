import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, NetInfo, BackHandler, AsyncStorage, AppState} from 'react-native';
import  { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import  {Content, Container, Header, Row} from 'native-base';
import {RadioButton, RadioGroup} from 'react-native-flexi-radio-button';
import * as QuestionAction from '../actions/QuestionAction';
import Toast from 'react-native-easy-toast';
import Spinner from 'react-native-loading-spinner-overlay';
import Voice from 'react-native-voice';
import Tts from 'react-native-tts';
import PreLoader from '../components/PreLoader';

class Questions extends Component {

  constructor (props) {
    super(props);
    this.state = {
      loading: true,
      selectedAnswer: '',
      answerVisible: false,
      question: '',
      option1: '',
      option2: '',
      option3: '',
      option4: '',
      answer: '',
      score: 0,
      questionNumber: 1,
      radioButtonsActive: true,
      selectedIndex: null,
      questionContainerBackgroundColor: 'rgba (255, 255, 255, 0)',
    };
  }

  componentWillMount () {
    NetInfo.isConnected.fetch().then(isConnected => {
        if (!isConnected) {
            this.setState({
                loading: false
            }, () => {
                this.refs.toast.show("Could not connect to server")
            })
        } else {
            this.setState({
                loading: true
            }, () => {
                this.props.QuestionAction.getQuestion ();
            })
          }
      });
  }

  componentDidMount () {
    NetInfo.isConnected.fetch().then(isConnected => {
        if (!isConnected) {
            this.setState({
            }, () => {
                this.refs.toast.show("Could not connect to server")
            })
        }
    });
    NetInfo.isConnected.addEventListener('connectionChange', this.handleFirstConnectivityChange);
    BackHandler.addEventListener ('hardwareBackPress', this.handleBackPress);
    //AppState.addEventListener ('change', this._handleAppStateChange);
    Voice.onSpeechResults = this.onSpeechResultsHandler.bind(this);
  }

  componentWillUnmount () {
    Tts.stop ();
    Voice.destroy ();
    //AppState.removeEventListener ('change', this._handleAppStateChange);
    BackHandler.removeEventListener ('hardwareBackPress', this.handleBackPress);
  }

  componentWillReceiveProps (next) {
    console.log (next.questionData);
    if (next.questionData) {
        this.setState({
          loading: false,
          question: next.questionData.question,
          option1: next.questionData.option1,
          option2: next.questionData.option2,
          option3: next.questionData.option3,
          option4: next.questionData.option4,
          answer: next.questionData.answer
        }, () => {
            this.readQuestion ();
            setTimeout(() => {
                this.setState({ loading: false });
            }, 500)
        });
    }
  }

  getQuestion = () => {
    this.setState ({
      loading: true,
    }, () => {
      this.props.QuestionAction.getQuestion ();
    })
  }

  // _handleAppStateChange = (nextAppState) => {
  //     if (nextAppState === 'inactive') {
  //       Tts.stop ();
  //       Voice.destroy ();
  //     }
  // }

  handleBackPress = () => {
      if (this.state.loading) this.setState({ loading: false })
      else this.props.navigation.navigate ('Home');
      return true;
  }

  handleFirstConnectivityChange = (isConnected) => {
      if (!isConnected) {
          this.setState({ loading: false });
      } else {
          this.setState({ loading: true });
      }
  }

  submitButton = () => {
    const {score} = this.state;
    if (this.state.radioButtonsActive) {
      if (this.state.selectedAnswer === this.state.answer) {
        this.setState ({
          questionContainerBackgroundColor: 'rgba(46, 204, 113, 1)',
          score: score + 1,
          radioButtonsActive: false,
        })
      }
      else {
        this.setState ({
          questionContainerBackgroundColor: 'rgba(231, 76, 60, 1)',
          answerVisible: true,
          radioButtonsActive: false,
        })
      }
    }
  }

  nextQuestion = () => {
    const {questionNumber} = this.state;
    if (this.state.questionNumber === 10) {
      this.props.navigation.navigate ('EndScreen', {score: this.state.score});
    }
    else {
      this.setState ({
        loading: true,
        selectedIndex: null,
        radioButtonsActive: true,
        questionContainerBackgroundColor: 'rgba(236, 240, 241, 1.0)',
        answerVisible: false,
        questionNumber: questionNumber + 1,
      }, () => {
        this.showAnswer ();
        this.props.QuestionAction.getQuestion();
      })
    }
  }

  showAnswer = () => {
    if (this.state.answerVisible){
      return (
        <View style={styles.correctAnswer}>
          <Text style={styles.answerText}>Answer: {this.state.answer}</Text>
        </View>
      );
    }
  }

  //Voice commands

  readQuestion () {
    const {question} = this.state;
    Tts.speak ('The capital of ' + question + ' is');
  }

  onSpeechResultsHandler (event) {
    var negatives = ['NO', 'ISN\'T', 'NOT', 'DON\'T'];
    var startWords = ['Ok', 'Sure', 'Cool', 'Alright', 'Fine'];
    const option1 = this.state.option1.split (' ')[0];
    const option2 = this.state.option2.split (' ')[0];
    const option3 = this.state.option3.split (' ')[0];
    const option4 = this.state.option4.split (' ')[0];
    const answer = this.state.answer.split (' ')[0];
    console.log (answer);
    // console.log (option1);
    // console.log (option2);
    // console.log (option3);
    // console.log (option4);
    var recogs = event.value;
    // console.log (recogs);
    for (var j = 0; j < recogs.length; j++) {
      var recog = event.value [j].toUpperCase ();
      // console.log (recog);
      var words = recog.split (' ');
      console.log (words);
      if (this.state.radioButtonsActive) {
        if (this.isInArray (words, answer.toUpperCase ())) {
          this.correctAnswerSpeak ();
          return;
        }
        else if (this.isInArray (words, 'OPTIONS')) {
          for (var i = 0; i < negatives.length; i++) {
            if (this.isInArray (words, negatives[i])) {
              var startWord = startWords [Math.floor (Math.random () * startWords.length)];
              var utterance = startWord + ', I won\'t read out the options. So what do you think is the capital of ' + this.state.question + '?';
              Tts.speak (utterance);
              return;
            }
          }
          this.readOptions ();
          return;
        }
        // else if (recog === this.state.option1.toUpperCase () || recog === this.state.option2.toUpperCase () || recog === this.state.option3.toUpperCase () || recog === this.state.option4.toUpperCase ()) {
        //   this.incorrectAnswerSpeak ();
        // }
        else if (this.isInArray (words, option1.toUpperCase ()) || this.isInArray (words, option2.toUpperCase ()) || this.isInArray (words, option3.toUpperCase ()) || this.isInArray (words, option4.toUpperCase ())) {
          for (var i = 0; i < negatives.length; i++) {
            if (this.isInArray (words, negatives[i].toUpperCase ())) {
              var startWord = startWords [Math.floor (Math.random () * startWords.length)];
              var utterance = 'Maybe it isn\'t, I\'m not at liberty to say. What do you think is the correct answer then?';
              Tts.speak (utterance);
              return;
            }
          }
          this.incorrectAnswerSpeak ();
          return;
        }
        else if (this.isInArray (words, 'SKIP')) {
          for (var i = 0; i < negatives.length; i++) {
            if (this.isInArray (words, negatives[i])) {
              var startWord = startWords [Math.floor (Math.random () * startWords.length)];
              var utterance = startWord + ', I won\'t skip this question. So what do you think is the capital of ' + this.state.question + '?';
              Tts.speak (utterance);
              return;
            }
          }
          this.nextQuestion ();
          return;
        }
        else if (this.isInArray (words, 'REPEAT')) {
          if (this.isInArray (words, 'QUESTION')) {
            for (var i = 0; i < negatives.length; i++) {
              if (this.isInArray (words, negatives[i])) {
                var startWord = startWords [Math.floor (Math.random () * startWords.length)];
                var utterance = startWord + ', I won\'t repeat the question. So what do you think is the answer?';
                Tts.speak (utterance);
                return;
              }
            }
            this.readQuestion ();
            return;
          }
          else if (this.isInArray (words, 'OPTIONS')) {
            for (var i = 0; i < negatives.length; i++) {
              if (this.isInArray (words, negatives[i])) {
                var startWord = startWords [Math.floor (Math.random () * startWords.length)];
                var utterance = startWord + ', I won\'t repeat the options. So what do you think is the answer?';
                Tts.speak (utterance);
                return;
              }
            }
            this.readOptions ();
            return;
          }
          else if (this.isInArray (words, 'COUNTRY')) {
            for (var i = 0; i < negatives.length; i++) {
              if (this.isInArray (words, negatives)) {
                var startWord = startWords [Math.floor (Math.random () * startWords.length)];
                var utterance = startWord + ', I won\'t repeat the country. So what do you think is the answer?';
                Tts.speak (utterance);
                return;
              }
            }
            Tts.speak (this.state.question);
            return;
          }
          else {
            for (var i = 0; i < negatives.length; i++) {
              if (this.isInArray (words, negatives[i])) {
                var startWord = startWords [Math.floor (Math.random () * startWords.length)];
                var utterance = startWord + ', I don\'t know what you want me to repeat, but I won\'t repeat it anyways. So what do you think is the answer?';
                Tts.speak (utterance);
                return;
              }
            }
            Tts.speak ('Sorry, I just heard repeat, and I\'m not sure what you want me to repeat');
            return;
          }
        }
        else {
          Tts.speak ('Sorry, can\'t find that in the options');
          return;
        }
      }
      else {
        if (this.isInArray (words, 'NEXT') || this.isInArray (words, 'OK')) {
          this.nextQuestion ();
          return;
        }
        else {
          Tts.speak ('Sorry, I didn\'t get that');
        }
      }
    }
  }

  isInArray (array, element) {
    for (var i = 0; i < array.length; i++) {
      if (array[i].toUpperCase () === element) {
        return true;
      }
    }
    return false;
  }

  correctAnswerSpeak = () => {
    const {score} = this.state;
    this.setState ({
      questionContainerBackgroundColor: 'rgba(46, 204, 113, 1)',
      score: score + 1,
      radioButtonsActive: false,
    })
    var utterance = 'Correct!';
    Tts.speak (utterance);
    Voice.destroy ();
    this.nextQuestion ();
  }

  incorrectAnswerSpeak = () => {
    this.setState ({
      questionContainerBackgroundColor: 'rgba(231, 76, 60, 1)',
      answerVisible: true,
      radioButtonsActive: false,
    })
    var utterance = 'Sorry, wrong answer. The correct answer is ' + this.state.answer;
    Tts.speak (utterance);
  }

  readOptions = () => {
    var utterance = this.state.option1 + ', ' + this.state.option2 + ', ' + this.state.option3 + ',or ' + this.state.option4;
    Tts.speak (utterance);
  }

  render() {
    const {question, option1, option2, option3, option4, answer, answerVisible, score} = this.state
    return (
      <Container style={styles.container}>
        <Content>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Question #{this.state.questionNumber}</Text>
            <Text style={styles.scoreText}>Your Score: {score}</Text>
          </View>
          <View style={[styles.textContainer, {backgroundColor: this.state.questionContainerBackgroundColor}]}>
            <View style={styles.question}>
              <Text style={styles.questionText}>The capital of {question} is:</Text>
            </View>
            <View style={styles.options}>
              <RadioGroup
                selectedIndex={this.state.selectedIndex}
                thickness={2}
                color='#fff'
                activeColor='#67F765'
                style={styles.radioGroup}
                onSelect={(index, value) => {this.setState({selectedAnswer: value, selectedIndex: index})}}>
                <RadioButton value={option1} style={{alignItems: 'center'}} disabled={!this.state.radioButtonsActive}>
                    <Text style={styles.optionText}>{option1}</Text>
                </RadioButton>
                <RadioButton value={option2} style={{alignItems: 'center'}} disabled={!this.state.radioButtonsActive}>
                    <Text style={styles.optionText}>{option2}</Text>
                </RadioButton>
                <RadioButton value={option3} style={{alignItems: 'center'}} disabled={!this.state.radioButtonsActive}>
                    <Text style={styles.optionText}>{option3}</Text>
                </RadioButton>
                <RadioButton value={option4} style={{alignItems: 'center'}} disabled={!this.state.radioButtonsActive}>
                    <Text style={styles.optionText}>{option4}</Text>
                </RadioButton>
              </RadioGroup>
            </View>
            {this.showAnswer()}
          </View>
          <View style={{alignItems: 'center'}}>
            <TouchableOpacity style={styles.submitButton} onPress={() => {this.submitButton()}}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>
          <View style={{alignItems: 'center'}}>
            <TouchableOpacity style={styles.submitButton} onPress={() => {this.nextQuestion()}}>
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </Content>
        <PreLoader preLoaderVisible={this.state.loading} />
        <Toast ref="toast" position="top" />
      </Container>
    );
  }
}

function mapStateToProps(state) {
    return {
      questionData: state.QuestionReducer.questionGetSuccess
    };
}

function mapDispatchToProps(dispatch) {
    return {
      QuestionAction: bindActionCreators (QuestionAction, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Questions);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(236, 240, 241, 1.0)',
    paddingHorizontal: 20,
  },
  titleContainer: {
    marginTop: 50
  },
  titleText: {
    color: 'rgba(52, 73, 94, 1.0)',
    fontSize: 34,
  },
  scoreText: {
    color: 'rgba(44, 62, 80, 1.0)',
    fontSize: 20,
  },
  textContainer: {
    marginTop: 50,
  },
  questionText: {
    color: 'rgba(52, 73, 94, 1.0)',
    fontSize: 24,
  },
  options: {
    marginTop: 10,
    marginLeft: 20,
  },
  optionText: {
    color: 'rgba(52, 73, 94, 1.0)',
    fontSize: 24,
    marginLeft: 5,
  },
  correctAnswer: {
    marginTop: 20,
    alignItems: 'center'
  },
  answerText: {
    color: '#67F765',
    fontSize: 24,
  },
  submitButton: {
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
