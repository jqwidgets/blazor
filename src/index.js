// This task autogenerates demos sample files.

const fs = require('fs');
const path = require('path');
const beautify = require('beautify');
const jsbeautify = require('js-beautify').js;
const fse = require('fs-extra')
const widgetNames =
	[
		'Accordion', 'Array', 'Breadcrumb', 'Button', 'Calendar',
		'Card', 'CardView', 'Carousel', 'Chart', 'CheckBox', 'Chip',
		'ColorPanel', 'ColorPicker', 'ComboBox', 'CustomizationDialog', 'DateTimePicker',
		'DockingLayout', 'DropDownButton', 'DropDownList', 'FileUpload', 'FilterBuilder',
		'FilterPanel', 'GanttChart', 'Gauge', 'Grid', 'GroupPanel', 'Input', 'CheckInput', 'MultiInput', 'MultiComboInput',
		'DateRangeInput', 'Kanban', 'Led', 'ListBox',
		'ListMenu', 'MaskedTextBox', 'Menu', 'MultiColumnFilterPanel', 'MultilineTextBox',
		'MultiSplitButton', 'NumericTextBox', 'Pager', 'PasswordTextBox', 'Path',
		'ProgressBar', 'PowerButton', 'QueryBuilder', 'RepeatButton', 'RadioButton', 'Rating', 'ScrollBar',
		'Slider', 'Sortable', 'SortPanel', 'Splitter', 'SwitchButton',
		'Tabs', 'TabsWindow', 'Table', 'Tank', 'ToggleButton', 'TextBox', 'TimePicker', 'Toast', 'Tooltip',
		'Tree', 'Window'
	];


function unlinkAngularSync(dir) {
	if (!fs.existsSync(dir)) {
		return;
	}

	fse.removeSync(dir);

}

const demosList = [
	'/form/overview',
	'/form/accordion',
	'/form/addons',
	'/form/autogenerate',
	'/form/checkout',
	'/form/crud',
	'/form/datetime',
	'/form/events',
	'/form/form-web-component',
	'/form/settings',
	'/form/tabs',
	'/form/template'	
];


unlinkAngularSync('./angular');

if (demosList.length > 0) {
	for (let i = 0; i < demosList.length; i++) {
		const prefix = '../smart/demos';
		const demo = demosList[i];
		const widget = demo.split('/')[1];
		const name = demo.split('/')[2];

		createDemoFiles(prefix + demo, widget, name);
	}
}
else {
	walkSync('../smart/demos');
}

function camelCaseToDash(str) {
	return str.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase()
}

function walkSync(dir) {
	const files = fs.readdirSync(dir);

	files.forEach(function (file) {
		if (file === 'source' || file === 'styles' || file === 'images' || file === 'angular' || file === 'src' || file === 'node_modules' || file === 'temp') {
			return true;
		}

		const newDir = path.join(dir, file);
		if (fs.statSync(newDir).isDirectory()) {

			const components = fs.readdirSync(newDir);

			/* Add files */
			components.forEach(function (demoName) {
				const demoDir = path.join(newDir, demoName);
				if (fs.statSync(demoDir).isDirectory()) {
					createDemoFiles(demoDir, file, demoName);
				}
			});
		}
	});
}

function getIndexFile() {
	return `<!DOCTYPE html>
<html>
    <head>
        <title id='Description'>Angular Accordion Overview | Accordion | https://www.htmlelements.com/</title>
        <base href="./../../../dist/accordion/overview/">
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1"> 
		<link rel="stylesheet" href="styles.css" type="text/css" />
    </head>
    <body>
        <app-root>Loading...</app-root>

        <script src="runtime-es2015.js" type="module"></script>
		<script src="polyfills-es2015.js" type="module"></script>
		<script src="runtime-es5.js" nomodule></script>
		<script src="polyfills-es5.js" nomodule></script>
		<script src="main-es2015.js" type="module"></script>
		<script src="main-es5.js" nomodule></script>
    </body>
</html>`;
}

