import os
import hashlib
import json
import stat
from datetime import datetime

SCAN_DIRS = ['/volume1/TUAN_ATLAS', '/volume1/TUAN_FORGE']
IMAGE_EXTS = {'.jpg', '.jpeg', '.png', '.heic', '.bmp', '.gif'}
REPORT_FILE = '/volume1/TUAN_FORGE/nas_audit_report.json'

def get_md5(file_path, block_size=65536):
    md5 = hashlib.md5()
    try:
        with open(file_path, 'rb') as f:
            for chunk in iter(lambda: f.read(block_size), b''):
                md5.update(chunk)
        return md5.hexdigest()
    except Exception as e:
        return None

def main():
    print("Bắt đầu quét thư mục NAS...")
    files_data = []
    total_scanned = 0
    total_size = 0
    hashes = {}
    duplicates = []
    
    for scan_dir in SCAN_DIRS:
        print(f"Đang quét {scan_dir}...")
        if not os.path.exists(scan_dir):
            print(f"Thư mục không tồn tại: {scan_dir}")
            continue
            
        for root, dirs, files in os.walk(scan_dir):
            # Skip Synology specific hidden dirs
            if '@eaDir' in root or '#recycle' in root:
                continue
            
            for file in files:
                ext = os.path.splitext(file)[1].lower()
                if ext in IMAGE_EXTS:
                    full_path = os.path.join(root, file)
                    total_scanned += 1
                    try:
                        file_stat = os.stat(full_path)
                        file_size = file_stat.st_size
                        mtime = file_stat.st_mtime
                        
                        file_hash = get_md5(full_path)
                        
                        if not file_hash:
                            continue
                            
                        file_info = {
                            'path': full_path,
                            'name': file,
                            'size': file_size,
                            'ext': ext,
                            'mtime': mtime,
                            'mtime_iso': datetime.fromtimestamp(mtime).isoformat(),
                            'hash': file_hash
                        }
                        
                        files_data.append(file_info)
                        total_size += file_size
                        
                        if file_hash in hashes:
                            hashes[file_hash].append(full_path)
                        else:
                            hashes[file_hash] = [full_path]
                            
                    except Exception as e:
                        pass
                        
    # Process duplicates
    dup_size = 0
    dup_count = 0
    for h, paths in hashes.items():
        if len(paths) > 1:
            dup_count += (len(paths) - 1)
            size = 0
            for f in files_data:
                if f['hash'] == h:
                    size = f['size']
                    break
            dup_size += size * (len(paths) - 1)
            duplicates.append({
                'hash': h,
                'count': len(paths),
                'paths': paths,
                'wasted_bytes': size * (len(paths) - 1)
            })

    report = {
        'scan_time': datetime.now().isoformat(),
        'total_images_found': total_scanned,
        'total_size_bytes': total_size,
        'duplicate_images_count': dup_count,
        'wasted_space_bytes': dup_size,
        'unique_images_count': len(hashes),
        'duplicates_list': duplicates,
        'all_files': files_data
    }
    
    # Save the report
    with open(REPORT_FILE, 'w') as f:
        json.dump(report, f, ensure_ascii=False, indent=2)
        
    print(f"Quét hoàn tất!")
    print(f"Tổng số ảnh: {total_scanned}")
    print(f"Số ảnh bị trùng lặp: {dup_count}")
    print(f"Dung lượng lãng phí: {dup_size / (1024*1024):.2f} MB")
    print(f"Báo cáo chi tiết lưu tại: {REPORT_FILE}")

if __name__ == '__main__':
    main()
