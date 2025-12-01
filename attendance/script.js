/**
 * GSC BNCC ATTENDANCE SYSTEM
 * Fully Optimized, Responsive, & Interactive
 */

// Global State
let membersData = [];
let paradesData = [];
let sortedParades = []; // Currently displayed parades (sorted/filtered)
let fullLeaderboardData = [];
let visibleParadesCount = 0;
let isRosterExpanded = false;

// Configs
const medals = {
    gold: `<div class="relative w-8 h-8 md:w-10 md:h-10 flex justify-center items-center"><svg class="w-full h-full drop-shadow-md" viewBox="0 0 24 24" fill="none"><path d="M12 15C15.866 15 19 11.866 19 8C19 4.13401 15.866 1 12 1C8.13401 1 5 4.13401 5 8C5 11.866 8.13401 15 12 15Z" fill="#FFD700"/><path d="M12 15V23L15 20L18 23V15H12Z" fill="#DAA520"/><path d="M12 15H6V23L9 20L12 23V15Z" fill="#DAA520"/><circle cx="12" cy="8" r="4" fill="#FFF7CC" opacity="0.5"/><text x="12" y="10" font-size="6" font-weight="bold" fill="#B8860B" text-anchor="middle">1</text></svg></div>`,
    silver: `<div class="relative w-8 h-8 md:w-10 md:h-10 flex justify-center items-center"><svg class="w-full h-full drop-shadow-md" viewBox="0 0 24 24" fill="none"><path d="M12 15C15.866 15 19 11.866 19 8C19 4.13401 15.866 1 12 1C8.13401 1 5 4.13401 5 8C5 11.866 8.13401 15 12 15Z" fill="#C0C0C0"/><path d="M12 15V23L15 20L18 23V15H12Z" fill="#A9A9A9"/><path d="M12 15H6V23L9 20L12 23V15Z" fill="#A9A9A9"/><circle cx="12" cy="8" r="4" fill="#FFFFFF" opacity="0.5"/><text x="12" y="10" font-size="6" font-weight="bold" fill="#707070" text-anchor="middle">2</text></svg></div>`,
    bronze: `<div class="relative w-8 h-8 md:w-10 md:h-10 flex justify-center items-center"><svg class="w-full h-full drop-shadow-md" viewBox="0 0 24 24" fill="none"><path d="M12 15C15.866 15 19 11.866 19 8C19 4.13401 15.866 1 12 1C8.13401 1 5 4.13401 5 8C5 11.866 8.13401 15 12 15Z" fill="#CD7F32"/><path d="M12 15V23L15 20L18 23V15H12Z" fill="#A0522D"/><path d="M12 15H6V23L9 20L12 23V15Z" fill="#A0522D"/><circle cx="12" cy="8" r="4" fill="#FFDAB9" opacity="0.5"/><text x="12" y="10" font-size="6" font-weight="bold" fill="#8B4513" text-anchor="middle">3</text></svg></div>`
};

