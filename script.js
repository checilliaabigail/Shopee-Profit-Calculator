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
    // Set nama produk yang dipilih
    DOM.searchProduk.value = item.displayName;

    // Set sub kategori display
    DOM.subKategoriDisplay.value = `${item.subKategori} (${item.kategoriUtama})`;
    DOM.subKategoriHidden.value = item.subKategori;

    // Set kategori
    let kategoriValue = '';
    if (item.kategoriUtama === 'Fashion') kategoriValue = 'fashion';
    else if (item.kategoriUtama === 'FMCG') kategoriValue = 'fmcg';
    else if (item.kategoriUtama === 'Elektronik') kategoriValue = 'elektronik';
    else if (item.kategoriUtama === 'Lifestyle') kategoriValue = 'lifestyle';
    else kategoriValue = 'lainnya';

    DOM.kategoriSelect.value = kategoriValue;

    // Update sub kategori dropdown
    updateSubKategoriFromJSON();

    // Pilih sub kategori yang sesuai
    const options = DOM.subKategoriSelect.options;
    for (let i = 0; i < options.length; i++) {
        if (options[i].value === item.subKategori) {
            DOM.subKategoriSelect.selectedIndex = i;
            break;
        }
    }

    // Hitung ulang SEMUA
    hitungBiayaAdmin();
    hitungBiayaPembayaran();
    hitungSemua();

    // Sembunyikan hasil search
    DOM.searchResults.classList.remove('show');
    DOM.searchResults.innerHTML = '';
}

