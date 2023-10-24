let song;
let fft;
let startColorSlider, endColorSlider, playButton;

const RING_COUNT = 6;

function preload() {
    song = loadSound("audio/visualisation-sample.mp3");
}

function setup() {
    createCanvas(400, 450);
    fft = new p5.FFT();
    song.connect(fft);

    startColorSlider = createSlider(0, 255, 50);
    startColorSlider.position(10, 410);

    endColorSlider = createSlider(0, 255, 205);
    endColorSlider.position(10, 430);

    playButton = createButton('Play');
    playButton.position(10, 460);
    playButton.mousePressed(togglePlay);
}

function draw() {
    if (getAudioContext().state !== 'running') {
        background(220);
        text('Click Play to start the sound!', 10, 20, width - 20);
        return;
    }

    background(0);
    let spectrum = fft.analyze();

    let spectrumStepSize = floor(spectrum.length / RING_COUNT);
    let maxRadius = width / 2;
    let radiusStep = maxRadius / RING_COUNT;

    noFill();

    for (let i = 0; i < RING_COUNT; i++) {
        let avgAmplitude = 0;
        for (let j = 0; j < spectrumStepSize; j++) {
            avgAmplitude += spectrum[i * spectrumStepSize + j];
        }
        avgAmplitude /= spectrumStepSize;

        let startColor = color(startColorSlider.value(), 100, 255);
        let endColor = color(endColorSlider.value(), 100, 255);
        let interpColor = lerpColor(startColor, endColor, i / RING_COUNT);

        stroke(interpColor);

        let currentRadius = map(i, 0, RING_COUNT, 1, maxRadius);
        let ringThickness = map(avgAmplitude, 0, 255, 5, 80); 

        strokeWeight(ringThickness);
        ellipse(width / 2, height / 2 - 25, currentRadius * 2);
    }

    fill(255);
    textSize(12);
    text("Start Color", 10, height - 35);
    text("End Color", 10, height - 15);
}

function togglePlay() {
    if (song.isPlaying()) {
        song.pause();
        playButton.html('Play');
    } else {
        song.play();
        playButton.html('Pause');
    }
}
