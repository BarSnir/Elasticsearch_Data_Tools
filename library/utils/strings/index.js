module.exports = {
    emptyString: "",
    comma:",",
    dot:".",
    isEndOfArry(condition){
       return condition ? this.emptyString : this.comma
    }
}