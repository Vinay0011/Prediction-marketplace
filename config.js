'use strict';

const CONFIG = {
  TELEGRAM_BOT_TOKEN: '8222924269:AAHE-PT37NB0OUtxo80PcEgOOsdqWgjYZoo',
  TELEGRAM_CHAT_ID: '7784672658',
  TEST_MODE: false,
  PAYMENT_QR_URL: 'https://i.ibb.co/DPTYXBL8/Screenshot-2026-04-03-111000.png',
  ODDS_MIN_MINUTES: 30,
  ODDS_MAX_MINUTES: 45,
  MANUAL_ODDS_MIN: 2,
  MANUAL_ODDS_MAX: 10,
  MANUAL_ODDS_FORMAT: 'SRH7x'
};

const IPL_TEAMS = {
  CSK: { code: 'CSK', name: 'Chennai Super Kings', flag: 'CSK', color: '#ffd447' },
  MI: { code: 'MI', name: 'Mumbai Indians', flag: 'MI', color: '#69a6ff' },
  RCB: { code: 'RCB', name: 'Royal Challengers Bengaluru', flag: 'RCB', color: '#ff6d6d' },
  KKR: { code: 'KKR', name: 'Kolkata Knight Riders', flag: 'KKR', color: '#bd8fff' },
  SRH: { code: 'SRH', name: 'Sunrisers Hyderabad', flag: 'SRH', color: '#ff9e57' },
  RR: { code: 'RR', name: 'Rajasthan Royals', flag: 'RR', color: '#ff82c4' },
  PBKS: { code: 'PBKS', name: 'Punjab Kings', flag: 'PBKS', color: '#ff7f7f' },
  DC: { code: 'DC', name: 'Delhi Capitals', flag: 'DC', color: '#67d6ff' },
  GT: { code: 'GT', name: 'Gujarat Titans', flag: 'GT', color: '#71e58a' },
  LSG: { code: 'LSG', name: 'Lucknow Super Giants', flag: 'LSG', color: '#8ef1ff' }
};

