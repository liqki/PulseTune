import { createContext, useContext } from 'react';

export type Folder = {
  path: string;
  name: string;
  files?: Array<string>;
  subfolders?: Array<Folder>;
};

type NowPlaying = {
  path: string;
  setPath: (path: string) => void;
};

type Folders = {
  folders: Array<Folder>;
  setFolders: (folders: Array<Folder>) => void;
};

type Favorites = {
  favorites: Array<string>;
  setFavorites: (favorites: Array<string>) => void;
};

type DarkMode = {
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
};

type DiscordRPC = {
  discordRPC: boolean;
  setDiscordRPC: (discordRPC: boolean) => void;
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

export const DarkModeContext = createContext<DarkMode>({
  darkMode: false,
  setDarkMode: () => {},
});

export const useDarkMode = () => useContext(DarkModeContext);

export const DiscordRPCContext = createContext<DiscordRPC>({
  discordRPC: false,
  setDiscordRPC: () => {},
});

export const useDiscordRPC = () => useContext(DiscordRPCContext);
