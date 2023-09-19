import '@testing-library/jest-dom';
import {vi} from "vitest";

const windowMock = {
    scroll: vi.fn(),
};

Object.assign(global, global, windowMock);