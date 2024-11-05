'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LessonTeacher extends Model {
    static associate(models) {
      
    }
  }
  LessonTeacher.init({
    lessonId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Lesson',
        key: 'id'
      }
    },
    teacherId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Teacher',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'LessonTeacher',
    timestamps: false 
  });
  return LessonTeacher;
};
