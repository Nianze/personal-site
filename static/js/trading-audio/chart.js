/////////////////////////

let VOICE_COUNT = 10;
let WIDTH = 640;
let HEIGHT = 360;

let SMOOTHING = 0.8;
let FFT_SIZE = 2048;

// Start off by initializing a new context.
let context = new (window.AudioContext || window.webkitAudioContext)();

if (!context.createGain)
    context.createGain = context.createGainNode;
if (!context.createDelay)
    context.createDelay = context.createDelayNode;
if (!context.createScriptProcessor)
    context.createScriptProcessor = context.createJavaScriptNode;

// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
return  window.requestAnimationFrame       || 
  window.webkitRequestAnimationFrame || 
  window.mozRequestAnimationFrame    || 
  window.oRequestAnimationFrame      || 
  window.msRequestAnimationFrame     || 
  function( callback ){
  window.setTimeout(callback, 1000 / 60);
};
})();

// sound generator
function WhiteNoiseGenerated(callback) {  
    // Generate a 5 second white noise buffer.  
    let lengthInSamples = 5 * context.sampleRate;  
    let buffer = context.createBuffer(1, lengthInSamples, context.sampleRate);  
    let data = buffer.getChannelData(0);  
    for (let i = 0; i < lengthInSamples; i++) {    
        data[i] = ((Math.random() * 2) - 1);  
    }

    // Create a source node from the buffer.  
    this.node = context.createBufferSource();  
    this.node.buffer = buffer;  
    this.node.loop = true;  
    this.node.start(0);
}

WhiteNoiseGenerated.prototype.connect = function(dest) {
  this.node.connect(dest);
};

function Envelope() {
    this.node = context.createGain();
    this.node.gain.value = 0;
}

Envelope.prototype.addEventToQueue = function() {
    this.node.gain.linearRampToValueAtTime(0, context.currentTime);  
    this.node.gain.linearRampToValueAtTime(1, context.currentTime + 0.001);  
    this.node.gain.linearRampToValueAtTime(0.3, context.currentTime + 0.101);  
    this.node.gain.linearRampToValueAtTime(0, context.currentTime + 0.500);
};

Envelope.prototype.connect = function(dest) {
  this.node.connect(dest);
};

// procedural sound
function ProceduralSound() {
    this.voices = [];  
    this.voiceIndex = 0;  
    this.noise = new WhiteNoiseGenerated();

    this.analyser = context.createAnalyser();
    this.freqs = new Uint8Array(this.analyser.frequencyBinCount);
    this.times = new Uint8Array(this.analyser.frequencyBinCount);    
    
    this.onLoaded();
}

ProceduralSound.prototype.onLoaded = function() {
    let filter = context.createBiquadFilter();  
    filter.type = 'lowpass';
    filter.Q.value = 1; 
    filter.frequency.value = 800;  

    // Initialize multiple voices.  
    for (let i = 0; i < VOICE_COUNT; i++) {    
        let voice = new Envelope();    
        this.noise.connect(voice.node);    
        voice.connect(filter);    
        this.voices.push(voice);
    }

    let gainMaster = context.createGain();
    gainMaster.gain.value = 1;
    filter.connect(gainMaster);
    //gainMaster.connect(context.destination);

    this.analyser.minDecibels = -140;
    this.analyser.maxDecibels = 0;
    gainMaster.connect(this.analyser);
    this.analyser.connect(context.destination);
    requestAnimFrame(this.draw.bind(this));
};

ProceduralSound.prototype.draw = function() {
  this.analyser.smoothingTimeConstant = SMOOTHING;
  this.analyser.fftSize = FFT_SIZE;

  // Get the frequency data from the currently playing music
  this.analyser.getByteFrequencyData(this.freqs);
  this.analyser.getByteTimeDomainData(this.times);

  let width = Math.floor(1/this.freqs.length, 10);

  let canvas = document.getElementById('proceduralCanvas');
  let drawContext = canvas.getContext('2d');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  // Draw the frequency domain chart.
  for (let i = 0; i < this.analyser.frequencyBinCount; i++) {
    let value = this.freqs[i];
    let percent = value / 256;
    let height = HEIGHT * percent;
    let offset = HEIGHT - height - 1;
    let barWidth = WIDTH/this.analyser.frequencyBinCount;
    let hue = i/this.analyser.frequencyBinCount * 360;
    drawContext.fillStyle = 'hsl(' + hue + ', 100%, 50%)';
    drawContext.fillRect(i * barWidth, offset, barWidth, height);
  }

  // Draw the time domain chart.
  for (let i = 0; i < this.analyser.frequencyBinCount; i++) {
    let value = this.times[i];
    let percent = value / 256;
    let height = HEIGHT * percent;
    let offset = HEIGHT - height - 1;
    let barWidth = WIDTH/this.analyser.frequencyBinCount;
    drawContext.fillStyle = 'gray';
    drawContext.fillRect(i * barWidth, offset, 1, 2);
  }

  requestAnimFrame(this.draw.bind(this));
}

ProceduralSound.prototype.beatOnce = function() {
    this.voiceIndex = (this.voiceIndex + 1) % VOICE_COUNT;
    this.voices[this.voiceIndex].addEventToQueue();
};

/////////////////////////

let parseDate = d3.timeParse("%Y-%m-%d");

let margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = 640 - margin.left - margin.right,
        height = 360 - margin.top - margin.bottom;

let x = techan.scale.financetime()
        .range([0, width]);

let y = d3.scaleLinear()
        .range([height, 0]);

let yVolume = d3.scaleLinear()
        .range([y(0), y(0.2)]);

let ohlc = techan.plot.ohlc()
        .xScale(x)
        .yScale(y);

