import * as through from 'through2'
import * as cheerio from 'cheerio'
import * as File from 'vinyl'

interface InputOptions {
    width?: number[]
    format?: string[]
    prefix?: string
    postfix?: string
}

interface Options {
    sizes: number[]
    format: string[]
    prefix: string
    postfix: string
}
const defaultOptions: Options = {
    sizes: [],
    format: [],
    prefix: '@',
    postfix: 'w',
};


export const htmlSrcset = (inputOptions: InputOptions = {}) => through.obj((file: File, enc, cb) => {

    if (inputOptions.width) {
        ;(inputOptions as Options).sizes = inputOptions.width
    }

    const options: Options = Object.assign(defaultOptions, inputOptions);
    if (file.isNull() || file.isStream() || !file.contents) {
        return cb(null, file)
    }

    if (options.sizes.length === 0 || options.format.length === 0) {
        console.warn('No widths or formats supplied')
        return cb(null, file)
    }

    const content = file.contents.toString()
    const $ = cheerio.load(content)
    const elements = $('img[srcset]')

    elements.each((i, el) => {
        const origSrcset = el.attribs['srcset']
        let origSize: number | string
        let origSrc: string
        [origSrc, origSize] = origSrcset.split(/\s/)

        let filename = (() => {
            let x = origSrc.split('.')
            x.pop()
            return x.join('.')
        })()

        let dir = origSize.slice(-1)
        if (['w', 'h'].indexOf(dir) !== -1) {
            origSize = origSize.slice(0, origSize.length - 1)
        } else {
            return cb(null, file)
        }

        const sizes: number[] = [];

        options.sizes.forEach(size => {
            if (origSize > size) {
                sizes.push(size);
            }
        })

        const srcset: string[] = [];

        sizes.forEach(size => {
            options.format.forEach(ext => {
                if (size === 1) {
                    srcset.push(`${filename}.${ext} ${origSize}${dir}`)
                } else {
                    srcset.push(`${filename}${options.prefix}${size}${options.postfix}.${ext} ${size}${dir}`)
                }
            })
        })

        el.attribs['srcset'] = srcset.join(', ')
    })

    file.contents = new Buffer($.html())

    cb(null, file)
})

export default htmlSrcset