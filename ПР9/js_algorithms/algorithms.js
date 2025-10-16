// Задача 2.1: Функции для работы с числами

// Временная сложность: O(√n)
function isPrime(number) {
    if (number <= 1) return false;
    if (number <= 3) return true;
    if (number % 2 === 0 || number % 3 === 0) return false;
    
    // Проверяем делители до √n
    for (let i = 5; i * i <= number; i += 6) {
        if (number % i === 0 || number % (i + 2) === 0) return false;
    }
    return true;
}

// Временная сложность: O(n)
function factorial(n) {
    if (n < 0) throw new Error("Факториал отрицательного числа не определен");
    if (n === 0 || n === 1) return 1;
    
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

// Временная сложность: O(n)
function fibonacci(n) {
    if (n <= 0) return [];
    if (n === 1) return [0];
    if (n === 2) return [0, 1];
    
    const sequence = [0, 1];
    for (let i = 2; i < n; i++) {
        sequence[i] = sequence[i - 1] + sequence[i - 2];
    }
    return sequence;
}

// Временная сложность: O(log(min(a, b)))
function gcd(a, b) {
    // Алгоритм Евклида
    while (b !== 0) {
        const temp = b;
        b = a % b;
        a = temp;
    }
    return Math.abs(a);
}

// Задача 2.2: Функции для работы со строками

// Временная сложность: O(n)
function isPalindrome(str) {
    const cleanStr = str.toLowerCase().replace(/[^а-яa-z0-9]/g, '');
    let left = 0;
    let right = cleanStr.length - 1;
    
    while (left < right) {
        if (cleanStr[left] !== cleanStr[right]) return false;
        left++;
        right--;
    }
    return true;
}

// Временная сложность: O(n)
function countVowels(str) {
    const vowels = {
        'russian': 'аеёиоуыэюя',
        'english': 'aeiou'
    };
    const allVowels = vowels.russian + vowels.english;
    let count = 0;
    
    for (let char of str.toLowerCase()) {
        if (allVowels.includes(char)) {
            count++;
        }
    }
    return count;
}

// Временная сложность: O(n)
function reverseString(str) {
    let reversed = '';
    for (let i = str.length - 1; i >= 0; i--) {
        reversed += str[i];
    }
    return reversed;
}

// Временная сложность: O(n)
function findLongestWord(sentence) {
    const words = sentence.split(/\s+/);
    let longestWord = '';
    let maxLength = 0;
    
    for (let word of words) {
        const cleanWord = word.replace(/[^а-яa-z]/gi, '');
        if (cleanWord.length > maxLength) {
            maxLength = cleanWord.length;
            longestWord = cleanWord;
        }
    }
    return longestWord;
}

// Задача 2.3: Функции для работы с массивами

// Временная сложность: O(n)
function findMax(arr) {
    if (arr.length === 0) throw new Error("Массив пуст");
    
    let max = arr[0];
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            max = arr[i];
        }
    }
    return max;
}

// Временная сложность: O(n)
function removeDuplicates(arr) {
    const seen = new Set();
    const result = [];
    
    for (let item of arr) {
        if (!seen.has(item)) {
            seen.add(item);
            result.push(item);
        }
    }
    return result;
}

// Временная сложность: O(n²)
function bubbleSort(arr) {
    const n = arr.length;
    let swapped;
    
    for (let i = 0; i < n - 1; i++) {
        swapped = false;
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                // Меняем элементы местами
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                swapped = true;
            }
        }
        // Если не было обменов, массив отсортирован
        if (!swapped) break;
    }
    return arr;
}

// Временная сложность: O(log n)
function binarySearch(sortedArr, target) {
    let left = 0;
    let right = sortedArr.length - 1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if (sortedArr[mid] === target) {
            return mid;
        } else if (sortedArr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return -1;
}

// Задача 2.4: Утилитарные функции

// Временная сложность: O(1)
function formatCurrency(amount, currency = '₽') {
    return new Intl.NumberFormat('ru-RU', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount) + ' ' + currency;
}

// Временная сложность: O(1)
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Временная сложность: O(n)
function generatePassword(length = 8) {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    const allChars = lowercase + uppercase + numbers + symbols;
    let password = '';
    
    // Гарантируем наличие хотя бы одного символа каждого типа
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];
    
    // Заполняем оставшуюся длину
    for (let i = 4; i < length; i++) {
        password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    // Перемешиваем символы
    return password.split('').sort(() => Math.random() - 0.5).join('');
}