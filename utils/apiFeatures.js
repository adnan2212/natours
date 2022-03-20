class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // 1A) Filtering
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const queryObj = { ...this.queryString };
    const excludedFiels = ['page', 'sort', 'limit', 'fields'];
    excludedFiels.forEach((el) => delete queryObj[el]);

    // 1B) Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      // console.log(sortBy);
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v'); // -__v excluding the field
    }

    return this;
  }

  paginate() {
    // const page = Number(this.queryString.page) || 1;
    const page = Number(this.queryString.page);
    // const limit = Number(this.queryString.limit) || 1;
    const limit = Number(this.queryString.limit);
    const skip = (page - 1) * limit;

    // page=2&limit=10, 1-10 page 1, 11-20 page 2, ... (3 - 1) * 10
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIfeatures;
