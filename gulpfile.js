const gulp = require('gulp')
const rollup = require('gulp-rollup')
const babel = require('gulp-babel')
const less = require('gulp-less')

let source
let destination
let configuration

source = {}
destination = {}
configuration = {}

source.public = {}

destination.public = {}

configuration.public = {}
configuration.public.script = {}
configuration.public.style = {}
configuration.header = {}
configuration.library = {}
configuration.rollup = {}

configuration.babel = {}
configuration.babel.preset = {}
configuration.rollup = {}

source.javascript = 'source/**/*.js'
source.typescript = 'source/**/*.ts'
source.script = 'source/**/*.[tj]s'
// source.scripts = 'source/**/*.[tj]sx?'
source.tsx = 'source/**/*.tsx'
source.less = 'source/**/*.less'
source.css = 'source/**/*.css'
source.styles = [source.less, source.css]

source.header = source.script
source.libary = source.script
source.rollup = source.javascript

source.public.script = source.tsx
source.public.style = source.styles

destination.rollup = 'destination'
destination.header = 'header'
destination.library = 'library'

destination.public.script = 'public/script'
destination.public.style = 'public/style'

configuration.babel.preset.typescript = ["@babel/preset-typescript", {}]
configuration.babel.preset.react = ["@babel/preset-react", {}]
configuration.babel.preset.env = ["@babel/preset-env", {}];
configuration.babel.preset.modules = ["@babel/preset-env", { "modules": false }];

configuration.public.script = {
    babel: {
        presets: [
            configuration.babel.preset.typescript,
            configuration.babel.preset.react,
            configuration.babel.preset.env
        ]
    }
}

configuration.rollup = {
    rollup: {},

    babel: {
        presets: [
            configuration.babel.preset.typescript,
            configuration.babel.preset.react,
            configuration.babel.preset.modules
        ]
    }
}

configuration.header = {
    babel: {
        presets: [
            configuration.babel.preset.typescript,
            configuration.babel.preset.env
        ]
    }
}

configuration.library = {
    rollup: {},

    babel: {
        presets: [
            configuration.babel.preset.typescript,
            configuration.babel.preset.react,
            configuration.babel.preset.modules
        ]
    }
}

configuration.public.style.less = {

}

gulp.task('rollup', () =>
    gulp.src(source.rollup)
    .pipe(rollup(configuration.rollup.rollup))
    .pipe(babel(configuration.rollup.babel))
    .pipe(gulp.dest(destination.rollup))
)

gulp.task('script', () =>
    gulp.src(source.public.script)
    .pipe(babel(configuration.public.script.babel))
    .pipe(gulp.dest(destination.public.script))
)

gulp.task('header', () =>
    gulp.src(source.header)
    .pipe(babel(configuration.header.babel))
    .pipe(gulp.dest(destination.header))
)

gulp.task('library', () =>
    gulp.src(source.libary)
    .pipe(babel(configuration.library.babel))
    .pipe(rollup(configuration.library.rollup))
    .pipe(gulp.dest(destination.library))
)

gulp.task('style', () =>
    gulp.src(source.public.style)
    .pipe(less(configuration.public.style.less))
    .pipe(gulp.dest(destination.public.style))
)

gulp.task('style:watch', () =>
    gulp.watch(source.less, gulp.parallel('style'))
)

gulp.task('browser', async () =>
    gulp.parallel('style', 'script')
)