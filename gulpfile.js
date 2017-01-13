var gulp = require('gulp'),
	rename = require('gulp-rename'),//引入重命名插件
	uglify = require("gulp-uglify"),//引入js压缩插件
	minifyCss = require("gulp-minify-css"),//引入css压缩插件
	minifyHtml = require("gulp-minify-html");//引入html压缩插件
	imagemin = require("gulp-imagemin"),//引入jpg、gif压缩插件
	pngquant = require('imagemin-pngquant'),//引入png压缩插件
	cache = require('gulp-cache'),//只压缩修改的图片
	rev = require('gulp-rev'),//更改版本号
	revAppend = require('gulp-rev-append'),//给页面的引用添加版本号，清除页面引用缓存
	revCollector = require('gulp-rev-collector'),//gulp-rev的插件,用于html更新引用路径
	del = require('del');//删除文件或文件夹

//执行css压缩
gulp.task('css',function(){
	gulp.src('170112/css/main.css')	//找到要压缩的文件
	.pipe(minifyCss())//执行压缩
	.pipe(rename('main.min.css'))//将main.js重命名为main.min.js
	.pipe(rev())//更改版本号
	.pipe(gulp.dest('170112/css'))//输出压缩后的文件
	.pipe(rev.manifest())
	.pipe(gulp.dest('rev'));
});
//执行js压缩
gulp.task('js',function(){
	gulp.src('170112/js/main.js')
	.pipe(uglify())
	.pipe(rename('main.min.js'))//将main.js重命名为main.min.js
	.pipe(rev())
	.pipe(gulp.dest('170112/js'))
	.pipe(rev.manifest())
	.pipe(gulp.dest('rev'));
});
//执行html压缩
gulp.task('html',function(){
	gulp.src(['170112/*.html'])//当有多处文件时可以传入数组
	.pipe(minifyHtml())
	.pipe(gulp.dest('170112'));
});
//执行img压缩
gulp.task('img',function(){
	gulp.src('170112/images/*')
	/*.pipe(imagemin({
		progressive: true,
		use: [pngquant()]//使用pngquant来压缩Png图片
	}))	*/
	.pipe(cache(imagemin({
			optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
			interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true,//类型：Boolean 默认：false 多次优化svg直到完全优化
            progressive: true,//jpg无损压缩
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
	.pipe(gulp.dest('170112/images'));
});
//更新html文件引用地址
gulp.task('update',function(){
	return gulp.src(['rev/*.json','170112/*.html'])//第一个问生成的json文件，后一个为要更新的的html模板
	.pipe(revCollector({
		replaceReved: true//替换原有路径
	}))
	.pipe(gulp.dest('170112'));
});
//给html中的url添加hash
gulp.task('revAppend',function(){
	gulp.src('170112/king.html')
	.pipe(revAppend())
	.pipe(gulp.dest('170112/html'));
});
//删除文件或文件夹
gulp.task('del',function(cb){
	del(['170112/js/main.min.js'],cb);//文件名前加上！不是不删除
});
