// js/sound-system.js
// Complete Sound System for Chess Game - Updated for Your Folder Structure

const soundSystem = {
    basePath: 'assets/sounds/',
    enabled: true,
    masterVolume: 0.5,
    
    // Volume settings per piece type
    volumes: {
        p: 0.25,  // Pawn
        n: 0.35,  // Knight
        b: 0.30,  // Bishop
        r: 0.45,  // Rook
        q: 0.55,  // Queen
        k: 0.40,  // King
        default: 0.3
    },
    
    // ⭐ UPDATED FILE REGISTRY - Matches your actual folder structure
    soundFiles: {
        // Pawn sounds - separated by move distance
        'Pawn/Move/1-Square_move/': ['cloth.wav', 'lowDown.ogg', 'wood-small.wav'],
        'Pawn/Move/2-Square_move/': ['cloth-heavy.wav'],
        
        'Pawn/Capture/Pawn/': ['bite-small.wav', 'bite-small2.wav'],
        'Pawn/Capture/Knight/': ['bite-small2.wav', 'metal-small1.wav', 'correct.ogg'],
        'Pawn/Capture/Bishop/': ['shade3.wav', 'magic1.wav', 'bite-small3.wav'],
        'Pawn/Capture/Rook/': ['metal-small1.wav', 'sword-unsheathe2.wav', 'correct.ogg'],
        'Pawn/Capture/Queen/': ['spell.wav', 'powerUp12.ogg', 'correct.ogg', 'new_highscore.ogg'],
        'Pawn/En-passant/': ['magic1.wav', 'phaseJump1.ogg', 'war_sniper.ogg'],
        'Pawn/Pawn-Promotion/': ['spell.wav', 'powerUp11.ogg', 'highUp.ogg', 'power_up.ogg'],
        'Pawn/Pawn-Promotion/To-Queen/': ['spell.wav', 'powerUp11.ogg', 'power_up.ogg'],
        'Pawn/Pawn-Promotion/To-Knight/': ['armor-light.wav', 'phaseJump2.ogg'],
        'Pawn/Pawn-Promotion/To-Rook/': ['metal-ringing.wav', 'giant1.wav'],
        'Pawn/Pawn-Promotion/To-Bishop/': ['shade2.wav', 'magic1.wav'],
        
        // Knight sounds
        'Knight/Move/': ['armor-light.wav', 'phaseJump2.ogg', 'chainmail1.wav', 'metal-small2.wav'],
        'Knight/Capture/Pawn/': ['swing2.wav', 'armor-light.wav'],
        'Knight/Capture/Knight/': ['armor-light.wav', 'sword-unsheathe2.wav', 'chainmail2.wav'],
        'Knight/Capture/Bishop/': ['swing3.wav', 'shade6.wav', 'sword-unsheathe2.wav'],
        'Knight/Capture/Rook/': ['sword-unsheathe2.wav', 'metal-ringing.wav', 'swing3.wav'],
        'Knight/Capture/Queen/': ['wolfman.wav', 'sword-unsheathe5.wav', 'war_target_destroyed.ogg', 'powerUp12.ogg'],
        'Knight/Capture/King/': ['powerUp12.ogg', 'you_win.ogg', 'mission_completed.ogg'],
        'Knight/Fork/': ['twoTone1.ogg', 'war_look_out.ogg', 'zapTwoTone.ogg'],
        
        // Bishop sounds
        'Bishop/Move/': ['shade2.wav', 'phaserUp3.ogg', 'shade3.wav', 'shade4.wav'],
        'Bishop/Capture/Pawn/': ['shade2.wav', 'magic1.wav'],
        'Bishop/Capture/Knight/': ['magic1.wav', 'shade5.wav'],
        'Bishop/Capture/Bishop/': ['shade5.wav', 'shade8.wav', 'spell.wav'],
        'Bishop/Capture/Rook/': ['shade10.wav', 'magic1.wav'],
        'Bishop/Capture/Queen/': ['spell.wav', 'powerUp11.ogg', 'objective_achieved.ogg'],
        'Bishop/Capture/King/': ['powerUp12.ogg', 'you_win.ogg'],
        'Bishop/Both-Bishop_active/': ['zapTwoTone.ogg', 'powerUp4.ogg'],
        
        // Rook sounds
        'Rook/Move/': ['metal-ringing.wav', 'chainmail2.wav', 'giant1.wav', 'metal-small3.wav'],
        'Rook/Capture/Pawn/': ['metal-small2.wav', 'giant2.wav'],
        'Rook/Capture/Knight/': ['sword-unsheathe3.wav', 'metal-ringing.wav'],
        'Rook/Capture/Bishop/': ['chainmail2.wav', 'sword-unsheathe3.wav'],
        'Rook/Capture/Rook/': ['metal-ringing.wav', 'giant3.wav', 'sword-unsheathe4.wav'],
        'Rook/Capture/Queen/': ['sword-unsheathe5.wav', 'giant4.wav', 'war_target_destroyed.ogg', 'powerUp12.ogg'],
        'Rook/Capture/King/': ['powerUp12.ogg', 'you_win.ogg', 'giant5.wav'],
        'Rook/Castling/': ['sword-unsheathe5.wav', 'chainmail1.wav', 'war_cover_me.ogg'],
        
        // Queen sounds
        'Queen/Move/': ['beads.wav', 'powerUp3.ogg', 'metal-ringing.wav', 'giant4.wav'],
        'Queen/Capture/Pawn/': ['beads.wav', 'powerUp2.ogg'],
        'Queen/Capture/Knight/': ['spell.wav', 'giant1.wav'],
        'Queen/Capture/Bishop/': ['giant1.wav', 'spell.wav', 'powerUp5.ogg'],
        'Queen/Capture/Rook/': ['giant4.wav', 'spell.wav', 'sword-unsheathe4.wav'],
        'Queen/Capture/Queen/': ['spell.wav', 'powerUp11.ogg', 'new_highscore.ogg', 'giant5.wav'],
        'Queen/Capture/King/': ['spell.wav', 'powerUp12.ogg', 'you_win.ogg', 'mission_completed.ogg'],
        'Queen/Queen-fork/': ['zapThreeToneUp.ogg', 'war_supressing_fire.ogg', 'powerUp7.ogg'],
        'Queen/Queen Sacrifice/': ['sword-unsheathe.wav', 'war_fire_in_the_hole.ogg', 'powerUp12.ogg'],
        
        // King sounds
        'King/Move/': ['metal-small3.wav', 'lowThreeTone.ogg', 'cloth.wav', 'beads.wav'],
        'King/Capture/Pawn/': ['metal-small3.wav', 'sword-unsheathe4.wav'],
        'King/Capture/Knight/': ['sword-unsheathe4.wav', 'chainmail1.wav'],
        'King/Capture/Bishop/': ['sword-unsheathe4.wav', 'war_target_engaged.ogg', 'magic1.wav'],
        'King/Capture/Rook/': ['chainmail1.wav', 'giant5.wav', 'sword-unsheathe5.wav'],
        'King/Capture/Queen/': ['sword-unsheathe5.wav', 'powerUp12.ogg', 'mission_completed.ogg', 'giant5.wav'],
        'King/King-Castling/': ['chainmail1.wav', 'sword-unsheathe5.wav', 'war_call_for_backup.ogg'],
        'King/King-inCheck Warning/': ['laser6.ogg', 'tone1.ogg', 'war_get_down.ogg', 'war_look_out.ogg'],
        'King/Game-Result/': ['checkmate-winner.ogg', 'checkmate-winner-voice.ogg', 'checkmate-loser.ogg', 
                              'checkmate-loser-voice.ogg', 'draw.ogg', 'draw-voice.ogg', 'stalemate.ogg', 
                              'stalemate-voice.ogg']
    },
    
    toggle: function() {
        this.enabled = !this.enabled;
        return this.enabled;
    },
    
    setVolume: function(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
    },
    
    playCapture: function(attackerType, victimType) {
        if (!this.enabled) return;
        
        const pieceName = this.getPieceName(attackerType);
        const victimName = this.getPieceName(victimType);
        const capturePath = `${pieceName}/Capture/${victimName}/`;
        const sounds = this.getSoundsInFolder(capturePath);
        
        if (sounds.length === 0) {
            console.warn(`No sounds found for ${capturePath}`);
            return;
        }
        
        if (sounds.length > 1 && this.isEpicCapture(attackerType, victimType)) {
            this.playSoundSequence(sounds, capturePath);
        } else {
            const randomSound = this.randomFrom(sounds);
            this.playSound(capturePath + randomSound, attackerType);
        }
    },
    
    // ⭐ UPDATED: Play move sound with proper pawn move detection
    playMove: function(pieceType, isFirstMove = false, moveInfo = null) {
        if (!this.enabled) return;
        
        const pieceName = this.getPieceName(pieceType);
        
        // Special handling for pawns - check move distance
        if (pieceType === 'p') {
            let movePath;
            
            // Determine if it's a 2-square or 1-square move
            if (isFirstMove) {
                // 2-square move (pawn's first move)
                movePath = 'Pawn/Move/2-Square_move/';
            } else {
                // 1-square move (regular pawn move)
                movePath = 'Pawn/Move/1-Square_move/';
            }
            
            const sounds = this.getSoundsInFolder(movePath);
            if (sounds.length === 0) {
                console.warn(`No sounds found for ${movePath}`);
                return;
            }
            
            const selectedSound = this.randomFrom(sounds);
            this.playSound(movePath + selectedSound, pieceType);
        } else {
            // Other pieces use regular Move folder
            const movePath = `${pieceName}/Move/`;
            const sounds = this.getSoundsInFolder(movePath);
            
            if (sounds.length === 0) return;
            
            const selectedSound = this.randomFrom(sounds);
            this.playSound(movePath + selectedSound, pieceType);
        }
    },
    
    playEnPassant: function() {
        if (!this.enabled) return;
        const sounds = this.getSoundsInFolder('Pawn/En-passant/');
        this.playSoundSequence(sounds, 'Pawn/En-passant/');
    },
    
    playPromotion: function(promotionPiece = 'q') {
        if (!this.enabled) return;
        
        const pieceToFolder = {
            'q': 'To-Queen',
            'n': 'To-Knight',
            'r': 'To-Rook',
            'b': 'To-Bishop'
        };
        
        const folderName = pieceToFolder[promotionPiece] || 'To-Queen';
        const specificPath = `Pawn/Pawn-Promotion/${folderName}/`;
        let sounds = this.getSoundsInFolder(specificPath);
        
        if (sounds.length === 0) {
            sounds = this.getSoundsInFolder('Pawn/Pawn-Promotion/');
        }
        
        this.playSoundSequence(sounds, sounds.length > 0 ? specificPath : 'Pawn/Pawn-Promotion/', 200);
    },
    
    playCastling: function() {
        if (!this.enabled) return;
        const kingSounds = this.getSoundsInFolder('King/King-Castling/');
        const rookSounds = this.getSoundsInFolder('Rook/Castling/');
        this.playSoundSequence(kingSounds, 'King/King-Castling/');
        setTimeout(() => {
            this.playSoundSequence(rookSounds, 'Rook/Castling/');
        }, 300);
    },
    
    playCheck: function() {
        if (!this.enabled) return;
        const sounds = this.getSoundsInFolder('King/King-inCheck Warning/');
        setTimeout(() => {
            this.playSoundSequence(sounds, 'King/King-inCheck Warning/');
        }, 300);
    },
    
    playCheckmate: function(isWinner) {
        if (!this.enabled) return;
        const sounds = this.getSoundsInFolder('King/Game-Result/');
        const filtered = sounds.filter(s => s.includes(isWinner ? 'winner' : 'loser'));
        setTimeout(() => {
            this.playSoundSequence(filtered, 'King/Game-Result/', 300);
        }, 500);
    },
    
    playDraw: function() {
        if (!this.enabled) return;
        const sounds = this.getSoundsInFolder('King/Game-Result/');
        const drawSounds = sounds.filter(s => s.includes('draw'));
        setTimeout(() => {
            this.playSoundSequence(drawSounds, 'King/Game-Result/');
        }, 500);
    },
    
    playStalemate: function() {
        if (!this.enabled) return;
        const sounds = this.getSoundsInFolder('King/Game-Result/');
        const stalemateSounds = sounds.filter(s => s.includes('stalemate'));
        setTimeout(() => {
            this.playSoundSequence(stalemateSounds, 'King/Game-Result/');
        }, 500);
    },
    
    isEpicCapture: function(attacker, victim) {
        if (attacker === 'p' && victim === 'q') return true;
        if (attacker === 'n' && victim === 'q') return true;
        if (attacker === 'q' && victim === 'q') return true;
        if (victim === 'k') return true;
        if (attacker === 'k' && victim === 'q') return true;
        return false;
    },
    
    getPieceName: function(type) {
        const names = {
            'p': 'Pawn',
            'n': 'Knight',
            'b': 'Bishop',
            'r': 'Rook',
            'q': 'Queen',
            'k': 'King'
        };
        return names[type] || 'Pawn';
    },
    
    getSoundsInFolder: function(folderPath) {
        return this.soundFiles[folderPath] || [];
    },
    
    randomFrom: function(array) {
        if (array.length === 0) return null;
        return array[Math.floor(Math.random() * array.length)];
    },
    
    playSound: function(soundPath, pieceType = null, delay = 0) {
        setTimeout(() => {
            try {
                const audio = new Audio(this.basePath + soundPath);
                let volume = this.volumes.default;
                if (pieceType && this.volumes[pieceType]) {
                    volume = this.volumes[pieceType];
                }
                audio.volume = volume * this.masterVolume;
                audio.play().catch(err => {
                    console.warn('Sound play error:', err.message);
                });
            } catch (err) {
                console.error('Sound creation error:', err);
            }
        }, delay);
    },
    
    playSoundSequence: function(sounds, folderPath = '', delayBetween = 150) {
        if (sounds.length === 0) return;
        sounds.forEach((sound, index) => {
            const fullPath = folderPath + sound;
            this.playSound(fullPath, null, index * delayBetween);
        });
    }
};

export default soundSystem;