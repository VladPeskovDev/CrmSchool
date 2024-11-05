# CrmSchool


Команда 1: Тестирование фильтрации по дате /date
Одна дата:
URL: http://localhost:3000/lessons/date?date=2019-09-01
Метод: GET
Диапазон дат:
URL: http://localhost:3000/lessons/date?date=2019-09-01,2019-09-04
Метод: GET


Команда 2: Тестирование фильтрации по статусу /status
URL: http://localhost:3000/lessons/status?status=1
Метод: GET
Здесь status=1 для поиска проведённых занятий, status=0 для непроведённых занятий.


Команда 3: Тестирование фильтрации по ID учителей /teacherIds
URL: http://localhost:3000/lessons/teacherIds?teacherIds=1,2
Метод: GET
Описание: Этот запрос ищет занятия, которые ведёт учитель с id=1 или id=2.


Команда 4: Тестирование фильтрации по количеству учеников /studentsCount
Точное количество учеников:
URL: http://localhost:3000/lessons/studentsCount?studentsCount=3
Метод: GET
Описание: Этот запрос ищет занятия с точным количеством записанных учеников (например, 3).
Диапазон количества учеников:
URL: http://localhost:3000/lessons/studentsCount?studentsCount=2,5
Метод: GET
Описание: Здесь studentsCount=2,5 для поиска занятий с количеством учеников от 2 до 5.


Команда 5: Тестирование пагинации /pagination
Первая страница с 5 занятиями:
URL: http://localhost:3000/lessons/pagination?page=1&lessonsPerPage=5
Метод: GET
Вторая страница с 10 занятиями на странице:
URL: http://localhost:3000/lessons/pagination?page=2&lessonsPerPage=10
Метод: GET