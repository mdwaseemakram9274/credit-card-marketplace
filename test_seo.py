#!/usr/bin/env python3
"""Test SEO tags and schemas on key pages"""

import urllib.request
import json
import re

def test_page_seo(url, page_name):
    """Test SEO elements on a page"""
    try:
        response = urllib.request.urlopen(url, timeout=5)
        html = response.read().decode('utf-8')
        
        print(f"\n{'='*50}")
        print(f"  {page_name}")
        print(f"{'='*50}")
        
        # Check for title
        title_match = re.search(r'<title>(.*?)</title>', html)
        if title_match:
            print(f"✅ Title: {title_match.group(1)[:60]}")
        else:
            print("❌ No title found")
        
        # Check for meta description
        desc_match = re.search(r'<meta name="description" content="(.*?)"', html)
        if desc_match:
            print(f"✅ Description: {desc_match.group(1)[:60]}")
        else:
            print("❌ No description found")
        
        # Check for JSON-LD schema
        schema_matches = re.findall(r'<script type="application/ld\+json">(.*?)</script>', html, re.DOTALL)
        if schema_matches:
            print(f"✅ JSON-LD Schemas: {len(schema_matches)} found")
            for i, schema in enumerate(schema_matches[:3]):
                try:
                    schema_data = json.loads(schema.strip())
                    schema_type = schema_data.get('@type', 'Unknown')
                    print(f"   • Schema {i+1}: {schema_type}")
                except:
                    pass
        else:
            print("❌ No JSON-LD schemas found")
        
        # Check for OG tags
        og_matches = re.findall(r'<meta property="og:(\w+)"', html)
        if og_matches:
            unique_og = list(set(og_matches))
            print(f"✅ Open Graph Tags: {len(og_matches)} found")
            print(f"   • Tags: {', '.join(unique_og[:5])}")
        else:
            print("❌ No OG tags found")
        
        # Check for Twitter tags
        twitter_matches = re.findall(r'<meta name="twitter:(\w+)"', html)
        if twitter_matches:
            unique_twitter = list(set(twitter_matches))
            print(f"✅ Twitter Card Tags: {len(twitter_matches)} found")
            print(f"   • Tags: {', '.join(unique_twitter[:5])}")
        else:
            print("❌ No Twitter tags found")
            
        # Check canonical
        canonical_match = re.search(r'<link rel="canonical" href="(.*?)"', html)
        if canonical_match:
            print(f"✅ Canonical URL: {canonical_match.group(1)}")
        else:
            print("❌ No canonical URL found")
        
        # Check robots meta
        robots_match = re.search(r'<meta name="robots" content="(.*?)"', html)
        if robots_match:
            print(f"✅ Robots Meta: {robots_match.group(1)}")
        else:
            print("⚠️  No robots meta (usually OK)")
            
    except Exception as e:
        print(f"\n❌ Error testing {page_name}: {str(e)}")

# Test key pages
test_page_seo('http://localhost:3000/', 'HOMEPAGE')
test_page_seo('http://localhost:3000/search', 'SEARCH PAGE')
test_page_seo('http://localhost:3000/about', 'ABOUT PAGE')

print(f"\n{'='*50}")
print("  SEO TEST COMPLETE")
print(f"{'='*50}\n")
