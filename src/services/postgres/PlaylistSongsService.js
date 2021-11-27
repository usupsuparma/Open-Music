const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

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

  async getSongFromPlaylist(playlistId, userId) {
    const query = {
      text: `SELECT songs.* FROM songs
      LEFT JOIN playlistsongs ON playlistsongs.song_id = songs.id
      LEFT JOIN users ON users.id = playlists.owner
      WHERE playlists.owner = $1 OR collaborations.user_id = $1
      GROUP BY playlists.id, users.id`,
      values: [playlistId, userId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async deleteCollaboration(playlistId, userId) {
    const query = {
      text: 'DELETE FROM  collaborations WHERE playlist_id = $1 AND song_id = $2 RETURNING ID',
      values: [playlistId, userId],
    };

    const result = await this._pool.query(query);
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
