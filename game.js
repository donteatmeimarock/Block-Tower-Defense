// HTML5 Canvas roundRect Polyfill for older/restricted browsers
if (typeof CanvasRenderingContext2D !== 'undefined' && !CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, radii) {
        if (!radii) radii = 0;
        if (typeof radii === 'number') {
            radii = [radii, radii, radii, radii];
        } else if (Array.isArray(radii)) {
            if (radii.length === 1) radii = [radii[0], radii[0], radii[0], radii[0]];
            else if (radii.length === 2) radii = [radii[0], radii[1], radii[0], radii[1]];
            else if (radii.length === 3) radii = [radii[0], radii[1], radii[2], radii[1]];
        } else {
            radii = [0, 0, 0, 0];
        }
        
        let r = {
            topLeft: radii[0] || 0,
            topRight: radii[1] || 0,
            bottomRight: radii[2] || 0,
            bottomLeft: radii[3] || 0
        };

        const minSide = Math.min(w, h);
        if (r.topLeft + r.topRight > w) {
            const factor = w / (r.topLeft + r.topRight);
            r.topLeft *= factor;
            r.topRight *= factor;
        }
        if (r.bottomLeft + r.bottomRight > w) {
            const factor = w / (r.bottomLeft + r.bottomRight);
            r.bottomLeft *= factor;
            r.bottomRight *= factor;
        }
        if (r.topLeft + r.bottomLeft > h) {
            const factor = h / (r.topLeft + r.bottomLeft);
            r.topLeft *= factor;
            r.bottomLeft *= factor;
        }
        if (r.topRight + r.bottomRight > h) {
            const factor = h / (r.topRight + r.bottomRight);
            r.topRight *= factor;
            r.bottomRight *= factor;
        }

        this.moveTo(x + r.topLeft, y);
        this.lineTo(x + w - r.topRight, y);
        this.arcTo(x + w, y, x + w, y + r.topRight, r.topRight);
        this.lineTo(x + w, y + h - r.bottomRight);
        this.arcTo(x + w, y + h, x + w - r.bottomRight, y + h, r.bottomRight);
        this.lineTo(x + r.bottomLeft, y + h);
        this.arcTo(x, y + h, x, y + h - r.bottomLeft, r.bottomLeft);
        this.lineTo(x, y + r.topLeft);
        this.arcTo(x, y, x + r.topLeft, y, r.topLeft);
        return this;
    };
}

// Sound Synthesizer via Web Audio API
let audioCtx = null;
try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
        audioCtx = new AudioContextClass();
    }
} catch (e) {
    console.warn("Web Audio API is not supported in this browser:", e);
}

function playSound(type) {
    if (!audioCtx) return;
    try {
        if (audioCtx.state === 'suspended') {
            audioCtx.resume().catch(e => console.warn("Audio resume blocked:", e));
        }
        
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        const now = audioCtx.currentTime;
        
        if (type === 'shoot_squire') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(400, now);
            osc.frequency.exponentialRampToValueAtTime(100, now + 0.15);
            gainNode.gain.setValueAtTime(0.15, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
            osc.start(now);
            osc.stop(now + 0.15);
        } else if (type === 'shoot_mage') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, now);
            osc.frequency.exponentialRampToValueAtTime(300, now + 0.2);
            gainNode.gain.setValueAtTime(0.12, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
            osc.start(now);
            osc.stop(now + 0.2);
        } else if (type === 'shoot_ninja') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(600, now);
            osc.frequency.exponentialRampToValueAtTime(1200, now + 0.08);
            gainNode.gain.setValueAtTime(0.08, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
            osc.start(now);
            osc.stop(now + 0.08);
        } else if (type === 'shoot_golem') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(120, now);
            osc.frequency.exponentialRampToValueAtTime(40, now + 0.3);
            gainNode.gain.setValueAtTime(0.3, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            osc.start(now);
            osc.stop(now + 0.3);
        } else if (type === 'hit') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(150, now);
            gainNode.gain.setValueAtTime(0.15, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
            osc.start(now);
            osc.stop(now + 0.05);
        } else if (type === 'buy') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(261.6, now); // C4
            osc.frequency.setValueAtTime(329.6, now + 0.08); // E4
            osc.frequency.setValueAtTime(392.0, now + 0.16); // G4
            osc.frequency.setValueAtTime(523.3, now + 0.24); // C5
            gainNode.gain.setValueAtTime(0.1, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
            osc.start(now);
            osc.stop(now + 0.35);
        } else if (type === 'sell') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(523.3, now); // C5
            osc.frequency.setValueAtTime(392.0, now + 0.08); // G4
            osc.frequency.setValueAtTime(329.6, now + 0.16); // E4
            osc.frequency.setValueAtTime(261.6, now + 0.24); // C4
            gainNode.gain.setValueAtTime(0.1, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
            osc.start(now);
            osc.stop(now + 0.35);
        } else if (type === 'hurt') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(180, now);
            osc.frequency.linearRampToValueAtTime(60, now + 0.25);
            gainNode.gain.setValueAtTime(0.2, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
            osc.start(now);
            osc.stop(now + 0.25);
        } else if (type === 'victory') {
            const notes = [261.6, 329.6, 392.0, 523.3, 659.3, 784.0];
            notes.forEach((freq, idx) => {
                const toneOsc = audioCtx.createOscillator();
                const toneGain = audioCtx.createGain();
                toneOsc.connect(toneGain);
                toneGain.connect(audioCtx.destination);
                toneOsc.frequency.setValueAtTime(freq, now + idx * 0.1);
                toneGain.gain.setValueAtTime(0.1, now + idx * 0.1);
                toneGain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.1 + 0.4);
                toneOsc.start(now + idx * 0.1);
                toneOsc.stop(now + idx * 0.1 + 0.4);
            });
        }
    } catch (e) {
        console.warn("Failed to play sound:", e);
    }
}

// Maps Definitions
const MAPS = {
    meadow: {
        background: '#0d131a',
        trackColor: '#1d2a3a',
        trackBorder: '#3b82f6',
        path: [
            { x: -50, y: 275 },
            { x: 150, y: 275 },
            { x: 150, y: 100 },
            { x: 350, y: 100 },
            { x: 350, y: 450 },
            { x: 550, y: 450 },
            { x: 550, y: 275 },
            { x: 850, y: 275 }
        ]
    },
    volcano: {
        background: '#140808',
        trackColor: '#2d1515',
        trackBorder: '#f43f5e',
        path: [
            { x: -50, y: 100 },
            { x: 400, y: 100 },
            { x: 400, y: 450 },
            { x: 200, y: 450 },
            { x: 200, y: 250 },
            { x: 600, y: 250 },
            { x: 600, y: 450 },
            { x: 850, y: 450 }
        ]
    }
};

