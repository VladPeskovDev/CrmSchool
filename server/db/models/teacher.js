'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Teacher extends Model {
  static associate(models) {
    Teacher.belongsToMany(models.Lesson, {
      through: models.LessonTeacher, 
      foreignKey: 'teacher_id',       
      otherKey: 'lesson_id'
    });
    }
  }
  Teacher.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Teacher',
    tableName: 'teachers',
    timestamps: false
  });
  return Teacher;
};