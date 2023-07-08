import type { IpcMainEvent} from 'electron';
import { BrowserWindow, dialog } from 'electron';

export const handleMenuButtons = (event: IpcMainEvent, button: string) => {
  const webContents = event.sender;
  const win = BrowserWindow.fromWebContents(webContents);
  if (!win) return;
  switch (button) {
    case 'minimize':
      win.minimize();
      break;
    case 'maximize':
      win.isMaximized() ? win.unmaximize() : win.maximize();
      break;
    case 'close':
      win.close();
      break;
  }
};

export const handleFolderDialog = async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openDirectory'],
  });
  if (!canceled) return filePaths[0];
};
