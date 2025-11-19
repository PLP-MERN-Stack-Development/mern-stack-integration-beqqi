const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a category name'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

// Create slug before save
CategorySchema.pre('save', function (next) {
  if (!this.isModified('name')) return next();
  this.slug = this.name.toLowerCase().replace(/[^
\w ]+/g, '').replace(/ +/g, '-');
  next();
});

module.exports = mongoose.model('Category', CategorySchema);
