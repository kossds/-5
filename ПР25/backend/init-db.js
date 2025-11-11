require('dotenv').config();
const path = require('path');
const fs = require('fs');

console.log('🔧 Инициализация базы данных...');

try {
    // Определяем путь к базе данных
    const dbPath = process.env.SQLITE_DB_PATH || './database/sqlite.prod.db';
    const dbDir = path.dirname(dbPath);
    
    // Создаем директорию для базы данных, если она не существует
    if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
        console.log(`✅ Создана директория для базы данных: ${dbDir}`);
    }
    
    // Проверяем, существует ли файл базы данных
    if (!fs.existsSync(dbPath)) {
        // Создаем пустой файл базы данных
        fs.closeSync(fs.openSync(dbPath, 'w'));
        console.log(`✅ Создан новый файл базы данных: ${dbPath}`);
    } else {
        console.log(`✅ Файл базы данных уже существует: ${dbPath}`);
    }
    
    console.log('✅ Инициализация базы данных завершена успешно');
    
} catch (error) {
    console.error('❌ Ошибка при инициализации базы данных:');
    console.error(error);
    process.exit(1);
}