const PlaylistSongHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlistsongs',
  version: '1.0.0',
  register: async (server, {
    service, playlistService, songService, validator,
  }) => {
    const playlistSongHandler = new PlaylistSongHandler(
      service, playlistService, songService, validator,
    );
    server.route(routes(playlistSongHandler));
  },
};
