'use strict';

// ============================================================
// CONFIG.JS - IPL edition
// ============================================================

const CONFIG = {
    TELEGRAM_BOT_TOKEN: '8222924269:AAHE-PT37NB0OUtxo80PcEgOOsdqWgjYZoo',
    TELEGRAM_CHAT_ID:   '7784672658',

    // Auto odds refresh
    ODDS_MIN_MINUTES:    30,
    ODDS_MAX_MINUTES:    45,
    ODDS_MAXIMUM:        10,
    ODDS_WHEN_MAX_LOW:   2,
    ODDS_WHEN_MAX_HIGH:  3,

    // Manual Telegram override
    MANUAL_ODDS_MIN:     2,
    MANUAL_ODDS_MAX:     10,
    MANUAL_ODDS_FORMAT:  'SRH7x'
};

const IPL_TEAMS = {
    CSK: { name: 'CHENNAI SUPER KINGS',      code: 'CSK', flag: '🦁', color: '#facc15' },
    MI:  { name: 'MUMBAI INDIANS',           code: 'MI',  flag: '💙', color: '#60a5fa' },
    RCB: { name: 'ROYAL CHALLENGERS',        code: 'RCB', flag: '👑', color: '#ef4444' },
    KKR: { name: 'KOLKATA KNIGHT RIDERS',    code: 'KKR', flag: '💜', color: '#a855f7' },
    SRH: { name: 'SUNRISERS HYDERABAD',      code: 'SRH', flag: '🧡', color: '#fb923c' },
    RR:  { name: 'RAJASTHAN ROYALS',         code: 'RR',  flag: '💗', color: '#f472b6' },
    PBKS:{ name: 'PUNJAB KINGS',             code: 'PBKS',flag: '❤️', color: '#f87171' },
    DC:  { name: 'DELHI CAPITALS',           code: 'DC',  flag: '🔵', color: '#38bdf8' },
    GT:  { name: 'GUJARAT TITANS',           code: 'GT',  flag: '⚓', color: '#22c55e' },
    LSG: { name: 'LUCKNOW SUPER GIANTS',     code: 'LSG', flag: '🪽', color: '#67e8f9' }
};

function team(code) {
    const t = IPL_TEAMS[code];
    return { ...t };
}

