import requests
import sys
import json
from datetime import datetime

class SpaceShooterAPITester:
    def __init__(self, base_url="https://pixelquest-64.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def run_test(self, name, method, endpoint, expected_status, data=None, params=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json() if response.content else {}
                except:
                    response_data = {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json() if response.content else {}
                    print(f"   Error: {error_data}")
                except:
                    print(f"   Response: {response.text}")
                response_data = {}

            self.test_results.append({
                "test": name,
                "method": method,
                "endpoint": endpoint,
                "expected_status": expected_status,
                "actual_status": response.status_code,
                "success": success
            })

            return success, response_data

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.test_results.append({
                "test": name,
                "method": method,
                "endpoint": endpoint,
                "expected_status": expected_status,
                "actual_status": "ERROR",
                "success": False,
                "error": str(e)
            })
            return False, {}

    def test_root_endpoint(self):
        """Test root API endpoint"""
        success, response = self.run_test(
            "Root API Endpoint",
            "GET",
            "",
            200
        )
        return success

    def test_levels_endpoint(self):
        """Test levels endpoint"""
        success, response = self.run_test(
            "Get Levels",
            "GET",
            "levels",
            200
        )
        if success and isinstance(response, list) and len(response) > 0:
            print(f"   Found {len(response)} levels")
            return True
        return False

    def test_save_game(self):
        """Test save game functionality"""
        game_state = {
            "player_x": 100.0,
            "player_y": 350.0,
            "player_health": 80,
            "score": 1500,
            "current_level": 2,
            "enemies": [
                {"x": 800, "y": 200, "width": 35, "height": 35, "health": 2, "type": "basic"}
            ],
            "bullets": [
                {"x": 200, "y": 365, "width": 10, "height": 4, "speed": 10}
            ]
        }
        
        save_data = {
            "game_name": f"Test Save {datetime.now().strftime('%H%M%S')}",
            "game_state": game_state
        }
        
        success, response = self.run_test(
            "Save Game",
            "POST",
            "game/save",
            200,
            data=save_data
        )
        
        if success and 'id' in response:
            print(f"   Game saved with ID: {response['id']}")
            return response['id']
        return None

    def test_get_saved_games(self):
        """Test get saved games"""
        success, response = self.run_test(
            "Get Saved Games",
            "GET",
            "game/saves",
            200
        )
        if success and isinstance(response, list):
            print(f"   Found {len(response)} saved games")
            return response
        return []

    def test_load_game(self, game_id):
        """Test load specific game"""
        if not game_id:
            print("❌ No game ID provided for load test")
            return False
            
        success, response = self.run_test(
            "Load Game",
            "GET",
            f"game/load/{game_id}",
            200
        )
        if success and 'game_state' in response:
            print(f"   Loaded game: {response.get('game_name', 'Unknown')}")
            return True
        return False

    def test_delete_game(self, game_id):
        """Test delete game"""
        if not game_id:
            print("❌ No game ID provided for delete test")
            return False
            
        success, response = self.run_test(
            "Delete Game",
            "DELETE",
            f"game/delete/{game_id}",
            200
        )
        return success

    def test_submit_score(self):
        """Test submit score to leaderboard"""
        score_data = {
            "player_name": f"TestPlayer{datetime.now().strftime('%H%M%S')}",
            "score": 2500,
            "level_reached": 3
        }
        
        success, response = self.run_test(
            "Submit Score",
            "POST",
            "leaderboard",
            200,
            data=score_data
        )
        
        if success and 'id' in response:
            print(f"   Score submitted with ID: {response['id']}")
            return True
        return False

    def test_get_leaderboard(self):
        """Test get leaderboard"""
        success, response = self.run_test(
            "Get Leaderboard",
            "GET",
            "leaderboard",
            200,
            params={"limit": 5}
        )
        if success and isinstance(response, list):
            print(f"   Found {len(response)} scores on leaderboard")
            return True
        return False

    def test_invalid_endpoints(self):
        """Test invalid endpoints return proper errors"""
        # Test non-existent game load
        success, _ = self.run_test(
            "Load Non-existent Game",
            "GET",
            "game/load/invalid-id",
            404
        )
        
        # Test non-existent game delete
        success2, _ = self.run_test(
            "Delete Non-existent Game",
            "DELETE",
            "game/delete/invalid-id",
            404
        )
        
        return success and success2

def main():
    print("🚀 Starting Space Shooter API Tests...")
    tester = SpaceShooterAPITester()
    
    # Test basic endpoints
    tester.test_root_endpoint()
    tester.test_levels_endpoint()
    
    # Test game save/load functionality
    saved_game_id = tester.test_save_game()
    saved_games = tester.test_get_saved_games()
    
    if saved_game_id:
        tester.test_load_game(saved_game_id)
        tester.test_delete_game(saved_game_id)
    
    # Test leaderboard functionality
    tester.test_submit_score()
    tester.test_get_leaderboard()
    
    # Test error handling
    tester.test_invalid_endpoints()
    
    # Print final results
    print(f"\n📊 Final Results:")
    print(f"Tests passed: {tester.tests_passed}/{tester.tests_run}")
    print(f"Success rate: {(tester.tests_passed/tester.tests_run)*100:.1f}%")
    
    # Save detailed results
    with open('/app/backend_test_results.json', 'w') as f:
        json.dump({
            "summary": {
                "total_tests": tester.tests_run,
                "passed_tests": tester.tests_passed,
                "success_rate": (tester.tests_passed/tester.tests_run)*100
            },
            "detailed_results": tester.test_results
        }, f, indent=2)
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())