/* eslint-disable no-console */

'use strict';

var rlsync = require('readline-sync');
var Round = require('./game/round');
var Psychobabble = require('./game/psychobabble');
var WordBank = require('./game/wordbank').Local;

function printState(round) {
  var states = {};
  states[Round.STATE.UNSTARTED] = 'unstarted';
  states[Round.STATE.BUILD_QUESTION] = 'build question';
  states[Round.STATE.VOTING] = 'voting';
  states[Round.STATE.ENDED] = 'ended';

  console.log('');
  console.log('===========================');
  console.log('State:', states[round.state()]);
  console.log('===========================');
}

var players = ['0', '1', '2'];
var round = Round(Psychobabble(WordBank), players);
StartRound(round);
BuildQuestion(round);
Vote(round);
End(round);

function StartRound(round) {
  printState(round);
  console.log('Starting Round');
  round.start();
}

function BuildQuestion(round) {
  printState(round);

  var words = round.words();
  var wordList = {};
  words.forEach(function(word) {
    wordList[word.id] = word;
  });

  console.log(words.map(({ id, root }) => ({ id, root })));
  console.log('Input by putting id seperated by space');
  console.log('');

  players.forEach(function(player) {
    var ok = false;
    while (!ok) {
      var sentence = rlsync.question(player + "'s sentence: ");

      var response = [];
      var tokens = sentence.split(' ');
      tokens.forEach(function(word) {
        if (word in wordList) {
          response.push(wordList[word]);
        }
      });

      if (tokens.length === response.length) {
        ok = round.submitSentence(player, response);
      }
    }
  });
}

function Vote(round) {
  printState(round);

  console.log(round.sentences());
  players.forEach(function(player) {
    var ok = false;
    while (!ok) {
      var vote = rlsync.question(player + "'s vote: ");
      ok = round.vote(player, vote);
    }
  });
}

function End(round) {
  printState(round);

  console.log(round.results());
}
