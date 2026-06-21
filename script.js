// ============================================================
// KONFIGURASI
// ============================================================
const DATA_PATH = 'data/';
const MAX_LIVE_XTRA = 20000;

// ============================================================
// STATE / DATA GLOBAL
// ============================================================
let dataXTRACategory = [];
let dataAdminMall = [];
let dataAdminNonMall = [];
let dataPromoXtra = [];
let dataXtraFee = [];
let dataBiayaPembayaran = [];
let productIndex = [];

// ============================================================
// MAPPING SUB KATEGORI KE KATEGORI PRODUK (XTRA)
// ============================================================
const subKategoriToProduk = {
    // ==================== FASHION ====================
    "Aksesoris Rambut": "H",
    "Aksesoris Tambahan": "H",
    "Anting": "H",
    "Cincin": "H",
    "Dasi": "H",
    "Gelang Kaki": "H",
    "Gelang Tangan & Bangle": "H",
    "Ikat Pinggang": "H",
    "Kacamata & Aksesoris": "H",
    "Kalung": "H",
    "Sarung Tangan": "H",
    "Set & Paket Aksesoris": "H",
    "Syal & Selendang": "H",
    "Topi": "H",
    "Logam Mulia": "B",
    "Perhiasan Berharga": "B",
    "Aksesoris Fashion Lainnya": "H",
    "Aksesoris Bayi & Anak": "D",
    "Pakaian Anak Laki-Laki": "D",
    "Pakaian Anak Perempuan": "D",
    "Pakaian Bayi": "D",
    "Sepatu Anak Laki-Laki": "D",
    "Sepatu Anak Perempuan": "D",
    "Sepatu Bayi": "D",
    "Fashion Bayi & Anak Lainnya": "D",
    "Mukena & Perlengkapan Sholat": "G",
    "Outerwear": "G",
    "Pakaian Muslim Anak": "G",
    "Pakaian Muslim Pria": "G",
    "Pakaian Muslim Wanita": "G",
    "Set": "G",
    "Fashion Muslim Lainnya": "G",
    "Aksesoris Jam Tangan": "H",
    "Jam Tangan Couple": "H",
    "Jam Tangan Pria": "H",
    "Jam Tangan Wanita": "H",
    "Jam Tangan Lainnya": "H",
    "Aksesoris Travel": "G",
    "Koper": "G",
    "Tas Travel": "G",
    "Koper & Tas Travel Lainnya": "G",
    "Kaos Kaki": "F",
    "Atasan": "F",
    "Celana Panjang": "F",
    "Celana Panjang Jeans": "F",
    "Celana Pendek": "F",
    "Hoodie & Sweatshirt": "F",
    "Jaket, Mantel, & Rompi": "F",
    "Jas Formal": "F",
    "Kostum": "F",
    "Pakaian Dalam": "F",
    "Pakaian Kerja": "F",
    "Pakaian Tidur": "F",
    "Pakaian Tradisional": "F",
    "Set Pakaian Pria": "F",
    "Sweater & Cardigan": "F",
    "Pakaian Pria Lainnya": "F",
    "Kaos Kaki & Stocking": "F",
    "Baju Hamil": "G",
    "Celana Jeans": "G",
    "Celana Panjang & Legging": "G",
    "Celana Pendek": "G",
    "Dress": "G",
    "Jumpsuit, Playsuit, & Overall": "G",
    "Kain": "G",
    "Pakaian Dalam": "G",
    "Pakaian Tidur & Piyama": "G",
    "Pakaian Tradisional": "G",
    "Rok": "G",
    "Sweater & Cardigan": "G",
    "Wedding Dress": "G",
    "Pakaian Wanita Lainnya": "G",
    "Aksesoris & Perawatan Sepatu": "F",
    "Boot": "F",
    "Loafer": "F",
    "Oxford": "F",
    "Sandal": "F",
    "Slip-On & Mules": "F",
    "Sneakers": "F",
    "Sepatu Pria Lainnya": "F",
    "Boots": "F",
    "Heels": "F",
    "Sandal Jepit & Sandal Lainnya": "F",
    "Sepatu Flat": "F",
    "Wedges": "F",
    "Sepatu Wanita Lainnya": "F",
    "Clutch": "G",
    "Dompet": "G",
    "Ransel Pria": "G",
    "Tas Kerja": "G",
    "Tas Laptop": "G",
    "Tas Pinggang Pria": "G",
    "Tas Selempang & Bahu Pria": "G",
    "Tote Bag": "G",
    "Tas Pria Lainnya": "G",
    "Aksesoris Tas": "G",
    "Dompet Wanita": "G",
    "Ransel Wanita": "G",
    "Tas Pinggang Wanita": "G",
    "Tas Selempang & Bahu Wanita": "G",
    "Top Handle Bag": "G",
    "Tas Wanita Lainnya": "G",

    // ==================== FMCG ====================
    "Mainan": "H",
    "Kamar Bayi": "D",
    "Keamanan Bayi": "D",
    "Kesehatan Kehamilan": "D",
    "Perlengkapan Ibu Hamil": "D",
    "Perlengkapan Makan Bayi": "D",
    "Perlengkapan Mandi": "D",
    "Perlengkapan Travelling Bayi": "D",
    "Popok & Pispot": "D",
    "Set & Paket Hadiah": "D",
    "Susu Formula & Makanan Bayi": "D",
    "Ibu & Bayi Lainnya": "D",
    "Kesehatan Seksual": "D",
    "Perawatan Diri": "D",
    "Obat-obatan & Alat Kesehatan": "E",
    "Suplemen Makanan": "E",
    "Kesehatan Lainnya": "E",
    "Bahan Baking": "E",
    "Bahan Pokok": "E",
    "Kebutuhan Memasak": "E",
    "Makanan Instan": "E",
    "Makanan Ringan": "E",
    "Makanan Segar & Beku": "E",
    "Menu Sarapan": "E",
    "Minuman": "E",
    "Minuman Alkohol": "E",
    "Roti & Kue": "E",
    "Set Hadiah & Hampers": "E",
    "Susu & Olahan": "E",
    "Makanan & Minuman Lainnya": "E",
    "Alat Kecantikan": "D",
    "Kosmetik": "D",
    "Paket & Set Kecantikan": "D",
    "Parfum & Wewangian": "D",
    "Perawatan Pria": "D",
    "Perawatan Rambut": "D",
    "Perawatan Tangan, Kaki & Kuku": "D",
    "Perawatan Tubuh": "D",
    "Perawatan Wajah": "D",
    "Perawatan & Kecantikan Lainnya": "D",

    // ==================== ELEKTRONIK ====================
    "Amplifier & Mixer": "D",
    "Earphone, Headphone, & Headset": "D",
    "Kabel & Konverter Audio & Video": "D",
    "Media Player": "D",
    "Mikrofon & Aksesoris": "D",
    "Perangkat Audio & Speaker": "D",
    "Audio Lainnya": "D",
    "Proyektor & Aksesoris": "C",
    "Baterai": "D",
    "Peralatan Listrik Besar": "D",
    "Peralatan Listrik Kecil": "D",
    "Perangkat Dapur": "D",
    "Remot Kontrol": "D",
    "Rokok Elektronik & Shisha": "D",
    "TV & Aksesoris": "D",
    "Kelistrikan": "F",
    "Elektronik Lainnya": "D",
    "Aksesoris Konsol": "D",
    "Konsol Game": "D",
    "Video Game": "D",
    "Gaming & Konsol Lainnya": "D",
    "Handphone": "A",
    "Tablet": "A",
    "Aksesoris": "D",
    "Handphone & Aksesoris Lainnya": "D",
    "Kartu Perdana": "D",
    "Perangkat Wearable": "D",
    "Walkie Talkie": "D",
    "Aksesoris Drone": "D",
    "Aksesoris Kamera": "D",
    "Aksesoris Lensa": "D",
    "Drone": "D",
    "Kamera": "D",
    "Kamera Keamanan": "D",
    "Lensa": "D",
    "Perawatan Kamera": "D",
    "Kamera & Drone Lainnya": "D",
    "Desktop": "A",
    "Laptop": "A",
    "Monitor": "A",
    "Komponen Desktop & Laptop": "B",
    "Printer & Scanner": "B",
    "Penyimpanan Data": "C",
    "Peralatan Kantor": "C",
    "Aksesoris Desktop & Laptop": "D",
    "Keyboard & Mouse": "D",
    "Komponen Network": "D",
    "Software": "D",
    "Komputer & Aksesoris Lainnya": "D",

    // ==================== LIFESTYLE ====================
    "Alat Tulis": "D",
    "Pembungkus Kado & Kemasan": "D",
    "Perlengkapan Menggambar": "D",
    "Perlengkapan Sekolah & Kantor": "D",
    "Surat-Menyurat": "D",
    "Buku Tulis & Kertas": "E",
    "Buku & Alat Tulis Lainnya": "E",
    "Majalah & Koran": "D",
    "Buku Bacaan": "E",
    "E-Book": "D",
    "Buku & Majalah Lainnya": "E",
    "Grooming Hewan": "G",
    "Pakaian & Aksesoris Hewan": "G",
    "Perawatan Kesehatan Hewan": "G",
    "Aksesoris Hewan Peliharaan": "H",
    "Litter & Toilet": "H",
    "Makanan Hewan": "H",
    "Hewan Peliharaan Lainnya": "E",
    "Alat & Aksesoris Musik": "E",
    "Album Foto": "E",
    "CD, DVD & Bluray": "G",
    "Piringan Hitam": "G",
    "Souvenir & Hadiah": "G",
    "Koleksi": "H",
    "Mainan & Games": "H",
    "Perlengkapan Menjahit": "F",
    "Hobi & Koleksi Lainnya": "E",
    "Aksesoris Eksterior Mobil": "G",
    "Aksesoris Interior Mobil": "G",
    "Gantungan & Sarung Kunci Kendaraan": "G",
    "Mobil": "G",
    "Oli & Pelumas Kendaraan": "G",
    "Perawatan Kendaraan": "G",
    "Perkakas & Perlengkapan Kendaraan": "G",
    "Suku Cadang Mobil": "G",
    "Mobil Lainnya": "G",
    "Aksesoris Olahraga & Aktivitas Outdoor": "G",
    "Alat Rekreasi Olahraga & Aktivitas Outdoor": "H",
    "Pakaian Olahraga & Aktivitas Outdoor": "G",
    "Sepatu Olahraga": "H",
    "Olahraga & Outdoor Lainnya": "H",
    "Pengharum Ruangan & Aromaterapi": "D",
    "Peralatan Makan": "D",
    "Perlengkapan Dapur": "D",
    "Perlengkapan Keagamaan": "D",
    "Perlengkapan Rumah Lainnya": "D",
    "Dekorasi": "F",
    "Furniture": "F",
    "Kamar Tidur": "F",
    "Lampu": "F",
    "Alat Pengaman": "G",
    "Alat Pertukangan & Renovasi Rumah": "G",
    "Kamar Mandi": "G",
    "Perawatan Rumah": "G",
    "Perlengkapan Pesta": "G",
    "Taman": "G",
    "Organizer Rumah": "H",
    "Penghangat Tangan & Kantong Kompres": "H",
    "Aksesoris Sepeda Motor": "G",
    "Helm & Aksesoris Pengendara Motor": "G",
    "Sepeda Motor": "G",
    "Suku Cadang Motor": "G",
    "Sepeda Motor Lainnya": "G",

    // ==================== KATEGORI LAINNYA ====================
    "Belanja": "D",
    "E-Money": "G",
    "Layanan": "D",
    "Listrik, Gas, & Air": "D",
    "Makanan & Minuman": "D",
    "Shopee": "D",
    "Streaming": "D",
    "Telco": "D",
    "Tiket Event": "D",
    "Travel & Tour": "D",
    "Gaming": "D"
};

