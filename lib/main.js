'use strict';

const electron = require('electron');
const path = require('path');
const fs = require('fs');
const menuTemplate = require('./menu-template')

let mainWindow;
const {app, BrowserWindow, dialog, Menu} = electron;

function openFile() {
	const files = dialog.showOpenDialog(mainWindow, {
		properties: ['openFile'],
		filters: [
			{name: 'Markdown Files', extensions: ['md', 'markdown', 'txt']}
		]
	});

	console.log(files);

	if (!files) {
		return;
	}

	const file = files[0];
	const content = fs.readFileSync(file).toString();

	mainWindow.webContents.send('file-opened', file, content);
}
function saveFile (content) {
  const fileName = dialog.showSaveDialog(mainWindow, {
    title: 'Save HTML Output',
    defaultPath: app.getPath('documents'),
    filters: [
      { name: 'HTML Files', extensions: ['html'] }
    ]
  })

  if (!fileName) return

  fs.writeFileSync(fileName, content)
}

app.on('ready', () => console.log('lifecycle - ready'));
app.on('quit', () => console.log('lifecycle - quit'));
app.on('before-quit', () => console.log('lifecycle - before-quit'));
app.on('will-quit', () => console.log('lifecycle - will-quit'));
app.on('window-all-closed', () => console.log('lifecycle - window-all-closed'));

app.on('ready', () => {
	mainWindow = new BrowserWindow();
	mainWindow.loadURL('file://' + path.join(__dirname, 'index.html'));

	mainWindow.webContents.on('did-finish-load', openFile);
});

app.on('ready', () => {
  const menu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(menu)
})


exports.openFile = openFile;
exports.saveFile = saveFile;
