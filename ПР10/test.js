// Тесты для функции sum
console.log("Тесты для sum:");
console.log(sum(1, 2, 3)); // 6
console.log(sum(10)); // 10
console.log(sum()); // 0
console.log(sum(1, -2, 3, -4)); // -2

// Тесты для createUser
console.log("\nТесты для createUser:");
console.log(createUser({ name: "Иван", age: 25, email: "ivan@mail.ru" }));
console.log(createUser({ name: "Мария", age: 30 }));

// Тесты для secretMessage
console.log("\nТесты для secretMessage:");
const secret = secretMessage("123", "Секретное сообщение");
console.log(secret("123")); // "Секретное сообщение"
console.log(secret("wrong")); // "Доступ запрещен"

// Тесты для compose
console.log("\nТесты для compose:");
const addTwo = x => x + 2;
const multiplyByThree = x => x * 3;
const composed = compose(addTwo, multiplyByThree);
console.log(composed(5)); // 17

// Тесты для myMap, myFilter, myReduce
console.log("\nТесты для методов массивов:");
const numbers = [1, 2, 3, 4, 5];
console.log(myMap(numbers, x => x * 2)); // [2, 4, 6, 8, 10]
console.log(myFilter(numbers, x => x % 2 === 0)); // [2, 4]
console.log(myReduce(numbers, (acc, curr) => acc + curr, 0)); // 15

// Тесты для каррирования
console.log("\nТесты для каррирования:");
const multiply = (a, b, c) => a * b * c;
const curriedMultiply = curry(multiply);
console.log(curriedMultiply(2)(3)(4)); // 24
console.log(curriedMultiply(2, 3)(4)); // 24

// Тесты для мемоизации
console.log("\nТесты для мемоизации:");
const expensiveFunction = (a, b) => {
    console.log("Выполняется вычисление...");
    return a + b;
};
const memoizedExpensive = memoize(expensiveFunction);
console.log(memoizedExpensive(1, 2)); // Выполняется вычисление... 3
console.log(memoizedExpensive(1, 2)); // 3 (из кэша)

// Тесты для дебаунсинга и троттлинга
console.log("\nТесты для дебаунсинга и троттлинга:");
let callCount = 0;
const testFn = () => callCount++;

const debouncedFn = debounce(testFn, 100);
const throttledFn = throttle(testFn, 100);

// Имитируем множественные вызовы
for (let i = 0; i < 5; i++) {
    debouncedFn();
    throttledFn();
}

setTimeout(() => {
    console.log("Call count после дебаунсинга и троттлинга:", callCount);
}, 200);

// Тесты для валидатора
console.log("\nТесты для валидатора:");
const passwordValidator = createValidator({
    minLength: 6,
    requireDigits: true,
    requireUppercase: true
});

console.log(passwordValidator("weak")); // { isValid: false, errors: [...] }
console.log(passwordValidator("Strong123")); // { isValid: true, errors: [] }