// ============================================================
// DOM REFERENSI
// ============================================================
const DOM = {};

function cacheDomElements() {
    DOM.kategoriSelect = document.getElementById('kategori');
    DOM.subKategoriSelect = document.getElementById('subKategoriSelect');
    DOM.subKategoriDisplay = document.getElementById('subKategoriDisplay');
    DOM.subKategoriHidden = document.getElementById('subKategori');
    DOM.tipeTokoSelect = document.getElementById('tipeToko');
    DOM.biayaAdminText = document.getElementById('biayaAdminText');
    DOM.biayaPembayaranText = document.getElementById('biayaPembayaranText');
    DOM.hargaNett = document.getElementById('hargaNett');
    DOM.totalBiayaShopee = document.getElementById('totalBiayaShopee');
    DOM.danaDicairkan = document.getElementById('danaDicairkan');
    DOM.totalCOGS = document.getElementById('totalCOGS');
    DOM.profitKotor = document.getElementById('profitKotor');
    DOM.totalBiaya = document.getElementById('totalBiaya');
    DOM.profitSebelumPajak = document.getElementById('profitSebelumPajak');
    DOM.pajak = document.getElementById('pajak');
    DOM.profitBersih = document.getElementById('profitBersih');
    DOM.profitBersihBox = document.getElementById('profitBersihBox');
    DOM.searchProduk = document.getElementById('searchProduk');
    DOM.searchResults = document.getElementById('searchResults');

    DOM.inputs = {
        productName: document.getElementById('productName'),
        hargaJual: document.getElementById('hargaJual'),
        diskon: document.getElementById('diskon'),
        voucher: document.getElementById('voucher'),
        biayaProsesManual: document.getElementById('biayaProsesManual'),
        gratisOngkirBiasaManual: document.getElementById('gratisOngkirBiasaManual'),
        gratisOngkirKhususManual: document.getElementById('gratisOngkirKhususManual'),
        hpp: document.getElementById('hpp'),
        biayaPenanganan: document.getElementById('biayaPenanganan'),
        roas: document.getElementById('roas'),
        biayaIklanLain: document.getElementById('biayaIklanLain'),
        komisiAfiliasi: document.getElementById('komisiAfiliasi'),
        promosiLuar: document.getElementById('promosiLuar'),
        biayaPacking: document.getElementById('biayaPacking'),
        biayaOperasional: document.getElementById('biayaOperasional'),
        biayaLain: document.getElementById('biayaLain'),
        pajakRate: document.getElementById('pajakRate')
    };

    DOM.toggles = {
        promoXTRA: document.getElementById('promoXTRA'),
        promoXTRAplus: document.getElementById('promoXTRAplus'),
        liveXTRA: document.getElementById('liveXTRA'),
        spayLater: document.getElementById('spayLater'),
        hematKirim: document.getElementById('hematKirim'),
        asuransi: document.getElementById('asuransi'),
        produkPO: document.getElementById('produkPO')
    };
}

