const mongoose = require('mongoose');
const Tour = require('./tourModel');

// review / rating / createdAt / ref to tour / ref to user
const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review cannot be empty!'],
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 3,
    },

    createdAt: {
      type: Date,
      default: Date.now(),
    },

    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour.'],
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user.'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Duplicate reviews
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  /* this.populate({
    path: 'tour',
    select: 'name',
  }).populate({
    path: 'user',
    select: 'name photo',
  }); */

  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

// Static Method: In this method, this keyword points to cuurrent model
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 }, // 1 will be added after every match, eg., if 5 doc then 1 will be added for each  doc, total will be 5
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  // console.log(stats);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

reviewSchema.post('save', function () {
  // this points to current review
  // construvtor is the model who created that document.
  this.constructor.calcAverageRatings(this.tour);

  //Review.calcAverageRatings(this.tour);
});
// POST middleware doen not hv access to next

/* reviewSchema.post(/^findOneAnd/, async function (docs) {
  await docs.constructor.calcAverageRatings(docs.tour);
}); */
/* reviewSchema.post(/^findOneAnd/, async function (docs) {
  if (docs) await docs.constructor.calcAverageRatings(docs.tour);
}); */

/* 
    Review id updated or delete using: 
        findByIdAndUpdate 
        findByIdAndDelete

        findOneAndUpdate is same

   In query middleware, we don't have direct access to the document in order to do something similar to this -
        this.constructor.calcAverageRatings(this.tour);

==================================================================================================================

In post query middleware, we get "docs" parameter which is nothing but the executed document. Since we have the document, we can use constructor on that to get the model ie docs.constructor . Now since we have model, we know that we can directly call statics method on that. That is what I have done.

NOTE:

Like I mentioned earlier, Jonas said that this.findOne() will not work inside post query middleware. Actually, it will work now.

 */

reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  // console.log(this.r);
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  // await this.findOne(); does NOT work here, query has already ececuted
  await this.r.constructor.calcAverageRatings(this.r.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
