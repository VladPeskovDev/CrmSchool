'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Student extends Model {
     static associate(models) {
      Student.belongsToMany(models.Lesson, { through: models.LessonStudent, foreignKey: 'studentId' });
    }
  }
  Student.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Student',
    tableName: 'students',
    timestamps: false
  });
  return Student;
};