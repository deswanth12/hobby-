import os
import zipfile
import shutil

root_dir = os.path.abspath('.')
zip_filename = os.path.join(root_dir, 'kavitha_associates_v6_source.zip')
artifact_dir = r'C:\Users\k deswanth\.gemini\antigravity\brain\12a17cde-3e50-4191-8739-afaecddf2151'
artifact_zip = os.path.join(artifact_dir, 'kavitha_associates_v6_source.zip')

# Exclude patterns
exclude_dirs = {
    'node_modules',
    '.git',
    '.gemini',
    'dist',
    '.vscode',
    'edge-profile',
    'edge-profile-tmp'
}

exclude_files = {
    '.env',
    '.env.local',
    '.env.production',
    '.env.development',
    'kavitha_associates_v6_source.zip'
}

print(f"Creating clean ZIP from {root_dir}...")
count = 0
total_bytes = 0

with zipfile.ZipFile(zip_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk(root_dir):
        # Filter directories in place
        dirs[:] = [d for d in dirs if d not in exclude_dirs and not d.startswith('edge-profile')]
        
        for file in files:
            if file in exclude_files or file.startswith('.env'):
                continue
            if file.endswith('.zip'):
                continue
                
            abs_path = os.path.join(root, file)
            rel_path = os.path.relpath(abs_path, root_dir)
            
            # Additional check on path parts
            parts = rel_path.split(os.sep)
            if any(p in exclude_dirs or p.startswith('edge-profile') for p in parts):
                continue
                
            zipf.write(abs_path, rel_path)
            count += 1
            total_bytes += os.path.getsize(abs_path)

zip_size_mb = os.path.getsize(zip_filename) / (1024 * 1024)
print(f"Archive created: {zip_filename}")
print(f"Packaged {count} files ({total_bytes / (1024 * 1024):.2f} MB uncompressed -> {zip_size_mb:.2f} MB zipped)")

# Copy to artifact directory
if os.path.exists(artifact_dir):
    shutil.copy2(zip_filename, artifact_zip)
    print(f"Copied to artifact directory: {artifact_zip}")
