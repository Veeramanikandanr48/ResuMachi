import requests
from bs4 import BeautifulSoup
import os
import zipfile
import io
import time
import re

BASE_URL = "https://www.overleaf.com"
START_URL = "https://www.overleaf.com/latex/templates/tagged/cv"
OUTPUT_DIR = "overleaf_templates"

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

def get_soup(url):
    try:
        response = requests.get(url, headers=HEADERS, timeout=10)
        response.raise_for_status()
        return BeautifulSoup(response.content, 'html.parser')
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return None

def download_and_extract_template(template_url, template_name):
    # Try zip first
    zip_url = f"{template_url}/source.zip"
    pdf_url = f"{template_url}.pdf"
    print(f"Processing {template_name}...")
    
    template_dir = os.path.join(OUTPUT_DIR, template_name)
    os.makedirs(template_dir, exist_ok=True)

    # Try to download PDF preview
    try:
        pdf_response = requests.get(pdf_url, headers=HEADERS, timeout=15)
        if pdf_response.status_code == 200 and 'application/pdf' in pdf_response.headers.get('Content-Type', ''):
            with open(os.path.join(template_dir, "preview.pdf"), "wb") as f:
                f.write(pdf_response.content)
            print(f"Downloaded preview PDF for {template_name}")
    except Exception as e:
        print(f"Error downloading PDF for {template_name}: {e}")

    # Try zip
    try:
        response = requests.get(zip_url, headers=HEADERS, timeout=15)
        if response.status_code == 200 and 'application/zip' in response.headers.get('Content-Type', ''):
            print(f"Downloading zip from {zip_url}...")
            with zipfile.ZipFile(io.BytesIO(response.content)) as z:
                z.extractall(template_dir)
            print(f"Successfully extracted zip to {template_dir}")
            return True
    except Exception as e:
        print(f"Error downloading zip for {template_name}: {e}")

    # Fallback to HTML parsing
    print(f"Zip download failed, falling back to HTML parsing for {template_name}...")
    try:
        soup = get_soup(template_url)
        if soup:
            source_modal = soup.find('div', id='modalViewSource')
            if source_modal:
                code_block = source_modal.find('pre')
                if code_block:
                    latex_code = code_block.get_text()
                    with open(os.path.join(template_dir, "main.tex"), "w") as f:
                        f.write(latex_code)
                    print(f"Successfully extracted main.tex from HTML for {template_name}")
                    return True
            else:
                print(f"No source modal found for {template_name}")
    except Exception as e:
        print(f"Error parsing HTML for {template_name}: {e}")
    
    return False

def scrape():
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)

    current_url = START_URL
    page_num = 1
    
    while current_url:
        print(f"Scraping page {page_num}: {current_url}")
        soup = get_soup(current_url)
        if not soup:
            break
            
        # Find all template links
        # Template links usually look like /latex/templates/template-name/id
        # We need to be careful not to pick up other links
        
        # Based on previous observation, links are in standard anchor tags
        # We can look for hrefs starting with /latex/templates/ and not containing /tagged/
        
        # Exclude 'tagged' links and ensure it has the right structure
        links = soup.find_all('a', href=re.compile(r"^/latex/templates/(?!tagged)[^/]+/[^/]+$"))
        
        found_templates_on_page = 0
        for link in links:
            href = link['href']
            # Extract a clean name from the URL
            # href is like /latex/templates/altacv-template/trgqjpwnmtgv
            parts = href.split('/')
            if len(parts) >= 4:
                template_slug = parts[3]
                template_id = parts[4]
                full_template_url = BASE_URL + href
                
                # Use a unique name combining slug and id to avoid collisions
                folder_name = f"{template_slug}_{template_id}"
                
                # Check if already downloaded to skip
                if os.path.exists(os.path.join(OUTPUT_DIR, folder_name)):
                    print(f"Skipping {folder_name}, already exists.")
                    continue

                success = download_and_extract_template(full_template_url, folder_name)
                if success:
                    found_templates_on_page += 1
                    # Be nice to the server
                    time.sleep(1) 
        
        print(f"Found and processed {found_templates_on_page} templates on page {page_num}")

        # Use rel='next' which is more robust
        next_link = soup.find('a', attrs={'rel': 'next'})

        if next_link and 'href' in next_link.attrs:
            next_href = next_link['href']
            current_url = BASE_URL + next_href
            page_num += 1
            time.sleep(2) # Pause between pages
        else:
            print("No next page found. Scraping complete.")
            break

if __name__ == "__main__":
    scrape()
