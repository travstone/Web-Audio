'use strict';

import AudioToolsContext from './mods/audioContext/audioToolsContext'
import osc from './mods/oscillator/oscillator'
import Oscillator from './mods/oscillator/oscillator'
let myCtxt = new AudioToolsContext()
let myOsc = Oscillator

console.log(myCtxt)

myOsc.init({'context': myCtxt})

console.log(osc)
