"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var through = require("through2");
var cheerio = require("cheerio");
var defaultOptions = {
    sizes: [],
    format: [],
    prefix: '@',
    postfix: 'w',
};
exports.htmlSrcset = function (inputOptions) {
    if (inputOptions === void 0) { inputOptions = {}; }
    return through.obj(function (file, enc, cb) {
        if (inputOptions.width) {
            ;
            inputOptions.sizes = inputOptions.width;
        }
        var options = Object.assign(defaultOptions, inputOptions);
        if (file.isNull() || file.isStream() || !file.contents) {
            return cb(null, file);
        }
        if (options.sizes.length === 0 || options.format.length === 0) {
            console.warn('No widths or formats supplied');
            return cb(null, file);
        }
        var content = file.contents.toString();
        var $ = cheerio.load(content);
        var elements = $('img[srcset]');
        elements.each(function (i, el) {
            var origSrcset = el.attribs['srcset'];
            var origSize;
            var origSrc;
            _a = origSrcset.split(/\s/), origSrc = _a[0], origSize = _a[1];
            var filename = (function () {
                var x = origSrc.split('.');
                x.pop();
                return x.join('.');
            })();
            var dir = origSize.slice(-1);
            if (['w', 'h'].indexOf(dir) !== -1) {
                origSize = origSize.slice(0, origSize.length - 1);
            }
            else {
                return cb(null, file);
            }
            var sizes = [];
            options.sizes.forEach(function (size) {
                if (origSize > size) {
                    sizes.push(size);
                }
            });
            var srcset = [];
            sizes.forEach(function (size) {
                options.format.forEach(function (ext) {
                    if (size === 1) {
                        srcset.push(filename + "." + ext + " " + origSize + dir);
                    }
                    else {
                        srcset.push("" + filename + options.prefix + size + options.postfix + "." + ext + " " + size + dir);
                    }
                });
            });
            el.attribs['srcset'] = srcset.join(', ');
            var _a;
        });
        file.contents = new Buffer($.html());
        cb(null, file);
    });
};
exports.default = exports.htmlSrcset;
