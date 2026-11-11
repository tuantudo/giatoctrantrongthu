import pandas as pd

df = pd.read_csv("audit_after_cutoff.csv")
print("DATE | FILE | TYPE | HR SAMPLES | VALID HR | GPS | SLEEP | BODY BATTERY | NOTES")
for _, row in df.iterrows():
    date = str(row['time_created']).split('.')[0]
    file = row['filename']
    ftype = row['file_type']
    if ftype == '49': ftype = 'sleep'
    elif ftype == '29': ftype = 'records'
    elif ftype == '41': ftype = 'chnglog'
    
    hr_samples = int(row['num_hr_fields'])
    valid_hr = int(row['valid_hr'])
    gps = "YES" if row['has_gps'] else "NO"
    sleep = "YES" if row['file_type'] == '49' else "NO"
    bb = "YES" if row['has_bb'] else "NO"
    notes = row['hr_absence_reason'] if pd.notna(row['hr_absence_reason']) else "Valid HR found"
    
    print(f"{date} | {file} | {ftype} | {hr_samples} | {valid_hr} | {gps} | {sleep} | {bb} | {notes}")