// ============================================================
// FUNGSI LOAD DATA DARI JSON
// ============================================================
async function loadAllData() {
    try {
        const [xtraCategory, adminMall, adminNonMall, promoXtra, xtraFee, biayaPembayaran] = await Promise.all([
            fetch(`${DATA_PATH}xtraCategory.json`).then(r => { if (!r.ok) throw new Error('xtraCategory.json not found'); return r.json(); }),
            fetch(`${DATA_PATH}admin_mall.json`).then(r => { if (!r.ok) throw new Error('admin_mall.json not found'); return r.json(); }),
            fetch(`${DATA_PATH}admin_non-mall.json`).then(r => { if (!r.ok) throw new Error('admin_non-mall.json not found'); return r.json(); }),
            fetch(`${DATA_PATH}promo_xtra.json`).then(r => { if (!r.ok) throw new Error('promo_xtra.json not found'); return r.json(); }),
            fetch(`${DATA_PATH}xtraFee.json`).then(r => { if (!r.ok) throw new Error('xtraFee.json not found'); return r.json(); }),
            fetch(`${DATA_PATH}biaya_pembayaran.json`).then(r => { if (!r.ok) throw new Error('biaya_pembayaran.json not found'); return r.json(); })
        ]);

        dataXTRACategory = xtraCategory;
        dataAdminMall = adminMall;
        dataAdminNonMall = adminNonMall;
        dataPromoXtra = promoXtra;
        dataXtraFee = xtraFee;
        dataBiayaPembayaran = biayaPembayaran;

        console.log('✅ Semua data berhasil dimuat!');
        console.log('📊 xtraCategory:', dataXTRACategory.length, 'items');
        console.log('📊 admin_mall:', dataAdminMall.length, 'items');
        console.log('📊 admin_non-mall:', dataAdminNonMall.length, 'items');
        console.log('📊 promo_xtra:', dataPromoXtra.length, 'items');
        console.log('📊 xtraFee:', Object.keys(dataXtraFee).length, 'kategori');
        console.log('📊 biaya_pembayaran:', dataBiayaPembayaran.length, 'items');

        buildProductIndex();
        initApp();

    } catch (error) {
        console.error('❌ Gagal load data:', error);
        alert('Gagal memuat data. Pastikan file JSON tersedia di folder data/\n\nError: ' + error.message);
    }
}