// Tower Templates (Modular Database)
const TOWER_TEMPLATES = {
    squire: {
        name: 'Squire Block',
        cost: 100,
        range: 140,
        damage: 18,
        fireRate: 1.8,
        bulletSpeed: 7,
        color: '#4f46e5',
        desc: 'Fires fast physical arrows at single targets.',
        upgradeTree: {
            branch1: {
                name: 'Archer Path (Speed & Pierce)',
                levels: [
                    { title: 'Swift Draw', desc: 'Increases attack rate by 40%', cost: 50, fireRate: 1.4 },
                    { title: 'Double Shot', desc: 'Fires 2 arrows simultaneously', cost: 120, extraProjectiles: 1 },
                    { title: 'Bowmaster', desc: 'Converts weapons to heavy shurikens', cost: 250, damage: 15, pierce: 3 },
                    { title: 'Eagle Eye', desc: 'Increases range by 50% and crit chance', cost: 500, range: 210, critChance: 0.25, critMultiplier: 2 },
                    { title: 'Sovereign Ranger', desc: 'Unleashes rapid projectile sweeps', cost: 1000, fireRate: 3.5, damage: 25 }
                ]
            },
            branch2: {
                name: 'Knight Path (Heavy Damage & Slash)',
                levels: [
                    { title: 'Iron Blade', desc: 'Increases damage significantly (+6)', cost: 60, damage: 14 },
                    { title: 'Heavy Cleave', desc: 'Swords pierce up to 3 targets', cost: 130, pierce: 3 },
                    { title: 'Ironclad Knight', desc: 'Deals AoE spin damage around itself', cost: 280, isAoeAround: true, range: 80 },
                    { title: 'Berserker Force', desc: 'Gain +10% speed for each nearby enemy', cost: 600 },
                    { title: 'Dreadnought Champion', desc: 'Massive cleaving strikes with 2x damage', cost: 1200, damage: 45, range: 110 }
                ]
            },
            branch3: {
                name: 'Taxes Path (Gold & Income)',
                levels: [
                    { title: 'Toll Gate', desc: 'Earn +2 tokens for every kill in range', cost: 80, bonusKillTokens: 2 },
                    { title: 'Lucky Strike', desc: '15% chance to hit for 3x critical damage', cost: 160, critChance: 0.15, critMultiplier: 3 },
                    { title: 'Treasure Collector', desc: 'Generates 15 tokens at wave end', cost: 300, roundBonusTokens: 15 },
                    { title: 'Golden Aura', desc: 'Increases nearby tower damage by 10%', cost: 700 },
                    { title: 'Midas Emperor', desc: 'Generates 100 tokens at end of every wave', cost: 1500, roundBonusTokens: 100 }
                ]
            }
        }
    },
    mage: {
        name: 'Mage Block',
        cost: 150,
        range: 130,
        damage: 24,
        fireRate: 1.5,
        bulletSpeed: 5,
        color: '#d946ef',
        desc: 'Fires elemental bursts that slow or ignite enemies.',
        upgradeTree: {
            branch1: {
                name: 'Fire Path (Splash Damage)',
                levels: [
                    { title: 'Ember Bolt', desc: 'Increases damage by 4', cost: 60, damage: 14 },
                    { title: 'Flame Burst', desc: 'Projectiles explode in a small radius', cost: 140, splashRadius: 40 },
                    { title: 'Pyromancer', desc: 'Creates burning ground that deals damage over time', cost: 300, dotDamage: 5 },
                    { title: 'Firestorm', desc: 'Greatly increases blast radius and burns', cost: 700, splashRadius: 80, damage: 25 },
                    { title: 'Meteor Archmage', desc: 'Summons explosive meteors dealing massive damage', cost: 2000, damage: 75, fireRate: 1.2 }
                ]
            },
            branch2: {
                name: 'Ice Path (Slow & Freeze)',
                levels: [
                    { title: 'Frost Spark', desc: 'Slows targets hit by 25% for 2s', cost: 50, slowFactor: 0.75 },
                    { title: 'Chill Blast', desc: 'Splash slow to nearby enemies', cost: 130, splashRadius: 35, slowFactor: 0.7 },
                    { title: 'Cryomancer', desc: 'Slows by 50% and stuns targets for 0.5s', cost: 320, stunDuration: 500 },
                    { title: 'Blizzard Storm', desc: 'Creates a permanent slowing storm field', cost: 800, range: 180 },
                    { title: 'Absolute Zero', desc: 'Freezes all enemies in range completely for 2s', cost: 2200, stunDuration: 2000, fireRate: 0.5 }
                ]
            },
            branch3: {
                name: 'Lightning Path (Chain Attacks)',
                levels: [
                    { title: 'Chain Spark', desc: 'Strikes chain to a secondary target', cost: 70, chainCount: 2 },
                    { title: 'Superbolt', desc: 'Increases damage by 6', cost: 160, damage: 16 },
                    { title: 'Stormcaller', desc: 'Chains reach up to 4 targets and stun briefly', cost: 350, chainCount: 4, stunDuration: 200 },
                    { title: 'Superconductor', desc: 'Attacks chain to 6 targets with longer range', cost: 850, chainCount: 6, range: 170 },
                    { title: 'Zeus Sovereign', desc: 'Chains to 10 targets, dealing high stun and damage', cost: 2400, chainCount: 10, damage: 38, fireRate: 1.3 }
                ]
            }
        }
    },
    golem: {
        name: 'Golem Block',
        cost: 200,
        range: 90,
        damage: 38,
        fireRate: 1.0,
        bulletSpeed: 0, // Instant slam
        color: '#10b981',
        desc: 'Crushes enemies directly around itself with shockwaves.',
        upgradeTree: {
            branch1: {
                name: 'Shockwave Path (Crowd Control)',
                levels: [
                    { title: 'Heavy Slam', desc: 'Increases slam range and damage', cost: 80, range: 110, damage: 24 },
                    { title: 'Seismic Shake', desc: 'Stuns hit targets for 0.8 seconds', cost: 180, stunDuration: 800 },
                    { title: 'Ground Smasher', desc: 'Deals double damage to stunned targets', cost: 400 },
                    { title: 'Mountain Titan', desc: 'Wider slam range and longer stun', cost: 900, range: 140, stunDuration: 1200 },
                    { title: 'World Breaker', desc: 'Slams stun ALL enemies on the map for 2 seconds', cost: 2500, globalStun: true, damage: 60 }
                ]
            },
            branch2: {
                name: 'Crystal Path (Laser Chain)',
                levels: [
                    { title: 'Prism Eye', desc: 'Converts slam to continuous laser beam', cost: 90, isLaser: true, fireRate: 4 },
                    { title: 'Focus Beam', desc: 'Laser melts target armor (2x damage over time)', cost: 200 },
                    { title: 'Crystal Sentinel', desc: 'Laser splits and attacks 3 targets', cost: 450, laserTargets: 3 },
                    { title: 'Prismatic Refraction', desc: 'Splits to 5 targets with wider range', cost: 1000, laserTargets: 5, range: 130 },
                    { title: 'Emerald Colossus', desc: 'Splits to 8 targets, dealing extreme DPS', cost: 2800, laserTargets: 8, damage: 25 }
                ]
            },
            branch3: {
                name: 'Thorny Path (Bleed & Defense)',
                levels: [
                    { title: 'Spiked Hide', desc: 'Passively damages passing enemies', cost: 70, auraDamage: 5 },
                    { title: 'Razor Spikes', desc: 'Bleeds enemies for damage over time', cost: 150, dotDamage: 4 },
                    { title: 'Iron Spikes', desc: 'Aura damage increased (+8)', cost: 330, auraDamage: 13 },
                    { title: 'Fortress Shell', desc: 'Aura also slows passing enemies by 25%', cost: 750, slowFactor: 0.75 },
                    { title: 'Dreadnought Bastion', desc: 'Shreds passing groups, dealing massive damage', cost: 1800, auraDamage: 35, range: 120 }
                ]
            }
        }
    },
    ninja: {
        name: 'Ninja Block',
        cost: 220,
        range: 120,
        damage: 14,
        fireRate: 3.2,
        bulletSpeed: 9,
        color: '#f43f5e',
        desc: 'Throws rapid-fire shurikens that slice through multiple targets.',
        upgradeTree: {
            branch1: {
                name: 'Shuriken Path (Pierce)',
                levels: [
                    { title: 'Sharp Steel', desc: 'Shurikens pierce through 2 targets', cost: 60, pierce: 2 },
                    { title: 'Quad Shuriken', desc: 'Throws 3 shurikens in a small fan shape', cost: 150, extraProjectiles: 2 },
                    { title: 'Shuriken Master', desc: 'Pierces 4 targets, damage increased', cost: 350, pierce: 4, damage: 12 },
                    { title: 'Wind Blade', desc: 'Projectiles fly forward and return, hitting twice', cost: 800 },
                    { title: 'Shuriken Deity', desc: 'Infinite pierce shurikens that shred waves', cost: 2300, pierce: 99, fireRate: 4.0 }
                ]
            },
            branch2: {
                name: 'Assassination Path (Single Target Crit)',
                levels: [
                    { title: 'Vital Spot', desc: '15% chance to land critical hit (3x damage)', cost: 70, critChance: 0.15, critMultiplier: 3 },
                    { title: 'Poison Darts', desc: 'Hits infect targets, dealing damage over time', cost: 160, dotDamage: 5 },
                    { title: 'Shinobi Assassin', desc: '30% crit chance for 5x damage', cost: 380, critChance: 0.30, critMultiplier: 5 },
                    { title: 'Noxious Blade', desc: 'Poison slows target by 30% and deals double DoT', cost: 850, slowFactor: 0.7 },
                    { title: 'Void Master', desc: 'Instantly executes small targets below 20% HP', cost: 2600 }
                ]
            },
            branch3: {
                name: 'Gale Path (Wind Knocks)',
                levels: [
                    { title: 'Swift Wind', desc: 'Attack speed increased by 30%', cost: 50, fireRate: 2.9 },
                    { title: 'Gale Slice', desc: 'Projectiles knock enemies back slightly', cost: 120, knockback: 10 },
                    { title: 'Tornado Throw', desc: '10% chance to summon a pushing tornado', cost: 300 },
                    { title: 'Typhoon Flurry', desc: 'Attacks deal wind cuts in a circle, knocking back', cost: 750, range: 150 },
                    { title: 'Storm Shinobi', desc: 'Launches constant heavy tornados that push mobs back', cost: 2000, fireRate: 3.5 }
                ]
            }
        }
    },
    king: {
        name: 'King Block',
        cost: 250,
        range: 110,
        damage: 0, // Pure support
        fireRate: 0,
        color: '#eab308',
        desc: 'Provides stat bonuses to all towers deployed within its range.',
        upgradeTree: {
            branch1: {
                name: 'Imperial Path (Damage Boost)',
                levels: [
                    { title: 'Royal Edict', desc: 'Nearby towers deal +15% damage', cost: 150, buffDamage: 1.15 },
                    { title: 'Battle Cry', desc: 'Damage buff increased to +25%', cost: 300, buffDamage: 1.25 },
                    { title: 'War Banner', desc: 'Nearby towers also gain +15% range', cost: 600, buffRange: 1.15 },
                    { title: 'Conqueror Command', desc: 'All towers on screen get +10% damage', cost: 1200 },
                    { title: 'Sovereign Emperor', desc: 'Nearby towers deal +50% damage and melt defenses', cost: 3000, buffDamage: 1.5 }
                ]
            },
            branch2: {
                name: 'Jester Path (Speed Boost)',
                levels: [
                    { title: 'Royal Tune', desc: 'Nearby towers attack 15% faster', cost: 120, buffSpeed: 1.15 },
                    { title: 'haste Melody', desc: 'Speed buff increased to +25%', cost: 260, buffSpeed: 1.25 },
                    { title: 'Jester Tricks', desc: 'Nearby towers gain +15% range', cost: 550, buffRange: 1.15 },
                    { title: 'Carnival Bell', desc: 'Increases speed buff to +35%', cost: 1100, buffSpeed: 1.35 },
                    { title: 'Arch-Jester Supreme', desc: 'Nearby towers attack 50% faster with +25% range', cost: 2800, buffSpeed: 1.5, buffRange: 1.25 }
                ]
            },
            branch3: {
                name: 'Tribute Path (Extra Economy)',
                levels: [
                    { title: 'Tax Office', desc: 'Nearby towers cost 10% less to upgrade', cost: 160 },
                    { title: 'Royal Tithe', desc: 'Earn +25 tokens at end of every wave', cost: 320, roundBonusTokens: 25 },
                    { title: 'Interest Treasury', desc: 'Earn 5% interest on current tokens at wave end', cost: 500 },
                    { title: 'Vassal Estates', desc: 'Towers in range sell for 90% of their cost', cost: 1000 },
                    { title: 'Tax Overlord', desc: 'Earn +150 tokens per wave; upgrades cost 25% less', cost: 2700, roundBonusTokens: 150 }
                ]
            }
        }
    },
    drawbridge: {
        name: 'Drawbridge',
        cost: 120,
        range: 40,
        damage: 0,
        fireRate: 0,
        color: '#78716c',
        desc: 'Placed on track. Alternates open and closed states to stop enemies.',
        upgradeTree: {
            branch1: {
                name: 'Thorned Gate (Spikes)',
                levels: [
                    { title: 'Iron Spikes', desc: 'Deals 5 damage per second to blocked enemies', cost: 60 },
                    { title: 'Heavy Grate', desc: 'Deals 12 damage per second to blocked enemies', cost: 130 },
                    { title: 'Razor Teeth', desc: 'Deals 25 damage per second and bleeds enemies', cost: 300 },
                    { title: 'Spike Pit', desc: 'Deals 50 damage per second; slows passing by 30%', cost: 700 },
                    { title: 'Dreadnought Portcullis', desc: 'Deals 150 damage per second to blocked enemies', cost: 1800 }
                ]
            },
            branch2: {
                name: 'Sturdy Support (Longer Closed)',
                levels: [
                    { title: 'Reinforced Wood', desc: 'Stays closed for 4.5 seconds instead of 4', cost: 50 },
                    { title: 'Iron Hinges', desc: 'Stays closed for 5 seconds', cost: 110 },
                    { title: 'Stone Bastion', desc: 'Stays closed for 5.5 seconds', cost: 250 },
                    { title: 'Steel Anchors', desc: 'Stays closed for 6 seconds', cost: 600 },
                    { title: 'Keep of the Realm', desc: 'Stays closed for 7 seconds; nearby towers deal +15% damage', cost: 1500 }
                ]
            },
            branch3: {
                name: 'Toll Bridge (Gold)',
                levels: [
                    { title: 'Toll Collection', desc: 'Earn 3 tokens when enemies pass through when open', cost: 80 },
                    { title: 'Tax Gate', desc: 'Earn 6 tokens when enemies pass through when open', cost: 160 },
                    { title: 'Merchant Pass', desc: 'Earn 20 tokens at the end of each wave', cost: 320 },
                    { title: 'Royal Customs', desc: 'Earn 12 tokens per pass, 40 per wave end', cost: 750 },
                    { title: 'Grand Customs Citadel', desc: 'Earn 150 tokens per wave, passing pay 20 tokens', cost: 2000 }
                ]
            }
    },
    god_tower: {
        name: 'God Tower',
        cost: 0,
        range: 9999,
        damage: 100,
        fireRate: 0.1, // Fires every 10 seconds
        bulletSpeed: 0,
        color: '#0f172a',
        desc: 'Strikes all enemies on screen with lightning every 10s.',
        upgradeTree: {} // Gets no upgrades
    }
};

// Enemy Definitions (Scale per wave)
const ENEMY_TEMPLATES = {
    slime: { name: 'Slime Block', hp: 5, speed: 1.4, size: 28, color: '#4ade80', reward: 8 },
    runner: { name: 'Speed Runner', hp: 4, speed: 2.5, size: 24, color: '#f43f5e', reward: 10 },
    golem: { name: 'Steel Golem', hp: 16, speed: 0.7, size: 38, color: '#94a3b8', reward: 18, armored: true },
    spirit: { name: 'Void Spirit', hp: 10, speed: 1.8, size: 30, color: '#d946ef', reward: 15, immuneToSlow: true },
    boss: { name: 'Boss Overlord', hp: 120, speed: 0.6, size: 50, color: '#eab308', reward: 100, boss: true },
    stronger_boss: { name: 'Stronger Boss', hp: 75, speed: 0.5, size: 52, color: '#ea580c', reward: 120, boss: true },
    super_boss: { name: 'Super Powerful Boss', hp: 150, speed: 0.45, size: 55, color: '#dc2626', reward: 200, boss: true },
    tank: { name: 'Tank Block', hp: 500, speed: 0.35, size: 60, color: '#475569', reward: 500, boss: true, armored: true }
};

// Core Game State variables
const state = {
    tokens: 300,
    lives: 100,
    wave: 1,
    gameState: 'menu', // 'menu', 'playing', 'game_over'
    activeMap: 'meadow',
    activeSpeed: 1,
    isWaveActive: false,
    
    towers: [],
    enemies: [],
    projectiles: [],
    spawnQueue: [],
    
    selectedTower: null,
    placingTowerType: null,
    
    mouse: { x: 0, y: 0, overCanvas: false },
    usedCheats: [],
    godTowerPending: false
};

// Canvas Setup
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const overlayEl = document.getElementById('canvas-overlay');

// Event Listeners initialization
window.addEventListener('DOMContentLoaded', () => {
    // Menu screen bindings
    document.querySelectorAll('.map-card').forEach(card => {
        card.addEventListener('click', (e) => {
            document.querySelectorAll('.map-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            state.activeMap = card.dataset.map;
        });
    });
    
    document.getElementById('start-btn').addEventListener('click', startGame);
    document.getElementById('back-to-menu-btn').addEventListener('click', exitToMenu);
    
    // Bottom Wave Controls
    document.querySelectorAll('.speed-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.speed-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.activeSpeed = parseInt(btn.dataset.speed);
        });
    });
    
    document.getElementById('start-wave-btn').addEventListener('click', startWave);
    
    // Shop UI instantiation
    initShopUI();
    
    // Cancel placement button
    const cancelBuyBtn = document.getElementById('cancel-buy-btn');
    if (cancelBuyBtn) {
        cancelBuyBtn.addEventListener('click', cancelPlacement);
    }
    
    // Canvas interaction
    canvas.addEventListener('mousemove', onCanvasMouseMove);
    canvas.addEventListener('mouseleave', () => { state.mouse.overCanvas = false; });
    canvas.addEventListener('mouseenter', () => { state.mouse.overCanvas = true; });
    canvas.addEventListener('click', onCanvasClick);
    
    // Right-click to cancel placement
    canvas.addEventListener('contextmenu', (e) => {
        if (state.gameState === 'playing' && state.placingTowerType) {
            e.preventDefault();
            cancelPlacement();
        }
    });

    // Escape key to cancel placement / deselect tower
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (state.gameState === 'playing') {
                if (state.placingTowerType) {
                    cancelPlacement();
                } else if (state.selectedTower) {
                    deselectTower();
                }
            }
        }
    });
    
    // Inspector bindings
    document.getElementById('close-inspector-btn').addEventListener('click', deselectTower);
    document.getElementById('target-select').addEventListener('change', (e) => {
        if (state.selectedTower) {
            state.selectedTower.targetStrategy = e.target.value;
        }
    });
    document.getElementById('sell-btn').addEventListener('click', sellSelectedTower);
    
    // Modal buttons
    document.getElementById('modal-retry-btn').addEventListener('click', () => {
        document.getElementById('game-over-modal').classList.add('hidden');
        exitToMenu();
    });
    
    // Save/Load system bindings
    const saveBtn = document.getElementById('save-game-btn');
    const saveModal = document.getElementById('save-modal');
    const saveCodeText = document.getElementById('save-code-text');
    const copySaveBtn = document.getElementById('copy-save-btn');
    const closeSaveBtn = document.getElementById('close-save-btn');
    
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            const code = generateSaveCode();
            if (code) {
                saveCodeText.value = code;
                saveModal.classList.remove('hidden');
            } else {
                alert("Failed to generate save code.");
            }
        });
    }
    
    if (copySaveBtn) {
        copySaveBtn.addEventListener('click', () => {
            saveCodeText.select();
            saveCodeText.setSelectionRange(0, 99999); // For mobile devices
            navigator.clipboard.writeText(saveCodeText.value).then(() => {
                const originalHTML = copySaveBtn.innerHTML;
                copySaveBtn.innerHTML = '<i class="fa-solid fa-check"></i> COPIED!';
                setTimeout(() => {
                    copySaveBtn.innerHTML = originalHTML;
                }, 2000);
            }).catch(err => {
                console.error("Could not copy text: ", err);
                alert("Failed to copy code automatically. Please copy the code in the text box manually.");
            });
        });
    }
    
    if (closeSaveBtn) {
        closeSaveBtn.addEventListener('click', () => {
            saveModal.classList.add('hidden');
        });
    }
    
    // Import save code on main menu screen
    const importBtn = document.getElementById('import-btn');
    const importInput = document.getElementById('import-code-input');
    const importFeedback = document.getElementById('import-feedback');
    
    if (importBtn && importInput && importFeedback) {
        importBtn.addEventListener('click', () => {
            const code = importInput.value.trim();
            if (!code) {
                importFeedback.textContent = "Please paste a save code first.";
                importFeedback.style.display = 'block';
                return;
            }
            
            try {
                const decoded = parseSaveCode(code);
                loadGame(decoded);
                // Clear input and feedback on success
                importInput.value = '';
                importFeedback.style.display = 'none';
            } catch (err) {
                importFeedback.textContent = err.message || "Failed to load save code.";
                importFeedback.style.display = 'block';
            }
        });
    }
    
    // Cheat Codes modal bindings
    const menuCheatsBtn = document.getElementById('menu-cheats-btn');
    const gameCheatsBtn = document.getElementById('game-cheats-btn');
    const cheatsModal = document.getElementById('cheats-modal');
    const closeCheatsBtn = document.getElementById('close-cheats-btn');
    const redeemCheatBtn = document.getElementById('redeem-cheat-btn');
    const cheatInput = document.getElementById('cheat-code-input');
    const cheatFeedback = document.getElementById('cheat-feedback');
    
    const openCheats = () => {
        cheatInput.value = '';
        cheatFeedback.style.display = 'none';
        cheatsModal.classList.remove('hidden');
    };
    
    if (menuCheatsBtn) menuCheatsBtn.addEventListener('click', openCheats);
    if (gameCheatsBtn) gameCheatsBtn.addEventListener('click', openCheats);
    if (closeCheatsBtn) {
        closeCheatsBtn.addEventListener('click', () => {
            cheatsModal.classList.add('hidden');
        });
    }
    
    if (redeemCheatBtn && cheatInput && cheatFeedback) {
        redeemCheatBtn.addEventListener('click', () => {
            const code = cheatInput.value.trim().toLowerCase();
            if (!code) {
                cheatFeedback.textContent = "Please enter a cheat code.";
                cheatFeedback.style.color = '#f43f5e';
                cheatFeedback.style.display = 'block';
                return;
            }
            
            if (state.usedCheats.includes(code)) {
                cheatFeedback.textContent = "This cheat has already been used in this game.";
                cheatFeedback.style.color = '#f43f5e';
                cheatFeedback.style.display = 'block';
                return;
            }
            
            if (code === '1000gold') {
                state.tokens += 1000;
                state.usedCheats.push(code);
                updateHUD();
                playSound('buy');
                cheatFeedback.textContent = "Cheat activated: Earned 1000 Gold!";
                cheatFeedback.style.color = '#10b981';
                cheatFeedback.style.display = 'block';
            } else if (code === 'spellofpower') {
                state.towers.forEach(maxUpgradeTower);
                state.usedCheats.push(code);
                if (state.selectedTower) {
                    selectTower(state.selectedTower);
                }
                updateHUD();
                playSound('buy');
                cheatFeedback.textContent = "Cheat activated: Max upgraded all towers!";
                cheatFeedback.style.color = '#10b981';
                cheatFeedback.style.display = 'block';
            } else if (code === 'godtower') {
                const hasPlacedGodTower = state.towers.some(t => t.type === 'god_tower');
                if (hasPlacedGodTower || state.godTowerPending) {
                    cheatFeedback.textContent = "You can only have one God Tower per game.";
                    cheatFeedback.style.color = '#f43f5e';
                    cheatFeedback.style.display = 'block';
                    return;
                }
                
                state.godTowerPending = true;
                state.usedCheats.push(code);
                initShopUI();
                playSound('buy');
                cheatFeedback.textContent = "Cheat activated: God Tower added to shop (FREE)!";
                cheatFeedback.style.color = '#10b981';
                cheatFeedback.style.display = 'block';
            } else {
                cheatFeedback.textContent = "Invalid cheat code.";
                cheatFeedback.style.color = '#f43f5e';
                cheatFeedback.style.display = 'block';
            }
        });
    }
    
    // Game loop start
    requestAnimationFrame(update);
});

