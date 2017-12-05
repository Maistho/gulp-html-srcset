/// <reference types="node" />
import * as stream from 'stream';
export interface InputOptions {
    width?: number[];
    format?: string[];
    prefix?: string;
    postfix?: string;
}
export declare const htmlSrcset: (inputOptions?: InputOptions) => stream.Transform;
export default htmlSrcset;
