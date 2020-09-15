module.exports = {
    emptyString: "",
    comma:",",
    dot:".",
    isEndOfArry(condition){
       return condition ? this.emptyString : this.comma
    },
    generate_token(length=30){
        //edit the token allowed characters
        var a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");
        var b = [];  
        for (var i=0; i<length; i++) {
            var j = (Math.random() * (a.length-1)).toFixed(0);
            b[i] = a[j];
        }
        return b.join("");
    }
}