// Start Game Mode
function startGame() {
    state.tokens = 300;
    state.lives = 100;
    state.wave = 1;
    state.towers = [];
    state.enemies = [];
    state.projectiles = [];
    state.selectedTower = null;
    state.placingTowerType = null;
    state.isWaveActive = false;
    state.gameState = 'playing';
    state.usedCheats = [];
    state.godTowerPending = false;
    
    document.getElementById('menu-screen').classList.remove('active');
    document.getElementById('game-screen').classList.add('active');
    
    updateHUD();
    deselectTower();
    updateCancelPlacementUI();
    playSound('buy');
}

// Exit back to Main Menu
function exitToMenu() {
    state.gameState = 'menu';
    state.isWaveActive = false;
    state.placingTowerType = null;
    updateCancelPlacementUI();
    document.getElementById('game-screen').classList.remove('active');
    document.getElementById('menu-screen').classList.add('active');
}

// Update Top HUD
function updateHUD() {
    document.querySelector('#hud-wave .hud-val').textContent = state.wave;
    document.querySelector('#hud-lives .hud-val').innerHTML = `<i class="fa-solid fa-heart"></i> ${state.lives}`;
    document.querySelector('#hud-tokens .hud-val').innerHTML = `<i class="fa-solid fa-coins"></i> ${state.tokens}`;
    
    // Enable/disable shop cards based on affordability
    document.querySelectorAll('.shop-card').forEach(card => {
        const type = card.dataset.type;
        if (type === 'god_tower') {
            card.classList.remove('disabled');
            return;
        }
        const cost = TOWER_TEMPLATES[type].cost;
        if (state.tokens >= cost) {
            card.classList.remove('disabled');
        } else {
            card.classList.add('disabled');
        }
    });
}

// Shop UI rendering
function initShopUI() {
    const shopContainer = document.getElementById('shop-items');
    shopContainer.innerHTML = '';
    
    if (state.godTowerPending) {
        const card = document.createElement('div');
        card.className = 'shop-card god-tower-card';
        card.dataset.type = 'god_tower';
        
        card.innerHTML = `
            <div class="shop-card-preview"></div>
            <div class="shop-card-info">
                <h4 style="color: #fbbf24;">God Tower</h4>
                <p>Global strikes of 100 dmg. Free cheat code reward!</p>
            </div>
            <div class="shop-card-cost" style="color: #fbbf24;">
                FREE
            </div>
        `;
        
        card.addEventListener('click', () => {
            state.placingTowerType = 'god_tower';
            state.selectedTower = null;
            document.getElementById('inspector-view').classList.remove('active');
            document.getElementById('shop-view').classList.add('active');
            updateCancelPlacementUI();
        });
        
        shopContainer.appendChild(card);
        
        // Draw the mini-preview blook icon
        const previewContainer = card.querySelector('.shop-card-preview');
        if (previewContainer) {
            const miniCanvas = document.createElement('canvas');
            miniCanvas.width = 44;
            miniCanvas.height = 44;
            previewContainer.appendChild(miniCanvas);
            const mCtx = miniCanvas.getContext('2d');
            drawBlookIcon(mCtx, 'god_tower', 22, 22, 32);
        }
    }
    
    Object.keys(TOWER_TEMPLATES).forEach(type => {
        const template = TOWER_TEMPLATES[type];
        
        const card = document.createElement('div');
        card.className = 'shop-card';
        card.dataset.type = type;
        
        // Render preview icon dynamically using SVG or programmatical mini-canvas
        card.innerHTML = `
            <div class="shop-card-preview"></div>
            <div class="shop-card-info">
                <h4>${template.name}</h4>
                <p>${template.desc}</p>
            </div>
            <div class="shop-card-cost">
                <i class="fa-solid fa-coins"></i> ${template.cost}
            </div>
        `;
        
        card.addEventListener('click', () => {
            if (state.tokens >= template.cost) {
                state.placingTowerType = type;
                state.selectedTower = null;
                document.getElementById('inspector-view').classList.remove('active');
                document.getElementById('shop-view').classList.add('active');
                updateCancelPlacementUI();
            }
        });
        
        shopContainer.appendChild(card);
        
        // Draw the mini-preview blook icon synchronously
        const previewContainer = card.querySelector('.shop-card-preview');
        if (previewContainer) {
            const miniCanvas = document.createElement('canvas');
            miniCanvas.width = 44;
            miniCanvas.height = 44;
            previewContainer.appendChild(miniCanvas);
            const mCtx = miniCanvas.getContext('2d');
            drawBlookIcon(mCtx, type, 22, 22, 32);
        }
    });
}

// Canvas Mouse Event Handlers
function onCanvasMouseMove(e) {
    const rect = canvas.getBoundingClientRect();
    state.mouse.x = e.clientX - rect.left;
    state.mouse.y = e.clientY - rect.top;
}

function onCanvasClick(e) {
    if (state.gameState !== 'playing') return;
    
    // If placing a tower
    if (state.placingTowerType) {
        const cost = TOWER_TEMPLATES[state.placingTowerType].cost;
        if (state.tokens >= cost && isValidPlacement(state.mouse.x, state.mouse.y)) {
            // Spend tokens
            state.tokens -= cost;
            playSound('buy');
            
            // Spawn tower
            const newTower = {
                id: Date.now() + Math.random(),
                x: state.mouse.x,
                y: state.mouse.y,
                type: state.placingTowerType,
                level: 1,
                branch: null, // 'branch1', 'branch2', 'branch3'
                upgradeLevel: 0, // 0 to 5
                angle: 0,
                lastShot: 0,
                targetStrategy: 'first',
                stats: { ...TOWER_TEMPLATES[state.placingTowerType] }
            };
            
            if (state.placingTowerType === 'drawbridge') {
                const proj = getPathProjection(state.mouse.x, state.mouse.y);
                newTower.x = proj.x;
                newTower.y = proj.y;
                newTower.distAlongTrack = proj.distAlongTrack;
                newTower.segmentIndex = proj.segmentIndex;
                newTower.bridgeState = 'closed';
                newTower.stateTimer = 0;
                
                const map = MAPS[state.activeMap];
                const p1 = map.path[proj.segmentIndex];
                const p2 = map.path[proj.segmentIndex + 1];
                newTower.angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
            }
            
            state.towers.push(newTower);
            state.placingTowerType = null;
            updateCancelPlacementUI();
            
            if (newTower.type === 'god_tower') {
                state.godTowerPending = false;
                initShopUI();
            }
            
            // Select placed tower
            selectTower(newTower);
            updateHUD();
        }
        return;
    }
    
    // Check if clicked an existing tower
    let clickedTower = null;
    for (let tower of state.towers) {
        const dist = Math.hypot(tower.x - state.mouse.x, tower.y - state.mouse.y);
        if (dist < 22) {
            clickedTower = tower;
            break;
        }
    }
    
    if (clickedTower) {
        selectTower(clickedTower);
    } else {
        // Deselect if clicked blank canvas area
        deselectTower();
    }
}

// Validate tower position placement
function isValidPlacement(x, y) {
    // Keep away from canvas bounds
    if (x < 30 || x > 770 || y < 30 || y > 520) return false;
    
    if (state.placingTowerType === 'drawbridge') {
        // Must be close to the track segment
        const projection = getPathProjection(x, y);
        if (projection.dist > 20) return false; // Too far from track
        
        // Must not be too close to the start or end of the track
        const map = MAPS[state.activeMap];
        const distToStart = Math.hypot(x - map.path[0].x, y - map.path[0].y);
        const distToEnd = Math.hypot(x - map.path[map.path.length - 1].x, y - map.path[map.path.length - 1].y);
        if (distToStart < 60 || distToEnd < 60) return false;
        
        // Check distance to other towers
        for (let tower of state.towers) {
            const dist = Math.hypot(tower.x - projection.x, tower.y - projection.y);
            if (tower.type === 'drawbridge') {
                if (dist < 80) return false; // Too close to another drawbridge
            } else {
                if (dist < 40) return false; // Too close to a regular tower
            }
        }
        
        return true;
    }
    
    // Regular tower placement
    // Check distance to other towers
    for (let tower of state.towers) {
        const dist = Math.hypot(tower.x - x, tower.y - y);
        if (dist < 40) return false; // Too close
    }
    
    // Check distance to map path
    const map = MAPS[state.activeMap];
    for (let i = 0; i < map.path.length - 1; i++) {
        const p1 = map.path[i];
        const p2 = map.path[i + 1];
        
        // Calculate shortest distance from point to segment
        const dist = distToSegment({ x, y }, p1, p2);
        if (dist < 32) return false; // Too close to path
    }
    
    return true;
}

// Math helpers for line segment distance
function distToSegment(p, v, w) {
    const l2 = Math.hypot(v.x - w.x, v.y - w.y) ** 2;
    if (l2 === 0) return Math.hypot(p.x - v.x, p.y - v.y);
    let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(p.x - (v.x + t * (w.x - v.x)), p.y - (v.y + t * (w.y - v.y)));
}

