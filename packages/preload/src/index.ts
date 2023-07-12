/**
 * @module preload
 */

import { ipcRenderer } from 'electron';
import { readdir } from 'node:fs/promises';

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
