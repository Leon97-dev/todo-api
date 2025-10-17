// MT_01 : 롤 챔프 소개 Schema

import mongoose from 'mongoose';

const MT1Schema = new mongoose.Schema(
  {
    champion: {
      type: String,
      required: [true, '챔피언 이름은 반드시 필요합니다.'],
      trim: true,
    },
    role: {
      type: String,
      enum: ['TOP', 'JUNGLE', 'MID', 'ADC', 'SUPPORT'],
      required: true,
    },
    class: {
      type: String,
      enum: ['전사', '마법사', '암살자', '탱커', '서포터', '원거리딜러'],
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const MT1 = mongoose.model('MT1', MT1Schema);

export default MT1;
