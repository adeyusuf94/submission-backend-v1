const ClientError = require('../../exceptions/ClientError');
const { SongService } = require('../../services/postgres');

class AlbumsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    this._songByAlbum = new SongService();

    this.postAlbumHandler = this.postAlbumHandler.bind(this);
    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
    this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
    this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
  }

  async postAlbumHandler(req, h) {
    try {
      this._validator.validateAlbumsPayload(req.payload);
      const { name, year } = req.payload;

      const albumId = await this._service.addAlbum({ name, year });

      const response = h.response({
        status: 'success',
        message: 'Album berhasil ditambahkan',
        data: {
          albumId,
        },
      });

      response.code(201);
      return response;
    } catch (error) {
      return error;
      // if (error instanceof ClientError) {
      //   const response = h.response({
      //     status: 'fail',
      //     message: error.message,
      //   });

      //   response.code(error.statusCode);
      //   return response;
      // }
      // // Server ERROR!
      // const response = h.response({
      //   status: 'error',
      //   message: 'Maaf, terjadi kegagalan pada server kami.',
      // });
      // response.code(500);
      // return response;
    }
  }

  async getAlbumByIdHandler(req, h) {
    try {
      const { id } = req.params;
      const album = await this._service.getAlbumById(id);

      const songs = await this._songByAlbum.getSongs();

      const songsFilter = songs.filter((x) => x.albumId === album.id);

      const songsByAlbum = songsFilter.map((x) => ({
        id: x.id,
        title: x.title,
        performer: x.performer,
      }));

      return {
        status: 'success',
        data: {
          album: {
            ...album,
            songs: songsByAlbum,
          },
        },
      };
    } catch (error) {
      return error;
      // if (error instanceof ClientError) {
      //   const response = h.response({
      //     status: 'fail',
      //     message: error.message,
      //   });

      //   response.code(error.statusCode);
      //   return response;
      // }
      // // Server ERROR!
      // const response = h.response({
      //   status: 'error',
      //   message: 'Maaf, terjadi kegagalan pada server kami.',
      // });
      // response.code(500);
      // return response;
    }
  }

  async putAlbumByIdHandler(req, h) {
    try {
      this._validator.validateAlbumsPayload(req.payload);
      const { id } = req.params;

      await this._service.editAlbumById(id, req.payload);

      return {
        status: 'success',
        message: 'Album berhasil diperbarui',
      };
    } catch (error) {
      return error;
      // if (error instanceof ClientError) {
      //   const response = h.response({
      //     status: 'fail',
      //     message: error.message,
      //   });
      //   response.code(error.statusCode);
      //   return response;
      // }
      // // Server ERROR!
      // const response = h.response({
      //   status: 'error',
      //   message: 'Maaf, terjadi kegagalan pada server kami.',
      // });
      // response.code(500);
      // return response;
    }
  }

  async deleteAlbumByIdHandler(req, h) {
    try {
      const { id } = req.params;
      await this._service.deleteAlbumById(id);

      return {
        status: 'success',
        message: 'Album berhasil dihapus',
      };
    } catch (error) {
      return error;
      // if (error instanceof ClientError) {
      //   const response = h.response({
      //     status: 'fail',
      //     message: error.message,
      //   });

      //   response.code(error.statusCode);
      //   return response;
      // }
      // // Server ERROR!
      // const response = h.response({
      //   status: 'error',
      //   message: 'Maaf, terjadi kegagalan pada server kami.',
      // });
      // response.code(500);
      // return response;
    }
  }
}

module.exports = AlbumsHandler;