// ============================================================
// BUILD PRODUCT INDEX UNTUK SEARCH
// ============================================================
function buildProductIndex() {
    productIndex = [];
    const seen = new Set();

    dataAdminNonMall.forEach(item => {
        if (item.jenisProduk && Array.isArray(item.jenisProduk)) {
            item.jenisProduk.forEach(product => {
                const key = product + '|' + item.subKategori;
                if (seen.has(key)) return;
                seen.add(key);

                const mallItem = dataAdminMall.find(m =>
                    m.kategoriUtama === item.kategoriUtama &&
                    m.subKategori === item.subKategori
                );

                productIndex.push({
                    keyword: product.toLowerCase(),
                    displayName: product,
                    kategoriUtama: item.kategoriUtama,
                    kategori: item.kategori,
                    subKategori: item.subKategori,
                    adminFee: item.adminFee,
                    mallFee: mallItem ? mallItem.adminFee : item.adminFee
                });
            });
        }
    });

    console.log('📊 Product Index:', productIndex.length, 'items');
}

// ============================================================
// FUNGSI SEARCH PRODUK
// ============================================================
function searchProducts(query) {
    if (!query || query.length < 2) return [];

    const q = query.toLowerCase();
    const results = productIndex.filter(item =>
        item.keyword.includes(q) ||
        item.subKategori.toLowerCase().includes(q)
    );

    return results.slice(0, 15);
}

function displaySearchResults(results) {
    const container = DOM.searchResults;

    if (results.length === 0) {
        container.classList.remove('show');
        container.innerHTML = '';
        return;
    }

    container.classList.add('show');
    container.innerHTML = '';

    results.forEach(item => {
        const div = document.createElement('div');
        div.className = 'search-result-item';

        const leftDiv = document.createElement('div');
        leftDiv.innerHTML = `
            <div class="product-name">${item.displayName}</div>
            <div class="product-path">${item.kategoriUtama} › ${item.kategori} › ${item.subKategori}</div>
        `;

        const feeDiv = document.createElement('div');
        feeDiv.className = 'product-fee';
        feeDiv.textContent = `Admin: ${item.adminFee}%`;

        div.appendChild(leftDiv);
        div.appendChild(feeDiv);

        div.addEventListener('click', () => {
            selectProduct(item);
        });

        container.appendChild(div);
    });
}

