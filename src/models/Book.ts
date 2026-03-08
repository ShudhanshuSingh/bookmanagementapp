import mongoose, { Schema, Model } from 'mongoose';
import { IBook } from '@/types';

const PASTEL_COLORS = [
  '#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF',
  '#E8BAFF', '#FFB3E6', '#B3FFE6', '#FFE6B3', '#B3D9FF',
  '#D9B3FF', '#B3FFB3', '#FFB3B3', '#B3FFFF', '#FFCCB3',
  '#CCB3FF', '#B3FFCC', '#FFB3CC', '#B3CCFF', '#CCFFB3',
];

function generateCoverColor(title: string): string {
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    const char = title.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32-bit integer
  }
  return PASTEL_COLORS[Math.abs(hash) % PASTEL_COLORS.length];
}

const BookSchema = new Schema<IBook>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title must not exceed 200 characters'],
    },
    author: {
      type: String,
      required: [true, 'Author is required'],
      trim: true,
      maxlength: [100, 'Author must not exceed 100 characters'],
    },
    tags: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['want-to-read', 'reading', 'completed'],
      default: 'want-to-read',
    },
    notes: {
      type: String,
      default: '',
      maxlength: [2000, 'Notes must not exceed 2000 characters'],
    },
    coverColor: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Auto-assign cover color before saving
BookSchema.pre('save', function () {
  if (!this.coverColor || this.isModified('title')) {
    this.coverColor = generateCoverColor(this.title);
  }
});

const Book: Model<IBook> =
  mongoose.models.Book || mongoose.model<IBook>('Book', BookSchema);

export default Book;
