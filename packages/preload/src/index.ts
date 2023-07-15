/**
 * @module preload
 */

import { ipcRenderer } from 'electron';
import { existsSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
const albumArt = require('album-art');

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

export const fileExists = async (path: string): Promise<boolean> => {
  return existsSync(path);
};

export const getAlbumArt = async (song: { artist: string; title: string }): Promise<string> => {
  let returnURL = '';
  const artist = song.artist.split(',')[0];
  await albumArt(artist, { album: song.title, size: 'large' }, (err: any, url: string) => {
    if (err) {
      console.log(err);
      return '';
    }
    returnURL = url;
  });
  return returnURL;
};
