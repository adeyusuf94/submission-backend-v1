const ClientError = require('../../exceptions/ClientError');

class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postSongHandler = this.postSongHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
  }

  async postSongHandler(req, h) {
    try {
      this._validator.validateSongPayload(req.payload);
      const {
        title, year, genre, performer, duration, albumId,
      } = req.payload;

      const songId = await this._service.addSong({
        title, year, genre, performer, duration, albumId,
      });

      const response = h.response({
        status: 'success',
        message: 'Song berhasil ditambahkan',
        data: {
          songId,
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

  async getSongsHandler(req) {
    const { title, performer } = req.query;
    let allSongs = await this._service.getSongs();

    if (title || performer !== undefined) {
      // eslint-disable-next-line max-len
      allSongs = allSongs.filter((x) => x.title?.toLowerCase().includes(title?.toLowerCase()) || x.performer?.toLowerCase().includes(performer?.toLowerCase()));
    }

    if (title && performer !== undefined) {
      // eslint-disable-next-line max-len
      allSongs = allSongs.filter((x) => x.title?.toLowerCase().includes(title?.toLowerCase()) && x.performer?.toLowerCase().includes(performer?.toLowerCase()));
    }

    const songs = allSongs.map((x) => ({
      id: x.id,
      title: x.title,
      performer: x.performer,
    }));

    return {
      status: 'success',
      data: {
        songs,
      },
    };
  }

  async getSongByIdHandler(req, h) {
    try {
      const { id } = req.params;
      const song = await this._service.getSongById(id);

      return {
        status: 'success',
        data: {
          song,
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

  async putSongByIdHandler(req, h) {
    try {
      this._validator.validateSongPayload(req.payload);
      const { id } = req.params;

      await this._service.editSongById(id, req.payload);

      return {
        status: 'success',
        message: 'Song berhasil diperbarui',
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

  async deleteSongByIdHandler(req, h) {
    try {
      const { id } = req.params;
      await this._service.deleteSongById(id);

      return {
        status: 'success',
        message: 'Song berhasil dihapus',
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

module.exports = SongsHandler;
