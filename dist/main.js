"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./libs/constants");
const cors_1 = __importDefault(require("cors"));
const routerManager_1 = require("./Routers/routerManager");
const corsSetUp_1 = require("./libs/corsSetUp");
const errorHandler_1 = __importDefault(require("./libs/Handler/errorHandler"));
const app = (0, constants_1.EXPRESS)();
app.use((0, cors_1.default)({
    origin: (0, corsSetUp_1.getCorsOrigin)(),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(constants_1.EXPRESS.json());
app.use(constants_1.EXPRESS.urlencoded({ extended: true }));
app.use('/upload', constants_1.EXPRESS.static('upload'));
app.use('/', routerManager_1.RouterManager);
app.use(errorHandler_1.default);
app.listen(constants_1.PORT, () => {
    console.log(`Server is running`);
});
//# sourceMappingURL=main.js.map