const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const randomId = nanoid(16);
    const id = `album-${randomId}`;

    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
      values: [id, name, year],
    };

    const results = await this._pool.query(query);

    if (!results.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    return results.rows[0].id;
  }

  async getAlbums() {
    const results = await this._pool.query('SELECT * FROM albums');
    return results.rows;
  }

  async getAlbumById(id) {
    const query = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    };
    const results = await this._pool.query(query);

    if (!results.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    return results.rows[0];
  }

  async editAlbumById(id, { name, year }) {
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, id],
    };

    const results = await this._pool.query(query);

    if (!results.rows.length) {
      throw new NotFoundError('Gagal memperbarui Album. id tidak ditemukan');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };

    const results = await this._pool.query(query);

    if (!results.rows.length) {
      throw new NotFoundError('Gagal menghapus Album. id tidak ditemukan');
    }
  }
}

module.exports = AlbumService;
