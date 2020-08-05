const cliProgress = require('cli-progress'); 
const _colors = require('colors');

module.exports = {
    color: null,
    message: null,
    construct(color, message){
      this.color = color;
      this.message = message;
    },
    initBar(){
      let color = _colors[this.color];
      return new cliProgress.SingleBar({
        format: 'CLI Progress |' + color('{bar}') +  `| {percentage}% || {value}/{total} Documents 🍺 ${this.message}`,
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
        hideCursor: true
      });
    },
    startBar(count) {
        this.currentProgressBar = this.runProgressBar();
        this.currentProgressBar.start(count, 0);
    },
    increaseBar(int=1){
      this.currentProgressBar.increment(int);
    },
    completeBar(){
        this.currentProgressBar.stop(); 
    },
}