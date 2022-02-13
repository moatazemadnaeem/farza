class notfound extends Error{
    notfoundmsg='this page is not found';
    statusCode=404;
    constructor(){
        super('you entered the wrong page')
        Object.setPrototypeOf(this,notfound.prototype)
    }
    summary(){
        return [{message:this.notfoundmsg}]
    }
}
module.exports={notfound}