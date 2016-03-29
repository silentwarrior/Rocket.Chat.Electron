'use strict';

import { remote } from 'electron';
import { servers } from './servers';
import { sidebar } from './sidebar';
import { webview } from './webview';
import webFrame from 'web-frame';
import '../branding/branding.js';

var Menu = remote.Menu;
var APP_NAME = remote.app.getName();
var template;

document.title = APP_NAME;

var changeCSS = function(){
    const activeWebview = webview.getActive();
    if (activeWebview) {
        var fs = require('fs');
         fs.readFile('./resources/app.asar/stylesheets/overrides.css',"utf-8", function(err, data) {
            data = ""+data;
             if (data && !err) {
                    console.log('reloading css');
                    activeWebview.insertCSS(data);
             }else{
                 console.error(err);
             }
         });
    }
}
// brute force the shit out of it lol
var interval = setInterval(changeCSS, 1000);
setTimeout(function(){
    clearInterval(interval);
}, 3*60*1000);

if (process.platform === 'darwin') {
	template = [
		{
			label: APP_NAME,
			submenu: [
				{
					label: 'About ' + APP_NAME,
					role: 'about'
				},
				{
					type: 'separator'
				},
				{
					label: 'Hide ' + APP_NAME,
					accelerator: 'Command+H',
					role: 'hide'
				},
				{
					label: 'Hide Others',
					accelerator: 'Command+Alt+H',
					role: 'hideothers'
				},
				{
					label: 'Show All',
					role: 'unhide'
				},
				{
					type: 'separator'
				},
				{
					label: 'Quit ' + APP_NAME,
					accelerator: 'Command+Q',
					click: function() {
						remote.app.quit();
					}
				}
			]
		},
		{
			label: 'Edit',
			submenu: [
				{
					label: 'Undo',
					accelerator: 'Command+Z',
					role: 'undo'
				},
				{
					label: 'Redo',
					accelerator: 'Command+Shift+Z',
					role: 'redo'
				},
				{
					type: 'separator'
				},
				{
					label: 'Cut',
					accelerator: 'Command+X',
					role: 'cut'
				},
				{
					label: 'Copy',
					accelerator: 'Command+C',
					role: 'copy'
				},
				{
					label: 'Paste',
					accelerator: 'Command+V',
					role: 'paste'
				},
				{
					label: 'Select All',
					accelerator: 'Command+A',
					role: 'selectall'
				}
			]
		},
		{
			label: 'View',
			submenu: [
				{
					label: 'Original Zoom',
					accelerator: 'Command+0',
					click: function() {
						webFrame.setZoomLevel(0);
					}
				},
				{
					label: 'Zoom In',
					accelerator: 'Command+=',
					click: function() {
						webFrame.setZoomLevel(webFrame.getZoomLevel()+1);
					}
				},
				{
					label: 'Zoom Out',
					accelerator: 'Command+-',
					click: function() {
						webFrame.setZoomLevel(webFrame.getZoomLevel()-1);
					}
				},
				{
					type: 'separator'
				},
				{
					label: 'Current Server - Reload',
					accelerator: 'Command+R',
					click: function() {
						const activeWebview = webview.getActive();
						if (activeWebview) {
							activeWebview.reload();
						}
					}
				},
				{
					label: 'Current Server - Toggle DevTools',
					accelerator: 'Command+Alt+I',
					click: function() {
						const activeWebview = webview.getActive();
						if (activeWebview) {
							activeWebview.openDevTools();
						}
					}
				},
				{
					type: 'separator'
				},
				{
					label: 'Application - Reload',
					accelerator: 'Command+Shift+R',
					click: function() {
						var mainWindow = remote.getCurrentWindow();
						if (mainWindow.tray) {
							mainWindow.tray.destroy();
						}
						mainWindow.reload();
					}
				},
				{
					label: 'Application - Toggle DevTools',
					click: function() {
						remote.getCurrentWindow().toggleDevTools();
					}
				},
				{
					type: 'separator'
				},
				{
					label: 'Toggle server list2',
					click: function() {
						sidebar.toggle();
					}
				},
				{
					type: 'separator'
				},
				{
					label: 'Reload CSS',
					click: function() {
					    const activeWebview = webview.getActive();
                    	if (activeWebview) {
                    	    var fs = require('fs');
                            fs.readFile('./stylesheets/overrides.css', function(err, data) {
                                if (data && !err) {
                                    console.log('has data and no error!');
                                    activeWebview.insertCSS("");
                                }else{
                                    console.error(err);
                                }
                            });
                    	}
					}
				}
			]
		},
		{
			label: 'Window',
			id: 'window',
			role: 'window',
			submenu: [
				{
					label: 'Minimize',
					accelerator: 'Command+M',
					role: 'minimize'
				},
				{
					label: 'Close',
					accelerator: 'Command+W',
					role: 'close'
				},
				{
					type: 'separator'
				},
				{
					type: 'separator',
					id: 'server-list-separator',
					visible: false
				},
				{
					label: 'Add new server',
					accelerator: 'Command+N',
					click: function() {
						var mainWindow = remote.getCurrentWindow();
						mainWindow.restore();
						mainWindow.show();
						servers.clearActive();
					}
				},
				{
					type: 'separator'
				},
				{
					label: 'Bring All to Front',
					click: function() {
						var mainWindow = remote.getCurrentWindow();
						mainWindow.restore();
						mainWindow.show();
					}
				}
			]
		},
		{
			label: 'Help',
			role: 'help',
			submenu: [
				{
					label: APP_NAME + ' Help',
					click: function() {
						remote.shell.openExternal('https://rocket.chat/docs');
					}
				},
				{
					type: 'separator'
				},
				{
					label: 'Learn More',
					click: function() {
						remote.shell.openExternal('https://rocket.chat');
					}
				}
			]
		}
	];
} else {
	template = [
		{
			label: APP_NAME,
			submenu: [
				{
					label: 'About ' + APP_NAME,
					click: function() {
						const win = new remote.BrowserWindow({ width: 310, height: 200, minWidth: 310, minHeight: 200, maxWidth: 310, maxHeight: 200, show: false, maximizable: false, minimizable: false, title: ' ' });
						win.loadURL('file://' + __dirname + '/about.html');
						win.show();
					}
				},
				{
					type: 'separator'
				},
				{
					label: 'Quit',
					accelerator: 'Ctrl+Q',
					click: function() {
						remote.app.quit();
					}
				}
			]
		},
		{
			label: 'Edit',
			submenu: [
				{
					label: 'Undo',
					accelerator: 'Ctrl+Z',
					role: 'undo'
				},
				{
					label: 'Redo',
					accelerator: 'Ctrl+Shift+Z',
					role: 'redo'
				},
				{
					type: 'separator'
				},
				{
					label: 'Cut',
					accelerator: 'Ctrl+X',
					role: 'cut'
				},
				{
					label: 'Copy',
					accelerator: 'Ctrl+C',
					role: 'copy'
				},
				{
					label: 'Paste',
					accelerator: 'Ctrl+V',
					role: 'paste'
				},
				{
					label: 'Select All',
					accelerator: 'Ctrl+A',
					role: 'selectall'
				}
			]
		},
		{
			label: 'View',
			submenu: [
				{
					label: 'Original Zoom',
					accelerator: 'Command+0',
					click: function() {
						webFrame.setZoomLevel(0);
					}
				},
				{
					label: 'Zoom In',
					accelerator: 'Command+=',
					click: function() {
						webFrame.setZoomLevel(webFrame.getZoomLevel()+1);
					}
				},
				{
					label: 'Zoom Out',
					accelerator: 'Command+-',
					click: function() {
						webFrame.setZoomLevel(webFrame.getZoomLevel()-1);
					}
				},
				{
					type: 'separator'
				},
				{
					label: 'Current Server - Reload',
					accelerator: 'Ctrl+R',
					click: function() {
						const activeWebview = webview.getActive();
						if (activeWebview) {
							activeWebview.reload();
						}
					}
				},
				{
					label: 'Current Server - Toggle DevTools',
					accelerator: 'Ctrl+Shift+I',
					click: function() {
						const activeWebview = webview.getActive();
						if (activeWebview) {
							activeWebview.openDevTools();
						}
					}
				},
				{
					type: 'separator'
				},
				{
					label: 'Application - Reload',
					accelerator: 'Ctrl+Shift+R',
					click: function() {
						var mainWindow = remote.getCurrentWindow();
						if (mainWindow.tray) {
							mainWindow.tray.destroy();
						}
						mainWindow.reload();
					}
				},
				{
					label: 'Application - Toggle DevTools',
					click: function() {
						remote.getCurrentWindow().toggleDevTools();
					}
				},
				{
					type: 'separator'
				},
				{
					label: 'Toggle server list',
					click: function() {
						sidebar.toggle();
					}
				},{
                 					type: 'separator'
                 				},
                 				{
                 					label: 'Reload CSS',
                 					click: function() {
                 					    const activeWebview = webview.getActive();
                                     	if (activeWebview) {
                                     	    var fs = require('fs');
                                             fs.readFile('./app/stylesheets/overrides.css',"utf-8", function(err, data) {
                                                data = ""+data;
                                                 if (data && !err) {
                                                     console.log('has data and no error!');
                                                                                    console.log(data);
                                                     activeWebview.insertCSS(data);
                                                 }else{
                                                     console.error(err);
                                                 }
                                             });
                                     	}
                 					}
                 				},
                 				{
                                                 					label: 'Reload CSS Loop',
                                                 					click: function() {
                                                 					    const activeWebview = webview.getActive();
                                                                     	if (activeWebview) {
                                                                     	    var fs = require('fs');
                                                                                     setInterval(function(){
                                                                             fs.readFile('./app/stylesheets/overrides.css',"utf-8", function(err, data) {
                                                                                data = ""+data;
                                                                                 if (data && !err) {
                                                                                        console.log('reloading css');
                                                                                        activeWebview.insertCSS(data);
                                                                                 }else{
                                                                                     console.error(err);
                                                                                 }
                                                                             });

                                                                                     }, 500);
                                                                     	}
                                                 					}
                                                 				},
                 				{
                                                 					label: 'Reload JS',
                                                 					click: function() {
                                                 					    const activeWebview = webview.getActive();
                                                                     	if (activeWebview) {
                                                                     	    var fs = require('fs');
                                                                             fs.readFile('./app/scripts/overrides.js',"utf-8", function(err, data) {
                                                                                 if (data && !err) {
                                                                                    console.log(data);
                                                                                     console.log('has data and no error!');
                                                                                     activeWebview.executeJavaScript(data);
                                                                                 }else{
                                                                                    console.log(data);
                                                                                     console.error(err);
                                                                                 }
                                                                             });
                                                                     	}
                                                 					}
                                                 				}
			]
		},
		{
			label: 'Window',
			id: 'window',
			submenu: [
				{
					type: 'separator',
					id: 'server-list-separator',
					visible: false
				},
				{
					label: 'Add new server',
					accelerator: 'Ctrl+N',
					click: function() {
						servers.clearActive();
					}
				},
				{
					type: 'separator'
				},
				{
					label: 'Close',
					accelerator: 'Ctrl+W',
					click: function() {
						remote.getCurrentWindow().close();
					}
				}
			]
		}
	];
}

export var menuTemplate = template;
export var menu = Menu.buildFromTemplate(template);

Menu.setApplicationMenu(menu);
