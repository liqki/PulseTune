# PulseTune

![GitHub package.json version (branch)](https://img.shields.io/github/package-json/v/liqki/PulseTune/main?label=version&color=brigthgreen) ![GitHub last commit (by committer)](https://img.shields.io/github/last-commit/liqki/PulseTune?logo=github&color=blue) ![GitHub release (latest by SemVer including pre-releases)](https://img.shields.io/github/downloads-pre/liqki/PulseTune/latest/total?label=latest) ![Static Badge](https://img.shields.io/badge/PRs-Welcome-brightgreen?logo=github) ![GitHub](https://img.shields.io/github/license/liqki/PulseTune)

PulseTune is a simple and easy to use music player built with Electron and React. It is designed to be a lightweight and fast music player that can be used on any platform. The project was scaffolded with [this template](https://github.com/cawa-93/vite-electron-builder) and uses [electron-builder](https://www.electron.build/index.html) to build the app.

## Features

- [x] Play music from your local library
- [x] Folder structure
- [x] Search for songs in your library
- [x] Dark mode
- [x] Mark songs as favorites
- [x] Cross platform (not tested on MacOS and Linux)

## Usage

### Installation

Download the latest release from the [releases page](https://github.com/liqki/PulseTune/releases/latest) and install it. Since the app is not signed, you might have to allow the app to run in your system settings.

### Adding music

To add music to your library, click on the `Add Music` button in the top left corner of the app. A folder dialog will pop up and ask you to add a folder. The app will then scan the folder for music files and add them to your library. Subfolders will be added as well which allows you to organize your music in a folder structure. In order to recognize a file as a music file, the file extension has to be `.mp3` and the file needs to be named in the following format: `Artist - Title.mp3`. If the file does not follow this format, it will not be added to your library.

### Playing music

To play music, click on a song in your library. The song will then start playing and the player controls will appear at the bottom of the app. The songs cover art will be fetched from Spotify using [album-art](https://github.com/lacymorrow/album-art) and displayed in the player controls. If the song does not have a cover art, a placeholder image will be displayed instead. The song will be added to the queue and the next song will be played once the current song has finished playing. You can also click on the `Next` and `Previous` buttons to skip to the next or previous song in the queue. The `Volume` slider can be used to adjust the volume of the song. The `Favorite` button can be used to mark a song as a favorite. The song will then be added to the favorites list which can be accessed by clicking on the `Favorites` button in the top left corner of the app. The `Search` bar at the top can be used to search for songs in your library. The search results will be displayed in the library and you can click on a song to play it.

## Contributing

Contributions are welcome! If you have any suggestions or find any bugs, feel free to open an issue or submit a pull request. To contribute, follow these steps:

1. Fork the repository
2. Clone the repository
3. Install dependencies with `npm install`
4. Run the app in dev mode with `npm run watch`
5. Make your changes
6. Commit your changes
7. Push your changes to your fork
8. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
