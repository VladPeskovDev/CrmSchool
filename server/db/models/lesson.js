'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Lesson extends Model {
    static associate(models) {
      Lesson.belongsToMany(models.Teacher, { through: models.LessonTeacher, foreignKey: 'lessonId' });
      Lesson.belongsToMany(models.Student, { through: models.LessonStudent, foreignKey: 'lessonId' });
    }
  }
  Lesson.init({
    date: DataTypes.DATE,
    title: DataTypes.STRING,
    status: { type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    sequelize,
    modelName: 'Lesson',
  });
  return Lesson;
};