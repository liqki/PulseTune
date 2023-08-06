/**
 * @module preload
 */

import { contextBridge, ipcRenderer } from 'electron';
import { existsSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
const albumArt = require('album-art');

type DiscordRPC = {
  details: string;
  startTimestamp: number;
  endTimestamp: number;
  largeImageKey: string;
};

type Folder = {
  path: string;
  name: string;
  files?: Array<string>;
  subfolders?: Array<Folder>;
};

export const handleMenuButtons = (button: string) => {
  ipcRenderer.send('handle-menu-buttons', button);
};

export const handleFolderDialog = async () => {
  return await ipcRenderer.invoke('dialog:addFolder');
};

export const readFiles = async (folder: string) => {
  const files = await readdir(folder);
  const filtered = files.filter(
    file =>
      (file.endsWith('.mp3') || file.endsWith('.wav')) &&
      file.split('-').length >= 2 &&
      file.replace(/[^-]/g, '').length === 1,
  );
  return filtered;
};

export const readFolders = async (folder: string) => {
  const folders = await readdir(folder, { withFileTypes: true });
  const filtered = folders.filter(folder => folder.isDirectory());
  if (filtered.length === 0) return [];
  const subfolders: Array<Folder> = [];
  for await (const subfolder of filtered) {
    subfolders.push({
      path: folder + '\\' + subfolder.name,
      name: subfolder.name,
      files: await readFiles(folder + '\\' + subfolder.name),
      subfolders: await readFolders(folder + '\\' + subfolder.name),
    });
  }
  return subfolders;
};

export const fileExists = async (path: string): Promise<boolean> => {
  return existsSync(path);
};

export const getAlbumArt = async (song: { artist: string; title: string }): Promise<string> => {
  let returnURL = '';
  const artist = song.artist.split(',')[0];
  await albumArt(artist, { album: song.title, size: 'large' }, (err: Error, url: string) => {
    if (err) {
      return '';
    }
    returnURL = url;
  });
  return returnURL;
};

export const openExternalLink = (link: string) => {
  ipcRenderer.send('open-external-link', link);
};

export const updateRichPresence = (newRPC: DiscordRPC) => {
  ipcRenderer.send('update-rich-presence', newRPC);
};

export const reconnectDiscordRPC = () => {
  ipcRenderer.send('reconnect-discord-rpc');
};

export const disconnectDiscordRPC = () => {
  ipcRenderer.send('disconnect-discord-rpc');
};

export const discordRPCConnected = async () => {
  return await ipcRenderer.invoke('discord-rpc-connected');
};

export const isMaximized = async () => {
  return await ipcRenderer.invoke('is-maximized');
};

contextBridge.exposeInMainWorld('ipcRenderer', {
  on: (channel: string, func: (...args: unknown[]) => void) => {
    const validChannels = ['window:maximize', 'window:unmaximize'];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },
});
