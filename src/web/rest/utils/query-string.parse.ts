import * as moo from "moo";
import {Lexer, Token} from "moo";

type Dict = { [key: string]: any };

const formatExpected = (expected?: string | string[]) => expected
    ? Array.isArray(expected)
        ? `, expected ${expected.join(" or ")}`
        : ` expected ${expected}`
    : "";

const unexpected = (token: Token | undefined, expected?: string | string[]) => token
    ? new Error(`Unexpected token '${token.value}' of type '${token.type}'` + formatExpected(expected))
    : new Error("Unexpected end of string" + formatExpected(expected));
const expect = (token: Token | undefined, type: string | string[]): boolean => !token
    ? false
    : Array.isArray(type)
        ? type.includes(token.type!)
        : token.type === type;

function assert(token: Token | undefined, type: string | string[]) {
    if (!expect(token, type)) {
        throw unexpected(token, type);
    }
}

export function parseQuery(query: string): any {
    const lexer = moo.compile({
        beginArray: /\[/,
        endArray: /]/,

        beginObject: /{/,
        endObject: /}/,

        numberValue: /[\d.]+/,
        // remove quotes from value and escape quotes
        stringValue: {match: /"(?:[^"\\]|\\.)*?"/, value: it => it
                    .substr(1, it.length - 2)
                    .replace(/\\"/g, '"')},
        booleanValue: /true|false/,

        separator: /,/,
        assignment: /=/,

        identifier: /[^\d\W]\w+/,
    });
    lexer.reset(query);
    const wrapped = new LexerWrapper(lexer);
    return parseNextValue(wrapped);
}

function parseNextObject(lexer: LexerWrapper): Dict {
    let result: { [key: string]: any } = {};

    while (!expect(lexer.peek(), "endObject")) {
        parseNextKeyValuePair(lexer, result);

        if (expect(lexer.peek(), "separator")) {
            lexer.next();
        } else {
            assert(lexer.next(), "endObject");
            break;
        }
    }
    return result;
}

function parseNextKeyValuePair(lexer: LexerWrapper, obj: Dict) {
    const key = parseNextKey(lexer);
    assert(lexer.next(), "assignment");
    obj[key] = parseNextValue(lexer);
}

function parseNextKey(lexer: LexerWrapper): string {
    const token = lexer.next();
    assert(token, "identifier");
    return token!.value;
}

function parseNextValue(lexer: LexerWrapper): any {
    const token = lexer.next();
    if (!token) {
        throw unexpected(token, "value");
    }
    switch (token.type) {
        case "stringValue":
            return token.value;
        case "numberValue":
            return parseFloat(token.value);
        case "booleanValue":
            return token.value === "true";
        case "beginObject":
            return parseNextObject(lexer);
        case "beginArray":
            return parseNextArray(lexer);
        default:
            throw unexpected(token, "value");
    }
}

function parseNextArray(lexer: LexerWrapper): any[] {
    let result: any[] = [];

    while (!expect(lexer.peek(), "endArray")) {
        result.push(parseNextValue(lexer));

        if (expect(lexer.peek(), "separator")) {
            lexer.next();
        } else {
            assert(lexer.next(), "endArray");
            break;
        }
    }
    return result;
}

class LexerWrapper {
    private _next: Token | undefined;
    private _current: Token | undefined;

    constructor(private lexer: Lexer) {
        this._next = lexer.next();
    }

    peek(): Token | undefined {
        return this._next;
    }

    next(): Token | undefined {
        this._current = this._next;
        this._next = this.lexer.next();

        return this._current;
    }

    current(): Token | undefined {
        return this._current;
    }
}
