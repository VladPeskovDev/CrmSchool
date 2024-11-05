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
      references: {
        model: 'Lesson',
        key: 'id'
      }
    },
    studentId: {
      type: DataTypes.INTEGER,
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
    timestamps: false 
  });
  return LessonStudent;
};
