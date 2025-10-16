function runTests() {
    const testResults = document.getElementById('test-results');
    let resultsHTML = '';
    
    function addTestResult(name, expected, actual, success) {
        const status = success ? 'test-success' : 'test-error';
        resultsHTML += `
            <div class="test-result ${status}">
                <strong>${name}:</strong> ${success ? 'Пройден' : 'Ошибка'}<br>
                Ожидалось: ${expected}<br>
                Получено: ${actual}
            </div>
        `;
    }
    
    // Тесты для функций работы с числами
    try {
        addTestResult('isPrime(7)', true, isPrime(7), isPrime(7) === true);
        addTestResult('isPrime(4)', false, isPrime(4), isPrime(4) === false);
        addTestResult('factorial(5)', 120, factorial(5), factorial(5) === 120);
        addTestResult('fibonacci(6)', '0,1,1,2,3,5', fibonacci(6).join(','), fibonacci(6).join(',') === '0,1,1,2,3,5');
        addTestResult('gcd(48, 18)', 6, gcd(48, 18), gcd(48, 18) === 6);
    } catch (e) {
        addTestResult('Функции работы с числами', 'Без ошибок', e.message, false);
    }
    
    // Тесты для функций работы со строками
    try {
        addTestResult('isPalindrome("А роза упала на лапу Азора")', true, isPalindrome("А роза упала на лапу Азора"), isPalindrome("А роза упала на лапу Азора") === true);
        addTestResult('countVowels("Привет мир")', 3, countVowels("Привет мир"), countVowels("Привет мир") === 3);
        addTestResult('reverseString("hello")', 'olleh', reverseString("hello"), reverseString("hello") === 'olleh');
        addTestResult('findLongestWord("Самое длинное слово в предложении")', 'предложении', findLongestWord("Самое длинное слово в предложении"), findLongestWord("Самое длинное слово в предложении") === 'предложении');
    } catch (e) {
        addTestResult('Функции работы со строками', 'Без ошибок', e.message, false);
    }
    
    // Тесты для функций работы с массивами
    try {
        addTestResult('findMax([3, 1, 4, 1, 5, 9])', 9, findMax([3, 1, 4, 1, 5, 9]), findMax([3, 1, 4, 1, 5, 9]) === 9);
        addTestResult('removeDuplicates([1,2,2,3,4,4,5])', '1,2,3,4,5', removeDuplicates([1,2,2,3,4,4,5]).join(','), removeDuplicates([1,2,2,3,4,4,5]).join(',') === '1,2,3,4,5');
        addTestResult('bubbleSort([3,1,4,2])', '1,2,3,4', bubbleSort([3,1,4,2]).join(','), bubbleSort([3,1,4,2]).join(',') === '1,2,3,4');
        addTestResult('binarySearch([1,2,3,4,5], 3)', 2, binarySearch([1,2,3,4,5], 3), binarySearch([1,2,3,4,5], 3) === 2);
    } catch (e) {
        addTestResult('Функции работы с массивами', 'Без ошибок', e.message, false);
    }
    
    // Тесты для утилитарных функций
    try {
        addTestResult('formatCurrency(1234.56)', '1 234,56 ₽', formatCurrency(1234.56), formatCurrency(1234.56).replace(/\s/g, ' ') === '1 234,56 ₽');
        addTestResult('isValidEmail("test@example.com")', true, isValidEmail("test@example.com"), isValidEmail("test@example.com") === true);
        
        const password = generatePassword(10);
        addTestResult('generatePassword(10)', 'Длина 10 символов', `Длина: ${password.length}`, password.length === 10);
    } catch (e) {
        addTestResult('Утилитарные функции', 'Без ошибок', e.message, false);
    }
    
    testResults.innerHTML = resultsHTML;
}

// Запускаем тесты после загрузки страницы
document.addEventListener('DOMContentLoaded', runTests);