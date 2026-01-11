import requests
from bs4 import BeautifulSoup
import re

url = "https://www.overleaf.com/latex/templates/tagged/cv"
headers = {
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}
response = requests.get(url, headers=headers)
soup = BeautifulSoup(response.content, 'html.parser')

print("--- All Links with 'page' in href ---")
for a in soup.find_all('a', href=True):
    if 'page' in a['href']:
        print(f"Text: '{a.get_text(strip=True)}', Href: {a['href']}")

print("\n--- Searching for 'Next' ---")
next_link = soup.find('a', string=re.compile(r"Next", re.IGNORECASE))
if next_link:
    print(f"Found by string: {next_link}")
else:
    print("Not found by string")

pagination = soup.find('ul', class_='pagination')
if pagination:
    print("\n--- Pagination Element ---")
    print(pagination)