let sma0 = techan.plot.sma()
        .xScale(x)
        .yScale(y);

let sma0Calculator = techan.indicator.sma()
        .period(10);

let sma1 = techan.plot.sma()
        .xScale(x)
        .yScale(y);

let sma1Calculator = techan.indicator.sma()
        .period(20);

let volume = techan.plot.volume()
        .accessor(ohlc.accessor())   // Set the accessor to a ohlc accessor so we get highlighted bars
        .xScale(x)
        .yScale(yVolume);

let xAxis = d3.axisBottom(x);

let yAxis = d3.axisLeft(y);

let volumeAxis = d3.axisRight(yVolume)
        .ticks(3)
        .tickFormat(d3.format(",.3s"));

let timeAnnotation = techan.plot.axisannotation()
        .axis(xAxis)
        .orient('bottom')
        .format(d3.timeFormat('%Y-%m-%d'))
        .width(65)
        .translate([0, height]);

let ohlcAnnotation = techan.plot.axisannotation()
        .axis(yAxis)
        .orient('left')
        .format(d3.format(',.2f'));

let volumeAnnotation = techan.plot.axisannotation()
        .axis(volumeAxis)
        .orient('right')
        .width(35);

let crosshair = techan.plot.crosshair()
        .xScale(x)
        .yScale(y)
        .xAnnotation(timeAnnotation)
        .yAnnotation([ohlcAnnotation, volumeAnnotation])
        .on("move", move);

let svg = d3.select("#chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

let defs = svg.append("defs");

defs.append("clipPath")
        .attr("id", "ohlcClip")
    .append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", width)
        .attr("height", height);

svg = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

let ohlcSelection = svg.append("g")
        .attr("class", "ohlc")
        .attr("transform", "translate(0,0)");

ohlcSelection.append("g")
        .attr("class", "volume")
        .attr("clip-path", "url(#ohlcClip)");

ohlcSelection.append("g")
        .attr("class", "candlestick")
        .attr("clip-path", "url(#ohlcClip)");

ohlcSelection.append("g")
        .attr("class", "indicator sma ma-0")
        .attr("clip-path", "url(#ohlcClip)");

ohlcSelection.append("g")
        .attr("class", "indicator sma ma-1")
        .attr("clip-path", "url(#ohlcClip)");

svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")");

svg.append("g")
        .attr("class", "y axis")
    .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Price ($)");

svg.append("g")
        .attr("class", "volume axis");

svg.append('g')
        .attr("class", "crosshair ohlc");

let coordsText = svg.append('text')
        .style("text-anchor", "end")
        .attr("class", "coords")
        .attr("x", width - 5)
        .attr("y", 15);

let feed;

let tradeBeat = new ProceduralSound();

// draw chart with techanJS
function redraw(data) {
    let accessor = ohlc.accessor();

    x.domain(data.map(accessor.d));
    // Show only 150 points on the plot
    x.zoomable().domain([data.length-130, data.length]);

    // Update y scale min max, only on viewable zoomable.domain()
    y.domain(techan.scale.plot.ohlc(data.slice(data.length-130, data.length)).domain());
    yVolume.domain(techan.scale.plot.volume(data.slice(data.length-130, data.length)).domain());

    // Setup a transition for all that support
    svg
//      .transition() // Disable transition for now, each is only for transitions
        .each(function() {
            let selection = d3.select(this);
            selection.select('g.x.axis').call(xAxis);
            selection.select('g.y.axis').call(yAxis);
            selection.select("g.volume.axis").call(volumeAxis);

            selection.select("g.candlestick").datum(data).call(ohlc);
            selection.select("g.sma.ma-0").datum(sma0Calculator(data)).call(sma0);
            selection.select("g.sma.ma-1").datum(sma1Calculator(data)).call(sma1);
            selection.select("g.volume").datum(data).call(volume);

            svg.select("g.crosshair.ohlc").call(crosshair);
        });

    tradeBeat.beatOnce();

    // Set next timer expiry
    setTimeout(function() {
        let newData;

        if(data.length < feed.length) {
            // Simulate a daily feed
            newData = feed.slice(0, data.length+1);
        }
        else {
            // Simulate intra day updates when no feed is left
            let last = data[data.length-1];
            // Last must be between high and low
            last.close = Math.round(((last.high - last.low)*Math.random())*10)/10+last.low;

            newData = data;
        }

        redraw(newData);
    }, (Math.random()*1000)+400); // Randomly pick an interval to update the chart
}

function move(coords) {
    coordsText.text(
            timeAnnotation.format()(coords.x) + ", " + ohlcAnnotation.format()(coords.y)
    );
}

function begin() {
    let request_params = {
        "function": "TIME_SERIES_DAILY",
        "symbol": "MSFT",
        "outputsize": "full",
        "datatype": "json",
        "apikey": "I7JY3EYLKK5LRI8L"
    }
    const base_url = "https://www.alphavantage.co/query"
    let params = Object.keys(request_params)
                       .map(key => key + '=' + request_params[key])
                       .join('&');
    let queryUrl = base_url + '?' + params;
        
    fetch(queryUrl)
        .then(resp => resp.json())
        .then(rawData => {
            feed = Object.entries(rawData["Time Series (Daily)"])
                         .map(([date, obj]) => ({
                            date: parseDate(date),
                            open: +obj["1. open"],
                            high: +obj["2. high"],
                            low: +obj["3. low"],
                            close: +obj["4. close"],
                            volume: +obj["5. volume"]
                         }))
                         .reverse();
            redraw(feed.slice(0, 200));
        })
        .catch(error => {document.getElementById("chart").innerHTML = error;});
}