// Find closest point on path and its projection information
function getPathProjection(x, y) {
    const map = MAPS[state.activeMap];
    let bestDist = Infinity;
    let bestSegmentIndex = 0;
    let bestProjX = 0;
    let bestProjY = 0;
    let bestDistAlongTrack = 0;
    
    let currentDist = 0;
    
    for (let i = 0; i < map.path.length - 1; i++) {
        const p1 = map.path[i];
        const p2 = map.path[i + 1];
        
        const segLength = Math.hypot(p2.x - p1.x, p2.y - p1.y);
        
        // Project (x, y) onto segment p1-p2
        let t = 0;
        if (segLength > 0) {
            t = ((x - p1.x) * (p2.x - p1.x) + (y - p1.y) * (p2.y - p1.y)) / (segLength * segLength);
            t = Math.max(0, Math.min(1, t));
        }
        
        const projX = p1.x + t * (p2.x - p1.x);
        const projY = p1.y + t * (p2.y - p1.y);
        
        const distToProj = Math.hypot(x - projX, y - projY);
        if (distToProj < bestDist) {
            bestDist = distToProj;
            bestSegmentIndex = i;
            bestProjX = projX;
            bestProjY = projY;
            bestDistAlongTrack = currentDist + t * segLength;
        }
        
        currentDist += segLength;
    }
    
    return {
        dist: bestDist,
        segmentIndex: bestSegmentIndex,
        x: bestProjX,
        y: bestProjY,
        distAlongTrack: bestDistAlongTrack
    };
}

// Get the coordinates (x, y) at a specific distance along the track
function getPointAtDist(targetDist) {
    const map = MAPS[state.activeMap];
    let currentDist = 0;
    
    for (let i = 0; i < map.path.length - 1; i++) {
        const p1 = map.path[i];
        const p2 = map.path[i + 1];
        const segLength = Math.hypot(p2.x - p1.x, p2.y - p1.y);
        
        if (currentDist + segLength >= targetDist) {
            const t = (targetDist - currentDist) / segLength;
            return {
                x: p1.x + t * (p2.x - p1.x),
                y: p1.y + t * (p2.y - p1.y),
                segmentIndex: i
            };
        }
        currentDist += segLength;
    }
    
    // Fallback to end of path
    const lastNode = map.path[map.path.length - 1];
    return {
        x: lastNode.x,
        y: lastNode.y,
        segmentIndex: map.path.length - 2
    };
}

// Select a tower to inspect/upgrade
function selectTower(tower) {
    state.selectedTower = tower;
    
    document.getElementById('shop-view').classList.remove('active');
    document.getElementById('inspector-view').classList.add('active');
    
    document.getElementById('inspect-name').textContent = tower.stats.name;
    document.getElementById('target-select').value = tower.targetStrategy;
    
    updateInspectorStats();
    updateUpgradeButtons();
    
    // Render inspector mini-preview
    const inspectCanvas = document.getElementById('inspect-preview-canvas');
    const iCtx = inspectCanvas.getContext('2d');
    iCtx.clearRect(0, 0, 80, 80);
    drawBlookIcon(iCtx, tower.type, 40, 40, 56, tower.branch, tower.upgradeLevel);
}

// Deselect tower back to shop
function deselectTower() {
    state.selectedTower = null;
    document.getElementById('inspector-view').classList.remove('active');
    document.getElementById('shop-view').classList.add('active');
}

// Cancel current tower buying/placement
function cancelPlacement() {
    if (state.placingTowerType) {
        state.placingTowerType = null;
        updateCancelPlacementUI();
    }
}

// Show/hide visual indicator to cancel buy
function updateCancelPlacementUI() {
    const cancelContainer = document.getElementById('cancel-placement-container');
    if (cancelContainer) {
        if (state.placingTowerType) {
            cancelContainer.classList.remove('hidden');
        } else {
            cancelContainer.classList.add('hidden');
        }
    }
}

// Update stats text in inspector panel
function updateInspectorStats() {
    if (!state.selectedTower) return;
    const t = state.selectedTower;
    
    document.getElementById('inspect-stat-damage').textContent = `Damage: ${t.stats.damage}`;
    document.getElementById('inspect-stat-speed').textContent = `Rate: ${t.stats.fireRate > 0 ? (t.stats.fireRate).toFixed(1) + '/s' : 'Support'}`;
    document.getElementById('inspect-stat-range').textContent = `Range: ${t.stats.range}`;
    
    // Calculate sell value (80% of total tokens spent)
    const baseCost = TOWER_TEMPLATES[t.type].cost;
    let spent = baseCost;
    if (t.branch) {
        const upgrades = TOWER_TEMPLATES[t.type].upgradeTree[t.branch].levels;
        for (let i = 0; i < t.upgradeLevel; i++) {
            spent += upgrades[i].cost;
        }
    }
    
    let sellVal = Math.round(spent * 0.8);
    // Apply taxation Tax Overlord bonus if applicable
    const isNearbyTaxOverlord = checkNearbyTaxOverlordSellBonus(t);
    if (isNearbyTaxOverlord) {
        sellVal = Math.round(spent * 0.9);
    }
    
    document.getElementById('sell-price').textContent = sellVal;
}

// Check if tower is in range of a Tier 5 Tribute King (Tax Overlord) for sell bonus
function checkNearbyTaxOverlordSellBonus(tower) {
    for (let t of state.towers) {
        if (t.type === 'king' && t.branch === 'branch3' && t.upgradeLevel === 5) {
            const dist = Math.hypot(t.x - tower.x, t.y - tower.y);
            if (dist <= t.stats.range) return true;
        }
    }
    return false;
}

// Update the upgrade cards inside the inspector panel
function updateUpgradeButtons() {
    if (!state.selectedTower) return;
    const t = state.selectedTower;
    const template = TOWER_TEMPLATES[t.type];
    
    const container = document.getElementById('upgrade-options');
    container.innerHTML = '';
    
    // Loop through 3 branches
    Object.keys(template.upgradeTree).forEach(branchKey => {
        const branch = template.upgradeTree[branchKey];
        
        // Determine branch status
        let isLocked = false;
        if (t.branch !== null && t.branch !== branchKey) {
            isLocked = true; // Specialized in a different branch
        }
        
        const nextLevelIndex = (t.branch === branchKey) ? t.upgradeLevel : 0;
        const maxUpgrades = branch.levels.length; // 5 levels
        
        const card = document.createElement('div');
        card.className = 'upgrade-option';
        
        if (isLocked) {
            card.classList.add('disabled');
            card.innerHTML = `
                <div class="upgrade-details">
                    <span class="upgrade-title" style="color: var(--text-muted);">${branch.name}</span>
                    <span class="upgrade-desc">Branch Locked</span>
                </div>
            `;
        } else if (t.upgradeLevel >= maxUpgrades && t.branch === branchKey) {
            card.innerHTML = `
                <div class="upgrade-details">
                    <span class="upgrade-title" style="color: #10b981;">${branch.name}</span>
                    <span class="upgrade-desc">Specialization Maximized</span>
                </div>
                <div class="upgrade-max">MAX</div>
            `;
        } else {
            const nextUpgrade = branch.levels[nextLevelIndex];
            
            // Adjust upgrade cost if under King Taxation buffs (10% or 25% discount)
            let finalCost = nextUpgrade.cost;
            const discount = getKingUpgradeDiscount(t);
            if (discount > 0) {
                finalCost = Math.round(finalCost * (1 - discount));
            }
            
            const isAffordable = state.tokens >= finalCost;
            if (!isAffordable) {
                card.classList.add('disabled');
            }
            
            card.innerHTML = `
                <div class="upgrade-details">
                    <span class="upgrade-title">${nextUpgrade.title} (Tier ${nextLevelIndex + 1})</span>
                    <span class="upgrade-desc">${nextUpgrade.desc}</span>
                </div>
                <div class="upgrade-cost"><i class="fa-solid fa-coins"></i> ${finalCost}</div>
            `;
            
            if (isAffordable) {
                card.addEventListener('click', () => {
                    buyUpgrade(branchKey, finalCost);
                });
            }
        }
        
        container.appendChild(card);
    });
}

// Find upgrade discounts from nearby taxation Kings
function getKingUpgradeDiscount(tower) {
    let bestDiscount = 0;
    for (let t of state.towers) {
        if (t.type === 'king' && t.branch === 'branch3') {
            const dist = Math.hypot(t.x - tower.x, t.y - tower.y);
            if (dist <= t.stats.range) {
                if (t.upgradeLevel === 5) {
                    bestDiscount = Math.max(bestDiscount, 0.25); // Tier 5: 25% off
                } else if (t.upgradeLevel >= 1) {
                    bestDiscount = Math.max(bestDiscount, 0.10); // Tier 1+: 10% off
                }
            }
        }
    }
    return bestDiscount;
}

// Buy an upgrade branch level
function buyUpgrade(branchKey, cost) {
    if (!state.selectedTower || state.tokens < cost) return;
    
    state.tokens -= cost;
    playSound('buy');
    
    const t = state.selectedTower;
    if (t.branch === null) {
        t.branch = branchKey;
        t.upgradeLevel = 1;
    } else {
        t.upgradeLevel++;
    }
    
    // Reapply base stats first, then compound upgrades sequentially
    const template = TOWER_TEMPLATES[t.type];
    t.stats = { ...template };
    
    // Apply branch level changes up to active upgradeLevel
    const branch = template.upgradeTree[branchKey];
    for (let i = 0; i < t.upgradeLevel; i++) {
        const u = branch.levels[i];
        Object.keys(u).forEach(key => {
            if (key !== 'title' && key !== 'desc' && key !== 'cost') {
                t.stats[key] = u[key];
            }
        });
    }
    
    selectTower(t); // Refresh UI
    updateHUD();
}

// Sell selected tower
function sellSelectedTower() {
    if (!state.selectedTower) return;
    const t = state.selectedTower;
    
    const sellPrice = parseInt(document.getElementById('sell-price').textContent);
    state.tokens += sellPrice;
    playSound('sell');
    
    // Remove from array
    state.towers = state.towers.filter(tw => tw.id !== t.id);
    
    deselectTower();
    updateHUD();
}

// Start wave spawning
function startWave() {
    if (state.isWaveActive) return;
    
    state.isWaveActive = true;
    state.projectiles = [];
    
    // Add start round bonus tokens based on Tribute Towers
    let startBonus = 0;
    state.towers.forEach(t => {
        if (t.type === 'squire' && t.branch === 'branch3' && t.upgradeLevel >= 3) {
            startBonus += 15; // Tier 3 Squire Gold Hunter
        }
        if (t.type === 'king' && t.branch === 'branch3' && t.upgradeLevel === 5) {
            startBonus += 100; // Tier 5 King Overlord round bonus
        }
    });
    
    if (startBonus > 0) {
        state.tokens += startBonus;
        updateHUD();
    }
    
    // Wave configuration: generate sequence of enemies
    state.spawnQueue = [];
    const count = 5 + state.wave * 3;
    const healthMultiplier = Math.pow(1.03, state.wave - 1);
    
    // Determine enemy mix based on wave number
    for (let i = 0; i < count; i++) {
        let type = 'slime';
        if (state.wave >= 2 && i % 4 === 0) type = 'runner';
        if (state.wave >= 4 && i % 5 === 0) type = 'golem';
        if (state.wave >= 6 && i % 6 === 0) type = 'spirit';
        
        // Spawn boss/tank on specific waves, otherwise general boss every 5 waves
        if (state.wave === 10 && i === count - 1) {
            type = 'stronger_boss';
        } else if (state.wave === 25 && i === count - 1) {
            type = 'super_boss';
        } else if (state.wave === 100 && i === count - 1) {
            type = 'tank';
        } else if (state.wave % 5 === 0 && i === count - 1) {
            type = 'boss';
        }
        
        const template = ENEMY_TEMPLATES[type];
        let hpVal = Math.round(template.hp * healthMultiplier);
        if (type === 'stronger_boss') hpVal = 75;
        else if (type === 'super_boss') hpVal = 150;
        else if (type === 'tank') hpVal = 500;
        
        state.spawnQueue.push({
            type: type,
            hp: hpVal,
            maxHp: hpVal,
            speed: template.speed,
            size: template.size,
            color: template.color,
            reward: template.reward,
            armored: template.armored || false,
            immuneToSlow: template.immuneToSlow || false,
            boss: template.boss || false,
            
            pathIndex: 0,
            x: MAPS[state.activeMap].path[0].x,
            y: MAPS[state.activeMap].path[0].y,
            distTraveled: 0,
            activeEffects: [] // Slow, stun, bleed effects
        });
    }
    
    // Spawner loop
    let spawnTimer = 0;
    const spawnInterval = 45; // Frames between spawns
    
    function spawner() {
        if (!state.isWaveActive || state.gameState !== 'playing') return;
        
        if (state.spawnQueue.length > 0) {
            spawnTimer++;
            if (spawnTimer >= spawnInterval / state.activeSpeed) {
                spawnTimer = 0;
                state.enemies.push(state.spawnQueue.shift());
            }
            requestAnimationFrame(spawner);
        }
    }
    spawner();
    
    playSound('victory');
}

// End Wave sequence
function endWave() {
    state.isWaveActive = false;
    
    // Round end tokens: base 100 + round bonuses
    let roundReward = 100;
    state.towers.forEach(t => {
        if (t.type === 'king' && t.branch === 'branch3') {
            if (t.upgradeLevel >= 2) roundReward += 25; // Tier 2+ King Round bonus
        }
        if (t.type === 'drawbridge' && t.branch === 'branch3') {
            if (t.upgradeLevel === 3) roundReward += 20;
            else if (t.upgradeLevel === 4) roundReward += 40;
            else if (t.upgradeLevel === 5) roundReward += 150;
        }
    });
    
    state.tokens += roundReward;
    state.wave++;
    
    updateHUD();
    deselectTower();
    playSound('buy');
}

// Main Frame Update Loop
let lastTime = 0;
function update(time) {
    if (state.gameState === 'playing') {
        const loopCount = state.activeSpeed;
        
        for (let i = 0; i < loopCount; i++) {
            updateEnemies();
            updateTowers();
            updateProjectiles();
        }
    }
    
    draw();
    requestAnimationFrame(update);
}

