#!/usr/bin/env python3
"""
OCR Results Analyzer
Analyzes the results from the experimental notice board generator
to show success rates, common errors, and text accuracy statistics.
"""

import os
import re
import json
from pathlib import Path
from collections import defaultdict

def load_projects():
    """Load projects from JSON file."""
    with open('data/projects.json', 'r') as f:
        data = json.load(f)
    return data['projects']

def parse_ocr_result_file(file_path):
    """Parse an individual OCR result file."""
    with open(file_path, 'r') as f:
        content = f.read()
    
    # Extract project name
    project_match = re.search(r'Project: (.+)', content)
    project_name = project_match.group(1) if project_match else "Unknown"
    
    # Extract similarity score
    similarity_match = re.search(r'Similarity Score: (.+)', content)
    similarity = similarity_match.group(1) if similarity_match else "0%"
    
    # Extract expected and OCR text
    expected_match = re.search(r'--- Expected Text ---\n(.+?)\n\n--- OCR Result ---', content, re.DOTALL)
    expected_text = expected_match.group(1) if expected_match else ""
    
    ocr_match = re.search(r'--- OCR Result ---\n(.+)$', content, re.DOTALL)
    ocr_text = ocr_match.group(1) if ocr_match else ""
    
    return {
        'project_name': project_name,
        'similarity': similarity,
        'similarity_float': float(similarity.rstrip('%')) / 100 if similarity.endswith('%') else 0,
        'expected_text': expected_text.strip(),
        'ocr_text': ocr_text.strip()
    }

def analyze_common_errors(results):
    """Analyze common OCR errors."""
    error_patterns = defaultdict(int)
    
    for result in results:
        expected_words = result['expected_text'].lower().split()
        ocr_words = result['ocr_text'].lower().split()
        
        # Simple word-by-word comparison
        for i, expected_word in enumerate(expected_words):
            if i < len(ocr_words):
                ocr_word = ocr_words[i]
                if expected_word != ocr_word:
                    error_patterns[f"{expected_word} → {ocr_word}"] += 1
    
    return error_patterns

def generate_report(results):
    """Generate a comprehensive analysis report."""
    total_projects = len(results)
    successful_projects = len([r for r in results if r['similarity_float'] >= 0.7])
    
    similarities = [r['similarity_float'] for r in results]
    avg_similarity = sum(similarities) / len(similarities) if similarities else 0
    
    print("🔬 EXPERIMENTAL NOTICE BOARD GENERATOR - OCR ANALYSIS REPORT")
    print("=" * 70)
    
    print(f"\n📊 OVERALL STATISTICS:")
    print(f"   Total Projects Analyzed: {total_projects}")
    print(f"   Successful Generations (≥70% similarity): {successful_projects}")
    print(f"   Success Rate: {successful_projects/total_projects*100:.1f}%")
    print(f"   Average Text Similarity: {avg_similarity*100:.1f}%")
    
    # Similarity distribution
    print(f"\n📈 SIMILARITY DISTRIBUTION:")
    ranges = [(0.9, 1.0, "Excellent (90-100%)"), 
              (0.7, 0.9, "Good (70-89%)"),
              (0.5, 0.7, "Fair (50-69%)"),
              (0.3, 0.5, "Poor (30-49%)"),
              (0.0, 0.3, "Failed (0-29%)")]
    
    for min_val, max_val, label in ranges:
        count = len([r for r in results if min_val <= r['similarity_float'] < max_val])
        percentage = count / total_projects * 100 if total_projects > 0 else 0
        bar = "█" * int(percentage / 5) + "░" * (20 - int(percentage / 5))
        print(f"   {label:20} {count:2d} [{bar}] {percentage:5.1f}%")
    
    # Best and worst performers
    if results:
        best = max(results, key=lambda x: x['similarity_float'])
        worst = min(results, key=lambda x: x['similarity_float'])
        
        print(f"\n🏆 BEST PERFORMER:")
        print(f"   Project: {best['project_name']}")
        print(f"   Similarity: {best['similarity']}")
        
        print(f"\n💔 MOST CHALLENGING:")
        print(f"   Project: {worst['project_name']}")
        print(f"   Similarity: {worst['similarity']}")
    
    # Common errors
    print(f"\n🔍 COMMON OCR ERRORS (Top 10):")
    error_patterns = analyze_common_errors(results)
    sorted_errors = sorted(error_patterns.items(), key=lambda x: x[1], reverse=True)[:10]
    
    for i, (error, count) in enumerate(sorted_errors, 1):
        print(f"   {i:2d}. {error} ({count} times)")
    
    # Individual project details
    print(f"\n📝 INDIVIDUAL PROJECT RESULTS:")
    sorted_results = sorted(results, key=lambda x: x['similarity_float'], reverse=True)
    
    for result in sorted_results:
        status = "✅" if result['similarity_float'] >= 0.7 else "❌"
        print(f"   {status} {result['project_name'][:40]:40} {result['similarity']:>6}")
    
    print(f"\n💡 INSIGHTS:")
    if avg_similarity >= 0.7:
        print(f"   🎉 Excellent results! The experiment is working well.")
    elif avg_similarity >= 0.5:
        print(f"   📈 Good progress! Some fine-tuning could improve results.")
    elif avg_similarity >= 0.3:
        print(f"   🔧 Mixed results. Consider adjusting prompts or OCR settings.")
    else:
        print(f"   🚧 Challenging results. Text generation in images is cutting-edge!")
    
    if successful_projects / total_projects < 0.3:
        print(f"   💡 Consider lowering the similarity threshold or improving prompts.")
    
    print(f"\n📁 Detailed results available in: images/notice_boards_with_text/ocr_results/")

def main():
    """Main function to analyze OCR results."""
    ocr_results_dir = Path("images/notice_boards_with_text/ocr_results")
    
    if not ocr_results_dir.exists():
        print("❌ OCR results directory not found.")
        print("Please run the experimental generator first:")
        print("python generate_notice_boards_with_text.py")
        return
    
    # Load all OCR result files
    result_files = list(ocr_results_dir.glob("*.txt"))
    
    if not result_files:
        print("❌ No OCR result files found.")
        print("Please run the experimental generator first.")
        return
    
    print(f"📊 Found {len(result_files)} OCR result files")
    
    # Parse all results
    results = []
    for file_path in result_files:
        try:
            result = parse_ocr_result_file(file_path)
            results.append(result)
        except Exception as e:
            print(f"⚠️  Error parsing {file_path}: {e}")
    
    if not results:
        print("❌ No valid results to analyze.")
        return
    
    # Generate comprehensive report
    generate_report(results)

if __name__ == "__main__":
    main() 