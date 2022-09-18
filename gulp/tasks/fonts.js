import fs from 'fs';
import fonter from 'gulp-fonter-fix';
import ttf2woff2 from 'gulp-ttf2woff2';

export const otfToTtf = () => {
	// Looking for .otf font files
	return app.gulp.src(`${app.path.srcFolder}/fonts/*.otf`, {})
		.pipe(app.plugins.plumber(
			app.plugins.notify.onError({
				title: "FONTS",
				message: "Error: <%= error.message %>"
			}))
		)
		// Convert to .ttf
		.pipe(fonter({
			formats: ['ttf']
		}))
		// Upload to source folder
		.pipe(app.gulp.dest(`${app.path.srcFolder}/fonts/`))
}
export const ttfToWoff = () => {
	// Looking for .ttf font files
	return app.gulp.src(`${app.path.srcFolder}/fonts/*.ttf`, {})
		.pipe(app.plugins.plumber(
			app.plugins.notify.onError({
				title: "FONTS",
				message: "Error: <%= error.message %>"
			}))
		)
		// Convert to .woff
		.pipe(fonter({
			formats: ['woff']
		}))
		// Upload to the folder with the result
		.pipe(app.gulp.dest(`${app.path.build.fonts}`))
		// Ищем файлы шрифтов .ttf
		.pipe(app.gulp.src(`${app.path.srcFolder}/fonts/*.ttf`))
		// Convert to .woff2
		.pipe(ttf2woff2())
		// Upload to the folder with the result
		.pipe(app.gulp.dest(`${app.path.build.fonts}`))
		// Ищем файлы шрифтов .woff и woff2
		.pipe(app.gulp.src(`${app.path.srcFolder}/fonts/*.{woff,woff2}`))
		// Upload to the folder with the result
		.pipe(app.gulp.dest(`${app.path.build.fonts}`));
}
export const fontsStyle = () => {
	// Font Connection Style File
	let fontsFile = `${app.path.srcFolder}/scss/fonts.scss`;
	// Check if font files exist
	fs.readdir(app.path.build.fonts, function (err, fontsFiles) {
		if (fontsFiles) {
			// Checking if a style file exists for connecting fonts
			if (!fs.existsSync(fontsFile)) {
				// If the file does not exist, create it
				fs.writeFile(fontsFile, '', cb);
				let newFileOnly;
				for (var i = 0; i < fontsFiles.length; i++) {
					// Writing Font Connections to a Style File
					let fontFileName = fontsFiles[i].split('.')[0];
					if (newFileOnly !== fontFileName) {
						let fontName = fontFileName.split('-')[0] ? fontFileName.split('-')[0] : fontFileName;
						let fontWeight = fontFileName.split('-')[1] ? fontFileName.split('-')[1] : fontFileName;
						if (fontWeight.toLowerCase() === 'thin') {
							fontWeight = 100;
						} else if (fontWeight.toLowerCase() === 'extralight') {
							fontWeight = 200;
						} else if (fontWeight.toLowerCase() === 'light') {
							fontWeight = 300;
						} else if (fontWeight.toLowerCase() === 'medium') {
							fontWeight = 500;
						} else if (fontWeight.toLowerCase() === 'semibold') {
							fontWeight = 600;
						} else if (fontWeight.toLowerCase() === 'bold') {
							fontWeight = 700;
						} else if (fontWeight.toLowerCase() === 'extrabold' || fontWeight.toLowerCase() === 'heavy') {
							fontWeight = 800;
						} else if (fontWeight.toLowerCase() === 'black') {
							fontWeight = 900;
						} else {
							fontWeight = 400;
						}
						fs.appendFile(fontsFile, `@font-face {\n\tfont-family: ${fontName};\n\tfont-display: swap;\n\tsrc: url("../fonts/${fontFileName}.woff2") format("woff2"), url("../fonts/${fontFileName}.woff") format("woff");\n\tfont-weight: ${fontWeight};\n\tfont-style: normal;\n}\r\n`, cb);
						newFileOnly = fontFileName;
					}
				}
			} else {
				// If the file exists, display a message
				console.log("The scss/fonts.scss file already exists. To update a file, you need to delete it!");
			}
		}
	});

	return app.gulp.src(`${app.path.srcFolder}`);
	function cb() { }
}