const icons = {
    cadet: `<div class="h-8 w-8 md:h-10 md:w-10 flex-shrink-0 bg-bnccDark/10 rounded-full flex items-center justify-center text-bnccDark relative"><svg class="w-5 h-5 md:w-6 md:h-6 fill-current" viewBox="0 0 100 100"><g transform="translate(50,50)"><g transform="rotate(-45)"><path d="M-3 25 L0 35 L3 25 L-3 25 Z" fill="currentColor"/><rect x="-3" y="15" width="6" height="10" fill="currentColor"/><rect x="-4" y="-15" width="8" height="30" fill="currentColor"/><path d="M-5 -15 L-5 -35 Q0 -40 5 -35 L5 -15 Z" fill="currentColor"/><rect x="2" y="-32" width="1.5" height="15" rx="0.5" fill="currentColor" opacity="0.8"/></g><g transform="rotate(45)"><path d="M-3 25 L0 35 L3 25 L-3 25 Z" fill="currentColor"/><rect x="-3" y="15" width="6" height="10" fill="currentColor"/><rect x="-4" y="-15" width="8" height="30" fill="currentColor"/><path d="M-5 -15 L-5 -35 Q0 -40 5 -35 L5 -15 Z" fill="currentColor"/><rect x="2" y="-32" width="1.5" height="15" rx="0.5" fill="currentColor" opacity="0.8"/></g></g></svg></div>`,
    lance_cpl: `<div class="h-8 w-8 md:h-10 md:w-10 flex-shrink-0 bg-bnccGreen/10 rounded-full flex items-center justify-center text-bnccGreen"><i data-lucide="chevron-down" class="w-5 h-5 md:w-6 md:h-6 stroke-[3px]"></i></div>`,
    corporal: `<div class="h-8 w-8 md:h-10 md:w-10 flex-shrink-0 bg-bnccGreen/10 rounded-full flex items-center justify-center text-bnccGreen"><div class="flex flex-col -space-y-1.5"><i data-lucide="chevron-down" class="w-4 h-4 md:w-5 md:h-5 stroke-[3px]"></i><i data-lucide="chevron-down" class="w-4 h-4 md:w-5 md:h-5 stroke-[3px]"></i></div></div>`,
    sergeant: `<div class="h-8 w-8 md:h-10 md:w-10 flex-shrink-0 bg-bnccGreen/10 rounded-full flex items-center justify-center text-bnccGreen"><div class="flex flex-col -space-y-1.5"><i data-lucide="chevron-down" class="w-3.5 h-3.5 md:w-4 md:h-4 stroke-[3px]"></i><i data-lucide="chevron-down" class="w-3.5 h-3.5 md:w-4 md:h-4 stroke-[3px]"></i><i data-lucide="chevron-down" class="w-3.5 h-3.5 md:w-4 md:h-4 stroke-[3px]"></i></div></div>`,
    cuo: `<div class="h-8 w-8 md:h-10 md:w-10 flex-shrink-0 bg-bnccGold/10 rounded-full flex items-center justify-center text-bnccGold"><svg class="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 5 C 19 5, 12 15, 6 20" /><path d="M4 22 L 6 20" /><line x1="4" y1="18" x2="8" y2="22" /><path d="M5 5 C 5 5, 12 15, 18 20" /><path d="M20 22 L 18 20" /><line x1="16" y1="22" x2="20" y2="18" /></svg></div>`,
    puo: `<div class="h-8 w-8 md:h-10 md:w-10 flex-shrink-0 bg-bnccRed/10 rounded-full flex items-center justify-center text-bnccRed"><i data-lucide="medal" class="w-5 h-5 md:w-6 md:h-6"></i></div>`
};

// ==========================================
// 1. INIT & FETCH
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
    if (typeof lucide !== 'undefined') lucide.createIcons();
    if (typeof AOS !== 'undefined') AOS.init({ once: true, offset: 50, duration: 600 });
    
    fetch('attendance.json')
        .then(response => {
            if (!response.ok) throw new Error("Could not load data");
            return response.json();
        })
        .then(data => {
            membersData = data.members;
            paradesData = data.parades;
            initApp();
        })
        .catch(err => {
            console.error("Error fetching data:", err);
            const main = document.querySelector('main');
            if(main) main.innerHTML = `<div class="text-center p-10 text-red-500 font-bold">Failed to load data. Please run on a local server.</div>`;
        });
});

function initApp() {
    const isMobile = window.innerWidth < 768;
    visibleParadesCount = isMobile ? 4 : 10;

    sortParades('latest');
    calculateLeaderboardData(); 
    
    renderLeaderboard(); 
    renderAttendanceGrid(); 
    updateGlobalStats();
    
    setupNavbar();
    setupButtons();
    setupFilters();
}

// ==========================================
// 2. LEADERBOARD LOGIC
// ==========================================
function calculateLeaderboardData() {
    const totalParades = paradesData.length;
    
    // 1. Calculate Stats
    let stats = membersData
        .filter(m => m.rank !== 'puo')
        .map(member => {
            let presentCount = 0;
            paradesData.forEach(parade => {
                if (parade.attendance && parade.attendance[member.id] === 1) presentCount++;
            });
            return {
                ...member,
                present: presentCount,
                total: totalParades,
                percentage: totalParades === 0 ? 0 : Math.round((presentCount / totalParades) * 100)
            };
        });

    // 2. Sort: % Desc -> Count Desc -> ID Asc (Lower ID first)
    stats.sort((a, b) => {
        if (b.percentage !== a.percentage) return b.percentage - a.percentage;
        if (b.present !== a.present) return b.present - a.present;
        return a.id - b.id; // Lower ID wins
    });

    // 3. Assign Ranking with Ties
    for (let i = 0; i < stats.length; i++) {
        if (i > 0) {
            const prev = stats[i - 1];
            const curr = stats[i];
            // If strict tie in performance
            if (prev.percentage === curr.percentage && prev.present === curr.present) {
                curr.displayRank = prev.displayRank;
            } else {
                curr.displayRank = i + 1; 
            }
        } else {
            stats[i].displayRank = 1;
        }
    }

    fullLeaderboardData = stats;
}

