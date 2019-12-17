'use strict';

import AudioToolsContext from './mods/audioToolsContext/AudioToolsContext'
import Oscillator from './mods/oscillator/Oscillator'
import Waveform from './mods/waveform/Waveform'
import RealTimeAnalyzer from './mods/realTimeAnalyzer/RealTimeAnalyzer'
import '../css/styles.css';


var start = document.querySelector('.start');
start.addEventListener('click', doAudio)

function doAudio() {

    start.removeEventListener('click', doAudio);
    start.remove();

    let myCtxt = new AudioToolsContext()

    let myOsc1 = new Oscillator({'context': myCtxt, 'sel': '#osc1'})

    // let myOsc2 = new Oscillator()
    // myOsc2.init({'context': myCtxt, 'sel': '#osc2'})

    // let myOsc3 = new Oscillator({'context': myCtxt, 'sel': '#osc3'})

    let myWave = new Waveform({'context': myCtxt, 'sel': '#wave1'})

    let myAnalyzer = new RealTimeAnalyzer({'context': myCtxt, 'sel': '#rta1'});

     console.log( myCtxt instanceof AudioContext, Object.getPrototypeOf(myCtxt), myCtxt)
    // console.log(myOsc1 instanceof Oscillator, Object.getPrototypeOf(myOsc1), myOsc1)
    // console.log(myOsc2 instanceof Oscillator, Object.getPrototypeOf(myOsc2), myOsc2)
    // console.log(myOsc3 instanceof Oscillator, Object.getPrototypeOf(myOsc3), myOsc3)
    // console.log(myWave instanceof Waveform, Object.getPrototypeOf(myWave), myWave)
    // console.log(myAnalyzer instanceof Waveform, Object.getPrototypeOf(myAnalyzer), myAnalyzer)

        
    // var message = document.querySelector('.message');
    // message.innerHTML = 'The application has started...'

}