# API Dino Clothes

Nama: Dino Febiyan (362458302043)\
Peran: **Mahasiswa 2 – Vendor B**\
Mata Kuliah: Interoperabilitas\
Proyek: API Distro Modern\
Link API: https://dino-clothes.vercel.app/

---

## Pendahuluan

Pada proyek ini saya membangun sebuah REST API untuk sebuah distro pakaian bernama **Dino Clothes**. API ini dibuat sebagai implementasi peran **Mahasiswa 2 (Vendor B – Distro Modern)** pada Ujian Praktikum Akhir Semester mata kuliah Interoperabilitas.

Sebagai Vendor B, saya memiliki tugas untuk menyediakan data produk dengan **struktur modern**, **standar internasional**, serta **siap diintegrasikan** dengan sistem lain. Data pada API ini saya buat agar konsisten, aman, dan mengikuti logika bisnis yang jelas berdasarkan peran pengguna.

---

## Tujuan Proyek

Melalui pembuatan API Dino Clothes ini, saya saya memiliki tujuan untuk:

* Mengimplementasikan REST API berbasis JSON
* Menghasilkan struktur data sesuai standar Vendor B
* Menerapkan konsep interoperabilitas
* Membedakan hak akses pengguna berdasarkan peran
* Menerapkan logika bisnis pada sistem backend

---

## Peran Saya sebagai Mahasiswa 2 (Vendor B)

Sesuai dengan soal UAS, saya berperan sebagai **Vendor B (Distro Modern)** dengan ketentuan:

* Menggunakan **Bahasa Inggris**
* Menggunakan **CamelCase**
* Menggunakan tipe data **Number** untuk harga
* Menggunakan tipe data **Boolean** untuk status ketersediaan

### Format Data Vendor B

```
[
  {
    "sku": "TSHIRT-001",
    "productName": "Kaos Ijen Crater",
    "price": 75000,
    "isAvailable": true
  }
]
```

Struktur ini akan saya terapkan pada API Dino Clothes secara konsisten agar API ini mudah diparsing dan diintegrasikan lewat sistem lain yaitu mahasiswa 4.

---

## Persiapan dan Pembuatan Proyek

Saya membuat proyek backend menggunakan Node.js dan Express.js, kemudian menyiapkan struktur dasar API. Berikut persiapan dalam pembuatan proyek yang saya lakukan:

### Inisialisasi Proyek

```
npm init -y
```

### Instalasi Dependensi

```
npm install express cors jsonwebtoken bcryptjs
```

Dependensi tersebut saya gunakan untuk:

* membuat REST API,
* mengatur autentikasi,
* mengamankan endpoint,
* serta mengelola data produk.

---

## Konsep Role dan Logika Bisnis

Dalam API Dino Clothes, saya menerapkan pembagian peran sebagai berikut:

### 1. Owner

* Membuat produk baru
* Menentukan harga produk
* Menghapus produk

### 2. Admin

* Mengelola stok produk
* Memperbarui ketersediaan produk

### 3. User

* Hanya dapat melihat daftar produk

Pembagian ini saya terapkan agar setiap pengguna memiliki tanggung jawab yang jelas dan sistem menjadi lebih aman.

---

## Fitur API dan Penjelasan Route

### GET `/products`

Digunakan untuk menampilkan seluruh produk Dino Clothes.

Logika:

* Endpoint bersifat publik
* Dapat diakses oleh semua role
* Menampilkan data sesuai format Vendor B

Contoh response:

```
[
  {
    "sku": "TSHIRT-001",
    "productName": "Kaos Ijen Crater",
    "price": 75000,
    "isAvailable": true
  }
]
```

---

### POST `/products`

Digunakan untuk menambahkan produk baru.

Logika bisnis:

* Hanya **owner** yang boleh mengakses
* Owner menentukan SKU, nama produk, dan harga

Aturan:

* Jika role ≠ owner → akses ditolak
* Harga wajib bertipe Number

---

### PUT `/products/:id`

Digunakan untuk memperbarui data produk.

Logika bisnis:

* **Admin** diperbolehkan memperbarui stok dan status `isAvailable`
* **Owner** diperbolehkan memperbarui detail produk
* **User** tidak diperbolehkan mengakses endpoint ini

Contoh:

* Admin → update stok
* Owner → update nama atau harga

---

### DELETE `/products/:id`

Digunakan untuk menghapus produk.

Logika bisnis:

* Hanya **owner** yang memiliki akses
* Admin dan user tidak diperbolehkan menghapus produk

---

## Kesesuaian dengan Perintah Soal

Sebagai Mahasiswa 2 (Vendor B), saya memastikan bahwa saya telah memenuhi seluruh kriteria perintah pada soal seperti:

* Menggunakan JSON schema modern
* Menggunakan bahasa Inggris dan CamelCase
* Menggunakan Number untuk `price`
* Menggunakan Boolean untuk `isAvailable`
* Menyediakan data siap integrasi

API ini dapat langsung digunakan oleh **Integrator (Mahasiswa 4)** untuk dinormalisasi ke format standar marketplace.

---

## Alur Bisnis API

1. Owner login
2. Owner menambahkan produk dan menentukan harga
3. Admin login
4. Admin mengelola stok produk
5. User atau sistem lain mengambil data produk melalui endpoint GET
6. Integrator memproses data Vendor B bersama vendor lain

---

## Kesimpulan

Melalui proyek API ini, saya berhasil membangun sebuah API sesuai dengan peran yang saya dapatkan yaitu **Mahasiswa 2 (Vendor B)** dengan struktur data yang modern dan konsisten. Saya menerapkan konsep interoperabilitas, pembagian peran pengguna, serta logika bisnis seperti antara owner, admin, dan user.

API yang saya buat telah memenuhi seluruh ketentuan soal, menggunakan format JSON standar, serta siap untuk diintegrasikan ke sistem marketplace yang lebih besar.