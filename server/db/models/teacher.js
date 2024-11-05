'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Teacher extends Model {
  static associate(models) {
    Teacher.belongsToMany(models.Lesson, { through: models.LessonTeacher, foreignKey: 'teacherId' });
    }
  }
  Teacher.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Teacher',
  });
  return Teacher;
};