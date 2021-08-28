const electron = require("electron");
const url = require("url");
const path = require("path");
const { protocol } = require("electron");

const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;
let addWindow;

const isMac = process.platform == "darwin";

// Listen for app to be ready

app.on("ready", ()=>{
    // create new window
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
          }
    });
    // Load HTML file
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, "views/mainWindow.html"),
        protocol:"file:",
        slahses:true,
    }));;
    //Quit app when close
    mainWindow.on("closed", function(){
        app.quit();
    })

    // Build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    // Inser Menu
    Menu.setApplicationMenu(mainMenu);
    
})

function createAddWindow(){
    addWindow = new BrowserWindow({
        width:300,
        height:200,
        title:"Add Shopping List Item",
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
          }
    });
    // Load HTML file
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, "views/addWindow.html"),
        protocol:"file:",
        slahses:true
    }));;
    //Garbage Colection Handle
    addWindow.on("close", function(){
        addWindow = null;
    })
}
// catch item:add
ipcMain.on("item:add", function(e, item){
    console.log(item);
    mainWindow.webContents.send("item:add", item);
    addWindow.close();
})


const mainMenuTemplate = [
    {label:""},
    {
        // role:"File",
        label:"File",
        submenu: [
            {
                role:"Add Item",
                label:"Add Item",
                accelerator:isMac?"Command+A":"Ctrl+A",
                click(){
                    console.log("Add Item")
                    createAddWindow();
                }
            },
            {
                role:"Clear Item",
                label:"Claer Item",
                accelerator:isMac?"Command+D":"Ctrl+D",
                click(){
                    mainWindow.webContents.send("item:clear")
                }
            },
            {
                role:"Quit",
                label:"Quit Electron",
                accelerator: isMac?"Command+Q":"Ctrl+Q",
                click(){
                    app.quit();
                }
            }
        ]
    }
];
if (process.env.NODE_ENV !=="production"){
    mainMenuTemplate.push({
        label:"Developer Tool",
        submenu:[
            {
                label:"Toggle Dev Tools",
                accelerator:isMac?"Command+I":"Ctrl+I",
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role:"reload"
            }
        ]
    });
}
