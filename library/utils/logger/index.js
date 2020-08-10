module.exports = {
    log(message){
        console.log(message);
    },
    error(e){
        console.log('\tname: ' + e.name + ' message: ' + e.message + ' at: ' + e.at + ' text: ' + e.text);
    }
}