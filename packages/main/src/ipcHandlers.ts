import type { IpcMainEvent } from 'electron';
import { BrowserWindow, dialog, shell, webContents } from 'electron';
const Client = require('discord-rich-presence');

let client: typeof Client | null = null;
let connected = false;

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
  if (!client) return;
  try {
    client.updatePresence(newRPC);
  } catch (err) {
    console.error(err);
  }
};

const handleRPCErrors = () => {
  client.on('connected', () => {
    connected = true;
  });
  client.on('disconnected', () => client.destroy());
  client.on('error', (err: Error) => {
    if (err.message === 'Could not connect' || err.message === 'connection closed') {
      client = null;
      connected = false;
    } else if (err.message.startsWith('child "activity" fails because')) console.error();
    else {
      console.error(err.message);
    }
  });
  process.on('unhandledRejection', (err: Error) => {
    if (err.message === 'connection closed') {
      if (!client) return;
      webContents.getFocusedWebContents()?.send('discord-rpc-disconnected');
      client = null;
      connected = false;
    } else {
      throw err;
    }
  });
};

export const reconnectDiscordRPC = () => {
  if (connected || client) return;
  client = new Client(import.meta.env.VITE_DISCORD_CLIENT_ID);
  handleRPCErrors();
};

export const disconnectDiscordRPC = () => {
  if (!client) return;
  client.disconnect();
  connected = false;
};

export const isMaximized = () => {
  const win = BrowserWindow.getFocusedWindow();
  if (!win) return false;
  return win.isMaximized();
};

export const discordRPCConnected = () => {
  return connected;
};