function renderLeaderboard() {
    const tbody = document.getElementById('leaderboard-body');
    if(!tbody) return;
    tbody.innerHTML = '';
    
    const isMobile = window.innerWidth < 768;
    let limit = isRosterExpanded ? fullLeaderboardData.length : (isMobile ? 5 : 10);
    
    fullLeaderboardData.slice(0, limit).forEach((item, index) => {
        let rankBadge = `<span class="font-bold text-gray-400 text-lg font-cinzel">#${item.displayRank}</span>`;
        
        if (item.displayRank === 1) rankBadge = medals.gold;
        else if (item.displayRank === 2) rankBadge = medals.silver;
        else if (item.displayRank === 3) rankBadge = medals.bronze;

        const row = `
            <tr class="hover:bg-gray-50 transition-colors group border-b border-gray-50 last:border-0 fade-in-row" style="animation-delay: ${index * 50}ms">
                <td class="px-6 py-4 text-center">${rankBadge}</td>
                <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                        ${icons[item.rank] || icons.cadet}
                        <div class="flex flex-col">
                            <span class="font-bold text-gray-700 font-sans group-hover:text-bnccGreen transition-colors text-sm md:text-base">${item.name}</span>
                            <span class="text-[10px] text-gray-400 md:hidden uppercase tracking-wider">${item.rankName}</span>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 hidden md:table-cell">
                    <span class="text-xs uppercase font-bold tracking-wider px-2 py-1 bg-gray-100 rounded text-gray-500">${item.rankName}</span>
                </td>
                <td class="px-6 py-4 text-center">
                    <span class="font-bold text-gray-800">${item.present}</span><span class="text-gray-400 text-xs">/${item.total}</span>
                </td>
                <td class="px-6 py-4 text-center">
                    <div class="flex items-center gap-2 justify-center">
                        <div class="w-16 md:w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div class="h-full ${getBarColor(item.percentage)}" style="width: ${item.percentage}%"></div>
                        </div>
                        <span class="text-xs font-bold w-8 text-right ${getTextColor(item.percentage)}">${item.percentage}%</span>
                    </div>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });

    // Update Top Performer Widget
    const topPerformerEl = document.getElementById('stat-top-performer');
    if(topPerformerEl && fullLeaderboardData.length > 0) {
        const topRankers = fullLeaderboardData.filter(m => m.displayRank === 1);
        // Sort top rankers by ID just in case, though main sort handles it
        topRankers.sort((a, b) => a.id - b.id);
        const names = topRankers.map(m => m.name.split(' ')[0]).join(', ');
        topPerformerEl.innerText = names;
        topPerformerEl.title = names;
    }

    if (typeof lucide !== 'undefined') lucide.createIcons();
}

// ==========================================
// 3. PARADE LOGIC
// ==========================================
function setupFilters() {
    const filterEl = document.getElementById('parade-filter');
    if(filterEl) {
        filterEl.addEventListener('change', (e) => {
            sortParades(e.target.value);
            const isMobile = window.innerWidth < 768;
            visibleParadesCount = isMobile ? 4 : 10;
            renderAttendanceGrid();
        });
    }
}

function sortParades(criteria) {
    if (criteria === 'latest') {
        sortedParades = [...paradesData].sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (criteria === 'highest') {
        sortedParades = [...paradesData].sort((a, b) => getParadePercentage(b) - getParadePercentage(a));
    } else if (criteria === 'lowest') {
        sortedParades = [...paradesData].sort((a, b) => getParadePercentage(a) - getParadePercentage(b));
    }
}

function getParadePercentage(parade) {
    const present = Object.values(parade.attendance || {}).filter(v => v === 1).length;
    const total = Object.values(parade.attendance || {}).length;
    return total === 0 ? 0 : (present / total) * 100;
}

function renderAttendanceGrid() {
    const grid = document.getElementById('attendance-grid');
    const loadMoreBtn = document.getElementById('btn-load-more');
    const noMoreMsg = document.getElementById('no-more-msg');
    
    if(!grid) return;
    grid.innerHTML = ''; 

    const paradesToShow = sortedParades.slice(0, visibleParadesCount);

    paradesToShow.forEach((parade, index) => {
        const dateParts = parade.date.split(' ');
        const dayNum = dateParts[0];
        const month = dateParts[1].replace(',', '');
        const year = dateParts[2];
        
        const percent = Math.round(getParadePercentage(parade));
        
        let badgeColor = "text-red-600 bg-red-50"; 
        if(percent >= 80) badgeColor = "text-green-600 bg-green-50"; 
        else if(percent >= 50) badgeColor = "text-yellow-600 bg-yellow-50"; 

        const card = `
            <div class="bg-white rounded-xl shadow-md overflow-hidden group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 flex flex-col fade-in-row" style="animation-delay: ${index * 100}ms">
                <div class="h-2 ${getColorByType(parade.type)} w-full group-hover:h-3 transition-all"></div>
                <div class="p-6 flex flex-col items-center text-center flex-1">
                    <span class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">${parade.type}</span>
                    <h2 class="text-5xl font-cinzel font-bold text-bnccDark mb-1">${dayNum}</h2>
                    <h3 class="text-xl text-bnccGold font-bold uppercase mb-4">${month}, ${year}</h3>
                    <div class="w-full flex justify-between items-center px-4 py-2 bg-gray-50 rounded-lg mb-6 text-xs font-sans mt-auto">
                        <span class="flex items-center gap-1 text-gray-500"><i data-lucide="calendar" class="w-3 h-3"></i> ${parade.day}</span>
                        <span class="font-bold px-2 py-1 rounded ${badgeColor}">${percent}% Present</span>
                    </div>
                    <button onclick="openReportModal('${parade.id}')" class="w-full py-3 border-2 border-bnccDark text-bnccDark font-bold uppercase text-sm tracking-wider rounded-lg hover:bg-bnccDark hover:text-white transition-all group-hover:shadow-lg flex items-center justify-center gap-2">
                        View Report <i data-lucide="arrow-right-circle" class="w-5 h-5"></i>
                    </button>
                </div>
            </div>
        `;
        grid.innerHTML += card;
    });

    if (visibleParadesCount >= sortedParades.length) {
        if(loadMoreBtn) loadMoreBtn.classList.add('hidden');
        if(noMoreMsg) noMoreMsg.classList.remove('hidden');
    } else {
        if(loadMoreBtn) loadMoreBtn.classList.remove('hidden');
        if(noMoreMsg) noMoreMsg.classList.add('hidden');
    }

    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function getColorByType(type) {
    if(type.includes('Regular')) return 'bg-bnccGreen';
    if(type.includes('Special')) return 'bg-bnccRed';
    return 'bg-bnccGold';
}

function getBarColor(percentage) {
    if (percentage >= 80) return 'bg-green-600';
    if (percentage >= 50) return 'bg-bnccGold';
    return 'bg-red-600';
}

function getTextColor(percentage) {
    if (percentage >= 80) return 'text-green-700';
    if (percentage >= 50) return 'text-bnccGold';
    return 'text-red-600';
}

// ==========================================
// 4. UI INTERACTIONS
// ==========================================
function setupButtons() {
    const rosterBtn = document.getElementById('btn-toggle-roster');
    if(rosterBtn) {
        rosterBtn.addEventListener('click', function() {
            isRosterExpanded = !isRosterExpanded;
            renderLeaderboard();
            if(isRosterExpanded) {
                this.innerHTML = `<span>Show Less</span> <i data-lucide="chevron-up" class="w-4 h-4"></i>`;
                this.classList.add('bg-bnccGreen', 'text-white');
                this.classList.remove('text-bnccGreen');
            } else {
                this.innerHTML = `<span>View Full Roster</span> <i data-lucide="chevron-down" class="w-4 h-4"></i>`;
                this.classList.remove('bg-bnccGreen', 'text-white');
                this.classList.add('text-bnccGreen');
                document.getElementById('leaderboard').scrollIntoView({ behavior: 'smooth' });
            }
            if (typeof lucide !== 'undefined') lucide.createIcons();
        });
    }

    const loadMoreBtn = document.getElementById('btn-load-more');
    if(loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            const originalText = this.innerHTML;
            this.innerHTML = `<svg class="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Loading...`;
            setTimeout(() => {
                visibleParadesCount += (window.innerWidth < 768 ? 4 : 10);
                renderAttendanceGrid();
                this.innerHTML = originalText;
                if (typeof lucide !== 'undefined') lucide.createIcons();
            }, 600);
        });
    }
}

