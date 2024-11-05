'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LessonStudent extends Model {
    static associate(models) {
    }
  }
  LessonStudent.init({
    lessonId: {
      type: DataTypes.INTEGER,
      field: 'lesson_id',
      references: {
        model: 'Lesson',
        key: 'id'
      }
    },
    studentId: {
      type: DataTypes.INTEGER,
      field: 'student_id',
      references: {
        model: 'Student',
        key: 'id'
      }
    },
    visit: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'LessonStudent',
    tableName: 'lesson_students',
    timestamps: false 
  });
  return LessonStudent;
};
