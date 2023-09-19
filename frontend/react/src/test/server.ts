import {setupServer} from "msw/node";
import {DefaultBodyType, PathParams, ResponseComposition, rest, RestContext, RestHandler, RestRequest} from "msw";

interface IHandlerConfig {
    method?: 'get' | 'post' | 'patch' | 'put' | 'delete';
    path: string;
    statusCode: number,
    res: (req?: RestRequest<never, PathParams<string>>, res?: ResponseComposition<DefaultBodyType>, ctx?: RestContext) => object
}

export const createServer = (handlerConfig: IHandlerConfig[]) => {
    const handlers: RestHandler[] = handlerConfig.map((config) => {
        return rest[config.method || 'get'](config.path, (_req: RestRequest<never, PathParams<string>>, res: ResponseComposition<DefaultBodyType>, ctx: RestContext) => {
            return res(
                ctx.status(config.statusCode),
                ctx.json(config.res())
            );
        });
    });

    const server = setupServer(...handlers);

    beforeAll(() => {
        server.listen();
    });

    afterEach(() => {
        server.resetHandlers();
        vi.clearAllMocks();
    });

    afterAll(() => {
        server.close();
    });
};