function updateGlobalStats() {
    const elTotal = document.getElementById('stat-total-parades');
    const elAvg = document.getElementById('stat-avg-attendance');
    if(!elTotal || !elAvg) return;

    elTotal.innerText = paradesData.length.toString().padStart(2, '0');
    let totalPresent = 0;
    let totalPossible = 0;
    paradesData.forEach(p => {
        const total = Object.values(p.attendance || {}).length;
        const present = Object.values(p.attendance || {}).filter(v => v === 1).length;
        totalPresent += present;
        totalPossible += total;
    });
    const avg = totalPossible === 0 ? 0 : Math.round((totalPresent / totalPossible) * 100);
    elAvg.innerText = avg + "%";
}

let currentParadeId = null;
function openReportModal(paradeId) {
    currentParadeId = paradeId;
    const parade = paradesData.find(p => p.id === paradeId);
    if(!parade) return;

    document.getElementById('modalDate').innerText = parade.date;
    document.getElementById('modalType').innerText = parade.type;
    const present = Object.values(parade.attendance).filter(v => v === 1).length;
    const absent = Object.values(parade.attendance).filter(v => v === 0).length;
    document.getElementById('modalStats').innerText = `Total: ${present + absent} | Present: ${present} | Absent: ${absent}`;

    renderModalList(parade);
    document.getElementById('reportModal').showModal();
}

