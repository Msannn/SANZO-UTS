// === Toggle class active untuk hamburger menu ===
const hamburger = document.querySelector('#hamburger-menu');
const navbarNav = document.querySelector('.navbar-nav');

hamburger.addEventListener('click', (e) => {
  navbarNav.classList.toggle('active');
  e.preventDefault();
});

// Cek apakah user sudah login dari cookie
function getCookie(nama) {
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookies = decodedCookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    let c = cookies[i].trim();
    if (c.indexOf(nama + "=") === 0) {
      return JSON.parse(c.substring(nama.length + 1));
    }
  }
  return null;
}

function isUserLoggedIn() {
  return getCookie("userLogin") !== null;
}

// === Inisialisasi saat halaman dimuat ===
document.addEventListener('DOMContentLoaded', function () {
  muatKeranjang();

// Lanjutkan checkout jika sebelumnya user mau checkout
if (typeof window.lanjutkanCheckout === "function") {
  window.lanjutkanCheckout();
  window.lanjutkanCheckout = null;
}

  // Fungsi simpan data ke cookie
  function simpanKeCookie(nama, nilai, hari) {
    const d = new Date();
    d.setTime(d.getTime() + (hari * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = `${nama}=${encodeURIComponent(JSON.stringify(nilai))};${expires};path=/`;
  }

  // Fungsi checkout
  function handleCheckout() {
    const keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];

    if (keranjang.length === 0) {
      alert("Keranjang masih kosong!");
      return;
    }

    simpanKeCookie("dataCheckout", keranjang, 3);

    let total = 0;
    let struk = "=== Struk Pembelian ===\n\n";

    keranjang.forEach((item, i) => {
      const hargaItem = parseFloat(item.harga);
      total += hargaItem;
      struk += `${i + 1}. ${item.produk} | Bahan: ${item.bahan} | Stok: ${item.stok} | Harga: Rp${hargaItem.toLocaleString()}\n`;
    });

    struk += `\nTotal Bayar: Rp${total.toLocaleString()}`;
    struk += "\n\nTerima kasih telah berbelanja di Autopartsid!";
    alert(struk);

    localStorage.removeItem("keranjang");
    muatKeranjang();
  }

  // Fungsi simpan ke keranjang
  function simpanKeKeranjang(data, tampilkanAlert = false) {
    const keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];
    keranjang.push(data);
    localStorage.setItem("keranjang", JSON.stringify(keranjang));
    if (tampilkanAlert) {
      alert(`${data.produk} telah ditambahkan ke keranjang.`);
    }
    muatKeranjang();
  }

  // Tampilkan isi keranjang
  function muatKeranjang() {
    const keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];
    const daftar = document.getElementById("daftar-keranjang");
    const jumlah = document.getElementById("keranjang-count");

    if (!daftar || !jumlah) return;

    daftar.innerHTML = '';
    keranjang.forEach((item, index) => {
      const div = document.createElement('div');
      div.classList.add('keranjang-item');
      div.innerHTML = `
        <p><strong>${item.produk}</strong> | Bahan: ${item.bahan} | Stok: ${item.stok} | Harga: Rp${parseFloat(item.harga).toLocaleString()}</p>
        <button onclick="hapusItem(${index})">Hapus</button>
      `;
      daftar.appendChild(div);
    });

    jumlah.textContent = keranjang.length;
  }

  // Hapus item dari keranjang
  window.hapusItem = function(index) {
    const keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];
    keranjang.splice(index, 1);
    localStorage.setItem("keranjang", JSON.stringify(keranjang));
    muatKeranjang();
  };

  // Tombol tambah ke keranjang
document.querySelectorAll('.keranjang-btn').forEach(button => {
  button.addEventListener('click', function () {
    const produk = this.getAttribute('data-produk');
    const bahan = this.getAttribute('data-bahan');
    const stok = this.getAttribute('data-stok');
    const harga = this.getAttribute('data-harga');
    const item = { produk, bahan, stok, harga };

    simpanKeKeranjang(item, false); // Tanpa alert
  });
});

  // Tombol checkout dari produk langsung
  document.querySelectorAll('.checkout-btn').forEach(button => {
    button.addEventListener('click', function () {
      const produk = this.getAttribute('data-produk');
      const bahan = this.getAttribute('data-bahan');
      const stok = this.getAttribute('data-stok');
      const harga = this.getAttribute('data-harga');
      const item = { produk, bahan, stok, harga };
  
      simpanKeKeranjang(item, false); // tanpa alert
  
      if (isUserLoggedIn()) {
        handleCheckout();
      } else {
        loginFormContainer.style.display = 'block';
        window.lanjutkanCheckout = () => handleCheckout(); // Simpan fungsi untuk lanjutkan setelah login
      }
    });
  });  

  // Tombol checkout dari dalam halaman keranjang
  const checkoutBtn = document.getElementById("checkout-btn");
if (checkoutBtn) {
  checkoutBtn.addEventListener("click", function () {
    if (isUserLoggedIn()) {
      handleCheckout();
    } else {
      loginFormContainer.style.display = 'block';
      window.lanjutkanCheckout = () => handleCheckout(); // Simpan fungsi untuk lanjutkan setelah login
    }
  });
}

  // Toggle tampilan halaman keranjang
  const toggleKeranjang = document.getElementById("toggle-keranjang");
  const halamanKeranjang = document.getElementById("halaman-keranjang");
  if (toggleKeranjang && halamanKeranjang) {
    toggleKeranjang.addEventListener("click", function (e) {
      e.preventDefault();
      halamanKeranjang.style.display = 
        (halamanKeranjang.style.display === "none" || halamanKeranjang.style.display === "") 
          ? "block" 
          : "none";
    });
  }
});


// Fungsi untuk menyimpan data ke cookie
function simpanKeCookie(nama, nilai, hari) {
  const d = new Date();
  d.setTime(d.getTime() + (hari * 24 * 60 * 60 * 1000));
  const expires = "expires=" + d.toUTCString();
  document.cookie = `${nama}=${encodeURIComponent(JSON.stringify(nilai))};${expires};path=/`;
}

// Toggle untuk menampilkan form login
const loginMenu = document.getElementById('login-menu');
const loginFormContainer = document.getElementById('login-form-container');
const closeLoginForm = document.getElementById('close-login-form');

loginMenu.addEventListener('click', function (e) {
  e.preventDefault();
  loginFormContainer.style.display = 'block';
});

closeLoginForm.addEventListener('click', function () {
  loginFormContainer.style.display = 'none';
});

// === FUNGSI LOGIN ===
document.getElementById("login-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const nama = document.getElementById("login-nama").value;
  const password = document.getElementById("login-password").value;

  if (!nama || !password) {
    alert("Harap isi nama dan password.");
    return;
  }

  const dataLogin = { nama, password };
  simpanKeCookie("userLogin", dataLogin, 3);

  alert("Login berhasil! Data disimpan di cookie.");
  loginFormContainer.style.display = 'none';

  // Lanjutkan checkout jika sebelumnya user mau checkout
  if (typeof window.lanjutkanCheckout === "function") {
    window.lanjutkanCheckout();
    window.lanjutkanCheckout = null;
  }
});





