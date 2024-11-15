function menyusunArrayKeTarget(arr) {
    const target = "Dumbways is awesome".split(""); // Ubah target menjadi array karakter
    let result = [];

    // Iterasi melalui target untuk menyusun ulang sesuai target
    target.forEach((char) => {
        const index = arr.indexOf(char);
        if (index !== -1) { // Jika tidak memeriksa apakah index -1, kita bisa mengakses elemen array yang tidak ada
            result.push(arr[index]);
            arr[index] = null; // Tandai sebagai 'terpakai' agar tidak digunakan lagi
        }
    });

    return result.join("");
}

// Data array input
const arr = ["u", "D", "m", "w", "b", "a", "y", "s", "i", "s", "w", "a", "e", "s", "e", "o", "m", " ", " "];

// Menjalankan fungsi dan menampilkan hasil
console.log(menyusunArrayKeTarget(arr)); // Output yang diharapkan: "Dumbways is awesome"

