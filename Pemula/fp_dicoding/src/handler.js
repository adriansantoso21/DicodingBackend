const { nanoid } = require('nanoid');
const books = require('./books');

// Fungsi menambahkan buku
const addBookHandler = (request, h) => {
  // eslint-disable-next-line object-curly-newline
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  let finished;

  if (pageCount === readPage) finished = true;
  else finished = false;

   // Jika tidak ada judul buku
   if (name === null || name === '' || name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });

    response.code(400);
    return response;
  }

  // Jika readPage > pageCount
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });

    response.code(400);
    return response;
  }

  const newBook = {
    // eslint-disable-next-line max-len
    id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt,
  };
  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });

    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });

  response.code(500);
  return response;
};

// Mendapatkan seluruh buku dengan ?name, ?reading, dan ?finished
const getAllBooksHandler = (request, h) => {
  const { name } = request.query;
  const { reading } = request.query;
  const { finished } = request.query;

  // Jika parameter berupa nama
  if (name) {
    // eslint-disable-next-line max-len
    const bookfilters = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
    const response = h.response({
      status: 'success',
      data: {
        books: bookfilters.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
      })),
      },
    });

    response.code(200);
    return response;
  }

  // Jika parameter berupa reading
  if (reading != null) {
    if (reading === '1') {
      const bookfilters = books.filter((book) => book.reading === true);
      const response = h.response({
        status: 'success',
        data: {
          books: bookfilters.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
        })),
        },
      });

      response.code(200);
      return response;
    }

    if (reading === '0') {
      const bookfilters = books.filter((book) => book.reading === false);
      const response = h.response({
        status: 'success',
        data: {
          books: bookfilters.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      });

      response.code(200);
      return response;
    }
  }

  // Jika parameter berupa finished
  if (finished != null) {
    if (finished === '1') {
      const bookfilters = books.filter((book) => book.finished === true);
      const response = h.response({
        status: 'success',
        data: {
          books: bookfilters.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
        })),
        },
      });

      response.code(200);
      return response;
    }

    if (finished === '0') {
      const bookfilters = books.filter((book) => book.finished === false);
      const response = h.response({
        status: 'success',
        data: {
          books: bookfilters.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      });

      response.code(200);
      return response;
    }
  }

  const response = h.response({
    status: 'success',
    data: {
      books: books.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
    })),
    },
  });

  response.code(200);
  return response;
};

// Mendapatkan buku dengan id tertentu
const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const book = books.filter((n) => n.id === bookId)[0];

  if (book !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        book,
      },
    });

    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

// Mengedit buku dengan id tertentu
const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  // eslint-disable-next-line object-curly-newline
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
  const updatedAt = new Date().toISOString();

  // Jika tidak ada judul buku
  if (name === null || name === '' || name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });

    response.code(400);
    return response;
  }

  // Jika readPage > pageCount
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });

    response.code(400);
    return response;
  }

  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

// Untuk menghapus buku
const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

 const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
