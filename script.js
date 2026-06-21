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
let dataXtraFee = {};

// ============================================================
// DOM REFERENSI
// ============================================================
const DOM = {};

function cacheDomElements() {
    DOM.kategoriSelect = document.getElementById('kategori');
    DOM.subKategoriSelect = document.getElementById('subKategori');
    DOM.tipeTokoSelect = document.getElementById('tipeToko');
    DOM.biayaAdminText = document.getElementById('biayaAdminText');
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
    
    // Semua input
    DOM.inputs = {
        productName: document.getElementById('productName'),
        hargaJual: document.getElementById('hargaJual'),
        diskon: document.getElementById('diskon'),
        voucher: document.getElementById('voucher'),
        biayaPembayaranManual: document.getElementById('biayaPembayaranManual'),
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
        const [xtraCategory, adminMall, adminNonMall, promoXtra, xtraFee] = await Promise.all([
            fetch(`${DATA_PATH}xtraCategory.json`).then(r => { if (!r.ok) throw new Error('xtraCategory.json not found'); return r.json(); }),
            fetch(`${DATA_PATH}admin_mall.json`).then(r => { if (!r.ok) throw new Error('admin_mall.json not found'); return r.json(); }),
            fetch(`${DATA_PATH}admin_non-mall.json`).then(r => { if (!r.ok) throw new Error('admin_non-mall.json not found'); return r.json(); }),
            fetch(`${DATA_PATH}promo_xtra.json`).then(r => { if (!r.ok) throw new Error('promo_xtra.json not found'); return r.json(); }),
            fetch(`${DATA_PATH}xtraFee.json`).then(r => { if (!r.ok) throw new Error('xtraFee.json not found'); return r.json(); })
        ]);
        
        dataXTRACategory = xtraCategory;
        dataAdminMall = adminMall;
        dataAdminNonMall = adminNonMall;
        dataPromoXtra = promoXtra;
        dataXtraFee = xtraFee;
        
        console.log('✅ Semua data berhasil dimuat!');
        console.log('📊 xtraCategory:', dataXTRACategory.length, 'items');
        console.log('📊 admin_mall:', dataAdminMall.length, 'items');
        console.log('📊 admin_non-mall:', dataAdminNonMall.length, 'items');
        console.log('📊 promo_xtra:', dataPromoXtra.length, 'items');
        console.log('📊 xtraFee:', Object.keys(dataXtraFee).length, 'kategori');
        
        // Inisialisasi aplikasi setelah data dimuat
        initApp();
        
    } catch (error) {
        console.error('❌ Gagal load data:', error);
        alert('Gagal memuat data. Pastikan file JSON tersedia di folder data/\n\nError: ' + error.message);
    }
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
    DOM.subKategoriSelect.innerHTML = '<option value="">-- Pilih Sub Kategori --</option>';
    
    // Filter data berdasarkan kategori utama dari admin_non-mall.json
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
    
    // Group by subKategori
    const grouped = {};
    dataSource.forEach(item => {
        const key = item.subKategori;
        if (!grouped[key]) {
            grouped[key] = [];
        }
        grouped[key].push(item);
    });
    
    // Tambahkan ke dropdown
    const subKategoriKeys = Object.keys(grouped).sort();
    subKategoriKeys.forEach(subKategori => {
        const option = document.createElement('option');
        option.value = subKategori;
        option.textContent = subKategori;
        
        // Ambil admin fee dari data pertama
        const firstItem = grouped[subKategori][0];
        const adminFeeNonMall = firstItem.adminFee || 0;
        
        // Cari admin fee mall dari file admin_mall.json
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
        
        DOM.subKategoriSelect.appendChild(option);
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
    
    const kategoriUtama = selectedOption.getAttribute('data-kategori-utama') || '';
    const subKategori = selectedOption.value;
    const hargaNett = getNumber('hargaJual') - getNumber('diskon') - getNumber('voucher');
    
    // Cari di xtraCategory.json berdasarkan kategoriUtama dan subKategori
    let found = dataXTRACategory.find(item => 
        item.kategoriUtama === kategoriUtama && 
        item.subKategori === subKategori
    );
    
    let result = { biasa: 0, khusus: 0 };
    
    if (found && found.regular && found.special) {
        // Hitung biaya gratis ongkir biasa
        if (found.regular && found.regular.rate) {
            let biaya = hargaNett * found.regular.rate;
            if (found.regular.maxPerQty && biaya > found.regular.maxPerQty) {
                biaya = found.regular.maxPerQty;
            }
            result.biasa = biaya;
        }
        
        // Hitung biaya gratis ongkir khusus
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
    // Ambil semua input user
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
    
    // INPUT MANUAL untuk biaya yang belum otomatis
    const biayaPembayaranManual = getNumber('biayaPembayaranManual');
    const biayaProsesManual = getNumber('biayaProsesManual');
    const gratisOngkirBiasaManual = getNumber('gratisOngkirBiasaManual');
    const gratisOngkirKhususManual = getNumber('gratisOngkirKhususManual');
    
    // 1. Harga Jual Nett
    const hargaNett = hargaJual - diskon - voucher;
    DOM.hargaNett.innerText = formatRupiah(hargaNett);
    
    // 2. Biaya Administrasi (otomatis dari pilihan sub kategori)
    let biayaAdmin = hitungBiayaAdmin();
    if (isNaN(biayaAdmin)) biayaAdmin = 0;
    
    // 3. Biaya Pembayaran (input manual)
    let biayaPembayaran = biayaPembayaranManual;
    
    // 4. Biaya Proses Pesanan (input manual)
    let biayaProses = biayaProsesManual;
    
    // 5. Gratis Ongkir (gabungan dari manual + JSON)
    let gratisOngkirBiasa = gratisOngkirBiasaManual;
    let gratisOngkirKhusus = gratisOngkirKhususManual;
    
    // Coba ambil dari JSON jika manual bernilai 0
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
    
    // 13. Total Biaya Shopee (SUM SEMUA)
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
    
    // Ubah warna berdasarkan profit
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
    // Kategori & Tipe Toko
    DOM.kategoriSelect.addEventListener('change', () => {
        updateSubKategoriFromJSON();
        hitungSemua();
    });
    
    DOM.tipeTokoSelect.addEventListener('change', () => {
        hitungBiayaAdmin();
        hitungSemua();
    });
    
    DOM.subKategoriSelect.addEventListener('change', () => {
        hitungBiayaAdmin();
        hitungSemua();
    });
    
    // Semua input number
    const inputIds = ['hargaJual', 'diskon', 'voucher', 'biayaPembayaranManual', 'biayaProsesManual', 
                      'gratisOngkirBiasaManual', 'gratisOngkirKhususManual', 'hpp', 'biayaPenanganan', 
                      'roas', 'biayaIklanLain', 'komisiAfiliasi', 'promosiLuar', 'biayaPacking', 
                      'biayaOperasional', 'biayaLain', 'pajakRate'];
    
    inputIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', hitungSemua);
            el.addEventListener('change', hitungSemua);
        }
    });
    
    // Semua toggle select
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
