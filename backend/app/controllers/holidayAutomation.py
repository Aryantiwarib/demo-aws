from flask import Flask, request, jsonify
from flask_cors import CORS
import csv
import datetime
import os
import time
from threading import Thread, Lock
from werkzeug.utils import secure_filename
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_FOLDER = './uploads'
DEFAULT_NOTICE_DAYS = 7
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Thread-safe data storage
class HolidayManager:
    def __init__(self):
        self.lock = Lock()
        self.holidays = []
        self.initialized = False

    def load_from_csv(self, file_path):
        with self.lock:
            try:
                new_holidays = []
                with open(file_path, mode='r', encoding='utf-8') as file:
                    reader = csv.DictReader(file)
                    for row in reader:
                        try:
                            start_date = datetime.datetime.strptime(row['start_date'], "%m/%d/%Y").date()
                            end_date = datetime.datetime.strptime(row['end_date'], "%m/%d/%Y").date()
                            
                            new_holidays.append({
                                "name": row['name'],
                                "start_date": start_date.strftime("%m-%d-%Y"),
                                "end_date": end_date.strftime("%m-%d-%Y"),
                                "type": row.get('type', 'Public Holiday'),
                                "notice_days": int(row.get('notice_days', DEFAULT_NOTICE_DAYS)),
                                "message": row.get('message', '')
                            })
                        except (ValueError, KeyError) as e:
                            logger.error(f"Error processing row {row}: {e}")
                
                self.holidays = new_holidays
                self.initialized = True
                return True
            except Exception as e:
                logger.error(f"CSV loading failed: {e}")
                return False

    def check_holidays(self):
        with self.lock:
            if not self.initialized:
                logger.info("Holiday data not initialized")
                return []
            
            today = datetime.date.today()
            notices = []
            
            for holiday in self.holidays:
                try:
                    holiday_date = datetime.datetime.strptime(holiday["start_date"], "%m-%d-%Y").date()
                    days_until = (holiday_date - today).days
                    
                    if days_until == holiday["notice_days"]:
                        notices.append({
                            "subject": f"Upcoming Holiday: {holiday['name']}",
                            "message": (
                                f"{holiday['name']} is from {holiday_date.strftime('%A, %B %d')} "
                                f"to {datetime.datetime.strptime(holiday['end_date'], '%m-%d-%Y').date().strftime('%B %d')}.\n"
                                f"{holiday['message']}"
                            )
                        })
                except Exception as e:
                    logger.error(f"Error processing holiday {holiday}: {e}")
            
            return notices

# Global instance
holiday_manager = HolidayManager()

# Routes
@app.route('/upload-csv', methods=['POST'])
def upload_csv():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if not file.filename:
        return jsonify({'error': 'No file selected'}), 400
    
    try:
        filename = secure_filename(file.filename)
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)
        
        if holiday_manager.load_from_csv(filepath):
            return jsonify({'message': 'Holidays loaded successfully'}), 200
        else:
            return jsonify({'error': 'Failed to process CSV'}), 500
    except Exception as e:
        logger.error(f"Upload failed: {e}")
        return jsonify({'error': str(e)}), 500

# Background worker
def automated_daily_check():
    # time.sleep(10)  # Let server start
    logger.info("Holiday automation started")
    
    while True:
        notices = holiday_manager.check_holidays()
        if notices:
            for notice in notices:
                logger.info(f"NOTICE: {notice['subject']}\n{notice['message']}")
        else:
            logger.info(f"{datetime.date.today()} - No notices today\n")
        time.sleep(24*60*60)  # 24 hours

# Startup
if __name__ == '__main__':
    Thread(target=automated_daily_check, daemon=True).start()
    app.run(host='0.0.0.0', port=5000, debug=False)