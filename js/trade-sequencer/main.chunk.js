(this["webpackJsonptrade-sequencer"]=this["webpackJsonptrade-sequencer"]||[]).push([[0],{11:function(e,t,n){e.exports=n(20)},16:function(e,t,n){},17:function(e,t,n){},20:function(e,t,n){"use strict";n.r(t);var a=n(0),o=n.n(a),s=n(4),r=n.n(s),i=(n(16),n(17),n(2)),c=n(8),u=n(5),l=n(6),d=n(10),h=n(9),m=n(1),f=n(7),g=n.n(f);function p(e){e.setup=function(){e.createCanvas(e.windowWidth,e.windowHeight),e.background(0,0,0,255)},e.myCustomRedrawAccordingToNewPropsHandler=function(t){var n=t.index,a=t.tickers,o=t.feeds,s=t.volumes,r=t.ranges;if(n&&a&&o&&s&&r){e.clear(),e.background(0,0,0,255);var i=e.windowWidth,c=e.windowHeight;a.forEach((function(t){var a=o[t][n];e.noStroke();var r=Math.min(i,c)*a.volume/s[t];e.fill(e.random(255),e.random(255),e.random(255),255*r/Math.min(i,c)),e.ellipse(i/2,c/2,r,r)}))}},e.draw=function(){}}var v=function(e){return o.a.createElement("button",{style:{display:"block",width:"100%",border:"none",backgroundColor:"rgb(0, 0, 0)",padding:"14px 28px",fontSize:"16px",color:"white",cursor:"pointer",textAlign:"center"},onClick:e.handleClick},e.isPlaying?"":"Play")},k=function(e){Object(d.a)(n,e);var t=Object(h.a)(n);function n(e){var a;return Object(u.a)(this,n),(a=t.call(this,e)).fetchData=function(e){var t={function:"TIME_SERIES_DAILY",symbol:e,outputsize:"compact",datatype:"json",apikey:"I7JY3EYLKK5LRI8L"},n=Object.keys(t).map((function(e){return e+"="+t[e]})).join("&");fetch("https://www.alphavantage.co/query?"+n).then((function(e){return e.json()})).then((function(t){console.log(t);var n=0,o=0,s=Number.MAX_SAFE_INTEGER,r=Object.entries(t["Time Series (Daily)"]).map((function(e){var t=Object(c.a)(e,2),a=t[0],r=t[1];return n=Math.max(n,+r["5. volume"]),o=Math.max(o,+r["2. high"]),s=Math.min(s,+r["3. low"]),{date:a,open:+r["1. open"],high:+r["2. high"],low:+r["3. low"],close:+r["4. close"],volume:+r["5. volume"]}})).reverse(),u=Object(i.a)({},a.state.volumes),l=Object(i.a)({},a.state.ranges),d=Object(i.a)({},a.state.feeds);u[e]=n,l[e]={min:s,max:o},d[e]=r,a.setState((function(e){return{feeds:d,ranges:l,volumes:u,maxIndex:Math.max(e.maxIndex,r.length)}}))}))},a.scheduleSequence=function(e){m.Transport.schedule((function(t){a.state.feeds[e].forEach((function(n,o){var s=n.volume/a.state.volumes[e],r=w(n.close,a.state.ranges[e]);a.sounds[e].triggerAttackRelease(r,"16n",t+o*Object(m.Time)("16n").toSeconds(),s)}))}),"0")},a.scheduleSketchIndex=function(){m.Transport.schedule((function(e){for(var t=0;t!==a.state.maxIndex;++t)setTimeout((function(){a.setState((function(e){return{sketchIndex:(e.sketchIndex+1)%e.maxIndex}}))}),t*Object(m.Time)("16n").toMilliseconds())}),"0")},a.togglePlay=function(){a.state.isPlaying?m.Transport.stop():m.Transport.start(),a.setState({isPlaying:!a.state.isPlaying})},a.state={isPlaying:!1,tickers:e.tickers,volumes:e.tickers.reduce((function(e,t){return e[t]=0,e}),{}),ranges:e.tickers.reduce((function(e,t){return e[t]={min:0,max:0},e}),{}),feeds:e.tickers.reduce((function(e,t){return e[t]=[],e}),{}),sketchIndex:0,maxIndex:0},a.sounds={},a.sounds[e.tickers[0]]=(new m.Synth).toMaster(),a.sounds[e.tickers[1]]=(new m.MonoSynth).toMaster(),a.sounds[e.tickers[2]]=(new m.Synth).toMaster(),a.sounds[e.tickers[3]]=(new m.FMSynth).toMaster(),a.sounds[e.tickers[4]]=(new m.AMSynth).toMaster(),m.Transport.loop=!1,m.Transport.loopEnd="1m",a}return Object(l.a)(n,[{key:"componentDidMount",value:function(){var e=this;this.state.tickers.map((function(t,n){return e.fetchData(t)})),this.state.tickers.map((function(t,n){return e.scheduleSequence(t)})),this.scheduleSketchIndex()}},{key:"componentDidUpdate",value:function(){}},{key:"render",value:function(){return o.a.createElement("div",null,o.a.createElement(v,{isPlaying:this.state.isPlaying,handleClick:this.togglePlay}),o.a.createElement(g.a,{sketch:p,index:this.state.sketchIndex,tickers:this.state.tickers,feeds:this.state.feeds,volumes:this.state.volumes,ranges:this.state.ranges}))}}]),n}(a.Component),w=function(e,t){var n=t.min,a=t.max,o=Math.floor(88*(e-n)/(a-n));return"CDEFGAB"[o%7]+(Math.floor(o/7)+1)},x=k;var y=function(){return o.a.createElement("div",{className:"App"},o.a.createElement(x,{tickers:["ivv","zm","fb","goog","amd"]}))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));r.a.render(o.a.createElement(o.a.StrictMode,null,o.a.createElement(y,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[11,1,2]]]);
//# sourceMappingURL=main.5e83e66f.chunk.js.map