function makeDir(elementName, demoName, level) {
	const angularDir = 'angular\\';

	if (!fs.existsSync('angular\\')) {
		fs.mkdirSync('angular\\');
	}

	if (!fs.existsSync('angular\\src\\')) {
		fs.mkdirSync('angular\\src\\');
	}

	if (!fs.existsSync('angular\\src\\' + elementName)) {
		fs.mkdirSync('angular\\src\\' + elementName);
	}

	if (!fs.existsSync('angular\\src\\' + elementName + '\\' + demoName)) {
		fs.mkdirSync('angular\\src\\' + elementName + '\\' + demoName);
	}

	if (!fs.existsSync('angular\\demos\\')) {
		fs.mkdirSync('angular\\demos\\');
	}

	if (!fs.existsSync('angular\\demos\\' + elementName)) {
		fs.mkdirSync('angular\\demos\\' + elementName);
	}

	if (!fs.existsSync('angular\\demos\\' + elementName + '\\' + demoName)) {
		fs.mkdirSync('angular\\demos\\' + elementName + '\\' + demoName);

		let data = getIndexFile();
		let name = elementName;

		for (let i = 0; i < widgetNames.length; i++) {
			const widgetName = widgetNames[i];

			if (widgetName.toLowerCase() === name) {
				name = widgetName;
				break;
			}
		}

		data = data.replace('Angular Accordion Overview | Accordion', `Angular ${name} ${demoName.substring(0, 1).toUpperCase()}${demoName.substring(1)} | ${name}`);
		data = data.replace('./../../../dist/accordion/overview/', `./../../../dist/${elementName.toLowerCase()}/${demoName.toLowerCase()}/`);

		fs.writeFileSync('angular\\demos\\' + elementName + '\\' + demoName + '\\index.htm', data);
	}

	return angularDir + '\\src\\' + elementName + '\\' + demoName;
}


