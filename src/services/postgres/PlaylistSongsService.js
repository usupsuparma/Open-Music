const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const { mapDBToModel } = require('../../utils');

class PlaylistSongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSongToPlaylist(playlistId, songId) {
    const id = `song-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlistsongs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('Lagu gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getSongFromPlaylist(playlistId) {
    const query = {
      text: `SELECT playlists.*, songs.* FROM playlists
      LEFT JOIN playlistsongs ON playlistsongs.playlist_id = playlists.id
      LEFT JOIN songs ON songs.id = playlistsongs.song_id
      WHERE playlists.id = $1 
      GROUP BY playlists.id, songs.id`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    return result.rows.map(mapDBToModel);
  }

  async deleteSongFromPlaylistSong(playlistId, songId) {
    console.log('delete song');
    const query = {
      text: 'DELETE FROM  playlistsongs WHERE playlist_id = $1 AND song_id = $2 RETURNING ID',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);
    console.log(result.rows.length);
    if (!result.rows.length) {
      throw new InvariantError('Playlist song gagal dihapus');
    }
  }

  async verifyPlaylistSong(playlistId, songId) {
    const query = {
      text: 'SELECT * FROM collaborations WHERE playlist_id = $1 AND song_id = $2',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('Playlist song gagal diverifikasi');
    }
  }
}

module.exports = PlaylistSongsService;
