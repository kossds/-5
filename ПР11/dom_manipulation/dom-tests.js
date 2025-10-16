// Тесты для проверки функций DOM манипуляций

function runTests() {
    console.log('=== Начинаем тестирование ===');
    
    // Тесты для создания элементов
    testCreateCard();
    testCreateList();
    
    // Тесты для навигации по DOM
    testCountChildren();
    testFindSpecialChild();
    testGetParentBackground();
    
    // Тесты для работы с формами
    testValidateForm();
    
    console.log('=== Тестирование завершено ===');
}

function testCreateCard() {
    console.log('Тест createCard:');
    
    // Создаем тестовый элемент
    const testContainer = document.createElement('div');
    testContainer.id = 'target1';
    document.body.appendChild(testContainer);
    
    // Вызываем функцию
    createCard('Тестовая карточка', 'Тестовое содержимое');
    
    // Проверяем результат
    const card = testContainer.querySelector('.card');
    const title = card.querySelector('h4');
    const content = card.querySelector('p');
    
    console.assert(card !== null, 'Карточка должна быть создана');
    console.assert(title.textContent === 'Тестовая карточка', 'Заголовок должен совпадать');
    console.assert(content.textContent === 'Тестовое содержимое', 'Содержимое должно совпадать');
    
    // Очистка
    testContainer.remove();
    console.log('✓ createCard прошел тест');
}

function testCreateList() {
    console.log('Тест createList:');
    
    const testContainer = document.createElement('div');
    testContainer.id = 'target1';
    document.body.appendChild(testContainer);
    
    const testItems = ['Элемент 1', 'Элемент 2', 'Элемент 3'];
    createList(testItems);
    
    const list = testContainer.querySelector('ol');
    const listItems = list.querySelectorAll('li');
    
    console.assert(list !== null, 'Список должен быть создан');
    console.assert(listItems.length === 3, 'Должно быть 3 элемента списка');
    
    testItems.forEach((item, index) => {
        console.assert(listItems[index].textContent === item, 
            `Текст элемента ${index + 1} должен совпадать`);
    });
    
    testContainer.remove();
    console.log('✓ createList прошел тест');
}

function testCountChildren() {
    console.log('Тест countChildren:');
    
    const testParent = document.createElement('div');
    testParent.id = 'parent-element';
    
    // Добавляем тестовые дочерние элементы
    for (let i = 0; i < 3; i++) {
        const child = document.createElement('div');
        child.className = 'child';
        testParent.appendChild(child);
    }
    
    document.body.appendChild(testParent);
    
    const count = countChildren();
    console.assert(count === 3, `Должно быть 3 ребенка, получено: ${count}`);
    
    testParent.remove();
    console.log('✓ countChildren прошел тест');
}

function testFindSpecialChild() {
    console.log('Тест findSpecialChild:');
    
    const testParent = document.createElement('div');
    testParent.id = 'parent-element';
    
    const normalChild = document.createElement('div');
    normalChild.className = 'child';
    normalChild.textContent = 'Обычный элемент';
    
    const specialChild = document.createElement('div');
    specialChild.className = 'child special';
    specialChild.textContent = 'Специальный элемент';
    
    testParent.appendChild(normalChild);
    testParent.appendChild(specialChild);
    document.body.appendChild(testParent);
    
    const result = findSpecialChild();
    console.assert(result === 'Специальный элемент', 
        `Должен найти специальный элемент, получено: "${result}"`);
    
    testParent.remove();
    console.log('✓ findSpecialChild прошел тест');
}

function testGetParentBackground() {
    console.log('Тест getParentBackground:');
    
    const testParent = document.createElement('div');
    testParent.id = 'parent-element';
    testParent.style.backgroundColor = 'rgb(255, 0, 0)';
    
    const testChild = document.createElement('div');
    testChild.className = 'child';
    
    testParent.appendChild(testChild);
    document.body.appendChild(testParent);
    
    const bgColor = getParentBackground();
    console.assert(bgColor === 'rgb(255, 0, 0)', 
        `Цвет фона должен быть красным, получено: ${bgColor}`);
    
    testParent.remove();
    console.log('✓ getParentBackground прошел тест');
}

function testValidateForm() {
    console.log('Тест validateForm:');
    
    // Тест корректных данных
    const validData = {
        name: 'Иван',
        email: 'ivan@example.com',
        age: '25'
    };
    
    const validResult = validateForm(validData);
    console.assert(validResult === null, 'Корректные данные должны проходить валидацию');
    
    // Тест некорректных данных
    const invalidData = {
        name: 'И', // Слишком короткое имя
        email: 'invalid-email', // Некорректный email
        age: '150' // Слишком большой возраст
    };
    
    const invalidResult = validateForm(invalidData);
    console.assert(invalidResult !== null, 'Некорректные данные должны возвращать ошибки');
    console.assert('name' in invalidResult, 'Должна быть ошибка имени');
    console.assert('email' in invalidResult, 'Должна быть ошибка email');
    console.assert('age' in invalidResult, 'Должна быть ошибка возраста');
    
    console.log('✓ validateForm прошел тест');
}

// Запуск тестов при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(runTests, 1000); // Даем время на загрузку DOM
});