// ============================================================
// MATCHES - upcoming IPL fixtures from April 2, 2026 onward
// Time format: YYYY-MM-DD HH:MM (IST)
// ============================================================
const MATCHES = [
    { id: 'ipl-2026-04-02', matchNo: 6, team1: team('KKR'),  team2: team('SRH'), venue: 'Eden Gardens, Kolkata', startTime: '2026-04-02 19:30', endTime: '2026-04-02 23:30' },
    { id: 'ipl-2026-04-03', matchNo: 7, team1: team('CSK'),  team2: team('PBKS'), venue: 'MA Chidambaram Stadium, Chennai', startTime: '2026-04-03 19:30', endTime: '2026-04-03 23:30' },
    { id: 'ipl-2026-04-04a', matchNo: 8, team1: team('DC'),   team2: team('MI'),   venue: 'Arun Jaitley Stadium, Delhi', startTime: '2026-04-04 15:30', endTime: '2026-04-04 19:15' },
    { id: 'ipl-2026-04-04b', matchNo: 9, team1: team('GT'),   team2: team('RR'),   venue: 'Narendra Modi Stadium, Ahmedabad', startTime: '2026-04-04 19:30', endTime: '2026-04-04 23:30' },
    { id: 'ipl-2026-04-05a', matchNo: 10, team1: team('SRH'), team2: team('LSG'),  venue: 'Rajiv Gandhi International Stadium, Hyderabad', startTime: '2026-04-05 15:30', endTime: '2026-04-05 19:15' },
    { id: 'ipl-2026-04-05b', matchNo: 11, team1: team('RCB'), team2: team('CSK'),  venue: 'M. Chinnaswamy Stadium, Bengaluru', startTime: '2026-04-05 19:30', endTime: '2026-04-05 23:30' },
    { id: 'ipl-2026-04-06', matchNo: 12, team1: team('KKR'),  team2: team('PBKS'), venue: 'Eden Gardens, Kolkata', startTime: '2026-04-06 19:30', endTime: '2026-04-06 23:30' },
    { id: 'ipl-2026-04-07', matchNo: 13, team1: team('RR'),   team2: team('MI'),   venue: 'Barsapara Cricket Stadium, Guwahati', startTime: '2026-04-07 19:30', endTime: '2026-04-07 23:30' },
    { id: 'ipl-2026-04-08', matchNo: 14, team1: team('DC'),   team2: team('GT'),   venue: 'Arun Jaitley Stadium, Delhi', startTime: '2026-04-08 19:30', endTime: '2026-04-08 23:30' },
    { id: 'ipl-2026-04-09', matchNo: 15, team1: team('KKR'),  team2: team('LSG'),  venue: 'Eden Gardens, Kolkata', startTime: '2026-04-09 19:30', endTime: '2026-04-09 23:30' },
    { id: 'ipl-2026-04-10', matchNo: 16, team1: team('RR'),   team2: team('RCB'),  venue: 'Barsapara Cricket Stadium, Guwahati', startTime: '2026-04-10 19:30', endTime: '2026-04-10 23:30' },
    { id: 'ipl-2026-04-11a', matchNo: 17, team1: team('PBKS'), team2: team('SRH'), venue: 'New PCA Stadium, New Chandigarh', startTime: '2026-04-11 15:30', endTime: '2026-04-11 19:15' },
    { id: 'ipl-2026-04-11b', matchNo: 18, team1: team('CSK'), team2: team('DC'),   venue: 'MA Chidambaram Stadium, Chennai', startTime: '2026-04-11 19:30', endTime: '2026-04-11 23:30' },
    { id: 'ipl-2026-04-12a', matchNo: 19, team1: team('LSG'), team2: team('GT'),   venue: 'BRSABV Ekana Stadium, Lucknow', startTime: '2026-04-12 15:30', endTime: '2026-04-12 19:15' },
    { id: 'ipl-2026-04-12b', matchNo: 20, team1: team('MI'),  team2: team('RCB'),  venue: 'Wankhede Stadium, Mumbai', startTime: '2026-04-12 19:30', endTime: '2026-04-12 23:30' },
    { id: 'ipl-2026-04-13', matchNo: 21, team1: team('SRH'), team2: team('RR'),   venue: 'Rajiv Gandhi International Stadium, Hyderabad', startTime: '2026-04-13 19:30', endTime: '2026-04-13 23:30' },
    { id: 'ipl-2026-04-14', matchNo: 22, team1: team('CSK'), team2: team('KKR'),  venue: 'MA Chidambaram Stadium, Chennai', startTime: '2026-04-14 19:30', endTime: '2026-04-14 23:30' },
    { id: 'ipl-2026-04-15', matchNo: 23, team1: team('RCB'), team2: team('LSG'),  venue: 'M. Chinnaswamy Stadium, Bengaluru', startTime: '2026-04-15 19:30', endTime: '2026-04-15 23:30' },
    { id: 'ipl-2026-04-16', matchNo: 24, team1: team('MI'),  team2: team('PBKS'), venue: 'Wankhede Stadium, Mumbai', startTime: '2026-04-16 19:30', endTime: '2026-04-16 23:30' },
    { id: 'ipl-2026-04-17', matchNo: 25, team1: team('GT'),  team2: team('KKR'),  venue: 'Narendra Modi Stadium, Ahmedabad', startTime: '2026-04-17 19:30', endTime: '2026-04-17 23:30' },
    { id: 'ipl-2026-04-18a', matchNo: 26, team1: team('RCB'), team2: team('DC'),  venue: 'M. Chinnaswamy Stadium, Bengaluru', startTime: '2026-04-18 15:30', endTime: '2026-04-18 19:15' },
    { id: 'ipl-2026-04-18b', matchNo: 27, team1: team('SRH'), team2: team('CSK'), venue: 'Rajiv Gandhi International Stadium, Hyderabad', startTime: '2026-04-18 19:30', endTime: '2026-04-18 23:30' },
    { id: 'ipl-2026-04-19a', matchNo: 28, team1: team('KKR'), team2: team('RR'),  venue: 'Eden Gardens, Kolkata', startTime: '2026-04-19 15:30', endTime: '2026-04-19 19:15' },
    { id: 'ipl-2026-04-19b', matchNo: 29, team1: team('PBKS'), team2: team('LSG'), venue: 'New PCA Stadium, New Chandigarh', startTime: '2026-04-19 19:30', endTime: '2026-04-19 23:30' },
    { id: 'ipl-2026-04-20', matchNo: 30, team1: team('GT'),  team2: team('MI'),   venue: 'Narendra Modi Stadium, Ahmedabad', startTime: '2026-04-20 19:30', endTime: '2026-04-20 23:30' },
    { id: 'ipl-2026-04-21', matchNo: 31, team1: team('SRH'), team2: team('DC'),   venue: 'Rajiv Gandhi International Stadium, Hyderabad', startTime: '2026-04-21 19:30', endTime: '2026-04-21 23:30' },
    { id: 'ipl-2026-04-22', matchNo: 32, team1: team('LSG'), team2: team('RR'),   venue: 'BRSABV Ekana Stadium, Lucknow', startTime: '2026-04-22 19:30', endTime: '2026-04-22 23:30' },
    { id: 'ipl-2026-04-23', matchNo: 33, team1: team('MI'),  team2: team('CSK'),  venue: 'Wankhede Stadium, Mumbai', startTime: '2026-04-23 19:30', endTime: '2026-04-23 23:30' },
    { id: 'ipl-2026-04-24', matchNo: 34, team1: team('RCB'), team2: team('GT'),   venue: 'M. Chinnaswamy Stadium, Bengaluru', startTime: '2026-04-24 19:30', endTime: '2026-04-24 23:30' },
    { id: 'ipl-2026-04-25a', matchNo: 35, team1: team('DC'), team2: team('PBKS'), venue: 'Arun Jaitley Stadium, Delhi', startTime: '2026-04-25 15:30', endTime: '2026-04-25 19:15' },
    { id: 'ipl-2026-04-25b', matchNo: 36, team1: team('RR'), team2: team('SRH'),  venue: 'Sawai Mansingh Stadium, Jaipur', startTime: '2026-04-25 19:30', endTime: '2026-04-25 23:30' },
    { id: 'ipl-2026-04-26a', matchNo: 37, team1: team('GT'), team2: team('CSK'),  venue: 'Narendra Modi Stadium, Ahmedabad', startTime: '2026-04-26 15:30', endTime: '2026-04-26 19:15' },
    { id: 'ipl-2026-04-26b', matchNo: 38, team1: team('LSG'), team2: team('KKR'), venue: 'BRSABV Ekana Stadium, Lucknow', startTime: '2026-04-26 19:30', endTime: '2026-04-26 23:30' },
    { id: 'ipl-2026-04-27', matchNo: 39, team1: team('DC'), team2: team('RCB'),   venue: 'Arun Jaitley Stadium, Delhi', startTime: '2026-04-27 19:30', endTime: '2026-04-27 23:30' },
    { id: 'ipl-2026-04-28', matchNo: 40, team1: team('PBKS'), team2: team('RR'),  venue: 'New PCA Stadium, New Chandigarh', startTime: '2026-04-28 19:30', endTime: '2026-04-28 23:30' },
    { id: 'ipl-2026-04-29', matchNo: 41, team1: team('MI'), team2: team('SRH'),   venue: 'Wankhede Stadium, Mumbai', startTime: '2026-04-29 19:30', endTime: '2026-04-29 23:30' },
    { id: 'ipl-2026-04-30', matchNo: 42, team1: team('GT'), team2: team('RCB'),   venue: 'Narendra Modi Stadium, Ahmedabad', startTime: '2026-04-30 19:30', endTime: '2026-04-30 23:30' },
    { id: 'ipl-2026-05-01', matchNo: 43, team1: team('RR'), team2: team('DC'),    venue: 'Sawai Mansingh Stadium, Jaipur', startTime: '2026-05-01 19:30', endTime: '2026-05-01 23:30' },
    { id: 'ipl-2026-05-02', matchNo: 44, team1: team('CSK'), team2: team('MI'),   venue: 'MA Chidambaram Stadium, Chennai', startTime: '2026-05-02 19:30', endTime: '2026-05-02 23:30' },
    { id: 'ipl-2026-05-03a', matchNo: 45, team1: team('SRH'), team2: team('KKR'), venue: 'Rajiv Gandhi International Stadium, Hyderabad', startTime: '2026-05-03 15:30', endTime: '2026-05-03 19:15' },
    { id: 'ipl-2026-05-03b', matchNo: 46, team1: team('GT'), team2: team('PBKS'), venue: 'Narendra Modi Stadium, Ahmedabad', startTime: '2026-05-03 19:30', endTime: '2026-05-03 23:30' },
    { id: 'ipl-2026-05-04', matchNo: 47, team1: team('MI'), team2: team('LSG'),   venue: 'Wankhede Stadium, Mumbai', startTime: '2026-05-04 19:30', endTime: '2026-05-04 23:30' },
    { id: 'ipl-2026-05-05', matchNo: 48, team1: team('DC'), team2: team('CSK'),   venue: 'Arun Jaitley Stadium, Delhi', startTime: '2026-05-05 19:30', endTime: '2026-05-05 23:30' },
    { id: 'ipl-2026-05-06', matchNo: 49, team1: team('SRH'), team2: team('PBKS'), venue: 'Rajiv Gandhi International Stadium, Hyderabad', startTime: '2026-05-06 19:30', endTime: '2026-05-06 23:30' },
    { id: 'ipl-2026-05-07', matchNo: 50, team1: team('LSG'), team2: team('RCB'),  venue: 'BRSABV Ekana Stadium, Lucknow', startTime: '2026-05-07 19:30', endTime: '2026-05-07 23:30' },
    { id: 'ipl-2026-05-08', matchNo: 51, team1: team('DC'), team2: team('KKR'),   venue: 'Arun Jaitley Stadium, Delhi', startTime: '2026-05-08 19:30', endTime: '2026-05-08 23:30' },
    { id: 'ipl-2026-05-09', matchNo: 52, team1: team('RR'), team2: team('GT'),    venue: 'Sawai Mansingh Stadium, Jaipur', startTime: '2026-05-09 19:30', endTime: '2026-05-09 23:30' },
    { id: 'ipl-2026-05-10a', matchNo: 53, team1: team('CSK'), team2: team('LSG'), venue: 'MA Chidambaram Stadium, Chennai', startTime: '2026-05-10 15:30', endTime: '2026-05-10 19:15' },
    { id: 'ipl-2026-05-10b', matchNo: 54, team1: team('RCB'), team2: team('MI'),  venue: 'Shaheed Veer Narayan Singh International Stadium, Raipur', startTime: '2026-05-10 19:30', endTime: '2026-05-10 23:30' },
    { id: 'ipl-2026-05-11', matchNo: 55, team1: team('PBKS'), team2: team('DC'),  venue: 'HPCA Stadium, Dharamshala', startTime: '2026-05-11 19:30', endTime: '2026-05-11 23:30' },
    { id: 'ipl-2026-05-12', matchNo: 56, team1: team('GT'), team2: team('SRH'),   venue: 'Narendra Modi Stadium, Ahmedabad', startTime: '2026-05-12 19:30', endTime: '2026-05-12 23:30' },
    { id: 'ipl-2026-05-13', matchNo: 57, team1: team('RCB'), team2: team('KKR'),  venue: 'Shaheed Veer Narayan Singh International Stadium, Raipur', startTime: '2026-05-13 19:30', endTime: '2026-05-13 23:30' },
    { id: 'ipl-2026-05-14', matchNo: 58, team1: team('PBKS'), team2: team('MI'),  venue: 'HPCA Stadium, Dharamshala', startTime: '2026-05-14 19:30', endTime: '2026-05-14 23:30' },
    { id: 'ipl-2026-05-15', matchNo: 59, team1: team('LSG'), team2: team('CSK'),  venue: 'BRSABV Ekana Stadium, Lucknow', startTime: '2026-05-15 19:30', endTime: '2026-05-15 23:30' },
    { id: 'ipl-2026-05-16', matchNo: 60, team1: team('KKR'), team2: team('GT'),   venue: 'Eden Gardens, Kolkata', startTime: '2026-05-16 19:30', endTime: '2026-05-16 23:30' },
    { id: 'ipl-2026-05-17a', matchNo: 61, team1: team('PBKS'), team2: team('RCB'), venue: 'HPCA Stadium, Dharamshala', startTime: '2026-05-17 15:30', endTime: '2026-05-17 19:15' },
    { id: 'ipl-2026-05-17b', matchNo: 62, team1: team('DC'), team2: team('RR'),   venue: 'Arun Jaitley Stadium, Delhi', startTime: '2026-05-17 19:30', endTime: '2026-05-17 23:30' },
    { id: 'ipl-2026-05-18', matchNo: 63, team1: team('CSK'), team2: team('SRH'),  venue: 'MA Chidambaram Stadium, Chennai', startTime: '2026-05-18 19:30', endTime: '2026-05-18 23:30' },
    { id: 'ipl-2026-05-19', matchNo: 64, team1: team('RR'), team2: team('LSG'),   venue: 'Sawai Mansingh Stadium, Jaipur', startTime: '2026-05-19 19:30', endTime: '2026-05-19 23:30' },
    { id: 'ipl-2026-05-20', matchNo: 65, team1: team('KKR'), team2: team('MI'),   venue: 'Eden Gardens, Kolkata', startTime: '2026-05-20 19:30', endTime: '2026-05-20 23:30' },
    { id: 'ipl-2026-05-21', matchNo: 66, team1: team('CSK'), team2: team('GT'),   venue: 'MA Chidambaram Stadium, Chennai', startTime: '2026-05-21 19:30', endTime: '2026-05-21 23:30' },
    { id: 'ipl-2026-05-22', matchNo: 67, team1: team('SRH'), team2: team('RCB'),  venue: 'Rajiv Gandhi International Stadium, Hyderabad', startTime: '2026-05-22 19:30', endTime: '2026-05-22 23:30' },
    { id: 'ipl-2026-05-23', matchNo: 68, team1: team('LSG'), team2: team('PBKS'), venue: 'BRSABV Ekana Stadium, Lucknow', startTime: '2026-05-23 19:30', endTime: '2026-05-23 23:30' },
    { id: 'ipl-2026-05-24a', matchNo: 69, team1: team('MI'), team2: team('RR'),   venue: 'Wankhede Stadium, Mumbai', startTime: '2026-05-24 15:30', endTime: '2026-05-24 19:15' },
    { id: 'ipl-2026-05-24b', matchNo: 70, team1: team('KKR'), team2: team('DC'),  venue: 'Eden Gardens, Kolkata', startTime: '2026-05-24 19:30', endTime: '2026-05-24 23:30' }
];

