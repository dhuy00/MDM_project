const mysql = require('mysql2/promise');

async function testConnection() {
    try {
        // Try connecting without password first
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root'
        });
        console.log('Successfully connected to MySQL without password');
        await connection.end();
    } catch (error) {
        console.error('Error connecting without password:', error.message);
        
        try {
            // If that fails, try with empty string password
            const connection = await mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: ''
            });
            console.log('Successfully connected to MySQL with empty password');
            await connection.end();
        } catch (error) {
            console.error('Error connecting with empty password:', error.message);
        }
    }
}

testConnection();
