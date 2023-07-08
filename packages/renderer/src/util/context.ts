import { createContext, useContext } from 'react';

export type NowPlaying = {
  path: string;
  setPath: (path: string) => void;
};

export type Folder = {
  path: string;
  name: string;
  files?: Array<string>;
};

export type Folders = {
  folders: Array<Folder>;
  setFolders: (folders: Array<Folder>) => void;
};

export type Favorites = {
  favorites: Array<string>;
  setFavorites: (favorites: Array<string>) => void;
};

export const NowPlayingContext = createContext<NowPlaying>({
  path: '',
  setPath: () => {},
});

export const useNowPlaying = () => useContext(NowPlayingContext);

export const FoldersContext = createContext<Folders>({
  folders: [],
  setFolders: () => {},
});

export const useFolders = () => useContext(FoldersContext);

export const FavoritesContext = createContext<Favorites>({
  favorites: [],
  setFavorites: () => {},
});

export const useFavorites = () => useContext(FavoritesContext);