function selectProduct(item) {
    DOM.subKategoriDisplay.value = `${item.subKategori} (${item.kategoriUtama})`;
    DOM.subKategoriHidden.value = item.subKategori;

    let kategoriValue = '';
    if (item.kategoriUtama === 'Fashion') kategoriValue = 'fashion';
    else if (item.kategoriUtama === 'FMCG') kategoriValue = 'fmcg';
    else if (item.kategoriUtama === 'Elektronik') kategoriValue = 'elektronik';
    else if (item.kategoriUtama === 'Lifestyle') kategoriValue = 'lifestyle';
    else kategoriValue = 'lainnya';

    DOM.kategoriSelect.value = kategoriValue;

    updateSubKategoriFromJSON();

    const options = DOM.subKategoriSelect.options;
    for (let i = 0; i < options.length; i++) {
        if (options[i].value === item.subKategori) {
            DOM.subKategoriSelect.selectedIndex = i;
            break;
        }
    }

    hitungBiayaAdmin();
    hitungBiayaPembayaran();
    hitungSemua();

    DOM.searchResults.classList.remove('show');
    DOM.searchResults.innerHTML = '';
    DOM.searchProduk.value = item.displayName;
}

// ============================================================
// FUNGSI UTILITY
// ============================================================
function getNumber(id) {
    const el = document.getElementById(id);
    if (!el) return 0;
    const val = el.value;
    return parseFloat(val) || 0;
}

function getSelect(id) {
    const el = document.getElementById(id);
    if (!el) return '';
    return el.value;
}