// Update Active Enemies
function updateEnemies() {
    const map = MAPS[state.activeMap];
    
    for (let i = state.enemies.length - 1; i >= 0; i--) {
        const e = state.enemies[i];
        
        // Apply passive aura damage from Golem spiked armor aura
        applyGolemSpikedAura(e);
        
        // Process active status effects (Slow, stun, bleed DoT)
        processEffects(e);
        
        if (e.hp <= 0) {
            killEnemy(e, i);
            continue;
        }
        
        // Check movement speed
        let speedMultiplier = 1;
        let isStunned = false;
        
        e.activeEffects.forEach(eff => {
            if (eff.type === 'slow' && !e.immuneToSlow) {
                speedMultiplier = Math.min(speedMultiplier, eff.factor);
            }
            if (eff.type === 'stun') {
                isStunned = true;
            }
        });
        
        if (!isStunned) {
            // Check if blocked by any closed drawbridge
            let isBlocked = false;
            let targetBridge = null;
            
            for (let t of state.towers) {
                if (t.type === 'drawbridge' && t.bridgeState === 'closed') {
                    const step = e.speed * speedMultiplier;
                    if (e.distTraveled <= t.distAlongTrack && e.distTraveled + Math.max(step, 8) >= t.distAlongTrack) {
                        isBlocked = true;
                        targetBridge = t;
                        break;
                    }
                }
            }
            
            if (isBlocked) {
                // Stop exactly at the bridge!
                const bridgePos = getPointAtDist(targetBridge.distAlongTrack);
                e.x = bridgePos.x;
                e.y = bridgePos.y;
                e.distTraveled = targetBridge.distAlongTrack;
                e.pathIndex = bridgePos.segmentIndex;
            } else {
                // Move along path segments
                const currentTarget = map.path[e.pathIndex + 1];
                if (!currentTarget) {
                    // Reached end of path! Lose life
                    state.lives -= e.boss ? 25 : 1;
                    playSound('hurt');
                    state.enemies.splice(i, 1);
                    
                    if (state.lives <= 0) {
                        state.lives = 0;
                        gameOver();
                    }
                    continue;
                }
                
                const dx = currentTarget.x - e.x;
                const dy = currentTarget.y - e.y;
                const dist = Math.hypot(dx, dy);
                const step = e.speed * speedMultiplier;
                
                if (dist <= step) {
                    e.x = currentTarget.x;
                    e.y = currentTarget.y;
                    e.pathIndex++;
                } else {
                    e.x += (dx / dist) * step;
                    e.y += (dy / dist) * step;
                    e.distTraveled += step;
                }
            }
            
            // Check if we passed any open drawbridges in this frame to collect Tolls
            state.towers.forEach(t => {
                if (t.type === 'drawbridge') {
                    if (!e.paidBridges) e.paidBridges = [];
                    if (!e.paidBridges.includes(t.id)) {
                        if (e.distTraveled >= t.distAlongTrack) {
                            e.paidBridges.push(t.id);
                            
                            // Generate tokens if Toll/Gold path is active
                            if (t.branch === 'branch3' && t.upgradeLevel > 0) {
                                let payment = 3;
                                if (t.upgradeLevel === 2) payment = 6;
                                if (t.upgradeLevel === 4) payment = 12;
                                if (t.upgradeLevel === 5) payment = 20;
                                
                                state.tokens += payment;
                                updateHUD();
                                playSound('buy');
                            }
                        }
                    }
                }
            });
        }
    }
    
    // Check if wave finished (all spawned enemies dead or escaped)
    if (state.isWaveActive && state.enemies.length === 0 && state.spawnQueue.length === 0) {
        endWave();
    }
}

// Bleed and status effects duration handler
function processEffects(e) {
    e.activeEffects = e.activeEffects.filter(eff => {
        eff.duration -= 16.6 * state.activeSpeed; // Milliseconds per frame
        
        // DoT damage tick
        if (eff.type === 'dot') {
            eff.tickTimer = (eff.tickTimer || 0) + 16.6 * state.activeSpeed;
            if (eff.tickTimer >= 500) {
                eff.tickTimer = 0;
                e.hp -= eff.damage;
            }
        }
        
        return eff.duration > 0;
    });
}

// Golem Spiked Hide Aura damage
function applyGolemSpikedAura(enemy) {
    state.towers.forEach(t => {
        if (t.type === 'golem' && t.branch === 'branch3' && t.stats.auraDamage > 0) {
            const dist = Math.hypot(t.x - enemy.x, t.y - enemy.y);
            if (dist <= t.stats.range) {
                // Apply aura damage occasionally (once every 10 frames)
                if (Math.random() < 0.1) {
                    enemy.hp -= t.stats.auraDamage;
                    
                    // Apply bleed DoT if Razor Spikes tier is active
                    if (t.upgradeLevel >= 2) {
                        applyEffect(enemy, {
                            type: 'dot',
                            duration: 2500,
                            damage: t.upgradeLevel >= 4 ? 8 : 4
                        });
                    }
                }
            }
        }
    });
}

// Apply status effect helper
function applyEffect(enemy, effect) {
    // Avoid double stacking slows/stuns
    const existing = enemy.activeEffects.find(eff => eff.type === effect.type);
    if (existing) {
        existing.duration = Math.max(existing.duration, effect.duration);
        if (effect.factor) existing.factor = Math.min(existing.factor, effect.factor);
    } else {
        enemy.activeEffects.push({ ...effect });
    }
}

// Kill Enemy Rewards
function killEnemy(enemy, index) {
    // Reward tokens
    let finalReward = enemy.reward;
    
    // Check nearby tax collectors
    state.towers.forEach(t => {
        if (t.type === 'squire' && t.branch === 'branch3' && t.upgradeLevel >= 1) {
            const dist = Math.hypot(t.x - enemy.x, t.y - enemy.y);
            if (dist <= t.stats.range) {
                finalReward += t.stats.bonusKillTokens || 0;
            }
        }
        if (t.type === 'king' && t.branch === 'branch3') {
            const dist = Math.hypot(t.x - enemy.x, t.y - enemy.y);
            if (dist <= t.stats.range) {
                if (t.upgradeLevel === 5) {
                    finalReward += 10;
                } else if (t.upgradeLevel >= 1) {
                    finalReward += 2;
                }
            }
        }
    });
    
    state.tokens += finalReward;
    state.enemies.splice(index, 1);
    playSound('hit');
    updateHUD();
}

// Cancel current tower buying/placement or check drawbridge block
function isEnemyBlockedAtBridge(enemy, bridge) {
    return Math.abs(enemy.distTraveled - bridge.distAlongTrack) < 1.0;
}

// Update drawbridge utility block timing, state, spikes, and slows
function updateDrawbridge(t) {
    const dt = 16.6 * state.activeSpeed; // milliseconds per frame
    if (!t.stateTimer) t.stateTimer = 0;
    if (!t.bridgeState) t.bridgeState = 'closed';
    
    // Determine closed duration based on Branch 2 upgrades
    let closedDuration = 4000; // 4 seconds base
    if (t.branch === 'branch2') {
        const extraSecs = [500, 1000, 1500, 2000, 3000]; // 4.5s, 5s, 5.5s, 6s, 7s
        closedDuration += extraSecs[t.upgradeLevel - 1] || 0;
    }
    
    t.stateTimer += dt;
    
    if (t.bridgeState === 'closed') {
        if (t.stateTimer >= closedDuration) {
            t.bridgeState = 'open';
            t.stateTimer = 0;
            playSound('sell'); // sound cue for opening
        } else {
            // Damage blocked enemies if Branch 1 (spikes) is upgraded
            if (t.branch === 'branch1' && t.upgradeLevel > 0) {
                const dpsValues = [5, 12, 25, 50, 150];
                const dps = dpsValues[t.upgradeLevel - 1] || 0;
                const dmgPerFrame = (dps * dt) / 1000;
                
                state.enemies.forEach(e => {
                    if (isEnemyBlockedAtBridge(e, t)) {
                        e.hp -= dmgPerFrame;
                        
                        // Apply bleed if Tier 3 Razor Teeth is active
                        if (t.upgradeLevel >= 3 && Math.random() < 0.05) {
                            applyEffect(e, { type: 'dot', duration: 3000, damage: 4 });
                        }
                    }
                });
            }
        }
    } else { // open state
        if (t.stateTimer >= 2000) { // 2 seconds open duration
            t.bridgeState = 'closed';
            t.stateTimer = 0;
            playSound('buy'); // sound cue for closing
        } else {
            // Apply slow if Spike Pit is active (Branch 1, Level 4+)
            if (t.branch === 'branch1' && t.upgradeLevel >= 4) {
                state.enemies.forEach(e => {
                    const dist = Math.hypot(e.x - t.x, e.y - t.y);
                    if (dist <= 35) {
                        applyEffect(e, { type: 'slow', duration: 1500, factor: 0.7 });
                    }
                });
            }
        }
    }
}

// Update deployed towers
function updateTowers() {
    const now = Date.now();
    
    state.towers.forEach(t => {
        if (t.type === 'drawbridge') {
            updateDrawbridge(t);
            return;
        }
        if (t.stats.fireRate === 0) return; // Support towers (King) do not shoot
        
        // Aiming target search
        const targets = getTargetsInRange(t);
        let target = null;
        
        if (targets.length > 0) {
            if (t.targetStrategy === 'first') {
                target = targets.sort((a, b) => b.distTraveled - a.distTraveled)[0];
            } else if (t.targetStrategy === 'last') {
                target = targets.sort((a, b) => a.distTraveled - b.distTraveled)[0];
            } else if (t.targetStrategy === 'strongest') {
                target = targets.sort((a, b) => b.hp - a.hp)[0];
            } else if (t.targetStrategy === 'weakest') {
                target = targets.sort((a, b) => a.hp - b.hp)[0];
            } else if (t.targetStrategy === 'nearest') {
                target = targets.sort((a, b) => Math.hypot(a.x - t.x, a.y - t.y) - Math.hypot(b.x - t.x, b.y - t.y))[0];
            }
        }
        
        if (target) {
            // Calculate aim angle
            t.angle = Math.atan2(target.y - t.y, target.x - t.x);
            
            // Check fire rate cooldown
            let baseFireRate = t.stats.fireRate;
            if (t.type === 'squire' && t.branch === 'branch2' && t.upgradeLevel >= 4) {
                // Berserker Force: +10% attack speed for each nearby enemy within range
                const range = t.stats.range * getKingRangeBuff(t);
                const nearbyEnemiesCount = state.enemies.filter(e => Math.hypot(e.x - t.x, e.y - t.y) <= range).length;
                baseFireRate *= (1 + 0.10 * nearbyEnemiesCount);
            }
            
            let fireInterval = 1000 / (baseFireRate * getKingSpeedBuff(t));
            if (t.type === 'god_tower') {
                fireInterval = 10000; // Fires exactly every 10 seconds
            }
            if (now - t.lastShot >= fireInterval) {
                t.lastShot = now;
                fireTower(t, target);
            }
        }
    });
}

// Find targets within range
function getTargetsInRange(tower) {
    const range = tower.stats.range * getKingRangeBuff(tower);
    return state.enemies.filter(e => Math.hypot(e.x - tower.x, e.y - tower.y) <= range);
}

// King Damage multiplier Buff calculation
function getKingDamageBuff(tower) {
    let multiplier = 1;
    state.towers.forEach(t => {
        if (t.type === 'king' && t.branch === 'branch1') {
            const dist = Math.hypot(t.x - tower.x, t.y - tower.y);
            if (dist <= t.stats.range) {
                if (t.upgradeLevel === 5) multiplier = Math.max(multiplier, 1.5);
                else if (t.upgradeLevel >= 3) multiplier = Math.max(multiplier, 1.25);
                else if (t.upgradeLevel >= 1) multiplier = Math.max(multiplier, 1.15);
            }
        }
        // Drawbridge Keep of the Realm damage buff (+15% damage to nearby towers in 120px range)
        if (t.type === 'drawbridge' && t.branch === 'branch2' && t.upgradeLevel === 5) {
            const dist = Math.hypot(t.x - tower.x, t.y - tower.y);
            if (dist <= 120) {
                multiplier = Math.max(multiplier, 1.15);
            }
        }
    });
    return multiplier;
}

// King Speed multiplier Buff calculation
function getKingSpeedBuff(tower) {
    let multiplier = 1;
    state.towers.forEach(t => {
        if (t.type === 'king' && t.branch === 'branch2') {
            const dist = Math.hypot(t.x - tower.x, t.y - tower.y);
            if (dist <= t.stats.range) {
                if (t.upgradeLevel === 5) multiplier = Math.max(multiplier, 1.5);
                else if (t.upgradeLevel >= 4) multiplier = Math.max(multiplier, 1.35);
                else if (t.upgradeLevel >= 2) multiplier = Math.max(multiplier, 1.25);
                else if (t.upgradeLevel >= 1) multiplier = Math.max(multiplier, 1.15);
            }
        }
    });
    return multiplier;
}

// King Range multiplier Buff calculation
function getKingRangeBuff(tower) {
    let multiplier = 1;
    state.towers.forEach(t => {
        if (t.type === 'king') {
            const dist = Math.hypot(t.x - tower.x, t.y - tower.y);
            if (dist <= t.stats.range) {
                if (t.branch === 'branch1' && t.upgradeLevel >= 3) multiplier = Math.max(multiplier, 1.15);
                if (t.branch === 'branch2') {
                    if (t.upgradeLevel === 5) multiplier = Math.max(multiplier, 1.25);
                    else if (t.upgradeLevel >= 3) multiplier = Math.max(multiplier, 1.15);
                }
            }
        }
    });
    return multiplier;
}

