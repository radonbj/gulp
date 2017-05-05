var gulp = require('gulp'),
	rename = require('gulp-rename'),//引入重命名插件
	watch = require('gulp-watch'),//检测文件是否改变
	uglify = require("gulp-uglify"),//引入js压缩插件
	minifyCss = require("gulp-minify-css"),//引入css压缩插件
	minifyHtml = require("gulp-minify-html");//引入html压缩插件
	imagemin = require("gulp-imagemin"),//引入jpg、gif压缩插件
	pngquant = require('imagemin-pngquant'),//引入png压缩插件
	cache = require('gulp-cache'),//只压缩修改的图片
	rev = require('gulp-rev'),//更改版本号
	revAppend = require('gulp-rev-append'),//给页面的引用添加MD5版本号，清除页面引用缓存
	revCollector = require('gulp-rev-collector'),//gulp-rev的插件,用于html更新引用路径
	autoprefixer = require('gulp-autoprefixer'),//css兼容处理
	del = require('del');//删除文件或文件夹

//执行css压缩和兼容处理
gulp.task('css',function(){
	gulp.src('170321/css/main.css')	//找到要压缩的文件
	.pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android >= 4.0'],
            cascade: true, //是否美化属性值 默认：true 像这样：           
            remove:true //是否去掉不必要的前缀 默认：true 
        }))
	.pipe(minifyCss())//执行压缩
	.pipe(rename('main.min.css'))//将main.js重命名为main.min.js
	.pipe(rev())//更改版本号		
	.pipe(gulp.dest('170321/css'))//输出压缩后的文件
	.pipe(rev.manifest())
	.pipe(gulp.dest('rev'));
});
//执行js压缩
gulp.task('js',function(){
	gulp.src('170321/js/main.js')
	.pipe(uglify())
	.pipe(rename('main.min.js'))//将main.js重命名为main.min.js
	.pipe(rev())
	.pipe(gulp.dest('170321/js'))
	.pipe(rev.manifest())
	.pipe(gulp.dest('rev'));
});
//执行html压缩
gulp.task('html',function(){
	gulp.src(['170321/*.html'])//当有多处文件时可以传入数组
	.pipe(minifyHtml())
	.pipe(gulp.dest('170321/'));
});
//执行img压缩
gulp.task('img',function(){
	gulp.src('170321/images/icon.png')
	/*.pipe(imagemin({
		progressive: true,
		use: [pngquant()]//使用pngquant来压缩Png图片
	}))	*/
	.pipe(cache(imagemin({
			optimizationLevel: 3, //类型：Number  默认：3  取值范围：0-7（优化等级）
			interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true,//类型：Boolean 默认：false 多次优化svg直到完全优化
            progressive: true,//jpg无损压缩
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
	.pipe(gulp.dest('170321/img'));
});
//更新html文件引用地址
gulp.task('update',function(){
	return gulp.src(['./rev/rev-manifest.json','./170321/*.html'])//第一个问生成的json文件，后一个为要更新的的html模板
	.pipe(revCollector({
		replaceReved: true//替换原有路径
	}))
	.pipe(gulp.dest('./170321/'));
});
//给html中的url添加hash
gulp.task('revAppend',function(){
	gulp.src('170321/*.html')	
	.pipe(revAppend())
	.pipe(gulp.dest('170321/'));
});
//删除文件或文件夹
gulp.task('del',function(cb){
	del(['170321/js/main.min.js'],cb);//文件名前加上！不是不删除
});

//一键命令
gulp.task('default',['css','js','img','update','revAppend']);