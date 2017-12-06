# gulp-html-srcset
This is a plugin for [gulp-html-transform](https://github.com/maistho/gulp-html-transform)

Converts html srcsets to automatically add all your responsive images

Works very nicely with [gulp-srcset](https://github.com/TrigenSoftware/gulp-srcset)

## Installing

Using npm
```
$ npm install --save gulp-html-srcset
```

Using yarn
```
$ yarn add gulp-html-srcset
```

## Usage

#### gulpfile.js
```javascript
const { transform } = require('gulp-html-transform')
const { htmlSrcset } = require('gulp-html-srcset')

gulp.task('html', () => {
  gulp.src('src/**/*.html')
  .pipe(transform(
    htmlSrcset({
      width: [1, 720],
      format: ['webp', 'jpg'],
    }),
  ))
  .pipe(gulp.dest('dist'))
})
```

#### Html in:
```html
<img srcset="image.jpg 1200w">
```

#### Html out:
```html
<img srcset="image.webp 1200w, image.jpg 1200w, image@720w.webp 720w, image@720w.jpg 720w">
```

## API
```javascript
htmlSrcSet({
    width: [1, 720], // 1 is to generate an original sized image, the rest are image widths. Default is []
    format: ['webp', 'jpg'], // The different image formats. Default is []
    prefix: '@', // Default is '@'
    postfix: 'w' // Default is 'w'
})
```

