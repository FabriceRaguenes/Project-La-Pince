// Class to make better errors than JS's base Errors (it carries a message and a status code)
// The error will be thrown to errorHandler() (middlewares/common.middleware.js)

class HttpError extends Error {

    #name;
    #statusCode;

    constructor(message, code){
        super(message);

        this.#name = 'HttpError';

        this.#statusCode = code;
    }

    get name(){
        return this.#name;
    }

    get statusCode(){
        return this.#statusCode;
    }

    set statusCode(value){
        this.#statusCode = value;
    }
    
}

export default HttpError;