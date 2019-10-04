const chokidar = require("chokidar");
const path = require("path");
const fs = require("fs");
const json = path.join(__dirname, "albums.json");

const x = fs.existsSync(json);

const containsAlbumName = (array, albumName) => {
  let hasAlbumName = false;
  if (array.length > 0) {
    array.forEach(arr => {
      if (arr.name === albumName) {
        hasAlbumName = true;
      }
    });
  }
  console.log(hasAlbumName);
  return hasAlbumName;
};

const albumIndex = (albums, albumName) => {
  const x = albums.findIndex(album => album.name === albumName);
  return x;
};
const addAlbumToFile = (musicObj, isSong) => {
  try {
    console.log(musicObj);
    if (x) {
      const jsonFile = fs.readFileSync(json, "utf8");
      const file = JSON.parse(jsonFile);
      if (!containsAlbumName(file, musicObj.name)) {
        const { song } = musicObj;
        delete musicObj.song;
        file.push({ ...musicObj, songs: [song] });
      }
      /*if (isSong) {
        const index = albumIndex(file, musicObj.name);
        console.log(index);
      } /*else {
        const index = albumIndex(file, musicObj.name);
        if (musicObj.song) {
          const album = file[index];
          const songs = album.songs.push(musicObj.song);
          file[index] = { ...musicObj, songs };
        } else {
          file[index] = { ...musicObj };
        }
      }*/
      const newFile = JSON.stringify(file);
      fs.writeFile("albums.json", newFile);
    }
  } catch (error) {
    console.log(error);
  }
};

const addSong = (song, name) => {
  console.log("json", json);
  const jsonFile = fs.readFileSync(json, "utf8");
  if (jsonFile) {
    const file = JSON.parse(jsonFile);
    const index = albumIndex(file, name);
    file[index].songs = [...file[index].songs, song];
    const newFile = JSON.stringify(file);
    fs.writeFile("albums.json", newFile);
  } else {
    console.log("yyy");
  }
};

const watchFiles = () => {
  return chokidar.watch("./musicDirectory").on("all", (event, path) => {
    const albumDetails = path.split("\\")[1];
    if (event === "addDir") {
      if (albumDetails) {
        const song = path.split("/")[2];
        const names = albumDetails.split("-");
        const artist = names[0];
        const name = names[1];
        addAlbumToFile({ song, artist, name, path });
      }
    }
    if (event === "add") {
      if (albumDetails) {
        const song = path.split("\\")[2];
        const names = albumDetails.split("-");
        const artist = names[0];
        const name = names[1];
        addSong(song, name);
      }
    }
  });
};

module.exports = watchFiles;
