const lessonsRouter = require('express').Router();
const { Lesson, Teacher, Student } = require('../../db/models');
const { Op } = require('sequelize');


// Эндпоинт для фильтрации по дате (одна или две даты)
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




module.exports = lessonsRouter;
