const cliProgress = require('cli-progress'); 
const _colors = require('colors');

module.exports = {
    color: null,
    message: null,
    currentProgressBar: null,
    construct(color, message){
      this.color = color;
      this.message = message;
    },
    initBar(){
      let color = _colors[this.color];
      this.currentProgressBar =  new cliProgress.SingleBar({
        format: 'CLI Progress |' + color('{bar}') +  `| {percentage}% || {value}/{total} 🍺 ${this.message}`,
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
        hideCursor: true
      });
    },
    start(count) {
        this.initBar();
        this.currentProgressBar.start(count, 0);
    },
    increase(int=1){
      this.currentProgressBar.increment(int);
    },
    stop(){
      this.currentProgressBar.stop(); 
    },
}