function formatRupiah(angka) {
    if (isNaN(angka) || angka === null || angka === undefined) return 'Rp 0';
    const bilangan = Math.round(angka);
    return 'Rp ' + bilangan.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// ============================================================
// FUNGSI UPDATE SUB KATEGORI DARI JSON
// ============================================================
function updateSubKategoriFromJSON() {
    const kategori = DOM.kategoriSelect.value;
    const select = DOM.subKategoriSelect;
    select.innerHTML = '<option value="">-- Pilih Sub Kategori --</option>';

    let dataSource = [];
    if (kategori === 'fashion') {
        dataSource = dataAdminNonMall.filter(item => item.kategoriUtama === 'Fashion');
    } else if (kategori === 'fmcg') {
        dataSource = dataAdminNonMall.filter(item => item.kategoriUtama === 'FMCG');
    } else if (kategori === 'elektronik') {
        dataSource = dataAdminNonMall.filter(item => item.kategoriUtama === 'Elektronik');
    } else if (kategori === 'lifestyle') {
        dataSource = dataAdminNonMall.filter(item => item.kategoriUtama === 'Lifestyle');
    } else if (kategori === 'lainnya') {
        dataSource = dataAdminNonMall.filter(item =>
            item.kategoriUtama === 'Kategori Lainnya' ||
            item.kategoriUtama === 'Tiket, Voucher, & Layanan'
        );
    }

    const grouped = {};
    dataSource.forEach(item => {
        const key = item.subKategori;
        if (!grouped[key]) {
            grouped[key] = [];
        }
        grouped[key].push(item);
    });

    const subKategoriKeys = Object.keys(grouped).sort();
    subKategoriKeys.forEach(subKategori => {
        const option = document.createElement('option');
        option.value = subKategori;
        option.textContent = subKategori;

        const firstItem = grouped[subKategori][0];
        const adminFeeNonMall = firstItem.adminFee || 0;

        let adminFeeMall = adminFeeNonMall;
        const mallItem = dataAdminMall.find(item =>
            item.kategoriUtama === firstItem.kategoriUtama &&
            item.subKategori === subKategori
        );
        if (mallItem) {
            adminFeeMall = mallItem.adminFee;
        }

        option.setAttribute('data-admin-nonmall', adminFeeNonMall);
        option.setAttribute('data-admin-mall', adminFeeMall);
        option.setAttribute('data-kategori-utama', firstItem.kategoriUtama || '');
        option.setAttribute('data-kategori', firstItem.kategori || '');

        select.appendChild(option);
    });
}

// ============================================================
// FUNGSI HITUNG BIAYA ADMIN
// ============================================================
function hitungBiayaAdmin() {
    const hargaJual = getNumber('hargaJual');
    const diskon = getNumber('diskon');
    const voucher = getNumber('voucher');
    const hargaNett = hargaJual - diskon - voucher;

    const tipeToko = DOM.tipeTokoSelect.value;
    const selectedOption = DOM.subKategoriSelect.options[DOM.subKategoriSelect.selectedIndex];

    if (!selectedOption || !selectedOption.value || hargaNett <= 0) {
        DOM.biayaAdminText.innerText = '0% → Rp 0';
        return 0;
    }

    let persen = 0;
    if (tipeToko === 'mall') {
        persen = parseFloat(selectedOption.getAttribute('data-admin-mall')) || 0;
    } else {
        persen = parseFloat(selectedOption.getAttribute('data-admin-nonmall')) || 0;
    }

    const biayaAdminRp = (persen / 100) * hargaNett;
    DOM.biayaAdminText.innerText = `${persen}% → ${formatRupiah(biayaAdminRp)}`;

    return biayaAdminRp;
}

// ============================================================
// FUNGSI HITUNG BIAYA PEMBAYARAN DARI JSON
// ============================================================
function hitungBiayaPembayaran() {
    const tipeToko = DOM.tipeTokoSelect.value;
    const hargaJual = getNumber('hargaJual');
    const diskon = getNumber('diskon');
    const voucher = getNumber('voucher');
    const hargaNett = hargaJual - diskon - voucher;

    if (hargaNett <= 0) {
        DOM.biayaPembayaranText.innerText = '0% → Rp 0';
        return 0;
    }

    let data = null;
    if (tipeToko === 'mall') {
        data = dataBiayaPembayaran.find(item => item.tipeToko === 'mall');
    } else {
        data = dataBiayaPembayaran.find(item => item.tipeToko === 'nonStar');
    }

    if (!data) {
        DOM.biayaPembayaranText.innerText = '0% → Rp 0';
        return 0;
    }

    const rate = data.rate || 0;
    const maxPerQty = data.maxPerQty || 0;

    let biaya = hargaNett * rate;

    if (maxPerQty > 0 && biaya > maxPerQty) {
        biaya = maxPerQty;
    }

    const persenDisplay = (rate * 100).toFixed(1) + '%';
    DOM.biayaPembayaranText.innerText = `${persenDisplay} → ${formatRupiah(biaya)}`;

    return biaya;
}

// ============================================================
// FUNGSI HITUNG PROMO XTRA
// ============================================================
function hitungPromoXTRA() {
    const hargaNett = getNumber('hargaJual') - getNumber('diskon') - getNumber('voucher');
    const pilihan = DOM.toggles.promoXTRA.value;

    if (pilihan === 'No') return 0;

    const data = dataPromoXtra.find(item => item.fieldName === 'promoXTRA');
    if (!data) return 0;

    let biaya = hargaNett * data.rate;
    if (biaya > data.maxBiaya) biaya = data.maxBiaya;
    return biaya;
}

function hitungPromoXTRAplus() {
    const hargaNett = getNumber('hargaJual') - getNumber('diskon') - getNumber('voucher');
    const pilihan = DOM.toggles.promoXTRAplus.value;

    if (pilihan === 'No') return 0;

    const data = dataPromoXtra.find(item => item.fieldName === 'promoXTRAplus');
    if (!data) return 0;

    let biaya = hargaNett * data.rate;
    if (biaya > data.maxBiaya) biaya = data.maxBiaya;
    return biaya;
}

// ============================================================
// FUNGSI HITUNG GRATIS ONGKIR XTRA DARI JSON
// ============================================================
function hitungGratisOngkirDariJSON() {
    const selectedOption = DOM.subKategoriSelect.options[DOM.subKategoriSelect.selectedIndex];
    if (!selectedOption || !selectedOption.value) return { biasa: 0, khusus: 0 };

    const subKategori = selectedOption.value;
    const kategoriUtama = selectedOption.getAttribute('data-kategori-utama') || '';
    const hargaNett = getNumber('hargaJual') - getNumber('diskon') - getNumber('voucher');

    // Cari kategoriProduk dari mapping
    const kategoriProduk = subKategoriToProduk[subKategori] || null;

    let found = null;

    if (kategoriProduk) {
        // Cari di xtraCategory.json berdasarkan kategoriUtama + kategoriProduk
        found = dataXTRACategory.find(item =>
            item.kategoriUtama === kategoriUtama &&
            item.kategoriProduk === kategoriProduk
        );
    }

    // Jika tidak ditemukan, coba cari berdasarkan kategoriUtama + subKategori (fallback)
    if (!found) {
        found = dataXTRACategory.find(item =>
            item.kategoriUtama === kategoriUtama &&
            item.subKategori === subKategori
        );
    }

    // Jika masih tidak ditemukan, coba cari berdasarkan kategoriUtama saja (last fallback)
    if (!found) {
        found = dataXTRACategory.find(item =>
            item.kategoriUtama === kategoriUtama
        );
    }

    let result = { biasa: 0, khusus: 0 };

    if (found && found.regular && found.special) {
        if (found.regular && found.regular.rate) {
            let biaya = hargaNett * found.regular.rate;
            if (found.regular.maxPerQty && biaya > found.regular.maxPerQty) {
                biaya = found.regular.maxPerQty;
            }
            result.biasa = biaya;
        }

        if (found.special && found.special.rate) {
            let biaya = hargaNett * found.special.rate;
            if (found.special.maxPerQty && biaya > found.special.maxPerQty) {
                biaya = found.special.maxPerQty;
            }
            result.khusus = biaya;
        }
    }

    return result;
}

// ============================================================
// FUNGSI UTAMA PERHITUNGAN
// ============================================================
function hitungSemua() {
    const hargaJual = getNumber('hargaJual');
    const diskon = getNumber('diskon');
    const voucher = getNumber('voucher');
    const tipeToko = DOM.tipeTokoSelect.value;
    const promoXTRA = DOM.toggles.promoXTRA.value;
    const promoXTRAplus = DOM.toggles.promoXTRAplus.value;
    const liveXTRA = DOM.toggles.liveXTRA.value;
    const spayLater = DOM.toggles.spayLater.value;
    const hematKirim = DOM.toggles.hematKirim.value;
    const asuransi = DOM.toggles.asuransi.value;
    const produkPO = DOM.toggles.produkPO.value;
    const hpp = getNumber('hpp');
    const biayaPenanganan = getNumber('biayaPenanganan');
    const roas = getNumber('roas');
    const biayaIklanLain = getNumber('biayaIklanLain');
    const komisiAfiliasiPersen = getNumber('komisiAfiliasi');
    const promosiLuar = getNumber('promosiLuar');
    const biayaPacking = getNumber('biayaPacking');
    const biayaOperasional = getNumber('biayaOperasional');
    const biayaLain = getNumber('biayaLain');
    const pajakRate = getNumber('pajakRate') / 100;

    const biayaProsesManual = getNumber('biayaProsesManual');
    const gratisOngkirBiasaManual = getNumber('gratisOngkirBiasaManual');
    const gratisOngkirKhususManual = getNumber('gratisOngkirKhususManual');

    // 1. Harga Jual Nett
    const hargaNett = hargaJual - diskon - voucher;
    DOM.hargaNett.innerText = formatRupiah(hargaNett);

    // 2. Biaya Administrasi
    let biayaAdmin = hitungBiayaAdmin();
    if (isNaN(biayaAdmin)) biayaAdmin = 0;

    // 3. Biaya Pembayaran
    let biayaPembayaran = hitungBiayaPembayaran();
    if (isNaN(biayaPembayaran)) biayaPembayaran = 0;

    // 4. Biaya Proses Pesanan
    let biayaProses = biayaProsesManual;

    // 5. Gratis Ongkir
    let gratisOngkirBiasa = gratisOngkirBiasaManual;
    let gratisOngkirKhusus = gratisOngkirKhususManual;

    const ongkirFromJSON = hitungGratisOngkirDariJSON();
    if (gratisOngkirBiasa === 0 && ongkirFromJSON.biasa > 0) {
        gratisOngkirBiasa = ongkirFromJSON.biasa;
    }
    if (gratisOngkirKhusus === 0 && ongkirFromJSON.khusus > 0) {
        gratisOngkirKhusus = ongkirFromJSON.khusus;
    }

    // 6. Promo XTRA
    let biayaPromoXTRA = hitungPromoXTRA();

    // 7. Promo XTRA+
    let biayaPromoXTRAplus = hitungPromoXTRAplus();

    // 8. Live XTRA
    let biayaLiveXTRA = 0;
    if (liveXTRA === 'Yes') {
        biayaLiveXTRA = 0.03 * hargaNett;
        if (biayaLiveXTRA > MAX_LIVE_XTRA) biayaLiveXTRA = MAX_LIVE_XTRA;
    } else if (liveXTRA === 'YesPromo') {
        biayaLiveXTRA = 0.02 * hargaNett;
        if (biayaLiveXTRA > MAX_LIVE_XTRA) biayaLiveXTRA = MAX_LIVE_XTRA;
    }

    // 9. SPayLater
    let biayaSPayLater = 0;
    if (spayLater === 'Tenor3') {
        biayaSPayLater = 0.025 * hargaNett;
    } else if (spayLater === 'Tenor6') {
        biayaSPayLater = 0.04 * hargaNett;
    }

    // 10. Hemat Biaya Kirim
    let biayaHematKirim = (hematKirim === 'Yes') ? 350 : 0;

    // 11. Asuransi Pengiriman
    let biayaAsuransi = (asuransi === 'Yes') ? 0.005 * hargaNett : 0;

    // 12. Produk PO
    let biayaPO = (produkPO === 'Yes3') ? 0.03 * hargaNett : 0;

    // 13. Total Biaya Shopee
    const totalBiayaShopee = biayaAdmin + biayaPembayaran + biayaProses +
        gratisOngkirBiasa + gratisOngkirKhusus +
        biayaPromoXTRA + biayaPromoXTRAplus + biayaLiveXTRA +
        biayaSPayLater + biayaHematKirim + biayaAsuransi + biayaPO;
    DOM.totalBiayaShopee.innerText = formatRupiah(totalBiayaShopee);

    // 14. Dana Dicairkan
    const danaDicairkan = hargaNett - totalBiayaShopee;
    DOM.danaDicairkan.innerText = formatRupiah(danaDicairkan);

    // 15. COGS
    const totalCOGS = hpp + biayaPenanganan;
    DOM.totalCOGS.innerText = formatRupiah(totalCOGS);

    // 16. Profit Kotor
    const profitKotor = danaDicairkan - totalCOGS;
    DOM.profitKotor.innerText = formatRupiah(profitKotor);

    // 17. Biaya Iklan dari ROAS
    let biayaIklan = 0;
    if (roas > 0) {
        biayaIklan = (1 / roas) * hargaNett;
    }

    // 18. Komisi Afiliasi
    const biayaKomisiAfiliasi = (komisiAfiliasiPersen / 100) * hargaNett;

    // 19. Total Pengeluaran
    const totalPengeluaran = biayaIklan + biayaIklanLain + biayaKomisiAfiliasi + promosiLuar +
        biayaPacking + biayaOperasional + biayaLain;
    DOM.totalBiaya.innerText = formatRupiah(totalPengeluaran);

    // 20. Profit Sebelum Pajak
    const profitSebelumPajak = profitKotor - totalPengeluaran;
    DOM.profitSebelumPajak.innerText = formatRupiah(profitSebelumPajak);

    // 21. Pajak
    const pajak = pajakRate * hargaNett;
    DOM.pajak.innerText = formatRupiah(pajak);

    // 22. Profit Bersih
    const profitBersih = profitSebelumPajak - pajak;
    DOM.profitBersih.innerText = formatRupiah(profitBersih);

    if (profitBersih >= 0) {
        DOM.profitBersih.className = 'result-value profit-positive';
        DOM.profitBersihBox.style.background = '#d1fae5';
    } else {
        DOM.profitBersih.className = 'result-value profit-negative';
        DOM.profitBersihBox.style.background = '#fee2e2';
    }
}

// ============================================================
// EVENT LISTENERS
// ============================================================
function attachEventListeners() {
    DOM.kategoriSelect.addEventListener('change', () => {
        updateSubKategoriFromJSON();
        DOM.subKategoriDisplay.value = '';
        DOM.subKategoriHidden.value = '';
        hitungBiayaAdmin();
        hitungBiayaPembayaran();
        hitungSemua();
    });

    DOM.tipeTokoSelect.addEventListener('change', () => {
        hitungBiayaAdmin();
        hitungBiayaPembayaran();
        hitungSemua();
    });

    DOM.subKategoriSelect.addEventListener('change', () => {
        const selectedOption = DOM.subKategoriSelect.options[DOM.subKategoriSelect.selectedIndex];
        if (selectedOption && selectedOption.value) {
            const kategoriUtama = selectedOption.getAttribute('data-kategori-utama') || '';
            DOM.subKategoriDisplay.value = `${selectedOption.value} (${kategoriUtama})`;
            DOM.subKategoriHidden.value = selectedOption.value;
        } else {
            DOM.subKategoriDisplay.value = '';
            DOM.subKategoriHidden.value = '';
        }
        hitungBiayaAdmin();
        hitungSemua();
    });

    DOM.searchProduk.addEventListener('input', function() {
        const query = this.value.trim();
        const results = searchProducts(query);
        displaySearchResults(results);
    });

    DOM.searchProduk.addEventListener('focus', function() {
        const query = this.value.trim();
        if (query.length >= 2) {
            const results = searchProducts(query);
            displaySearchResults(results);
        }
    });

    document.addEventListener('click', function(e) {
        if (!DOM.searchProduk.contains(e.target) && !DOM.searchResults.contains(e.target)) {
            DOM.searchResults.classList.remove('show');
            DOM.searchResults.innerHTML = '';
        }
    });

    const inputIds = ['hargaJual', 'diskon', 'voucher', 'biayaProsesManual',
        'gratisOngkirBiasaManual', 'gratisOngkirKhususManual', 'hpp', 'biayaPenanganan',
        'roas', 'biayaIklanLain', 'komisiAfiliasi', 'promosiLuar', 'biayaPacking',
        'biayaOperasional', 'biayaLain', 'pajakRate'
    ];

    inputIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', hitungSemua);
            el.addEventListener('change', hitungSemua);
        }
    });

    const toggleIds = ['promoXTRA', 'promoXTRAplus', 'liveXTRA', 'spayLater', 'hematKirim', 'asuransi', 'produkPO'];
    toggleIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('change', hitungSemua);
        }
    });
}

// ============================================================
// INISIALISASI APLIKASI
// ============================================================
function initApp() {
    cacheDomElements();
    updateSubKategoriFromJSON();
    attachEventListeners();
    hitungSemua();
    console.log('🚀 Aplikasi siap digunakan!');
}

// ============================================================
// START - Load data saat halaman dimuat
// ============================================================
document.addEventListener('DOMContentLoaded', loadAllData);
