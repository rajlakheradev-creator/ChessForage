# ChessForage

![License](https://img.shields.io/badge/license-ISC-green)

## 📝 Description

ChessForage is a streamlined web application built on the Express.js framework, designed for chess enthusiasts to efficiently discover and curate chess-related content. Whether you're tracking game histories or searching for tactical insights, ChessForage provides a responsive and intuitive platform to enhance your chess study and gameplay experience.

## ✨ Features

- 🕸️ Web


## 🛠️ Tech Stack

- 🚀 Express.js


## 📦 Key Dependencies

```
bcryptjs: ^3.0.3
chess.js: ^1.4.0
cors: ^2.8.6
dotenv: ^17.3.1
express: ^5.2.1
fs: ^0.0.1-security
jsonwebtoken: ^9.0.3
mongoose: ^9.2.2
path: ^0.12.7
```

## 🚀 Run Commands

- **test**: `npm run test`


## 📁 Project Structure

```
.
├── images
│   ├── ashish.jpg
│   ├── bb.jpg
│   ├── bk.jpg
│   ├── bn.jpg
│   ├── bp.jpg
│   ├── bq.jpg
│   ├── br.jpg
│   ├── wb.jpg
│   ├── wk.jpg
│   ├── wn.jpg
│   ├── wp.jpg
│   ├── wq.jpg
│   └── wr.jpg
├── assets
│   └── sounds
│       ├── Bishop
│       │   ├── Both-Bishop_active
│       │   │   ├── powerUp4.ogg
│       │   │   └── zapTwoTone.ogg
│       │   ├── Capture
│       │   │   ├── Bishop
│       │   │   │   ├── shade5.wav
│       │   │   │   ├── shade8.wav
│       │   │   │   └── spell.wav
│       │   │   ├── King
│       │   │   │   ├── powerUp12.ogg
│       │   │   │   └── you_win.ogg
│       │   │   ├── Knight
│       │   │   │   ├── magic1.wav
│       │   │   │   └── shade5.wav
│       │   │   ├── Pawn
│       │   │   │   ├── magic1.wav
│       │   │   │   └── shade2.wav
│       │   │   ├── Queen
│       │   │   │   ├── objective_achieved.ogg
│       │   │   │   ├── powerUp11.ogg
│       │   │   │   └── spell.wav
│       │   │   └── Rook
│       │   │       ├── magic1.wav
│       │   │       └── shade10.wav
│       │   └── Move
│       │       ├── phaserUp3.ogg
│       │       ├── shade2.wav
│       │       ├── shade3.wav
│       │       └── shade4.wav
│       ├── King
│       │   ├── Capture
│       │   │   ├── Bishop
│       │   │   │   ├── magic1.wav
│       │   │   │   ├── sword-unsheathe4.wav
│       │   │   │   └── war_target_engaged.ogg
│       │   │   ├── Knight
│       │   │   │   ├── chainmail1.wav
│       │   │   │   └── sword-unsheathe4.wav
│       │   │   ├── Pawn
│       │   │   │   ├── metal-small3.wav
│       │   │   │   └── sword-unsheathe4.wav
│       │   │   ├── Queen
│       │   │   │   ├── giant5.wav
│       │   │   │   ├── mission_completed.ogg
│       │   │   │   ├── powerUp12.ogg
│       │   │   │   └── sword-unsheathe5.wav
│       │   │   └── Rook
│       │   │       ├── chainmail1.wav
│       │   │       ├── giant5.wav
│       │   │       └── sword-unsheathe5.wav
│       │   ├── Game-Result
│       │   │   ├── checkmate-loser-voice.ogg
│       │   │   ├── checkmate-loser.ogg
│       │   │   ├── checkmate-winner-voice.ogg
│       │   │   ├── checkmate-winner.ogg
│       │   │   ├── draw-voice.ogg
│       │   │   ├── draw.ogg
│       │   │   ├── stalemate-voice.ogg
│       │   │   └── stalemate.ogg
│       │   ├── King-Castling
│       │   │   ├── chainmail1.wav
│       │   │   ├── sword-unsheathe5.wav
│       │   │   └── war_call_for_backup.ogg
│       │   ├── King-inCheck Warning
│       │   │   ├── war_get_down.ogg
│       │   │   └── war_look_out.ogg
│       │   └── Move
│       │       ├── beads.wav
│       │       ├── cloth.wav
│       │       ├── lowThreeTone.ogg
│       │       └── metal-small3.wav
│       ├── Knight
│       │   ├── Capture
│       │   │   ├── Bishop
│       │   │   │   ├── shade6.wav
│       │   │   │   ├── swing3.wav
│       │   │   │   └── sword-unsheathe2.wav
│       │   │   ├── King
│       │   │   │   ├── mission_completed.ogg
│       │   │   │   ├── powerUp12.ogg
│       │   │   │   └── you_win.ogg
│       │   │   ├── Knight
│       │   │   │   ├── armor-light.wav
│       │   │   │   ├── chainmail2.wav
│       │   │   │   └── sword-unsheathe2.wav
│       │   │   ├── Pawn
│       │   │   │   ├── armor-light.wav
│       │   │   │   └── swing2.wav
│       │   │   ├── Queen
│       │   │   │   ├── powerUp12.ogg
│       │   │   │   ├── sword-unsheathe5.mp3
│       │   │   │   ├── war_target_destroyed.ogg
│       │   │   │   └── wolfman.wav
│       │   │   └── Rook
│       │   │       ├── metal-ringing.wav
│       │   │       ├── swing3.wav
│       │   │       └── sword-unsheathe2.wav
│       │   ├── Fork
│       │   │   ├── twoTone1.ogg
│       │   │   ├── war_look_out.ogg
│       │   │   └── zapTwoTone.ogg
│       │   └── Move
│       │       ├── armor-light.wav
│       │       ├── chainmail1.wav
│       │       ├── metal-small2.wav
│       │       └── phaseJump2.ogg
│       ├── Pawn
│       │   ├── Capture
│       │   │   ├── Bishop
│       │   │   │   ├── bite-small3.wav
│       │   │   │   ├── magic1.wav
│       │   │   │   └── shade3.wav
│       │   │   ├── Knight
│       │   │   │   ├── bite-small2.wav
│       │   │   │   ├── correct.ogg
│       │   │   │   └── metal-small1.wav
│       │   │   ├── Pawn
│       │   │   │   ├── bite-small.wav
│       │   │   │   └── bite-small2.wav
│       │   │   ├── Queen
│       │   │   │   ├── correct.ogg
│       │   │   │   ├── new_highscore.ogg
│       │   │   │   ├── powerUp12.ogg
│       │   │   │   └── spell.wav
│       │   │   └── Rook
│       │   │       ├── correct.ogg
│       │   │       ├── metal-small1.wav
│       │   │       └── sword-unsheathe2.wav
│       │   ├── En-passant
│       │   │   ├── magic1.wav
│       │   │   ├── phaseJump1.ogg
│       │   │   └── war_sniper.ogg
│       │   ├── Move
│       │   │   ├── 1-Square_move
│       │   │   │   ├── cloth.wav
│       │   │   │   ├── lowDown.ogg
│       │   │   │   └── wood-small.wav
│       │   │   └── 2-Square_move
│       │   │       └── cloth-heavy.wav
│       │   └── Pawn-Promotion
│       │       ├── To-Bishop
│       │       │   ├── magic1.wav
│       │       │   └── shade2.wav
│       │       ├── To-Knight
│       │       │   ├── armor-light.wav
│       │       │   └── phaseJump2.ogg
│       │       ├── To-Queen
│       │       │   ├── powerUp11.ogg
│       │       │   ├── power_up.ogg
│       │       │   └── spell.wav
│       │       ├── To-Rook
│       │       │   ├── giant1.wav
│       │       │   └── metal-ringing.wav
│       │       ├── highUp.ogg
│       │       ├── powerUp11.ogg
│       │       ├── power_up.ogg
│       │       └── spell.wav
│       ├── Queen
│       │   ├── Capture
│       │   │   ├── Bishop
│       │   │   │   ├── giant1.wav
│       │   │   │   ├── powerUp5.ogg
│       │   │   │   └── spell.wav
│       │   │   ├── King
│       │   │   │   ├── mission_completed.ogg
│       │   │   │   ├── powerUp12.ogg
│       │   │   │   ├── spell.wav
│       │   │   │   └── you_win.ogg
│       │   │   ├── Knight
│       │   │   │   ├── powerUp5.ogg
│       │   │   │   └── spell.wav
│       │   │   ├── Pawn
│       │   │   │   ├── beads.wav
│       │   │   │   └── powerUp2.ogg
│       │   │   ├── Queen
│       │   │   │   ├── giant5.wav
│       │   │   │   ├── new_highscore.ogg
│       │   │   │   ├── powerUp11.ogg
│       │   │   │   └── spell.wav
│       │   │   └── Rook
│       │   │       ├── giant4.wav
│       │   │       ├── spell.wav
│       │   │       └── sword-unsheathe4.wav
│       │   ├── Move
│       │   │   ├── beads.wav
│       │   │   ├── giant4.wav
│       │   │   ├── metal-ringing.wav
│       │   │   └── powerUp3.ogg
│       │   ├── Queen Sacrifice
│       │   │   ├── powerUp12.ogg
│       │   │   ├── sword-unsheathe.wav
│       │   │   └── war_fire_in_the_hole.ogg
│       │   └── Queen-fork
│       │       ├── powerUp7.ogg
│       │       ├── war_supressing_fire.ogg
│       │       └── zapThreeToneUp.ogg
│       ├── Rook
│       │   ├── Capture
│       │   │   ├── Bishop
│       │   │   │   ├── chainmail2.wav
│       │   │   │   └── sword-unsheathe3.wav
│       │   │   ├── King
│       │   │   │   ├── giant5.wav
│       │   │   │   ├── powerUp12.ogg
│       │   │   │   └── you_win.ogg
│       │   │   ├── Knight
│       │   │   │   ├── metal-ringing.wav
│       │   │   │   └── sword-unsheathe3.wav
│       │   │   ├── Pawn
│       │   │   │   ├── giant2.wav
│       │   │   │   └── metal-small2.wav
│       │   │   ├── Queen
│       │   │   │   ├── giant4.wav
│       │   │   │   ├── powerUp12.ogg
│       │   │   │   ├── sword-unsheathe5.wav
│       │   │   │   └── war_target_destroyed.ogg
│       │   │   └── Rook
│       │   │       ├── giant3.wav
│       │   │       ├── metal-ringing.wav
│       │   │       └── sword-unsheathe4.wav
│       │   ├── Castling
│       │   │   ├── chainmail1.wav
│       │   │   ├── sword-unsheathe5.wav
│       │   │   └── war_cover_me.ogg
│       │   └── Move
│       │       ├── chainmail2.wav
│       │       ├── giant1.wav
│       │       ├── metal-ringing.wav
│       │       └── metal-small3.wav
│       ├── black_move.mp3
│       ├── pieces_move.mp3
│       └── white_move.mp4
├── css
│   ├── Asset-modal.css
│   ├── auth.css
│   ├── board.css
│   ├── bot-panel.css
│   ├── game-status.css
│   ├── layout.css
│   ├── move-history.css
│   └── variables.css
├── Index.html
├── js
│   ├── asset-modal.js
│   ├── board.js
│   ├── bot.js
│   ├── config.js
│   ├── game-control.js
│   ├── login.js
│   ├── main.js
│   ├── move-history.js
│   ├── server.js
│   ├── signup.js
│   ├── sound-system.js
│   ├── ui-handlers.js
│   ├── user.js
│   └── utilites.js
├── login.html
├── middleware
│   └── authMiddleware.js
├── package.json
├── routes
│   └── auth.js
└── signup.html
```

## 👥 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/rajlakheradev-creator/ChessForage.git`
3. **Create** a new branch: `git checkout -b feature/your-feature`
4. **Commit** your changes: `git commit -am 'Add some feature'`
5. **Push** to your branch: `git push origin feature/your-feature`
6. **Open** a pull request

Please ensure your code follows the project's style guidelines and includes tests where applicable.

## 📜 License

This project is licensed under the ISC License.

---