// ============================================================
// FUNGSI UTILITY
// ============================================================
function getNumber(id) {
    const el = document.getElementById(id);
    if (!el) return 0;
    const val = el.value;
    if (val === '' || val === null || val === undefined) return 0;
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
// FUNGSI RESET FORM
// ============================================================
function resetForm() {
    const inputIds = [
        'productName', 'hargaJual', 'diskon', 'voucher',
        'biayaProsesManual', 'gratisOngkirBiasaManual', 'gratisOngkirKhususManual',
        'hpp', 'biayaPenanganan', 'roas', 'biayaIklanLain',
        'komisiAfiliasi', 'promosiLuar', 'biayaPacking', 'biayaOperasional',
        'biayaLain', 'pajakRate'
    ];

    inputIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            if (el.type === 'text' || el.type === 'number') {
                el.value = '';
            }
        }
    });

    DOM.kategoriSelect.value = 'fashion';
    DOM.tipeTokoSelect.value = 'nonStar';
    DOM.subKategoriSelect.innerHTML = '<option value="">-- Pilih Sub Kategori --</option>';
    DOM.subKategoriDisplay.value = '';
    DOM.subKategoriHidden.value = '';
    DOM.searchProduk.value = '';
    DOM.searchResults.classList.remove('show');
    DOM.searchResults.innerHTML = '';

    DOM.toggles.promoXTRA.value = 'No';
    DOM.toggles.promoXTRAplus.value = 'No';
    DOM.toggles.liveXTRA.value = 'No';
    DOM.toggles.spayLater.value = 'No';
    DOM.toggles.hematKirim.value = 'No';
    DOM.toggles.asuransi.value = 'No';
    DOM.toggles.produkPO.value = 'No';

    updateSubKategoriFromJSON();
    console.log('🔄 Form telah direset!');
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
// FUNGSI HITUNG BIAYA PEMBAYARAN
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
    let productName = DOM.searchProduk.value.trim();

    if (!productName) {
        const displayText = DOM.subKategoriDisplay.value;
        const match = displayText.match(/^(.+?)\s*\(/);
        if (match) {
            productName = match[1].trim();
        }
    }

    if (!productName) {
        const selectedOption = DOM.subKategoriSelect.options[DOM.subKategoriSelect.selectedIndex];
        if (selectedOption && selectedOption.value) {
            const productData = dataAdminNonMall.find(item => item.subKategori === selectedOption.value);
            if (productData && productData.jenisProduk && productData.jenisProduk.length > 0) {
                productName = productData.jenisProduk[0];
            }
        }
    }

    const selectedOption = DOM.subKategoriSelect.options[DOM.subKategoriSelect.selectedIndex];
    const subKategori = selectedOption ? selectedOption.value : '';
    const kategoriUtama = selectedOption ? selectedOption.getAttribute('data-kategori-utama') || '' : '';
    const hargaNett = getNumber('hargaJual') - getNumber('diskon') - getNumber('voucher');

    if (hargaNett <= 0) {
        return { biasa: 0, khusus: 0 };
    }

    let found = null;

    // STRATEGI 1: Cari berdasarkan nama produk
    if (productName && productName.length > 0) {
        found = dataXTRACategory.find(item => {
            if (item.jenisProduk && Array.isArray(item.jenisProduk)) {
                return item.jenisProduk.some(p =>
                    p.toLowerCase() === productName.toLowerCase() ||
                    p.toLowerCase().includes(productName.toLowerCase())
                );
            }
            return false;
        });
        if (found) {
            console.log('✅ XTRA ditemukan via nama produk:', productName, '→', found.subKategori);
        }
    }

    // STRATEGI 2: Cari via sub kategori (exact match)
    if (!found && subKategori) {
        found = dataXTRACategory.find(item =>
            item.kategoriUtama === kategoriUtama &&
            item.subKategori === subKategori
        );
        if (found) {
            console.log('✅ XTRA ditemukan via subKategori exact match:', found.subKategori);
        }
    }

    // STRATEGI 3: Partial match di sub kategori
    if (!found && subKategori) {
        const keywords = subKategori.toLowerCase().split(/[()\-,\s]+/).filter(w => w.length > 3);
        for (const keyword of keywords) {
            found = dataXTRACategory.find(item =>
                item.kategoriUtama === kategoriUtama &&
                item.subKategori.toLowerCase().includes(keyword)
            );
            if (found) break;
        }
        if (found) {
            console.log('✅ XTRA ditemukan via partial match subKategori:', found.subKategori);
        }
    }

    // STRATEGI 4: Fallback ke kategori utama
    if (!found && kategoriUtama) {
        found = dataXTRACategory.find(item =>
            item.kategoriUtama === kategoriUtama
        );
        if (found) {
            console.log('⚠️ XTRA fallback ke kategori utama:', found.subKategori);
        }
    }

    if (!found) {
        console.log('❌ TIDAK ADA data XTRA untuk:', productName || subKategori);
        return { biasa: 0, khusus: 0 };
    }

    let result = { biasa: 0, khusus: 0 };

    if (found.regular && found.regular.rate) {
        let biaya = hargaNett * found.regular.rate;
        if (found.regular.maxPerQty && biaya > found.regular.maxPerQty) {
            biaya = found.regular.maxPerQty;
        }
        result.biasa = biaya;
        console.log('✅ XTRA Regular:', (found.regular.rate * 100) + '% → Rp' + biaya.toLocaleString());
    }

    if (found.special && found.special.rate) {
        let biaya = hargaNett * found.special.rate;
        if (found.special.maxPerQty && biaya > found.special.maxPerQty) {
            biaya = found.special.maxPerQty;
        }
        result.khusus = biaya;
        console.log('✅ XTRA Special:', (found.special.rate * 100) + '% → Rp' + biaya.toLocaleString());
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

    // ⚠️ UPDATE INPUT DENGAN NILAI DARI JSON ⚠️
    if (gratisOngkirBiasa === 0 && ongkirFromJSON.biasa > 0) {
        gratisOngkirBiasa = ongkirFromJSON.biasa;
        // Isi input dengan nilai yang dihitung
        document.getElementById('gratisOngkirBiasaManual').value = Math.round(gratisOngkirBiasa);
    }
    if (gratisOngkirKhusus === 0 && ongkirFromJSON.khusus > 0) {
        gratisOngkirKhusus = ongkirFromJSON.khusus;
        // Isi input dengan nilai yang dihitung
        document.getElementById('gratisOngkirKhususManual').value = Math.round(gratisOngkirKhusus);
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

    DOM.subKategoriSelect.addEventListener('change', function() {
        const selectedOption = this.options[this.selectedIndex];
        if (selectedOption && selectedOption.value) {
            const kategoriUtama = selectedOption.getAttribute('data-kategori-utama') || '';
            DOM.subKategoriDisplay.value = `${selectedOption.value} (${kategoriUtama})`;
            DOM.subKategoriHidden.value = selectedOption.value;

            const productData = dataAdminNonMall.find(item => item.subKategori === selectedOption.value);
            if (productData && productData.jenisProduk && productData.jenisProduk.length > 0) {
                DOM.searchProduk.value = productData.jenisProduk[0];
            }
        } else {
            DOM.subKategoriDisplay.value = '';
            DOM.subKategoriHidden.value = '';
            DOM.searchProduk.value = '';
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
    resetForm();
    attachEventListeners();
    hitungSemua();
    console.log('🚀 Aplikasi siap digunakan!');
}

// ============================================================
// START - Load data saat halaman dimuat
// ============================================================
document.addEventListener('DOMContentLoaded', loadAllData);