// Fire Projectile
function fireTower(tower, target) {
    playSound(`shoot_${tower.type}`);
    
    // God Tower global lightning strikes
    if (tower.type === 'god_tower') {
        const targets = state.enemies.filter(e => e.hp > 0);
        targets.forEach(e => {
            e.hp -= 100;
        });
        tower.godStrikes = targets.map(e => ({ x: e.x, y: e.y }));
        setTimeout(() => { tower.godStrikes = null; }, 150);
        return;
    }
    
    // Squire Knight Path AoE Spin (No projectile)
    if (tower.type === 'squire' && tower.stats.isAoeAround) {
        const range = tower.stats.range * getKingRangeBuff(tower);
        state.enemies.forEach(e => {
            if (Math.hypot(e.x - tower.x, e.y - tower.y) <= range) {
                let finalDmg = tower.stats.damage * getKingDamageBuff(tower);
                
                // Double damage check if Berserker force is active (Level 4: +10% speed/damage per nearby enemy)
                if (tower.upgradeLevel >= 4) {
                    const enemiesCount = state.enemies.filter(enemy => Math.hypot(enemy.x - tower.x, enemy.y - tower.y) <= range).length;
                    finalDmg *= (1 + 0.1 * enemiesCount);
                }
                
                e.hp -= Math.round(finalDmg);
            }
        });
        spawnSlamWave(tower.x, tower.y, range);
        return;
    }
    
    // Golem Slam is instant splash, no projectile
    if (tower.type === 'golem' && !tower.stats.isLaser) {
        if (tower.stats.globalStun) {
            // World Breaker slam
            state.enemies.forEach(e => {
                e.hp -= tower.stats.damage * getKingDamageBuff(tower);
                applyEffect(e, { type: 'stun', duration: tower.stats.stunDuration });
            });
            spawnSlamWave(tower.x, tower.y, 300);
        } else {
            // Local Golem slam
            const range = tower.stats.range * getKingRangeBuff(tower);
            state.enemies.forEach(e => {
                if (Math.hypot(e.x - tower.x, e.y - tower.y) <= range) {
                    let finalDmg = tower.stats.damage * getKingDamageBuff(tower);
                    
                    // Double damage to stunned targets (Ground Smasher)
                    const isStunned = e.activeEffects.some(eff => eff.type === 'stun');
                    if (isStunned && tower.upgradeLevel >= 3) {
                        finalDmg *= 2;
                    }
                    
                    e.hp -= finalDmg;
                    
                    if (tower.stats.stunDuration) {
                        applyEffect(e, { type: 'stun', duration: tower.stats.stunDuration });
                    }
                }
            });
            spawnSlamWave(tower.x, tower.y, range);
        }
        return;
    }
    
    // Laser Beam (Golem crystals)
    if (tower.type === 'golem' && tower.stats.isLaser) {
        const maxTargets = tower.stats.laserTargets || 1;
        const targets = getTargetsInRange(tower).slice(0, maxTargets);
        
        targets.forEach(targ => {
            targ.hp -= tower.stats.damage * getKingDamageBuff(tower) * 0.15; // Lasers tick rapidly
            
            // Focus beam multiplier
            if (tower.upgradeLevel >= 2) {
                applyEffect(targ, {
                    type: 'dot',
                    duration: 1500,
                    damage: 2
                });
            }
        });
        
        // Save targeted lasers to render during Draw phase
        tower.laserLines = targets.map(targ => ({ x: targ.x, y: targ.y }));
        return;
    }
    
    // Chain Lightning Mage
    if (tower.type === 'mage' && tower.stats.chainCount) {
        const chained = [];
        let curr = target;
        let chainsLeft = tower.stats.chainCount;
        
        while (curr && chainsLeft > 0) {
            chained.push({ x: curr.x, y: curr.y });
            curr.hp -= tower.stats.damage * getKingDamageBuff(tower);
            
            if (tower.stats.stunDuration) {
                applyEffect(curr, { type: 'stun', duration: tower.stats.stunDuration });
            }
            
            // Find next closest target within chain range (e.g. 100px)
            let next = null;
            let bestDist = 120;
            
            state.enemies.forEach(e => {
                if (e.hp > 0 && !chained.some(c => e.x === c.x && e.y === c.y)) {
                    const dist = Math.hypot(e.x - curr.x, e.y - curr.y);
                    if (dist < bestDist) {
                        bestDist = dist;
                        next = e;
                    }
                }
            });
            
            curr = next;
            chainsLeft--;
        }
        
        // Save chain lightning line segments to render during Draw
        tower.lightningChain = [{ x: tower.x, y: tower.y }, ...chained];
        setTimeout(() => { tower.lightningChain = null; }, 120);
        return;
    }
    
    // Calculate critical hit chance
    let baseDamage = tower.stats.damage * getKingDamageBuff(tower);
    let isCrit = false;
    if (tower.stats.critChance && Math.random() < tower.stats.critChance) {
        baseDamage *= (tower.stats.critMultiplier || 2);
        isCrit = true;
    }
    const finalDamage = Math.round(baseDamage);

    // Multiple projectile branch (e.g. Archer / Ninja Quad Shuriken fan)
    if (tower.stats.extraProjectiles) {
        const extra = tower.stats.extraProjectiles;
        const spread = 0.25; // radians spread
        
        for (let i = -extra/2; i <= extra/2; i++) {
            const angleOffset = i * spread;
            const cos = Math.cos(tower.angle + angleOffset);
            const sin = Math.sin(tower.angle + angleOffset);
            
            state.projectiles.push({
                x: tower.x,
                y: tower.y,
                vx: cos * tower.stats.bulletSpeed,
                vy: sin * tower.stats.bulletSpeed,
                damage: finalDamage,
                isCrit: isCrit,
                pierce: tower.stats.pierce || 1,
                hitEnemies: [], // Avoid hitting same target twice
                
                type: tower.type,
                branch: tower.branch,
                upgradeLevel: tower.upgradeLevel
            });
        }
        return;
    }
    
    // Default single projectile (Archer, Mage balls, Ninja shurikens)
    const cos = Math.cos(tower.angle);
    const sin = Math.sin(tower.angle);
    
    state.projectiles.push({
        x: tower.x,
        y: tower.y,
        vx: cos * tower.stats.bulletSpeed,
        vy: sin * tower.stats.bulletSpeed,
        damage: finalDamage,
        isCrit: isCrit,
        pierce: tower.stats.pierce || 1,
        slowFactor: tower.stats.slowFactor || 1,
        stunDuration: tower.stats.stunDuration || 0,
        splashRadius: tower.stats.splashRadius || 0,
        dotDamage: tower.stats.dotDamage || 0,
        
        hitEnemies: [],
        type: tower.type,
        branch: tower.branch,
        upgradeLevel: tower.upgradeLevel
    });
}

// Spawn slam wave animation details
const activeSlamWaves = [];
function spawnSlamWave(x, y, radius) {
    activeSlamWaves.push({ x, y, maxR: radius, currR: 5 });
}

// Update flying projectiles
function updateProjectiles() {
    for (let i = state.projectiles.length - 1; i >= 0; i--) {
        const p = state.projectiles[i];
        p.x += p.vx;
        p.y += p.vy;
        
        // Remove out-of-bounds projectiles
        if (p.x < -20 || p.x > 820 || p.y < -20 || p.y > 570) {
            state.projectiles.splice(i, 1);
            continue;
        }
        
        // Check collision with enemies
        for (let enemy of state.enemies) {
            if (p.hitEnemies.includes(enemy)) continue;
            
            const dist = Math.hypot(enemy.x - p.x, enemy.y - p.y);
            if (dist < (enemy.size / 2 + 6)) {
                p.hitEnemies.push(enemy);
                p.pierce--;
                
                // Deal Damage (Armored Golems take half physical damage but full magical Mage damage)
                let dmg = p.damage;
                if (enemy.armored && (p.type === 'squire' || p.type === 'ninja')) {
                    dmg = Math.round(dmg * 0.5);
                }
                enemy.hp -= dmg;
                
                // Apply status effects
                if (p.slowFactor < 1) {
                    applyEffect(enemy, { type: 'slow', duration: 2000, factor: p.slowFactor });
                }
                if (p.stunDuration > 0) {
                    applyEffect(enemy, { type: 'stun', duration: p.stunDuration });
                }
                if (p.dotDamage > 0) {
                    applyEffect(enemy, { type: 'dot', duration: 3000, damage: p.dotDamage });
                }
                
                // Exploding fire Mage splash radius
                if (p.splashRadius > 0) {
                    state.enemies.forEach(e => {
                        if (e !== enemy) {
                            const splashDist = Math.hypot(e.x - p.x, e.y - p.y);
                            if (splashDist <= p.splashRadius) {
                                e.hp -= Math.round(p.damage * 0.7);
                                
                                if (p.dotDamage > 0) {
                                    applyEffect(e, { type: 'dot', duration: 3000, damage: p.dotDamage });
                                }
                                if (p.slowFactor < 1) {
                                    applyEffect(e, { type: 'slow', duration: 2000, factor: p.slowFactor });
                                }
                            }
                        }
                    });
                    spawnSlamWave(p.x, p.y, p.splashRadius);
                }
                
                // Ninja execute master
                if (p.type === 'ninja' && p.branch === 'branch2' && p.upgradeLevel === 5) {
                    if (enemy.hp < enemy.maxHp * 0.20 && !enemy.boss) {
                        enemy.hp = 0; // Execution!
                    }
                }
                
                // Pierce check
                if (p.pierce <= 0) {
                    state.projectiles.splice(i, 1);
                    break;
                }
            }
        }
    }
}

// Game Over sequence
function gameOver() {
    state.gameState = 'game_over';
    state.isWaveActive = false;
    document.getElementById('game-over-modal').classList.remove('hidden');
    playSound('hurt');
}

// DRAWING CANVAS ENGINE
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background grid
    ctx.fillStyle = MAPS[state.activeMap].background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid wires (subtle Blooket TD look)
    ctx.strokeStyle = 'rgba(255,255,255,0.02)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 40) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }
    
    // Draw Track Path
    drawTrack();
    
    // Draw Golem Laser beams
    drawGolemLasers();
    
    // Draw Lightning chains
    drawLightningChains();
    
    // Draw God strikes
    drawGodStrikes();
    
    // Draw Projectiles
    drawProjectiles();
    
    // Draw Enemies
    state.enemies.forEach(e => {
        drawEnemyBlook(e);
    });
    
    // Draw Towers
    state.towers.forEach(t => {
        drawTowerBlook(t);
    });
    
    // Draw Placement range or preview Blook if active
    drawPlacementPreview();
    
    // Draw Golem Slam waves
    drawSlamWaves();
}

