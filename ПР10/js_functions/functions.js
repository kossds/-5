// Часть 2: Основные задания

// Создайте функцию sum, которая принимает любое количество аргументов
function sum(...numbers) {
    return numbers.reduce((acc, curr) => acc + curr, 0);
}

// Создайте функцию createUser, которая принимает объект с деструктуризацией
function createUser({ name, age, email = "не указан" }) {
    return `Пользователь: ${name}, возраст: ${age}, email: ${email}`;
}

// Создайте функцию secretMessage, которая сохраняет секретное сообщение
function secretMessage(password, message) {
    return function(checkPassword) {
        return checkPassword === password ? message : "Доступ запрещен";
    };
}

// Часть 3: Рекурсия и функции высшего порядка

// Создайте функцию compose, которая принимает несколько функций
function compose(...functions) {
    return function(initialValue) {
        return functions.reduceRight((acc, fn) => fn(acc), initialValue);
    };
}

// Реализуйте функцию myMap
function myMap(array, callback) {
    const result = [];
    for (let i = 0; i < array.length; i++) {
        result.push(callback(array[i], i, array));
    }
    return result;
}

// Реализуйте функцию myFilter
function myFilter(array, callback) {
    const result = [];
    for (let i = 0; i < array.length; i++) {
        if (callback(array[i], i, array)) {
            result.push(array[i]);
        }
    }
    return result;
}

// Реализуйте функцию myReduce
function myReduce(array, callback, initialValue) {
    let accumulator = initialValue !== undefined ? initialValue : array[0];
    let startIndex = initialValue !== undefined ? 0 : 1;
    
    for (let i = startIndex; i < array.length; i++) {
        accumulator = callback(accumulator, array[i], i, array);
    }
    return accumulator;
}

// Часть 4: Сложно, но важно

// Каррирование
function curry(fn) {
    return function curried(...args) {
        if (args.length >= fn.length) {
            return fn.apply(this, args);
        } else {
            return function(...args2) {
                return curried.apply(this, args.concat(args2));
            };
        }
    };
}

// Мемоизация
function memoize(fn) {
    const cache = new Map();
    return function(...args) {
        const key = JSON.stringify(args);
        if (cache.has(key)) {
            return cache.get(key);
        }
        const result = fn.apply(this, args);
        cache.set(key, result);
        return result;
    };
}

// Дебаунсинг
function debounce(fn, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), delay);
    };
}

// Троттлинг
function throttle(fn, interval) {
    let lastCall = 0;
    return function(...args) {
        const now = Date.now();
        if (now - lastCall >= interval) {
            lastCall = now;
            return fn.apply(this, args);
        }
    };
}

// Функция-валидатор
function createValidator(options) {
    return function(value) {
        const errors = [];
        
        if (options.minLength && value.length < options.minLength) {
            errors.push(`Минимальная длина: ${options.minLength}`);
        }
        
        if (options.requireDigits && !/\d/.test(value)) {
            errors.push("Должна содержать цифры");
        }
        
        if (options.requireUppercase && !/[A-Z]/.test(value)) {
            errors.push("Должна содержать заглавные буквы");
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    };
}