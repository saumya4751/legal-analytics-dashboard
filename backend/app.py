from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3
import pandas as pd
from src.etl.processor import LegalCaseETL

app = Flask(__name__)
CORS(app)

# Initialize ETL pipeline
etl = LegalCaseETL()

def apply_filters(query, filters):
    where_clauses = []
    params = []
    
    if filters.get('caseType'):
        where_clauses.append("case_type = ?")
        params.append(filters['caseType'])
    
    if filters.get('practiceArea'):
        where_clauses.append("practice_area = ?")
        params.append(filters['practiceArea'])
        
    if filters.get('status'):
        where_clauses.append("status = ?")
        params.append(filters['status'])
        
    if filters.get('searchTerm'):
        where_clauses.append("(case_number LIKE ? OR case_type LIKE ? OR practice_area LIKE ?)")
        search_term = f"%{filters['searchTerm']}%"
        params.extend([search_term, search_term, search_term])
    
    if where_clauses:
        query += " WHERE " + " AND ".join(where_clauses)
    
    return query, params

@app.route('/api/cases/stats')
def get_case_stats():
    try:
        filters = request.args.to_dict()
        conn = sqlite3.connect('legal_cases.db')
        
        base_query = """
        SELECT 
            COUNT(*) as total_cases,
            SUM(CASE WHEN status = 'Active' THEN 1 ELSE 0 END) as active_cases,
            AVG(case_duration) as avg_resolution_days,
            AVG(is_successful) as success_rate
        FROM cases
        """
        
        query, params = apply_filters(base_query, filters)
        df = pd.read_sql_query(query, conn, params=params)
        stats = df.iloc[0].to_dict()
        conn.close()
        return jsonify(stats)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/cases/by-type')
def get_cases_by_type():
    try:
        filters = request.args.to_dict()
        conn = sqlite3.connect('legal_cases.db')
        
        base_query = """
        SELECT 
            case_type,
            COUNT(*) as count,
            AVG(is_successful) as success_rate,
            AVG(settlement_amount) as avg_settlement
        FROM cases
        """
        
        query, params = apply_filters(base_query, filters)
        query += " GROUP BY case_type ORDER BY count DESC"
        
        df = pd.read_sql_query(query, conn, params=params)
        result = df.to_dict(orient='records')
        conn.close()
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/cases/resolution-times')
def get_resolution_times():
    try:
        filters = request.args.to_dict()
        conn = sqlite3.connect('legal_cases.db')
        
        base_query = """
        SELECT 
            practice_area,
            AVG(case_duration) as avg_days,
            MIN(case_duration) as min_days,
            MAX(case_duration) as max_days
        FROM cases
        """
        
        query, params = apply_filters(base_query, filters)
        query += " GROUP BY practice_area"
        
        df = pd.read_sql_query(query, conn, params=params)
        result = df.to_dict(orient='records')
        conn.close()
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("Running initial ETL pipeline...")
    etl.run_pipeline()
    print("Starting Flask server...")
    app.run(debug=True)