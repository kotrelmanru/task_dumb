function investasiDuaTahun(dana) {
    const danaTotal = 
        dana * 0.35 * (1 + 3.5 / 100) ** 2 +    // Deposito (35% dengan 3.5% per tahun)
        dana * 0.30 * (1 + 13 / 100) ** 2 +     // Obligasi (30% dengan 13% per tahun)
        dana * 0.35 * 0.35 * (1 + 14.5 / 100) ** 2 +  // Saham A (35% dari 35% dengan 14.5% per tahun)
        dana * (1 - (0.35 + 0.30 + 0.35 * 0.35)) * (1 + 12.5 / 100) ** 2; // Saham B (sisa dengan 12.5% per tahun)

    console.log(`Total uang investor setelah dua tahun adalah: Rp ${danaTotal.toFixed(2)}`);
}

// Misalkan modal awal investor sebesar 1 miliar (1.000.000.000)
investasiDuaTahun(1000000000);
