class UploadImageHandler {
  constructor(service, validaor) {
    this._service = service;
    this._validator = validaor;

    this.postUploadImageHandler = this.postUploadImageHandler.bind(this);
  }

  async postUploadImageHandler(request, h) {
    console.log('test');
    const { data } = request.payload;
    this._validator.validateImageHeaders(data.hapi.headers);
    const filename = await this._service.writeFile(data, data.hapi);
    const response = h.response({
      status: 'success',
      data: {
        pictureUrl: `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`,
      },
    });

    response.code(201);
    return response;
  }
}

module.exports = UploadImageHandler;
