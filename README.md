# ⚙️ Steam Cogitator - Warhammer 40K Recommendation Engine

*"Seek not the knowledge of the machine, but whisper prayers to the Omnissiah whilst your Steam library is analyzed..."*

A Warhammer 40K-themed recommendation engine that analyzes your Steam library and wishlist to suggest your next sacred digital conquest.

## Features

- 📚 Analyze your Steam library for game patterns
- 🎮 Get personalized game recommendations
- 📋 Prioritize your Steam wishlist
- 🕯️ Gothic, immersive Warhammer 40K interface
- ⚙️ Simple beginner-friendly Python backend

## Tech Stack

- **Backend**: Python + Flask
- **Frontend**: HTML5 + CSS3 + Vanilla JavaScript
- **Data**: Steam API (via requests library)
- **Theme**: Warhammer 40K Gothic

## Getting Started

### Prerequisites

- Python 3.8+
- pip (Python package manager)
- A Steam account

### Installation

1. Clone this repository
```bash
git clone https://github.com/ATMoonman/steamcogitator.git
cd steamcogitator
```

2. Create a virtual environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies
```bash
pip install -r requirements.txt
```

4. Set up your Steam API key
   - Get your key from: https://steamcommunity.com/dev/apikey
   - Create a `.env` file in the project root:
   ```
   STEAM_API_KEY=your_api_key_here
   STEAM_ID=your_steam_id_here
   ```

5. Run the application
```bash
python app.py
```

6. Open your browser and visit: `http://localhost:5000`

## How It Works

1. **Connect**: Enter your Steam ID (found in your profile URL)
2. **Analyze**: The cogitator scans your library and wishlist
3. **Recommend**: Get personalized suggestions based on:
   - Genres you play most
   - Play time per genre
   - Tags and themes
   - Price-to-playtime ratio
4. **Decide**: View recommendations with thematic descriptions

## File Structure

```
steamcogitator/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── .env.example          # Environment variables template
├── static/
│   ├── css/
│   │   └── style.css     # Gothic Warhammer 40K styling
│   └── js/
│       └── script.js     # Frontend logic
└── templates/
    ├── index.html        # Home page
    └── results.html      # Results page
```

## Theme: The Cogitator

In Warhammer 40K, a Cogitator is a sacred machine used to process vast amounts of information. This project channels that aesthetic:

- **Loading states**: "Seeking knowledge from the Omnissiah..."
- **Results**: "Blessed recommendations from the Machine Spirit"
- **Navigation**: Tech-priest warnings and binary flourishes
- **UI**: Dark, gothic, ancient machine aesthetic

## Troubleshooting

### "Steam API key not found"
Make sure you've created a `.env` file with your API key. See Installation step 4.

### "Steam ID invalid"
Your Steam ID should be numeric (e.g., 76561198012345678). Find it at: https://steamcommunity.com/support/faqs/view/2816-4339-7457-0B21

### Port 5000 already in use
Change the port in `app.py`: `app.run(debug=True, port=5001)`

## Next Steps

- Add game comparison features
- Implement price tracking
- Add user preferences (horror? racing? strategy?)
- Deploy to Heroku or similar

## License

MIT

---

*"In the grim darkness of the far future, there is only... game recommendations."*
