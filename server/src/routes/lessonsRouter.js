const lessonsRouter = require('express').Router();
const { Lesson, Teacher, Student, LessonStudent } = require('../../db/models');
const { Op } = require('sequelize');


  lessonsRouter.get('/', async (req, res) => {
    const { date, status, teacherIds, studentsCount, page = 1, lessonsPerPage = 5 } = req.query;
  
    try {
      const whereClause = {};
      const includeClause = [];
  
      // Фильтр по дате
      if (date) {
        if (date.includes(',')) {
          const [startDate, endDate] = date.split(',');
          whereClause.date = {
            [Op.between]: [new Date(startDate), new Date(endDate)],
          };
        } else {
          whereClause.date = { [Op.eq]: new Date(date) };
        }
      }
  
      // Фильтр по статусу 
      if (status !== undefined) {
        whereClause.status = parseInt(status, 10);
      }
  
      // Фильтр по ID учителей
      if (teacherIds) {
        const ids = teacherIds.split(',').map(id => parseInt(id, 10));
        includeClause.push({
          model: Teacher,
          where: { id: { [Op.in]: ids } },
          through: { attributes: [] },
        });
      }
  
      // Включаем студентов, чтобы потом фильтровать по количеству
      includeClause.push({
        model: Student,
        through: { attributes: ["visit"] },
      });
  
      // Пагинация
      const offset = (page - 1) * lessonsPerPage;
  
      // Запрос с условиями фильтрации
      let lessons = await Lesson.findAll({
        where: whereClause,
        include: includeClause,
        limit: parseInt(lessonsPerPage, 10),
        offset: offset,
      });
  
      // Фильтр по учеников
      if (studentsCount) {
        let minCount = 0;
        let maxCount = Infinity;
  
        if (studentsCount.includes(',')) {
          [minCount, maxCount] = studentsCount.split(',').map(Number);
        } else {
          minCount = maxCount = parseInt(studentsCount, 10);
        }
  
        // Фильтруем занятия по количеству учеников 
        lessons = lessons.filter(
          lesson => lesson.Students && lesson.Students.length >= minCount && lesson.Students.length <= maxCount
        );
      }
  
      // Форматируем 
      const formattedLessons = lessons.map((lesson) => ({
        id: lesson.id,
        date: lesson.date,
        title: lesson.title,
        status: lesson.status,
        visitCount: lesson.Students 
          ? lesson.Students.filter(student => student.LessonStudent && student.LessonStudent.visit).length 
          : 0,
        students: lesson.Students
          ? lesson.Students.map((student) => ({
              id: student.id,
              name: student.name,
              visit: student.LessonStudent ? student.LessonStudent.visit : false,
            }))
          : [],
        teachers: lesson.Teachers
          ? lesson.Teachers.map((teacher) => ({
              id: teacher.id,
              name: teacher.name,
            }))
          : [],
      }));
  
      if (formattedLessons.length === 0) {
        return res.status(400).json({ message: 'Нет занятий с указанными фильтрами' });
      }
  
      res.json(formattedLessons);
    } catch (error) {
      console.error('Ошибка при запросе данных занятий:', error);
      res.status(500).send('Ошибка при запросе данных занятий');
    }
  });

  
  module.exports = lessonsRouter;
  


  /*
// Эндпоинт для фильтрации по дате
lessonsRouter.get('/date', async (req, res) => {
    const { date } = req.query;
  
    try {
      let dateCondition = {};
  
      if (date.includes(',')) {
        const [startDate, endDate] = date.split(',');
        dateCondition = {
          date: {
            [Op.between]: [new Date(startDate), new Date(endDate)],
          },
        };
      } else {
        dateCondition = {
          date: {
            [Op.eq]: new Date(date),
          },
        };
      }
  
      const lessons = await Lesson.findAll({ where: dateCondition });
      
      if (lessons.length === 0) {
        return res.status(200).json({ message: 'На указанную дату занятий нет.' });
      }
  
      res.json(lessons);
    } catch (error) {
      console.error('Ошибка при фильтрации по дате:', error);
      res.status(500).send('Ошибка при фильтрации по дате');
    }
  });
  

  lessonsRouter.get('/status', async (req, res) => {
    const { status } = req.query;
    
    try {
      const lessons = await Lesson.findAll({
        where: {
          status: parseInt(status, 10),
        },
      });
      res.json(lessons);
    } catch (error) {
      res.status(500).send('Ошибка при фильтрации по статусу');
    }
  });

  // Эндпоинт для фильтрации по ID учителей
lessonsRouter.get('/teacherIds', async (req, res) => {
    const { teacherIds } = req.query;
    
    try {
      const ids = teacherIds.split(',').map(id => parseInt(id, 10));
  
      const lessons = await Lesson.findAll({
        include: [
          {
            model: Teacher,
            where: {
              id: {
                [Op.in]: ids,
              },
            },
            through: { attributes: [] },
          },
        ],
      });
  
      if (lessons.length === 0) {
        return res.status(200).json({ message: 'Для указанных учителей занятий нет.' });
      }
  
      res.json(lessons);
    } catch (error) {
      console.error('Ошибка при фильтрации по учителям:', error);
      res.status(500).send('Ошибка при фильтрации по учителям');
    }
  });
  

  // Фильтр по количеству учеников (studentsCount)
  lessonsRouter.get('/studentsCount', async (req, res) => {
    const { studentsCount } = req.query;
  
    try {
      let minCount = 0;
      let maxCount = Infinity;
  
      if (studentsCount.includes(',')) {
        [minCount, maxCount] = studentsCount.split(',').map(Number);
      } else {
        minCount = maxCount = parseInt(studentsCount, 10);
      }
  
      const lessons = await Lesson.findAll({
        include: [
          {
            model: Student,
            through: { attributes: [] },
          },
        ],
      });
  
      const filteredLessons = lessons.filter(
        lesson => lesson.Students.length >= minCount && lesson.Students.length <= maxCount
      );
  
      if (filteredLessons.length === 0) {
        return res.status(200).json({ message: 'Нет занятий с указанным количеством студентов' });
      }
  
      res.json(filteredLessons);
    } catch (error) {
      console.error('Ошибка при фильтрации по количеству учеников:', error);
      res.status(500).send('Ошибка при фильтрации по количеству учеников');
    }
  });

  // Пагинация
lessonsRouter.get('/pagination', async (req, res) => {
    const { page = 1, lessonsPerPage = 5 } = req.query;
    const offset = (page - 1) * lessonsPerPage;
    
    try {
      const lessons = await Lesson.findAll({
        offset: offset,
        limit: parseInt(lessonsPerPage, 10),
      });
      res.json(lessons);
    } catch (error) {
      res.status(500).send('Ошибка при получении занятий с пагинацией');
    }
  });

*/