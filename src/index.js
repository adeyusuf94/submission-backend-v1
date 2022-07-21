require('dotenv').config();

const Hapi = require('@hapi/hapi');
const { albums, songs } = require('./api');
const ClientError = require('./exceptions/ClientError');
const { AlbumService, SongService } = require('./services/postgres');
const { AlbumsValidator, SongsValidator } = require('./validator');

const init = async () => {
  const albumService = new AlbumService();
  const songService = new SongService();
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumService,
        validator: AlbumsValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: songService,
        validator: SongsValidator,
      },
    },
  ]);

  server.ext('onPreResponse', (req, h) => {
    // mendapatkan konteks response dari request
    const { response } = req;

    if (response instanceof ClientError) {
      // membuat response baru dari response toolkit sesuai kebutuhan error handling
      const newResponse = h.response({
        status: 'fail',
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }

    // Server ERROR!
    if (response instanceof Error) {
      const newResponse = h.response({
        status: 'error',
        message: response.output.payload.message,
      });
      newResponse.code(response.output.statusCode);
      return newResponse;
    }

    // jika bukan ClientError, lanjutkan dengan response sebelumnya (tanpa terintervensi)
    return response.continue || response;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
