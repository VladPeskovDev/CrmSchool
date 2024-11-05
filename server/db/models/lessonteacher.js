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
      field: 'lesson_id',
      references: {
        model: 'Lesson',
        key: 'id'
      }
    },
    teacherId: {
      type: DataTypes.INTEGER,
      field: 'teacher_id',
      references: {
        model: 'Teacher',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'LessonTeacher',
    tableName: 'lesson_teachers',
    timestamps: false 
  });
  return LessonTeacher;
};