function createDemoFiles(dir, elementName, demoName) {
	let components = [];
	let viewChildren = [];
	if (fs.existsSync(dir + '\\index.htm')) {
		fs.readFile(dir + '\\index.htm', 'utf8', function (err, data) {
			if (err) {
				return console.log(err);
			}

			data = data.toString();

			const hasViewPortClass = data.indexOf('<body class="viewport">') > 0;

			if (hasViewPortClass) {
				data = data.toString().substring(data.indexOf('<body class="viewport">') + 24);
			}
			else {
				data = data.toString().substring(data.indexOf('<body>') + 6);
			}
			data = data.replace('<body>', '');
			data = data.replace('</body>', '');
			data = data.replace('</html>', '');

			if (data.indexOf('<!-- scripts') >= 0) {
				data = data.substring(0, data.indexOf('<!-- scripts'));
			}
			else if (data.indexOf('<script') >= 0) {
				data = data.substring(0, data.indexOf('<script'));
			}

			// add template ids.
			for (let i = 0; i < widgetNames.length; i++) {
				const tagName = 'smart-' + camelCaseToDash(widgetNames[i]);
				const widgetName = widgetNames[i];

				let replaceIndex = 0;

				data = data.replace(new RegExp(tagName + ' ', 'g'), function (tagName) {
					replaceIndex++;
					console.log(tagName);
					if (tagName.indexOf('#') === -1) {
						if (replaceIndex === 1) {
							components.push(widgetName);
							viewChildren.push({ name: widgetName, id: widgetName.toLowerCase() });
						}
						else {
							viewChildren.push({ name: widgetName, id: widgetName.toLowerCase() + replaceIndex });
						}

						if (replaceIndex > 1) {
							return tagName + '  #' + widgetName.toLowerCase() + replaceIndex + ' ';
						}

						return tagName + '  #' + widgetName.toLowerCase() + ' ';
					}

					return tagName;
				});
			}

			data = beautify(data, { format: 'html' });

			const angularDir = makeDir(elementName, demoName);
			fs.writeFileSync(angularDir + '\\app.component.html', data);
		});
	}


	if (fs.existsSync(dir + '\\styles.css')) {
		fs.readFile(dir + '\\styles.css', 'utf8', function (err, data) {
			if (err) {
				return console.log(err);
			}

			const angularDir = makeDir(elementName, demoName);
			fs.writeFileSync(angularDir + '\\app.component.css', data);
		});
	}

	if (fs.existsSync(dir + '\\index.ts')) {
		fs.readFile('temp/src/app/app.component.ts', 'utf8', function (err, data) {
			if (err) {
				return console.log(err);
			}

			fs.readFile(dir + '\\index.js', 'utf8', function (err, jsdata) {
				if (err) {
					return console.log(err);
				}

				const tsURL = 'from "../../../source/typescript/smart.elements"';

				if (jsdata.indexOf(tsURL) >= 0) {
					jsdata = jsdata.substring(jsdata.indexOf(tsURL) + tsURL.length);
				}
				jsdata = jsdata.trim();
				if (jsdata.length > 0) {
					if (jsdata.indexOf('window.onload') >= 0) {
						jsdata = jsdata.replace('window.onload = function () {', '');
						jsdata = jsdata.substring(0, jsdata.lastIndexOf('}'));
					}

					let result = '';
					const multilines = jsdata.split('\n');

					for (let i = 0; i < multilines.length; i++) {
						result += '    ' + multilines[i] + '\n';

					}

					data = data.replace("// init code.", "// init code.\n\t" + result);
				}

				let componentImports = '';

				for (let i = 0; i < components.length; i++) {
					componentImports += `import { ${components[i]}Component } from 'smart-webcomponents-angular/${components[i].toLowerCase()}';\n`;
				}

				data = data.replace("import { AccordionComponent } from 'smart-webcomponents-angular/accordion';", componentImports);

				let viewChildrenImports = '';
				for (let i = 0; i < viewChildren.length; i++) {
					const viewChild = viewChildren[i];

					viewChildrenImports += `@ViewChild('${viewChild.id}', { read: ${viewChild.name}Component, static: false }) ${viewChild.id}: ${viewChild.name}Component;\n	`;
				}

				data = data.replace("@ViewChild('accordion', { read: AccordionComponent, static: false }) accordion: AccordionComponent;", viewChildrenImports);
				data = data.replace('/// <reference path="../../../source/typescript/smart.elements.d.ts" />', '');

				const angularDir = makeDir(elementName, demoName);
				fs.writeFileSync(angularDir + '\\app.component.ts', data);

				let appModuleData = `import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AccordionModule } from 'smart-webcomponents-angular/accordion';

import { AppComponent } from './app.component';

@NgModule({
    declarations: [ AppComponent ],
    imports: [ BrowserModule, AccordionModule ],
    bootstrap: [ AppComponent ],
	entryComponents: [ AppComponent ]
})

export class AppModule { }
`;

				// app.module.ts
				let name = elementName;

				for (let i = 0; i < widgetNames.length; i++) {
					if (widgetNames[i].toLowerCase() === name.toLowerCase()) {
						name = widgetNames[i];
						break;
					}
				}

				let moduleTSImports = '';
				let moduleImports = '';

				for (let i = 0; i < components.length; i++) {
					moduleTSImports += `import { ${components[i]}Module } from 'smart-webcomponents-angular/${components[i].toLowerCase()}';`;

					moduleImports += `${components[i]}Module`;

					if (i < components.length - 1) {
						moduleImports += ', ';
						componentImports += '\n';
					}
				}

				appModuleData = appModuleData.replace("import { AccordionModule } from 'smart-webcomponents-angular/accordion';", moduleTSImports);
				appModuleData = appModuleData.replace("BrowserModule, AccordionModule", 'BrowserModule, ' + moduleImports);

				fs.writeFileSync(angularDir + '\\app.module.ts', appModuleData);
			});
		});
	}

	fs.readFile('temp/src/main.ts', 'utf8', function (err, data) {
		if (err) {
			return console.log(err);
		}

		const angularDir = makeDir(elementName, demoName);

		fs.writeFileSync(angularDir + '\\main.ts', data);
	});
}


