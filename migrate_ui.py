import os
import re

templates_dir = r"C:\1 . project\Placement Prediction\src\main\resources\templates"

# Files to skip (Homepage)
skip_files = ['index.html']

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    
    # 1. Swap the CSS
    content = content.replace('global-theme.css', 'corporate-theme.css')
    
    # 2. Remove webgl-canvas
    content = re.sub(r'<canvas id="webgl-canvas"></canvas>\s*', '', content)
    
    # 3. Swap the card classes
    content = content.replace('glass-card-premium', 'corporate-card')
    
    # 4. Strip inline styles that force dark background or glowing borders
    # Specifically looking for style="background: rgba(...)" or border inline styles
    content = re.sub(r'style="background:\s*rgba\([^)]+\);\s*backdrop-filter:\s*blur\([^)]+\);\s*border:[^"]+"', '', content)
    content = re.sub(r'style="background:\s*rgba\([^)]+\);\s*border:[^"]+"', '', content)
    
    # Some inline styles have other things we want to keep, but we can strip specific properties
    # Let's just remove the explicit glass-border variable usage
    content = content.replace('border: 1px solid var(--glass-border)', 'border: 1px solid var(--border-color)')
    
    # 5. Remove 'text-light' or 'text-white' from body or let CSS handle it. 
    # CSS is already handling it, but let's remove 'bg-transparent' from alerts to make them pop
    content = content.replace('bg-transparent', '')
    
    # 6. Navbar updates - remove navbar-dark or text-light from navbar specifically if they exist
    # The CSS handles this.
    
    # 7. Button outlines - let's make them solid for primary actions, but outlines are fine.
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")

for root, dirs, files in os.walk(templates_dir):
    for file in files:
        if file.endswith('.html') and file not in skip_files:
            filepath = os.path.join(root, file)
            process_file(filepath)

print("Migration script completed.")
