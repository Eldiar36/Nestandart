let project_folder = "dist";
let source_folder = "#source";

let path ={
    build:{
        html: "dist"+ "/",
        css: "dist"+ "/css/",
        js: "dist"+ "/js/",
        img: "dist"+ "/images/",
        fonts: "dist"+ "/fonts/",
    },
    src:{
        html: "#source"+ "/*.html",
        css: "#source"+ "/sass/style.scss",
        libs_css: "#source"+ "/sass/_libs.scss",
        js: "#source"+ "/js/main.js",
        img: "#source"+ "/images/*.{png,svg,jpg}",
        fonts: "#source"+ "/fonts/*.ttf",
    },
    watch:{
        html: "#source"+ "/",
        css: "#source"+ "/sass/*style.scss",
        libs_css: "#source"+ "/sass/*_libs.scss",
        js: "#source"+ "/js/*.js",
        img: "#source"+ "/images/*.{png,svg,jpg}",
    },
    clean: "./" + project_folder + "/"
};

let {src, dest} = require("gulp"),
     gulp = require('gulp'),
     browsersync = require("browser-sync").create(),
    fileinclude= require("gulp-file-include"),
    del=require("del"),
    scss = require("gulp-sass"),
    autoprefixer = require("gulp-autoprefixer"),
    group_media = require("gulp-group-css-media-queries"),
    clean_css = require("gulp-clean-css"),
    rename = require("gulp-rename"),
    uglify = require("gulp-uglify-es").default,
    imagemin = require("gulp-imagemin"),
    jsconcat      = require ('gulp-concat'),
    cssnano     = require('gulp-cssnano');



function browserSync(params) {
    browsersync.init({
        server:{
            baseDir: "./" + project_folder+ "/"
        },
        port: 3000,
        notify: false,
    })
}
function scripts(){
    return gulp.src([ // Берем все необходимые библиотеки
        '#source/libs/owl.carousel.js', //
        '#source/libs/jquery.magnific-popup.min.js',
        '#source/libs/aos.js'
    ])
        .pipe(jsconcat('libs.min.js')) //
        .pipe(uglify()) // Сжимаем JS файл
        .pipe(gulp.dest(path.build.js)); //
}

function html(){
    return src(path.src.html)
        .pipe(fileinclude())
        .pipe(dest(path.build.html))
        .pipe(browsersync.stream())
}
function js(){
    return src(path.src.js)
        .pipe(fileinclude())
        .pipe(dest(path.build.js))
        .pipe(
            uglify()
        )
        .pipe(
            rename({
                extname: ".min.js"
            })
        )
        .pipe(browsersync.stream())
}
function  css() {
    return src(path.src.css)
        .pipe(scss({
            outputStyle: "expanded"
        }))
        .pipe(
            group_media()
        )

        .pipe(
            autoprefixer({
                overrideBrowserslist: ['last 5 versions'],
                cascade: true
            })
        )
        .pipe(dest(path.build.css))
        .pipe(
            clean_css()
        )
        .pipe(
            rename({
                extname: ".min.css"
            })
        )
        .pipe(dest(path.build.css))
        .pipe(browsersync.stream())
}
/*function  libsCss() {
    return src(path.src.libs_css)
        .pipe(scss({
            outputStyle: "expanded"
        }))
        .pipe(
            autoprefixer({
                overrideBrowserslist: ['last 5 versions'],
                cascade: true
            })
        )
        .pipe(dest(path.build.css))
        .pipe(
            clean_css()
        )
        .pipe(
            rename({
                extname: ".min.css"
            })
        )
        .pipe(dest(path.build.css))
        .pipe(browsersync.stream())
}*/
function images(){
    return src(path.src.img)
        .pipe(
            imagemin({
                progressive: true,
                svgPlugins: [{removeViewBox:false}],
                interlaced: true,
                optimizationLevel: 3 //0 to 7
            })
        )
        .pipe(dest(path.build.img))
        .pipe(browsersync.stream())
}
function watchFiles(params){
    gulp.watch([path.watch.html],html)
    gulp.watch([path.watch.css],css)
    gulp.watch([path.watch.js],js)
    gulp.watch([path.watch.img],images)
}

function clean(params){
    return del(path.clean)
}
let build = gulp.series(clean,gulp.parallel(js,css,html,images,scripts));

let watch = gulp.parallel(build ,watchFiles, browserSync);

exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;
