"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv = require("dotenv");
var openai_1 = require("openai");
var readlineModule = require("readline");
var readline = readlineModule.createInterface({
    input: process.stdin,
    output: process.stdout,
});
dotenv.config();
var secretKey = process.env.OPENAI_API_KEY;
var openai = new openai_1.OpenAI({ apiKey: secretKey });
var assistantId = "asst_CjvyFIeraCLKB8NTAqF0FhqG"; // Replace with your assistant's ID
function askUser(question) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve) {
                    readline.question(question, function (answer) {
                        resolve(answer);
                    });
                })];
        });
    });
}
function main() {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var threadId, _loop_1, state_1, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 4, , 5]);
                    threadId = null;
                    console.log("Здравствуйте, чем я могу вам помочь?");
                    _loop_1 = function () {
                        var userInput, thread, run, runStatus, messages, assistantMessages;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0: return [4 /*yield*/, askUser("Введите ваш ответ (или введите 'выход' для завершения): ")];
                                case 1:
                                    userInput = _c.sent();
                                    if (userInput.toLowerCase() === 'выход') {
                                        return [2 /*return*/, "break"];
                                    }
                                    if (!!threadId) return [3 /*break*/, 3];
                                    return [4 /*yield*/, openai.beta.threads.create()];
                                case 2:
                                    thread = _c.sent();
                                    threadId = thread.id;
                                    console.log("Thread ID created:", threadId);
                                    _c.label = 3;
                                case 3:
                                    console.log("Current Thread ID:", threadId);
                                    return [4 /*yield*/, openai.beta.threads.messages.create(threadId, {
                                            role: "user",
                                            content: userInput,
                                        })];
                                case 4:
                                    _c.sent();
                                    return [4 /*yield*/, openai.beta.threads.runs.create(threadId, { assistant_id: assistantId })];
                                case 5:
                                    run = _c.sent();
                                    runStatus = void 0;
                                    _c.label = 6;
                                case 6: return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                                case 7:
                                    _c.sent();
                                    return [4 /*yield*/, openai.beta.threads.runs.retrieve(threadId, run.id)];
                                case 8:
                                    runStatus = _c.sent();
                                    _c.label = 9;
                                case 9:
                                    if (runStatus.status !== "completed") return [3 /*break*/, 6];
                                    _c.label = 10;
                                case 10: return [4 /*yield*/, openai.beta.threads.messages.list(threadId)];
                                case 11:
                                    messages = _c.sent();
                                    assistantMessages = messages.data.filter(function (m) { return m.role === "assistant" && m.run_id === run.id; });
                                    if (assistantMessages.length > 0 && assistantMessages[0].content[0].type === 'text') {
                                        console.log("Ответ помощника:", (_a = assistantMessages[0].content[0].text) === null || _a === void 0 ? void 0 : _a.value);
                                    }
                                    else {
                                        console.log("Assistant did not respond in time.");
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _b.label = 1;
                case 1:
                    if (!true) return [3 /*break*/, 3];
                    return [5 /*yield**/, _loop_1()];
                case 2:
                    state_1 = _b.sent();
                    if (state_1 === "break")
                        return [3 /*break*/, 3];
                    return [3 /*break*/, 1];
                case 3:
                    readline.close();
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _b.sent();
                    console.error(error_1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
main();
