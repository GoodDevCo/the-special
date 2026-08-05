/* Seed data + brand styling. Seed deals sourced from EatDrinkDeals (Aug 2026). */
const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const TODAY = new Date().getDay();
const DOWNVOTE_LIMIT = 3;   // downvotes needed to kill a deal (with ratio rule)
const DOWNVOTE_RATIO = 0.3; // ...AND downvotes must exceed 30% of upvotes
const STALE_DAYS = 5;       // freshness decay window

const BRANDS = {
 'Taco Bell':['#3a1a6b','🌮'],"Wendy's":['#8b1a1a','🍔'],"McDonald's":['#7a1414','🍟'],
 'Sonic':['#1a3a6b','🥤'],'KFC':['#7a1a1a','🍗'],'Wingstop':['#144d2e','🍗'],
 'Chipotle':['#5c2a1a','🌯'],'Shake Shack':['#14503c','🥤'],'White Castle':['#1a3060','🍔'],
 "Arby's":['#6e1d1d','🥪'],'Dairy Queen':['#5c1430','🍦'],"Jimmy John's":['#5c1414','🥖'],
 'Panera Bread':['#4d3a14','🥣'],'A&W':['#4a2c14','🍺'],"Carl's Jr.":['#665014','⭐'],
 'Krispy Kreme':['#14503c','🍩'],'Local Find':['#3d3358','📍']};
function brand(c){ return BRANDS[c] || ['#3d3358','🍴']; }

function daysAgo(n){ const d=new Date(); d.setDate(d.getDate()-n); return d.getTime(); }

const SEED_DEALS = [
 {id:1,chain:'Taco Bell',deal:'$1 Meximelt — Tuesday Drops',price:'$1',days:[2],src:'web',up:41,down:1,lastVerified:daysAgo(1),myVote:0},
 {id:2,chain:'Wingstop',deal:'70¢ boneless wings',price:'70¢/wing',days:[1,2],src:'web',up:33,down:0,lastVerified:daysAgo(1),myVote:0},
 {id:3,chain:"McDonald's",deal:'$5 Extra Value Meal (app)',price:'$5',days:[0,1,2,3,4,5,6],src:'web',up:58,down:2,lastVerified:daysAgo(0),myVote:0},
 {id:4,chain:'KFC',deal:'$10 chicken bucket, weekdays only',price:'$10',days:[1,2,3,4,5],src:'community',up:12,down:1,lastVerified:daysAgo(2),myVote:0},
 {id:5,chain:'Sonic',deal:'BOGO entrées for Rewards members',price:'BOGO',days:[3],src:'ig',ig:'instagram.com/reel/sonic-bogo-weds',igUser:'@fastfooddeals',up:24,down:0,lastVerified:daysAgo(0),myVote:0},
 {id:6,chain:'Shake Shack',deal:'$3 frozen custard all week',price:'$3',days:[0,1,2,3,4,5,6],src:'ig',ig:'instagram.com/reel/shack-custard',igUser:'@dealhunterkat',up:19,down:0,lastVerified:daysAgo(3),myVote:0},
 {id:7,chain:'A&W',deal:'FREE root beer float — National Root Beer Float Day 🍺',price:'FREE',days:[4],src:'web',up:7,down:0,lastVerified:daysAgo(0),myVote:0},
 {id:8,chain:'White Castle',deal:'10-sack of sliders',price:'$8.99',days:[0,1,2,3,4,5,6],src:'community',up:4,down:1,lastVerified:daysAgo(6),myVote:0},
 {id:9,chain:"Arby's",deal:'50% off any sandwich in the app',price:'50% off',days:[0,1,2,3,4,5,6],src:'community',up:9,down:2,lastVerified:daysAgo(7),myVote:0},
 {id:10,chain:'Chipotle',deal:'Free chips & guac with entrée',price:'FREE add-on',days:[0,1,2,3,4,5,6],src:'ig',ig:'instagram.com/reel/chip-guac-deal',igUser:'@snackscout',up:15,down:9,lastVerified:daysAgo(9),myVote:0,dead:true},
 {id:11,chain:"Jimmy John's",deal:'Regular sandwiches $5.99 (limited time)',price:'$5.99',days:[0,1,2,3,4,5,6],src:'web',up:22,down:1,lastVerified:daysAgo(1),myVote:0},
 {id:12,chain:'Dairy Queen',deal:'Free mini Blizzard — rotating app coupon',price:'FREE',days:[3,4],src:'ig',ig:'instagram.com/reel/dq-mini-blizz',igUser:'@sweetdealsdaily',up:11,down:0,lastVerified:daysAgo(0),myVote:0},
];