function createStackblitzFiles(dir, elementName, demoName) {
	fs.readFile(dir + '\\index.htm', 'utf8', function (err, data) {
		if (err) {
			return console.log(err);
		}

		const angularDir = makeDir(dir, elementName, demoName);

		data = data.toString();

		const hasViewPortClass = data.indexOf('<body class="viewport">') > 0;

		if (hasViewPortClass) {
			data = data.toString().substring(data.indexOf('<body class="viewport">') + 24);
		}
		else {
			data = data.toString().substring(data.indexOf('<body>') + 6);
		}
		data = data.replace('<body>', '');
		data = data.replace('</body>', '');
		data = data.replace('</html>', '');

		createFile(angularDir + '\\src\\app\\', data, 'app.component.html');
	});




	fs.readFile(dir + '\\styles.css', 'utf8', function (err, data) {
		if (err) {
			return console.log(err);
		}

		const angularDir = makeDir(dir, elementName, demoName);

		createFile(angularDir + '\\src\\app\\', data, 'app.component.css');
	});

	fs.readFile('temp/src/app/app.component.ts', 'utf8', function (err, data) {
		if (err) {
			return console.log(err);
		}

		const angularDir = makeDir(dir, elementName, demoName);

		fs.readFile(dir + '\\index.ts', 'utf8', function (err, jsdata) {
			if (err) {
				return console.log(err);
			}

			if (jsdata.length > 0) {
				if (jsdata.indexOf('window.onload') >= 0) {
					jsdata = jsdata.replace('window.onload = function () {', '');

					jsdata = jsdata.substring(0, jsdata.lastIndexOf('}'));
				}

				let result = '';
				const multilines = jsdata.split('\n');

				for (let i = 0; i < multilines.length; i++) {
					result += '    ' + multilines[i] + '\n';

				}

				data = data.replace("// onInit code.", "// onInit code.\n\t" + result);
			}
			createFile(angularDir + '\\src\\app\\', data, 'app.component.ts');
		});
	});

	fs.readFile('temp/src/app/app.module.ts', 'utf8', function (err, data) {
		if (err) {
			return console.log(err);
		}

		const angularDir = makeDir(dir, elementName, demoName);

		createFile(angularDir + '\\src\\app\\', data, 'app.module.ts');
	});

	fs.readFile('temp/src/index.html', 'utf8', function (err, data) {
		if (err) {
			return console.log(err);
		}

		const angularDir = makeDir(dir, elementName, demoName);

		createFile(angularDir + '\\src\\', data, 'index.html');
	});

	fs.readFile('temp/src/main.ts', 'utf8', function (err, data) {
		if (err) {
			return console.log(err);
		}

		const angularDir = makeDir(dir, elementName, demoName);

		createFile(angularDir + '\\src\\', data, 'main.ts');
	});

	fs.readFile('temp/src/polyfills.ts', 'utf8', function (err, data) {
		if (err) {
			return console.log(err);
		}

		const angularDir = makeDir(dir, elementName, demoName);

		createFile(angularDir + '\\src\\', data, 'polyfills.ts');
	});

	fs.readFile('temp/angular.json', 'utf8', function (err, data) {
		if (err) {
			return console.log(err);
		}

		const angularDir = makeDir(dir, elementName, demoName);

		createFile(angularDir + '\\', data, 'angular.json');
	});

	fs.readFile('temp/package.json', 'utf8', function (err, data) {
		if (err) {
			return console.log(err);
		}

		const angularDir = makeDir(dir, elementName, demoName);

		createFile(angularDir + '\\', data, 'package.json');
	});

	fs.readFile('temp/tsconfig.json', 'utf8', function (err, data) {
		if (err) {
			return console.log(err);
		}

		const angularDir = makeDir(dir, elementName, demoName);

		createFile(angularDir + '\\', data, 'tsconfig.json');
	});
}

function createFile(dir, data, index) {
	if (fs.existsSync(dir + '\\' + index)) {
		fs.truncateSync(dir + '\\' + index);
	}
	fs.appendFile(dir + '\\' + index, data, function (err) {
		if (err) console.log('error at "appendFile"   =>   ' + err);
	});
}