// Draw Track Path with neon glows
function drawTrack() {
    const map = MAPS[state.activeMap];
    
    // Draw outer glow border
    ctx.strokeStyle = map.trackBorder;
    ctx.lineWidth = 44;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    map.path.forEach((p, idx) => {
        if (idx === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
    });
    ctx.stroke();
    
    // Draw inner path core
    ctx.strokeStyle = map.trackColor;
    ctx.lineWidth = 38;
    ctx.beginPath();
    map.path.forEach((p, idx) => {
        if (idx === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
    });
    ctx.stroke();
}

// Draw laser beams
function drawGolemLasers() {
    state.towers.forEach(t => {
        if (t.type === 'golem' && t.stats.isLaser && t.laserLines) {
            ctx.lineWidth = t.upgradeLevel === 5 ? 5 : 3;
            ctx.lineCap = 'round';
            
            t.laserLines.forEach(l => {
                // Outer neon glow
                ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
                ctx.beginPath();
                ctx.moveTo(t.x, t.y);
                ctx.lineTo(l.x, l.y);
                ctx.stroke();
                
                // Inner bright beam
                ctx.strokeStyle = '#6ee7b7';
                ctx.lineWidth = t.upgradeLevel === 5 ? 2.5 : 1.5;
                ctx.beginPath();
                ctx.moveTo(t.x, t.y);
                ctx.lineTo(l.x, l.y);
                ctx.stroke();
            });
            
            // Laser clears after frame draw
            t.laserLines = null;
        }
    });
}

// Draw chain lightning bolts
function drawLightningChains() {
    state.towers.forEach(t => {
        if (t.type === 'mage' && t.lightningChain) {
            ctx.strokeStyle = '#60a5fa';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            
            t.lightningChain.forEach((p, idx) => {
                if (idx === 0) ctx.moveTo(p.x, p.y);
                else {
                    // Generate lightning jagged zig-zags
                    const prev = t.lightningChain[idx - 1];
                    const midX = (prev.x + p.x) / 2 + (Math.random() - 0.5) * 15;
                    const midY = (prev.y + p.y) / 2 + (Math.random() - 0.5) * 15;
                    ctx.lineTo(midX, midY);
                    ctx.lineTo(p.x, p.y);
                }
            });
            ctx.stroke();
            
            // Draw bright core
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1;
            ctx.beginPath();
            t.lightningChain.forEach((p, idx) => {
                if (idx === 0) ctx.moveTo(p.x, p.y);
                else {
                    const prev = t.lightningChain[idx - 1];
                    const midX = (prev.x + p.x) / 2 + (Math.random() - 0.5) * 6;
                    const midY = (prev.y + p.y) / 2 + (Math.random() - 0.5) * 6;
                    ctx.lineTo(midX, midY);
                    ctx.lineTo(p.x, p.y);
                }
            });
            ctx.stroke();
        }
    });
}

// Draw project projectiles
function drawProjectiles() {
    state.projectiles.forEach(p => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(Math.atan2(p.vy, p.vx));
        
        if (p.type === 'squire') {
            if (p.branch === 'branch1' && p.upgradeLevel >= 3) {
                // Shuriken
                ctx.fillStyle = '#94a3b8';
                ctx.beginPath();
                ctx.arc(0, 0, 8, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = '#cbd5e1';
                ctx.lineWidth = 2;
                ctx.stroke();
            } else {
                // Arrow
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 3;
                ctx.beginPath(); ctx.moveTo(-8, 0); ctx.lineTo(8, 0); ctx.stroke();
                ctx.fillStyle = '#6366f1';
                ctx.beginPath(); ctx.moveTo(8, -3); ctx.lineTo(12, 0); ctx.lineTo(8, 3); ctx.fill();
            }
        } else if (p.type === 'mage') {
            if (p.branch === 'branch1') {
                // Fireball
                const rad = p.splashRadius > 40 ? 12 : 8;
                const grad = ctx.createRadialGradient(0, 0, 1, 0, 0, rad);
                grad.addColorStop(0, '#ffffff');
                grad.addColorStop(0.3, '#f97316');
                grad.addColorStop(1, 'rgba(239, 68, 68, 0)');
                ctx.fillStyle = grad;
                ctx.beginPath(); ctx.arc(0, 0, rad, 0, Math.PI*2); ctx.fill();
            } else {
                // Ice shard
                ctx.fillStyle = '#67e8f9';
                ctx.beginPath();
                ctx.moveTo(8, 0); ctx.lineTo(-4, -4); ctx.lineTo(-4, 4);
                ctx.closePath(); ctx.fill();
            }
        } else if (p.type === 'ninja') {
            // Shurikens / Knives
            ctx.fillStyle = '#38bdf8';
            if (p.branch === 'branch1') {
                // Spikey Star
                ctx.beginPath();
                for (let i = 0; i < 4; i++) {
                    ctx.rotate(Math.PI / 2);
                    ctx.lineTo(0, -9); ctx.lineTo(2, -3);
                }
                ctx.fill();
            } else {
                // Kunai
                ctx.strokeStyle = '#e2e8f0';
                ctx.lineWidth = 2.5;
                ctx.beginPath(); ctx.moveTo(-6, 0); ctx.lineTo(6, 0); ctx.stroke();
            }
        }
        ctx.restore();
    });
}

// Draw expanding slam waves
function drawSlamWaves() {
    for (let i = activeSlamWaves.length - 1; i >= 0; i--) {
        const w = activeSlamWaves[i];
        
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(w.x, w.y, w.currR, 0, Math.PI * 2);
        ctx.stroke();
        
        w.currR += 6 * state.activeSpeed;
        if (w.currR >= w.maxR) {
            activeSlamWaves.splice(i, 1);
        }
    }
}

// Placement range preview helper
function drawPlacementPreview() {
    if (state.placingTowerType && state.mouse.overCanvas) {
        const template = TOWER_TEMPLATES[state.placingTowerType];
        const range = template.range;
        let x = state.mouse.x;
        let y = state.mouse.y;
        let angle = 0;
        
        const valid = isValidPlacement(state.mouse.x, state.mouse.y);
        
        if (state.placingTowerType === 'drawbridge') {
            const proj = getPathProjection(x, y);
            x = proj.x;
            y = proj.y;
            
            const map = MAPS[state.activeMap];
            const p1 = map.path[proj.segmentIndex];
            const p2 = map.path[proj.segmentIndex + 1];
            angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
        }
        
        // Draw range circle
        ctx.fillStyle = valid ? 'rgba(99, 102, 241, 0.12)' : 'rgba(244, 63, 94, 0.12)';
        ctx.strokeStyle = valid ? 'rgba(99, 102, 241, 0.4)' : 'rgba(244, 63, 94, 0.4)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, range, 0, Math.PI*2);
        ctx.fill();
        ctx.stroke();
        
        // Draw ghost preview Blook
        ctx.save();
        ctx.globalAlpha = 0.5;
        drawBlook(ctx, state.placingTowerType, x, y, 40, angle, null, 0, 'closed');
        ctx.restore();
    }
    
    // Draw range of selected tower
    if (state.selectedTower) {
        const t = state.selectedTower;
        const range = t.stats.range * getKingRangeBuff(t);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.lineWidth = 2.5;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.arc(t.x, t.y, range, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Highlights selected tower with outer neon circle
        ctx.strokeStyle = '#5c6bc0';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(t.x, t.y, 25, 0, Math.PI * 2);
        ctx.stroke();
    }
}

// PROGRAMMATICAL BLOOK DRAWING ENGINES
// Draw static Blook icons for shop and previews
function drawBlookIcon(ctx, type, x, y, size, branch = null, upgradeLevel = 0) {
    ctx.clearRect(0, 0, size*2, size*2);
    drawBlook(ctx, type, x, y, size, 0, branch, upgradeLevel);
}

// Draw fully animated game-board Blooks
function drawTowerBlook(tower) {
    // Check if under King buffs for visual glow highlights
    let isBuffed = getKingDamageBuff(tower) > 1 || getKingSpeedBuff(tower) > 1;
    
    if (isBuffed) {
        ctx.strokeStyle = 'rgba(234, 179, 8, 0.25)';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.arc(tower.x, tower.y, 20, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    drawBlook(ctx, tower.type, tower.x, tower.y, 38, tower.angle, tower.branch, tower.upgradeLevel, tower.bridgeState);
}

// Core drawing engine for Blooks
function drawBlook(ctx, type, x, y, size, angle, branch, upgradeLevel, bridgeState = 'closed') {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    
    if (type === 'drawbridge') {
        // Draw custom drawbridge graphic:
        // Stone towers (top and bottom of track, locally along Y-axis)
        ctx.fillStyle = '#44403c'; // Dark stone
        ctx.strokeStyle = '#292524';
        ctx.lineWidth = 2.5;
        
        // Shadow for top/bottom towers
        ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
        ctx.beginPath();
        ctx.roundRect(-size/2 + 2, -size/2 - 6 + 3, size/3, size/3, 4);
        ctx.roundRect(-size/2 + 2, size/2 - size/3 + 6 + 3, size/3, size/3, 4);
        ctx.fill();
        
        // Top tower
        ctx.fillStyle = '#44403c';
        ctx.beginPath();
        ctx.roundRect(-size/2, -size/2 - 6, size/3, size/3, 4);
        ctx.fill(); ctx.stroke();
        
        // Bottom tower
        ctx.beginPath();
        ctx.roundRect(-size/2, size/2 - size/3 + 6, size/3, size/3, 4);
        ctx.fill(); ctx.stroke();
        
        // Draw battlements/crenelations on the towers
        ctx.fillStyle = '#292524';
        ctx.fillRect(-size/2 + 2, -size/2 - 8, 4, 3);
        ctx.fillRect(-size/6 - 4, -size/2 - 8, 4, 3);
        ctx.fillRect(-size/2 + 2, size/2 + 5, 4, 3);
        ctx.fillRect(-size/6 - 4, size/2 + 5, 4, 3);
        
        // Draw the wooden gate doors (swung closed or open)
        ctx.fillStyle = '#78350f'; // Warm wood brown
        ctx.strokeStyle = '#451a03';
        ctx.lineWidth = 3;
        
        const gateLength = size * 0.45;
        
        if (bridgeState === 'open') {
            // Left gate leaf swung open (parallel-ish to path)
            ctx.save();
            ctx.translate(-size/3, -size/3);
            ctx.rotate(-Math.PI / 4);
            ctx.fillRect(0, -3, gateLength, 6);
            ctx.strokeRect(0, -3, gateLength, 6);
            ctx.restore();
            
            // Right gate leaf swung open
            ctx.save();
            ctx.translate(-size/3, size/3);
            ctx.rotate(Math.PI / 4);
            ctx.fillRect(0, -3, gateLength, 6);
            ctx.strokeRect(0, -3, gateLength, 6);
            ctx.restore();
        } else {
            // Closed: meet in the middle (blocking the track)
            // Top half gate
            ctx.fillRect(-size/3, -size/3, 6, gateLength + 2);
            ctx.strokeRect(-size/3, -size/3, 6, gateLength + 2);
            
            // Bottom half gate
            ctx.fillRect(-size/3, size/3 - gateLength - 2, 6, gateLength + 2);
            ctx.strokeRect(-size/3, size/3 - gateLength - 2, 6, gateLength + 2);
            
            // Draw spikes if Branch 1 (spikes) is active
            if (branch === 'branch1') {
                ctx.fillStyle = '#ef4444'; // Red glowing spikes
                for (let sy = -size/3 + 4; sy <= size/3 - 4; sy += 8) {
                    ctx.beginPath();
                    ctx.moveTo(-size/3 + 6, sy);
                    ctx.lineTo(-size/3 + 12, sy + 3);
                    ctx.lineTo(-size/3 + 6, sy + 6);
                    ctx.fill();
                }
            }
        }
        
        // Draw cute little eyes on the top stone tower to fit classic Blooket style!
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(-size * 0.35, -size * 0.38, 4, 0, Math.PI * 2);
        ctx.arc(-size * 0.15, -size * 0.38, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(-size * 0.35, -size * 0.38, 2, 0, Math.PI * 2);
        ctx.arc(-size * 0.15, -size * 0.38, 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
        return;
    }
    
    const template = TOWER_TEMPLATES[type];
    const baseColor = template.color;
    
    // Calculate shadow offset
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.beginPath();
    ctx.roundRect(-size/2 + 2, -size/2 + 4, size, size, size * 0.25);
    ctx.fill();
    
    // Render Base Blook Rounded Rect
    ctx.fillStyle = baseColor;
    ctx.beginPath();
    ctx.roundRect(-size/2, -size/2, size, size, size * 0.25);
    ctx.fill();
    
    // Draw Specialization Branch Styles (RPG-themed block outfits)
    if (type === 'squire') {
        if (branch === 'branch1') {
            // Archer Path: Green cap/hood
            ctx.fillStyle = '#1b4332';
            ctx.beginPath();
            ctx.moveTo(-size/2 - 1, -size/2);
            ctx.lineTo(size/2 + 1, -size/2);
            ctx.lineTo(size/2 + 1, -size/5);
            ctx.lineTo(-size/2 - 1, -size/5);
            ctx.closePath(); ctx.fill();
            
            // Tiny arrow feather decoration
            ctx.fillStyle = '#ef4444';
            ctx.beginPath();
            ctx.moveTo(size/3, -size/2 - 2);
            ctx.lineTo(size/3 + 4, -size/2 - 8);
            ctx.lineTo(size/3 + 1, -size/2 - 2);
            ctx.fill();
        } else if (branch === 'branch2') {
            // Knight Path: Silver helmet overlay
            ctx.fillStyle = '#64748b';
            ctx.beginPath();
            ctx.moveTo(-size/2 - 1, -size/2);
            ctx.lineTo(size/2 + 1, -size/2);
            ctx.lineTo(size/2 + 1, -size/6);
            ctx.lineTo(-size/2 - 1, -size/6);
            ctx.closePath(); ctx.fill();
            
            // Visor stripe
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(-size/3, -size/3, size * 0.66, 3);
        } else if (branch === 'branch3') {
            // Taxes Path: Gold accents
            ctx.fillStyle = '#f59e0b';
            ctx.fillRect(-size/2, -size/2, size, size*0.15);
            ctx.fillStyle = '#d97706';
            ctx.fillRect(-size/4, -size/2, size/2, size*0.25);
        }
    } else if (type === 'mage') {
        // Wizard Hat base
        ctx.fillStyle = '#5b21b6';
        ctx.beginPath();
        ctx.moveTo(-size/2 - 2, -size/3);
        ctx.lineTo(0, -size/2 - 12);
        ctx.lineTo(size/2 + 2, -size/3);
        ctx.closePath(); ctx.fill();
        
        if (branch === 'branch1') {
            // Fire Mage: Fire crest decoration
            ctx.fillStyle = '#ea580c';
            ctx.beginPath();
            ctx.arc(0, -size/2 - 12, 6, 0, Math.PI*2);
            ctx.fill();
        } else if (branch === 'branch2') {
            // Ice Mage: Ice crystal topper
            ctx.fillStyle = '#22d3ee';
            ctx.beginPath();
            ctx.moveTo(0, -size/2 - 18);
            ctx.lineTo(-4, -size/2 - 12);
            ctx.lineTo(4, -size/2 - 12);
            ctx.closePath(); ctx.fill();
        } else if (branch === 'branch3') {
            // Lightning Mage: Yellow spark
            ctx.fillStyle = '#eab308';
            ctx.beginPath();
            ctx.moveTo(0, -size/2 - 16);
            ctx.lineTo(3, -size/2 - 11);
            ctx.lineTo(-2, -size/2 - 11);
            ctx.closePath(); ctx.fill();
        }
    } else if (type === 'golem') {
        // Stone lines
        ctx.strokeStyle = '#065f46';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(-size/3, -size/4); ctx.lineTo(-size/4, size/3); ctx.stroke();
        
        if (branch === 'branch1') {
            // Shockwave: Horns
            ctx.fillStyle = '#b91c1c';
            ctx.beginPath();
            ctx.moveTo(-size/2, -size/2); ctx.lineTo(-size/2 - 6, -size/2 - 6); ctx.lineTo(-size/3, -size/3);
            ctx.moveTo(size/2, -size/2); ctx.lineTo(size/2 + 6, -size/2 - 6); ctx.lineTo(size/3, -size/3);
            ctx.fill();
        } else if (branch === 'branch2') {
            // Crystal Sentinel: Emerald shards
            ctx.fillStyle = '#34d399';
            ctx.fillRect(-size/3, -size/2 - 4, 8, 8);
            ctx.fillRect(size/3 - 8, -size/2 - 4, 8, 8);
        }
    } else if (type === 'ninja') {
        // Ninja Mask headband
        ctx.fillStyle = '#111827';
        ctx.fillRect(-size/2, -size/4, size, size/2);
        
        if (branch === 'branch2') {
            // Assassin: Red mask ribbon
            ctx.fillStyle = '#ef4444';
            ctx.beginPath();
            ctx.moveTo(-size/2, -size/6); ctx.lineTo(-size/2 - 8, -size/4); ctx.lineTo(-size/2 - 4, 0);
            ctx.closePath(); ctx.fill();
        } else if (branch === 'branch3') {
            // Wind Runner: Green scarf
            ctx.fillStyle = '#10b981';
            ctx.fillRect(-size/2, size/3, size, size/6);
        }
    } else if (type === 'king') {
        // Golden Crown
        ctx.fillStyle = '#eab308';
        ctx.beginPath();
        ctx.moveTo(-size/2, -size/2);
        ctx.lineTo(-size/3, -size/2 + 6);
        ctx.lineTo(-size/6, -size/2 - 6);
        ctx.lineTo(0, -size/2 + 6);
        ctx.lineTo(size/6, -size/2 - 6);
        ctx.lineTo(size/3, -size/2 + 6);
        ctx.lineTo(size/2, -size/2);
        ctx.lineTo(size/2, -size/3);
        ctx.lineTo(-size/2, -size/3);
        ctx.closePath(); ctx.fill();
        
        // Crown gems decoration
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(-size/6, -size/2 - 2, 2, 0, Math.PI*2);
        ctx.arc(size/6, -size/2 - 2, 2, 0, Math.PI*2);
        ctx.fill();
    } else if (type === 'god_tower') {
        // Draw golden halo/glow behind it
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.7, 0, Math.PI * 2);
        ctx.stroke();
        
        // Draw gold corners/accents
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(-size/2, -size/2, size, size * 0.15);
        ctx.fillRect(-size/2, size/2 - size * 0.15, size, size * 0.15);
        
        // Draw lightning bolt emblem in the center
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.moveTo(0, -size * 0.2);
        ctx.lineTo(-size * 0.12, size * 0.05);
        ctx.lineTo(-size * 0.02, size * 0.05);
        ctx.lineTo(-size * 0.08, size * 0.3);
        ctx.lineTo(size * 0.12, size * 0.05);
        ctx.lineTo(size * 0.02, size * 0.05);
        ctx.closePath();
        ctx.fill();
    }
    
    // Draw Eyes (Classic Cute Blooket eyes)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-size * 0.22, -size * 0.04, size * 0.15, 0, Math.PI * 2);
    ctx.arc(size * 0.22, -size * 0.04, size * 0.15, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw Pupils (black, or glowing for God Tower)
    ctx.fillStyle = (type === 'god_tower') ? '#06b6d4' : '#0f172a';
    ctx.beginPath();
    ctx.arc(-size * 0.22 + 1, -size * 0.04, size * 0.08, 0, Math.PI * 2);
    ctx.arc(size * 0.22 + 1, -size * 0.04, size * 0.08, 0, Math.PI * 2);
    ctx.fill();
    
    // Cute blushing cheeks
    ctx.fillStyle = 'rgba(244, 63, 94, 0.35)';
    ctx.beginPath();
    ctx.arc(-size * 0.35, size * 0.1, size * 0.06, 0, Math.PI*2);
    ctx.arc(size * 0.35, size * 0.1, size * 0.06, 0, Math.PI*2);
    ctx.fill();
    
    // Smile mouth
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(0, size * 0.08, size * 0.1, 0, Math.PI);
    ctx.stroke();
    
    ctx.restore();
}

// Draw Enemies along the track
function drawEnemyBlook(enemy) {
    ctx.save();
    ctx.translate(enemy.x, enemy.y);
    
    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.beginPath();
    ctx.roundRect(-enemy.size/2 + 2, -enemy.size/2 + 4, enemy.size, enemy.size, enemy.size * 0.2);
    ctx.fill();
    
    // Base Body
    ctx.fillStyle = enemy.color;
    ctx.beginPath();
    ctx.roundRect(-enemy.size/2, -enemy.size/2, enemy.size, enemy.size, enemy.size * 0.2);
    ctx.fill();
    
    // Draw Golem Armor cracks
    if (enemy.armored) {
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(-enemy.size/3, -enemy.size/3); ctx.lineTo(enemy.size/3, enemy.size/3); ctx.stroke();
    }
    
    // Angry eyes
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-enemy.size * 0.2, -enemy.size * 0.05, enemy.size * 0.13, 0, Math.PI * 2);
    ctx.arc(enemy.size * 0.2, -enemy.size * 0.05, enemy.size * 0.13, 0, Math.PI * 2);
    ctx.fill();
    
    // Red angry pupils
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(-enemy.size * 0.2, -enemy.size * 0.05, enemy.size * 0.06, 0, Math.PI * 2);
    ctx.arc(enemy.size * 0.2, -enemy.size * 0.05, enemy.size * 0.06, 0, Math.PI * 2);
    ctx.fill();
    
    // Angled angry eyebrows
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-enemy.size * 0.35, -enemy.size * 0.24); ctx.lineTo(-enemy.size * 0.06, -enemy.size * 0.15);
    ctx.moveTo(enemy.size * 0.35, -enemy.size * 0.24); ctx.lineTo(enemy.size * 0.06, -enemy.size * 0.15);
    ctx.stroke();
    
    // Frown mouth
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, enemy.size * 0.18, enemy.size * 0.08, Math.PI, 0);
    ctx.stroke();
    
    // Status effects overlay visual indicator
    drawEnemyStatusEffects(enemy);
    
    // Draw Health bar
    if (enemy.hp < enemy.maxHp) {
        const barW = enemy.size * 1.1;
        const barH = 5;
        const pct = Math.max(0, enemy.hp / enemy.maxHp);
        
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(-barW/2, -enemy.size/2 - 12, barW, barH);
        
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(-barW/2, -enemy.size/2 - 12, barW * pct, barH);
    }
    
    ctx.restore();
}

// Draw ice/stun status markers on enemies
function drawEnemyStatusEffects(enemy) {
    let hasSlow = false;
    let hasStun = false;
    
    enemy.activeEffects.forEach(eff => {
        if (eff.type === 'slow') hasSlow = true;
        if (eff.type === 'stun') hasStun = true;
    });
    
    if (hasStun) {
        // Yellow electric ring
        ctx.strokeStyle = '#eab308';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(0, 0, enemy.size * 0.65, 0, Math.PI * 2);
        ctx.stroke();
    } else if (hasSlow) {
        // Ice shard overlay
        ctx.fillStyle = 'rgba(34, 211, 238, 0.4)';
        ctx.beginPath();
        ctx.roundRect(-enemy.size/2, -enemy.size/2, enemy.size, enemy.size, enemy.size * 0.2);
        ctx.fill();
    }
}

// Generate Base64 save code representing the current game progress
function generateSaveCode() {
    const saveData = {
        version: 1,
        map: state.activeMap,
        wave: state.wave,
        tokens: state.tokens,
        lives: state.lives,
        usedCheats: state.usedCheats || [],
        godTowerPending: state.godTowerPending || false,
        towers: state.towers.map(t => ({
            x: Math.round(t.x),
            y: Math.round(t.y),
            type: t.type,
            branch: t.branch,
            upgradeLevel: t.upgradeLevel,
            angle: Number(t.angle.toFixed(3)),
            targetStrategy: t.targetStrategy
        }))
    };
    
    try {
        const jsonStr = JSON.stringify(saveData);
        // UTF-8 friendly Base64 encoding
        return btoa(unescape(encodeURIComponent(jsonStr)));
    } catch (e) {
        console.error("Failed to generate save code:", e);
        return null;
    }
}

// Decodes Base64 string back into JSON object
function parseSaveCode(code) {
    try {
        const jsonStr = decodeURIComponent(escape(atob(code.trim())));
        return JSON.parse(jsonStr);
    } catch (e) {
        throw new Error("Failed to decode save code. Ensure it is copied correctly.");
    }
}

// Load the game state from decoded save data
function loadGame(saveData) {
    try {
        // Validation
        if (!saveData || typeof saveData !== 'object') {
            throw new Error("Invalid save code format");
        }
        if (!MAPS[saveData.map]) {
            throw new Error("Invalid map key in save code");
        }
        if (typeof saveData.wave !== 'number' || saveData.wave < 1) {
            throw new Error("Invalid wave number in save code");
        }
        if (typeof saveData.tokens !== 'number' || saveData.tokens < 0) {
            throw new Error("Invalid tokens amount in save code");
        }
        if (typeof saveData.lives !== 'number' || saveData.lives < 0) {
            throw new Error("Invalid lives amount in save code");
        }
        if (!Array.isArray(saveData.towers)) {
            throw new Error("Invalid towers list in save code");
        }
        
        // Load settings into active state
        state.activeMap = saveData.map;
        state.wave = saveData.wave;
        state.tokens = saveData.tokens;
        state.lives = saveData.lives;
        state.usedCheats = saveData.usedCheats || [];
        state.godTowerPending = saveData.godTowerPending || false;
        
        // Reconstruct towers
        state.towers = saveData.towers.map(savedTower => {
            const newTower = {
                id: Date.now() + Math.random(),
                x: savedTower.x,
                y: savedTower.y,
                type: savedTower.type,
                level: 1,
                branch: savedTower.branch || null,
                upgradeLevel: savedTower.upgradeLevel || 0,
                angle: savedTower.angle || 0,
                lastShot: 0,
                targetStrategy: savedTower.targetStrategy || 'first',
                stats: { ...TOWER_TEMPLATES[savedTower.type] }
            };
            
            // Reapply upgrade stats sequentially
            if (newTower.branch !== null && newTower.upgradeLevel > 0) {
                const template = TOWER_TEMPLATES[newTower.type];
                const branch = template.upgradeTree[newTower.branch];
                if (branch) {
                    for (let i = 0; i < newTower.upgradeLevel; i++) {
                        const u = branch.levels[i];
                        if (u) {
                            Object.keys(u).forEach(key => {
                                if (key !== 'title' && key !== 'desc' && key !== 'cost') {
                                    newTower.stats[key] = u[key];
                                }
                            });
                        }
                    }
                }
            }
            
            // Handle drawbridge-specific state
            if (newTower.type === 'drawbridge') {
                const proj = getPathProjection(newTower.x, newTower.y);
                newTower.x = proj.x;
                newTower.y = proj.y;
                newTower.distAlongTrack = proj.distAlongTrack;
                newTower.segmentIndex = proj.segmentIndex;
                newTower.bridgeState = 'closed';
                newTower.stateTimer = 0;
            }
            
            return newTower;
        });
        
        // Reset interactive state
        state.enemies = [];
        state.projectiles = [];
        state.spawnQueue = [];
        state.selectedTower = null;
        state.placingTowerType = null;
        state.isWaveActive = false;
        
        // Switch to the playing screen
        state.gameState = 'playing';
        document.getElementById('menu-screen').classList.remove('active');
        document.getElementById('game-screen').classList.add('active');
        
        // Update menu map selection card visually to match loaded map
        document.querySelectorAll('.map-card').forEach(card => {
            if (card.dataset.map === state.activeMap) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });
        
        // Update game HUD and shop UI
        updateHUD();
        deselectTower();
        updateCancelPlacementUI();
        playSound('buy');
        
        return true;
    } catch (e) {
        console.error("Load game error:", e);
        throw e;
    }
}

// Draw God Tower global strikes
function drawGodStrikes() {
    state.towers.forEach(t => {
        if (t.type === 'god_tower' && t.godStrikes) {
            t.godStrikes.forEach(p => {
                drawLightning(t.x, t.y, p.x, p.y, 'rgba(56, 189, 248, 0.6)', '#ffffff', 4.5, 1.5);
            });
        }
    });
}

// Draw lightning bolts with jagged segments and white core
function drawLightning(fromX, fromY, toX, toY, colorOuter, colorInner, widthOuter, widthInner) {
    ctx.save();
    ctx.strokeStyle = colorOuter;
    ctx.lineWidth = widthOuter;
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    
    const dist = Math.hypot(toX - fromX, toY - fromY);
    const steps = Math.floor(dist / 30);
    const jaggedPoints = [{ x: fromX, y: fromY }];
    
    for (let i = 1; i < steps; i++) {
        const t = i / steps;
        const targetX = fromX + (toX - fromX) * t;
        const targetY = fromY + (toY - fromY) * t;
        
        const dx = toX - fromX;
        const dy = toY - fromY;
        const angle = Math.atan2(dy, dx) + Math.PI / 2;
        const offset = (Math.random() - 0.5) * 12;
        
        const ptX = targetX + Math.cos(angle) * offset;
        const ptY = targetY + Math.sin(angle) * offset;
        
        ctx.lineTo(ptX, ptY);
        jaggedPoints.push({ x: ptX, y: ptY });
    }
    
    ctx.lineTo(toX, toY);
    ctx.stroke();
    
    // Draw white core
    ctx.strokeStyle = colorInner;
    ctx.lineWidth = widthInner;
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    jaggedPoints.forEach((pt, idx) => {
        if (idx > 0) ctx.lineTo(pt.x, pt.y);
    });
    ctx.lineTo(toX, toY);
    ctx.stroke();
    
    ctx.restore();
}

// Max upgrade a tower (T5 in active branch or default branch1)
function maxUpgradeTower(t) {
    const template = TOWER_TEMPLATES[t.type];
    if (!template || !template.upgradeTree || Object.keys(template.upgradeTree).length === 0) return; // No upgrades
    
    if (t.branch === null) {
        t.branch = 'branch1'; // Default branch
    }
    t.upgradeLevel = 5;
    
    // Reapply base stats first, then compound upgrades sequentially
    t.stats = { ...template };
    const branch = template.upgradeTree[t.branch];
    if (branch) {
        for (let i = 0; i < t.upgradeLevel; i++) {
            const u = branch.levels[i];
            if (u) {
                Object.keys(u).forEach(key => {
                    if (key !== 'title' && key !== 'desc' && key !== 'cost') {
                        t.stats[key] = u[key];
                    }
                });
            }
        }
    }
}