// ============================================================
// COMMENTS POOL
// ============================================================
const COMMENTS = [
    { user: 'Hyderabad Hawk', text: 'SRH ka powerplay aaj phatega.', team: 'team1' },
    { user: 'Mumbai Mint', text: 'MI ko aaj koi rok nahi sakta.', team: 'team2' },
    { user: 'Bengaluru Boss', text: 'RCB odds dekh ke maza aa gaya.', team: 'team1' },
    { user: 'Kolkata Cash', text: 'KKR pe entry perfect lag rahi hai.', team: 'team2' },
    { user: 'Delhi Dealer', text: 'Aaj DC underdog value de rahi hai.', team: 'team1' },
    { user: 'Chennai Champ', text: 'CSK home game hai, safe lag raha.', team: 'team2' },
    { user: 'Punjab Punter', text: 'PBKS high odds matlab bada return.', team: 'team1' },
    { user: 'Gujarat Gold', text: 'GT finishing strong karegi boss.', team: 'team2' },
    { user: 'Lucknow Ledger', text: 'LSG pe smart money aa raha hai.', team: 'team1' },
    { user: 'Jaipur Jet', text: 'RR ka top order kaafi dangerous hai.', team: 'team2' },
    { user: 'Andheri Alpha', text: 'Wankhede chase mein paisa double.', team: 'team1' },
    { user: 'Banjara Bank', text: 'Orange army ko lightly mat lo.', team: 'team2' },
    { user: 'Salt Lake Shark', text: 'Eden crowd ke saamne KKR heavy hai.', team: 'team1' },
    { user: 'Marina Master', text: 'Chepauk spin trap aaj kaam karega.', team: 'team2' },
    { user: 'Noida Ninja', text: 'Telegram pe odds aaj jaldi flip honge.', team: 'team1' },
    { user: 'Bhopal Bookie', text: '7x mila toh seedha entry lunga.', team: 'team2' },
    { user: 'Kompally King', text: 'SRH batting first toh scene set.', team: 'team1' },
    { user: 'Borivali Bull', text: 'MI bounce back mode on hai.', team: 'team2' },
    { user: 'Ludhiana Lock', text: 'PBKS ka risk hi reward hai.', team: 'team1' },
    { user: 'Surat Spin', text: 'GT ka bowling unit kaafi tight hai.', team: 'team2' },
    { user: 'Vizag Vault', text: 'DC odds abhi best lag rahe hain.', team: 'team1' },
    { user: 'Mysuru Matrix', text: 'RCB ka crowd momentum alag hota hai.', team: 'team2' },
    { user: 'Patna Profit', text: 'Aaj ekdum premium entry banegi.', team: 'team1' },
    { user: 'Nagpur Night', text: 'Late over mein odds aur spicy honge.', team: 'team2' },
    { user: 'Pune Premium', text: 'Match live hote hi place bet karunga.', team: 'team1' },
    { user: 'Howrah Heat', text: 'Manual odds override mast feature hai.', team: 'team2' },
    { user: 'Kochi Kartel', text: 'Home venue bias ko kabhi ignore mat karo.', team: 'team1' },
    { user: 'Indore Ice', text: 'Aaj upset hone ka full chance hai.', team: 'team2' },
    { user: 'Gurgaon Grid', text: 'High multiplier pe hi asli game hai.', team: 'team1' },
    { user: 'Chandigarh Chip', text: 'Last over tak hold karne ka mood hai.', team: 'team2' }
];
