function cetakPola(n) {
    for (let i = 0; i < n; i++) {
        let line = ' '.repeat(i); // Spasi di awal baris
        let charCount = n - i;    // Jumlah karakter dalam satu baris

        // Tentukan pola karakter untuk setiap baris
        line += Array.from({ length: charCount }, (_, j) =>
            ((i + 2) % 4 === 0) ? (j % 2 === 0 ? '+' : '#') :
            (i % 2 === 0 ? (j % 2 === 0 ? '#' : '+') : '+')
        ).join(' ');

        console.log(line);
    }
}

// Panggil function dengan n = 10 untuk melihat hasil lebih banyak
cetakPola(5);