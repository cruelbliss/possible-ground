let osc, playing, freq, amp;
var r = 0;
var b = 255;
let voice;
let carrier; // this is the oscillator we will hear
let modulator;
let mic, recorder, soundFile;
let state = 0;

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.mousePressed(oscStart);
  osc = new p5.Oscillator('sine');
  new p5.Noise('brown')
  delay = new p5.Delay();
  delay.process(osc, 0.12, .7, 3000);
  fft = new p5.FFT();
  
  carrier = new p5.Oscillator(); // connects to master output by default
  carrier.freq(200);
  carrier.amp(0);
  
  carrier.start();

  modulator = new p5.Oscillator('triangle');
  modulator.disconnect(); // disconnect the modulator from master output
  modulator.freq(5);
  modulator.amp(1);
  modulator.start();
  carrier.amp(modulator.scale(-1, 1, 1, -1));
  mic = new p5.AudioIn();
  mic.start();
  recorder = new p5.SoundRecorder();
  soundFile = new p5.SoundFile();
}

function draw() {
  r = map(mouseX, 0, 1920, 0, 255);
  b = map(mouseX, 0, 1000, 255, 0);
  background(r, 0, b, 30);
  fill(b, 118, r);
  
  freq = constrain(map(mouseX, 0, width, 100, 600), 100, 900);
  amp = constrain(map(mouseY, height, 0, 0, 1), 0, 1);
  
  let waveform = fft.waveform(); // analyze the waveform
  
  beginShape();
  strokeWeight(4);
  for (let i = 0; i < waveform.length; i++) {
    let x = map(i, 0, waveform.length, 0, width);
    let y = map(waveform[i], -1, 1, height, 0);
    vertex(x, y);
  }
  endShape();
  
  let modFreq = map(mouseY, 0, height, 5, 0);
  modulator.freq(modFreq);
  let modAmp = map(mouseX/2, 0, width, 0, 1);
  modulator.amp(modAmp, 0.01);
  
  text('T O U C H   T O   B E L L O W   A   T U N E   TO  THE  T H R U M B   OF   M Y    V E I N S ', 20, 20);
  text('peaks: ' + freq, 20, 40);
  text('height: ' + amp, 20, 60);
 filter(DILATE);

  if (playing) {
    // smooth the transitions by 0.1 seconds
    osc.freq(freq, 0.1);
    osc.amp(amp, 0.1);
  }
  if (frameCount % 200 == 0) {

    filter(INVERT);
} 
}

function oscStart() {
  // starting an oscillator on a user gesture will enable audio
  // in browsers that have a strict autoplay policy.
  // See also: userStartAudio();
  userStartAudio();
  osc.start();
  playing = true;

  if (state === 0 && mic.enabled) {

    // record to our p5.SoundFile
    recorder.record(soundFile);
    state++;
  }
  else if (state === 1) {
    background(0,255,0);

    // stop recorder and
    // send result to soundFile
    recorder.stop();
state++;
  }

  else if (state === 2) {
    soundFile.play(); // play the result!
    save(soundFile, 'veinsthrumbstill.wav');
    state++;
  }
}

function mouseReleased() {
  // ramp amplitude to 0 over 0.5 seconds
  osc.amp(0, 0.5);
  playing = false;
}



