class PlaylistSongHandler {
  constructor(service, playlistService, songService, validator) {
    this._service = service;
    this._playlistsService = playlistService;
    this._validator = validator;
    this._songService = songService;

    this.postSongsToPlaylistHandler = this.postSongsToPlaylistHandler.bind(this);
  }

  // eslint-disable-next-line class-methods-use-this
  async postSongsToPlaylistHandler(request, h) {
    const { playlistId } = request.params;
    console.log(playlistId);
    // toDo validasi params
    this._validator.validatePlaylistSongPayload(request.payload);
    const { songId } = request.payload;
    const { id: credentialId } = request.auth.credentials;
    // todo validasi owner access
    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    // todo validasi id song valid
    await this._songService.isValidSong(songId);
    // todo tambahkan lagu ke playlist
    await this._service.addSongToPlaylist(playlistId, songId);

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke playlist',
      data: null,
    });
    response.code(201);
    return response;
  }
}

module.exports = PlaylistSongHandler;