function renderModalList(parade, filterStatus = 'all', searchQuery = '') {
    const container = document.getElementById('modalList');
    if(!container) return;
    container.innerHTML = '';

    membersData.forEach(member => {
        const status = parade.attendance[member.id];
        const note = parade.notes[member.id] || '';
        const isPresent = status === 1;

        if(filterStatus === 'present' && !isPresent) return;
        if(filterStatus === 'absent' && isPresent) return;
        if(searchQuery && !member.name.toLowerCase().includes(searchQuery.toLowerCase())) return;

        const statusClass = isPresent 
            ? 'bg-green-50 text-green-700 border-green-200' 
            : 'bg-red-50 text-red-700 border-red-200';
        
        const item = `
            <div class="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div class="flex items-center gap-3">
                    ${icons[member.rank] || icons.cadet}
                    <div>
                        <h4 class="font-bold text-gray-800 text-sm font-sans">${member.name}</h4>
                        <p class="text-xs text-gray-400 uppercase tracking-wider">${member.rankName}</p>
                    </div>
                </div>
                <div class="text-right">
                    <span class="inline-block px-3 py-1 rounded-full text-xs font-bold border ${statusClass}">
                        ${isPresent ? 'Present' : 'Absent'}
                    </span>
                    ${note ? `<p class="text-[10px] text-red-400 mt-1 italic max-w-[80px] truncate">${note}</p>` : ''}
                </div>
            </div>
        `;
        container.innerHTML += item;
    });
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

// Modal Listeners
document.getElementById('searchMember')?.addEventListener('input', (e) => {
    if(currentParadeId) {
        const parade = paradesData.find(p => p.id === currentParadeId);
        renderModalList(parade, document.getElementById('filterStatus').value, e.target.value);
    }
});
document.getElementById('filterStatus')?.addEventListener('change', (e) => {
    if(currentParadeId) {
        const parade = paradesData.find(p => p.id === currentParadeId);
        renderModalList(parade, e.target.value, document.getElementById('searchMember').value);
    }
});
document.getElementById('reportModal')?.addEventListener('click', (e) => {
    const modal = document.getElementById('reportModal');
    const rect = modal.getBoundingClientRect();
    if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
        modal.close();
    }
});

function setupNavbar() {
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('glass-nav', 'py-2');
            navbar.classList.remove('py-4');
        } else {
            navbar.classList.remove('glass-nav', 'py-2');
            navbar.classList.add('py-4');
        }
    });
    const btn = document.getElementById('mobile-btn');
    const menu = document.getElementById('mobile-menu');
    if(btn && menu){
        btn.addEventListener('click', () => {
            menu.classList.toggle('hidden');
            const icon = menu.classList.contains('hidden') ? 'menu' : 'x';
            btn.innerHTML = `<i data-lucide="${icon}" class="w-8 h-8"></i>`;
            if (typeof lucide !== 'undefined') lucide.createIcons();
        });
    }
}