import pandas as pd
import sqlite3
from datetime import datetime, timedelta
import random

class LegalCaseETL:

    # Initialize ETL processor with database path
    def __init__(self, db_path='legal_cases.db'):
        self.db_path = db_path
        # Create database and tables if they don't exist
        self._init_database()

    # Initialize the SQLite database and create tables
    def _init_database(self):
        conn = sqlite3.connect(self.db_path)
        conn.execute('''
            CREATE TABLE IF NOT EXISTS cases (
                id INTEGER PRIMARY KEY,
                case_number TEXT,
                case_type TEXT,
                filing_date TEXT,
                resolution_date TEXT,
                status TEXT,
                practice_area TEXT,
                attorney_id INTEGER,
                settlement_amount REAL,
                outcome TEXT,
                case_duration INTEGER,
                settlement_tier TEXT,
                is_successful INTEGER,
                is_long_duration INTEGER
            )
        ''')
        conn.commit()
        conn.close()
        print(f"Database initialized at {self.db_path}")

    # Extract data from CSV or generate sample data
    def extract_from_csv(self, csv_path=None):
        if csv_path:
            return pd.read_csv(csv_path)
        else:
            # Generate sample data
            data = []
            case_types = ['Personal Injury', 'Family Law', 'Criminal Defense', 'Real Estate', 'Corporate']
            practice_areas = ['Civil Litigation', 'Criminal Law', 'Family Law', 'Corporate Law']
            statuses = ['Active', 'Resolved']
            outcomes = ['Success', 'Pending', 'Settled']
            
            for i in range(100):
                filing_date = datetime(2023, 1, 1) + timedelta(days=random.randint(0, 365))
                resolution_date = filing_date + timedelta(days=random.randint(30, 180))
                
                data.append({
                    'case_number': f'CASE-{2023}-{i+1:04d}',
                    'case_type': random.choice(case_types),
                    'filing_date': filing_date.strftime('%Y-%m-%d'),
                    'resolution_date': resolution_date.strftime('%Y-%m-%d'),
                    'status': random.choice(statuses),
                    'practice_area': random.choice(practice_areas),
                    'attorney_id': random.randint(1, 10),
                    'settlement_amount': round(random.uniform(5000, 100000), 2),
                    'outcome': random.choice(outcomes)
                })
            
            return pd.DataFrame(data)

    # Transform the extracted data
    def transform(self, df):
        transformed_df = df.copy()
        
        # Standardize case types and practice areas
        transformed_df['case_type'] = transformed_df['case_type'].str.title()
        transformed_df['practice_area'] = transformed_df['practice_area'].str.title()
        
        # Calculate case duration
        transformed_df['filing_date'] = pd.to_datetime(transformed_df['filing_date'])
        transformed_df['resolution_date'] = pd.to_datetime(transformed_df['resolution_date'])
        transformed_df['case_duration'] = (transformed_df['resolution_date'] - 
                                         transformed_df['filing_date']).dt.days
        
        # Calculate settlement tier
        transformed_df['settlement_tier'] = pd.cut(
            transformed_df['settlement_amount'],
            bins=[0, 10000, 50000, 100000, float('inf')],
            labels=['Low', 'Medium', 'High', 'Very High']
        )
        
        # Add derived metrics
        transformed_df['is_successful'] = transformed_df['outcome'] == 'Success'
        transformed_df['is_long_duration'] = transformed_df['case_duration'] > 90
        
        return transformed_df

    # Load transformed data into SQLite database
    def load(self, df):
        conn = sqlite3.connect(self.db_path)
        
        # Store processed data
        processed_cols = [
            'case_number', 'case_type', 'filing_date', 'resolution_date',
            'status', 'practice_area', 'attorney_id', 'settlement_amount',
            'outcome', 'case_duration', 'settlement_tier', 'is_successful',
            'is_long_duration'
        ]
        
        df[processed_cols].to_sql('cases', conn, if_exists='replace', index=False)
        conn.commit()
        conn.close()
        print(f"Data loaded into {self.db_path}")

    # Run the complete ETL pipeline
    def run_pipeline(self, csv_path=None):
        print("Starting ETL pipeline...")
        print("Extracting data...")
        raw_data = self.extract_from_csv(csv_path)
        
        print("Transforming data...")
        transformed_data = self.transform(raw_data)
        
        print("Loading data...")
        self.load(transformed_data)
        
        print("ETL pipeline completed successfully!")
        return transformed_data