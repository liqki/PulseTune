import type { IpcMainEvent } from 'electron';
import { BrowserWindow, dialog, shell } from 'electron';
const client = require('discord-rich-presence')(import.meta.env.VITE_DISCORD_CLIENT_ID);

type DiscordRPC = {
  details: string;
  startTimestamp: number;
  endTimestamp: number;
  largeImageKey: string;
};

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

export const openExternalLink = (event: IpcMainEvent, link: string) => {
  shell.openExternal(link);
};

export const updateRichPresence = (event: IpcMainEvent, newRPC: DiscordRPC) => {
  client.updatePresence(newRPC);
};

export const isMaximized = (event: IpcMainEvent) => {
  const win = BrowserWindow.getFocusedWindow();
  if (!win) return false;
  event.returnValue = win.isMaximized();
};
