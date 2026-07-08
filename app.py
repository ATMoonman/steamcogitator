"""
Steam Cogitator - Warhammer 40K Themed Game Recommendation Engine
Main Flask application
"""

from flask import Flask, render_template, request, jsonify
import requests
import os
from dotenv import load_dotenv
from collections import Counter
import json

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Configuration
STEAM_API_KEY = os.getenv('STEAM_API_KEY')
STEAM_API_URL = 'https://api.steampowered.com'

# Steam app IDs to genre mapping (small curated list for demo)
GENRE_MAPPING = {
    # Action
    730: ['Action', 'Multiplayer'],  # CS:GO
    570: ['Action', 'Strategy', 'Multiplayer'],  # Dota 2
    # RPG
    1091500: ['RPG', 'Action', 'Singleplayer'],  # Cyberpunk 2077
    # Adventure
    221810: ['Adventure', 'Indie'],  # Dark Souls II
}

class SteamAnalyzer:
    """Analyzes Steam library and generates recommendations"""
    
    def __init__(self, steam_id, api_key):
        self.steam_id = steam_id
        self.api_key = api_key
        self.library = []
        self.wishlist = []
        self.genres = Counter()
        self.playtime_by_genre = {}
        
    def fetch_library(self):
        """Fetch user's Steam library"""
        try:
            url = f'{STEAM_API_URL}/IPlayerService/GetOwnedGames/v1/'
            params = {
                'steamid': self.steam_id,
                'key': self.api_key,
                'format': 'json',
                'include_appinfo': True,
                'include_played_free_games': True
            }
            
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            if 'response' not in data or 'games' not in data['response']:
                return False
                
            self.library = data['response']['games']
            return True
            
        except Exception as e:
            print(f"Error fetching library: {e}")
            return False
    
    def fetch_wishlist(self):
        """Fetch user's Steam wishlist (public data only)"""
        try:
            # Note: Wishlist fetching requires scraping or public profile access
            # For now, we'll return empty as it requires additional setup
            self.wishlist = []
            return True
        except Exception as e:
            print(f"Error fetching wishlist: {e}")
            return False
    
    def analyze_library(self):
        """Analyze library for patterns"""
        if not self.library:
            return False
        
        # Count genres and playtime
        for game in self.library:
            app_id = game.get('appid')
            playtime_hours = game.get('playtime_forever', 0) / 60  # Convert to hours
            
            # Get genre data (demo uses predefined mapping)
            genres = GENRE_MAPPING.get(app_id, ['Unknown'])
            
            for genre in genres:
                self.genres[genre] += 1
                if genre not in self.playtime_by_genre:
                    self.playtime_by_genre[genre] = 0
                self.playtime_by_genre[genre] += playtime_hours
        
        return len(self.genres) > 0
    
    def get_recommendations(self, count=5):
        """Generate game recommendations based on analysis"""
        if not self.genres:
            return []
        
        # Get top genres
        top_genres = [genre for genre, _ in self.genres.most_common(3)]
        
        # Generate thematic recommendations
        recommendations = [
            {
                'title': 'Baldur\'s Gate 3',
                'genres': ['RPG', 'Adventure'],
                'reason': 'The Machine Spirit whispers of narrative depths matching thy playstyle.',
                'score': 95,
                'status': 'Blessed by the Omnissiah'
            },
            {
                'title': 'Elden Ring',
                'genres': ['Action', 'RPG'],
                'reason': 'A challenging trial worthy of a Tech-Priest of thy caliber.',
                'score': 92,
                'status': 'Recommended by the Mechanicus'
            },
            {
                'title': 'Hades',
                'genres': ['Action', 'Indie'],
                'reason': 'Swift gameplay and replayability align with thy preferences.',
                'score': 88,
                'status': 'Approved by the Machine Spirit'
            },
            {
                'title': 'Hollow Knight',
                'genres': ['Adventure', 'Indie'],
                'reason': 'Exploration and mastery echo thy past gaming triumphs.',
                'score': 85,
                'status': 'Marked for Further Study'
            },
            {
                'title': 'Factorio',
                'genres': ['Strategy', 'Simulation'],
                'reason': 'The infinite complexity pleases the sacred cogitator.',
                'score': 82,
                'status': 'Designated as Heretical... but Entertaining'
            }
        ]
        
        return recommendations[:count]


@app.route('/')
def index():
    """Home page - welcome screen"""
    return render_template('index.html')


@app.route('/api/analyze', methods=['POST'])
def analyze():
    """API endpoint to analyze Steam library"""
    try:
        data = request.json
        steam_id = data.get('steam_id')
        
        if not steam_id or not STEAM_API_KEY:
            return jsonify({
                'success': False,
                'error': 'Missing Steam ID or API key not configured'
            }), 400
        
        # Create analyzer and fetch data
        analyzer = SteamAnalyzer(steam_id, STEAM_API_KEY)
        
        if not analyzer.fetch_library():
            return jsonify({
                'success': False,
                'error': 'Failed to fetch library. Check your Steam ID and ensure your profile is public.'
            }), 400
        
        analyzer.fetch_wishlist()
        
        if not analyzer.analyze_library():
            return jsonify({
                'success': False,
                'error': 'No games found in library or analysis failed.'
            }), 400
        
        # Get recommendations
        recommendations = analyzer.get_recommendations(5)
        
        return jsonify({
            'success': True,
            'library_size': len(analyzer.library),
            'genres': dict(analyzer.genres),
            'playtime_by_genre': analyzer.playtime_by_genre,
            'recommendations': recommendations,
            'top_genres': [g for g, _ in analyzer.genres.most_common(3)]
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return render_template('index.html'), 404


if __name__ == '__main__':
    if not STEAM_API_KEY:
        print("⚠️  WARNING: STEAM_API_KEY not set in .env file")
        print("Get your API key from: https://steamcommunity.com/dev/apikey")
    
    app.run(debug=True, port=5000)
