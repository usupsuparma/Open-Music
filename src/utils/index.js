/* eslint-disable camelcase */
const mapDBToModel = ({ id, title, performer }) => ({
  id,
  title,
  performer,
});

const mapDBToModelDetail = ({
  created_at,
  updated_at,
  ...args
}) => ({
  ...args,
  insertedAt: created_at,
  updatedAt: updated_at,
});

module.exports = {
  mapDBToModel,
  mapDBToModelDetail,
};
