// Функция для вывода результатов тестов
function displayTestResult(testName, passed, expected = null, actual = null) {
    const resultsDiv = document.getElementById('test-results');
    const resultDiv = document.createElement('div');
    resultDiv.className = `test-result ${passed ? 'pass' : 'fail'}`;
    
    let resultText = `${testName}: ${passed ? 'ПРОЙДЕН' : 'НЕ ПРОЙДЕН'}`;
    if (!passed && expected !== null && actual !== null) {
        resultText += ` (ожидалось: ${expected}, получено: ${actual})`;
    }
    
    resultDiv.textContent = resultText;
    resultsDiv.appendChild(resultDiv);
}

// Тестирование функций для работы с числами
function testNumberFunctions() {
    // Тесты для isPrime
    displayTestResult('isPrime(7)', isPrime(7) === true, true, isPrime(7));
    displayTestResult('isPrime(10)', isPrime(10) === false, false, isPrime(10));
    displayTestResult('isPrime(2)', isPrime(2) === true, true, isPrime(2));
    
    // Тесты для factorial
    displayTestResult('factorial(5)', factorial(5) === 120, 120, factorial(5));
    displayTestResult('factorial(0)', factorial(0) === 1, 1, factorial(0));
    
    // Тесты для fibonacci
    const fibResult = fibonacci(6);
    const expectedFib = [0, 1, 1, 2, 3, 5];
    displayTestResult('fibonacci(6)', 
        JSON.stringify(fibResult) === JSON.stringify(expectedFib), 
        JSON.stringify(expectedFib), JSON.stringify(fibResult));
    
    // Тесты для gcd
    displayTestResult('gcd(54, 24)', gcd(54, 24) === 6, 6, gcd(54, 24));
    displayTestResult('gcd(17, 13)', gcd(17, 13) === 1, 1, gcd(17, 13));
}

// Тестирование функций для работы со строками
function testStringFunctions() {
    // Тесты для isPalindrome
    displayTestResult('isPalindrome("А роза упала на лапу Азора")', 
        isPalindrome("А роза упала на лапу Азора") === true, true, 
        isPalindrome("А роза упала на лапу Азора"));
    displayTestResult('isPalindrome("hello")', 
        isPalindrome("hello") === false, false, isPalindrome("hello"));
    
    // Тесты для countVowels
    displayTestResult('countVowels("Привет мир")', 
        countVowels("Привет мир") === 3, 3, countVowels("Привет мир"));
    
    // Тесты для reverseString
    displayTestResult('reverseString("hello")', 
        reverseString("hello") === "olleh", "olleh", reverseString("hello"));
    
    // Тесты для findLongestWord
    displayTestResult('findLongestWord("Самое длинное слово в предложении")', 
        findLongestWord("Самое длинное слово в предложении") === "предложении", 
        "предложении", findLongestWord("Самое длинное слово в предложении"));
}

// Тестирование функций для работы с массивами
function testArrayFunctions() {
    // Тесты для findMax
    displayTestResult('findMax([3, 1, 4, 1, 5, 9])', 
        findMax([3, 1, 4, 1, 5, 9]) === 9, 9, findMax([3, 1, 4, 1, 5, 9]));
    
    // Тесты для removeDuplicates
    const dupResult = removeDuplicates([1, 2, 2, 3, 4, 4, 5]);
    const expectedDup = [1, 2, 3, 4, 5];
    displayTestResult('removeDuplicates([1,2,2,3,4,4,5])', 
        JSON.stringify(dupResult) === JSON.stringify(expectedDup),
        JSON.stringify(expectedDup), JSON.stringify(dupResult));
    
    // Тесты для bubbleSort
    const sortResult = bubbleSort([64, 34, 25, 12, 22, 11, 90]);
    const expectedSort = [11, 12, 22, 25, 34, 64, 90];
    displayTestResult('bubbleSort([64,34,25,12,22,11,90])', 
        JSON.stringify(sortResult) === JSON.stringify(expectedSort),
        JSON.stringify(expectedSort), JSON.stringify(sortResult));
    
    // Тесты для binarySearch
    const sortedArray = [11, 12, 22, 25, 34, 64, 90];
    displayTestResult('binarySearch([11,12,22,25,34,64,90], 25)', 
        binarySearch(sortedArray, 25) === 3, 3, binarySearch(sortedArray, 25));
    displayTestResult('binarySearch([11,12,22,25,34,64,90], 100)', 
        binarySearch(sortedArray, 100) === -1, -1, binarySearch(sortedArray, 100));
}

// Тестирование утилитарных функций
function testUtilityFunctions() {
    // Тесты для formatCurrency
    displayTestResult('formatCurrency(1234.56)', 
        formatCurrency(1234.56) === "1 234.56 ₽", "1 234.56 ₽", formatCurrency(1234.56));
    
    // Тесты для isValidEmail
    displayTestResult('isValidEmail("test@example.com")', 
        isValidEmail("test@example.com") === true, true, isValidEmail("test@example.com"));
    displayTestResult('isValidEmail("invalid-email")', 
        isValidEmail("invalid-email") === false, false, isValidEmail("invalid-email"));
    
    // Тесты для generatePassword
    const password = generatePassword(8);
    displayTestResult('generatePassword(8) length', 
        password.length === 8, 8, password.length);
}

// Запуск всех тестов при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    testNumberFunctions();
    testStringFunctions();
    testArrayFunctions();
    testUtilityFunctions();
});