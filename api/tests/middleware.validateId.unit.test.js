import { validateId } from '../middlewares/common.middleware.js';
import { jest } from '@jest/globals';


describe("validateId", () => {

    const res = {}; // the function doesn't use res

    it("id is a random string like a word", () => {

        const req = {
            params: {id: "lorem"}
        }

        const next = jest.fn();

        // HttpError extends Error
        validateId(req, res, next);
        expect(next).toHaveBeenCalledWith(expect.any(Error));
    });

    it("id is a number < 1", () => {

        const req = {
            params: {id: "-4"}
        }

        const next = jest.fn();

        validateId(req, res, next);
        expect(next).toHaveBeenCalledWith(expect.any(Error));
    });

    it("id is a number >= 1", () => {

        const req = {
            params: {id: "6"}
        }

        const next = jest.fn();

        validateId(req, res, next);
        expect(next).toHaveBeenCalledWith(); // called with no argument
    });

});