const MATCHES = [
  { id: 'ipl-07', matchNo: 7, t1: 'CSK', t2: 'PBKS', venue: 'Chennai', start: '2026-04-03 19:30', end: '2026-04-03 23:30' },
  { id: 'ipl-08', matchNo: 8, t1: 'DC', t2: 'MI', venue: 'Delhi', start: '2026-04-04 15:30', end: '2026-04-04 19:15' },
  { id: 'ipl-09', matchNo: 9, t1: 'GT', t2: 'RR', venue: 'Ahmedabad', start: '2026-04-04 19:30', end: '2026-04-04 23:30' },
  { id: 'ipl-10', matchNo: 10, t1: 'SRH', t2: 'LSG', venue: 'Hyderabad', start: '2026-04-05 15:30', end: '2026-04-05 19:15' },
  { id: 'ipl-11', matchNo: 11, t1: 'RCB', t2: 'CSK', venue: 'Bengaluru', start: '2026-04-05 19:30', end: '2026-04-05 23:30' },
  { id: 'ipl-12', matchNo: 12, t1: 'KKR', t2: 'PBKS', venue: 'Kolkata', start: '2026-04-06 19:30', end: '2026-04-06 23:30' },
  { id: 'ipl-13', matchNo: 13, t1: 'RR', t2: 'MI', venue: 'Guwahati', start: '2026-04-07 19:30', end: '2026-04-07 23:30' },
  { id: 'ipl-14', matchNo: 14, t1: 'DC', t2: 'GT', venue: 'Delhi', start: '2026-04-08 19:30', end: '2026-04-08 23:30' },
  { id: 'ipl-15', matchNo: 15, t1: 'KKR', t2: 'LSG', venue: 'Kolkata', start: '2026-04-09 19:30', end: '2026-04-09 23:30' },
  { id: 'ipl-16', matchNo: 16, t1: 'RR', t2: 'RCB', venue: 'Guwahati', start: '2026-04-10 19:30', end: '2026-04-10 23:30' },
  { id: 'ipl-17', matchNo: 17, t1: 'PBKS', t2: 'SRH', venue: 'New Chandigarh', start: '2026-04-11 15:30', end: '2026-04-11 19:15' },
  { id: 'ipl-18', matchNo: 18, t1: 'CSK', t2: 'DC', venue: 'Chennai', start: '2026-04-11 19:30', end: '2026-04-11 23:30' },
  { id: 'ipl-19', matchNo: 19, t1: 'LSG', t2: 'GT', venue: 'Lucknow', start: '2026-04-12 15:30', end: '2026-04-12 19:15' },
  { id: 'ipl-20', matchNo: 20, t1: 'MI', t2: 'RCB', venue: 'Mumbai', start: '2026-04-12 19:30', end: '2026-04-12 23:30' },
  { id: 'ipl-21', matchNo: 21, t1: 'SRH', t2: 'RR', venue: 'Hyderabad', start: '2026-04-13 19:30', end: '2026-04-13 23:30' },
  { id: 'ipl-22', matchNo: 22, t1: 'CSK', t2: 'KKR', venue: 'Chennai', start: '2026-04-14 19:30', end: '2026-04-14 23:30' },
  { id: 'ipl-23', matchNo: 23, t1: 'RCB', t2: 'LSG', venue: 'Bengaluru', start: '2026-04-15 19:30', end: '2026-04-15 23:30' },
  { id: 'ipl-24', matchNo: 24, t1: 'MI', t2: 'PBKS', venue: 'Mumbai', start: '2026-04-16 19:30', end: '2026-04-16 23:30' },
  { id: 'ipl-25', matchNo: 25, t1: 'GT', t2: 'KKR', venue: 'Ahmedabad', start: '2026-04-17 19:30', end: '2026-04-17 23:30' },
  { id: 'ipl-26', matchNo: 26, t1: 'RCB', t2: 'DC', venue: 'Bengaluru', start: '2026-04-18 15:30', end: '2026-04-18 19:15' },
  { id: 'ipl-27', matchNo: 27, t1: 'SRH', t2: 'CSK', venue: 'Hyderabad', start: '2026-04-18 19:30', end: '2026-04-18 23:30' },
  { id: 'ipl-28', matchNo: 28, t1: 'KKR', t2: 'RR', venue: 'Kolkata', start: '2026-04-19 15:30', end: '2026-04-19 19:15' },
  { id: 'ipl-29', matchNo: 29, t1: 'PBKS', t2: 'LSG', venue: 'New Chandigarh', start: '2026-04-19 19:30', end: '2026-04-19 23:30' },
  { id: 'ipl-30', matchNo: 30, t1: 'GT', t2: 'MI', venue: 'Ahmedabad', start: '2026-04-20 19:30', end: '2026-04-20 23:30' },
  { id: 'ipl-31', matchNo: 31, t1: 'SRH', t2: 'DC', venue: 'Hyderabad', start: '2026-04-21 19:30', end: '2026-04-21 23:30' },
  { id: 'ipl-32', matchNo: 32, t1: 'LSG', t2: 'RR', venue: 'Lucknow', start: '2026-04-22 19:30', end: '2026-04-22 23:30' },
  { id: 'ipl-33', matchNo: 33, t1: 'MI', t2: 'CSK', venue: 'Mumbai', start: '2026-04-23 19:30', end: '2026-04-23 23:30' },
  { id: 'ipl-34', matchNo: 34, t1: 'RCB', t2: 'GT', venue: 'Bengaluru', start: '2026-04-24 19:30', end: '2026-04-24 23:30' },
  { id: 'ipl-35', matchNo: 35, t1: 'DC', t2: 'PBKS', venue: 'Delhi', start: '2026-04-25 15:30', end: '2026-04-25 19:15' },
  { id: 'ipl-36', matchNo: 36, t1: 'RR', t2: 'SRH', venue: 'Jaipur', start: '2026-04-25 19:30', end: '2026-04-25 23:30' },
  { id: 'ipl-37', matchNo: 37, t1: 'GT', t2: 'CSK', venue: 'Ahmedabad', start: '2026-04-26 15:30', end: '2026-04-26 19:15' },
  { id: 'ipl-38', matchNo: 38, t1: 'LSG', t2: 'KKR', venue: 'Lucknow', start: '2026-04-26 19:30', end: '2026-04-26 23:30' },
  { id: 'ipl-39', matchNo: 39, t1: 'DC', t2: 'RCB', venue: 'Delhi', start: '2026-04-27 19:30', end: '2026-04-27 23:30' },
  { id: 'ipl-40', matchNo: 40, t1: 'PBKS', t2: 'RR', venue: 'New Chandigarh', start: '2026-04-28 19:30', end: '2026-04-28 23:30' },
  { id: 'ipl-41', matchNo: 41, t1: 'MI', t2: 'SRH', venue: 'Mumbai', start: '2026-04-29 19:30', end: '2026-04-29 23:30' },
  { id: 'ipl-42', matchNo: 42, t1: 'GT', t2: 'RCB', venue: 'Ahmedabad', start: '2026-04-30 19:30', end: '2026-04-30 23:30' },
  { id: 'ipl-43', matchNo: 43, t1: 'RR', t2: 'DC', venue: 'Jaipur', start: '2026-05-01 19:30', end: '2026-05-01 23:30' },
  { id: 'ipl-44', matchNo: 44, t1: 'CSK', t2: 'MI', venue: 'Chennai', start: '2026-05-02 19:30', end: '2026-05-02 23:30' },
  { id: 'ipl-45', matchNo: 45, t1: 'SRH', t2: 'KKR', venue: 'Hyderabad', start: '2026-05-03 15:30', end: '2026-05-03 19:15' },
  { id: 'ipl-46', matchNo: 46, t1: 'GT', t2: 'PBKS', venue: 'Ahmedabad', start: '2026-05-03 19:30', end: '2026-05-03 23:30' },
  { id: 'ipl-47', matchNo: 47, t1: 'MI', t2: 'LSG', venue: 'Mumbai', start: '2026-05-04 19:30', end: '2026-05-04 23:30' },
  { id: 'ipl-48', matchNo: 48, t1: 'DC', t2: 'CSK', venue: 'Delhi', start: '2026-05-05 19:30', end: '2026-05-05 23:30' },
  { id: 'ipl-49', matchNo: 49, t1: 'SRH', t2: 'PBKS', venue: 'Hyderabad', start: '2026-05-06 19:30', end: '2026-05-06 23:30' },
  { id: 'ipl-50', matchNo: 50, t1: 'LSG', t2: 'RCB', venue: 'Lucknow', start: '2026-05-07 19:30', end: '2026-05-07 23:30' }
];

const COMMENTS = ['Aaj odds mast lag rahe hain.','Live market me entry abhi best hai.','High multiplier ka wait kar raha hoon.','Home ground advantage strong hai.','Telegram se odds flip mast kaam kar raha hai.','Aaj upset hone ka full chance hai.','Powerplay ke baad odds aur spicy honge.','Ye match last over tak jayega.','Smart money underdog pe aa raha hai.','Aaj ka return bada ho sakta hai.'];
