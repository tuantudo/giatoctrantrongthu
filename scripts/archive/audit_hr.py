import os
import glob
import pandas as pd
from fitparse import FitFile
import datetime

RAW_DIR = os.path.expanduser("~/Desktop/Garmin_Forensic_Audit/HEALTH_DATA/raw")
fit_files = glob.glob(os.path.join(RAW_DIR, "**/*.fit"), recursive=True) + glob.glob(os.path.join(RAW_DIR, "**/*.FIT"), recursive=True)

audit_data = []

def convert_timestamp(ts):
    if isinstance(ts, int):
        return datetime.datetime.utcfromtimestamp(ts + 631065600)
    return ts

for f in fit_files:
    file_size = os.path.getsize(f)
    mtime = datetime.datetime.fromtimestamp(os.path.getmtime(f))
    
    file_type = "unknown"
    time_created = None
    
    num_record = 0
    num_hr = 0
    valid_hr = 0
    invalid_hr = 0
    has_gps = False
    has_sleep = False
    has_bb = False
    
    first_ts = None
    last_ts = None
    
    try:
        fitfile = FitFile(f)
        for message in fitfile.get_messages():
            msg_name = message.name
            
            if msg_name == 'file_id':
                ftype = message.get_value('type')
                if ftype: file_type = str(ftype)
                tc = message.get_value('time_created')
                if tc: time_created = convert_timestamp(tc)
                continue
                
            ts = convert_timestamp(message.get_value('timestamp'))
            if ts:
                if first_ts is None or ts < first_ts: first_ts = ts
                if last_ts is None or ts > last_ts: last_ts = ts
            
            if msg_name == 'record' or msg_name == 'monitoring' or msg_name == 'hr':
                num_record += 1
                hr_val = message.get_value('heart_rate')
                if hr_val is None:
                    hr_val = message.get_value('filtered_bpm') # Check for compressed/hr message
                
                if hr_val is not None:
                    num_hr += 1
                    if hr_val > 0 and hr_val < 255:
                        valid_hr += 1
                    else:
                        invalid_hr += 1
                
                if message.get_value('position_lat') is not None:
                    has_gps = True
                    
            if msg_name == 'sleep_level':
                has_sleep = True
            if msg_name == 'body_battery':
                has_bb = True
                
    except Exception as e:
        # File might be corrupt or empty
        pass
        
    # Classify HR Absence
    hr_absence = ""
    if file_size < 500 and num_record == 0:
        hr_absence = "E. file too small / header-only"
    elif num_record > 0 and num_hr == 0:
        hr_absence = "A. no HR field"
    elif num_hr > 0 and valid_hr == 0:
        hr_absence = "B. HR field present but invalid (255/0)"
    elif num_record == 0 and file_size >= 500:
        hr_absence = "C/D. No records found"
    
    audit_data.append({
        'filename': os.path.basename(f),
        'path': f,
        'mtime': mtime,
        'time_created': time_created if time_created else mtime,
        'file_type': file_type,
        'file_size': file_size,
        'num_record': num_record,
        'num_hr_fields': num_hr,
        'valid_hr': valid_hr,
        'invalid_hr': invalid_hr,
        'first_ts': first_ts,
        'last_ts': last_ts,
        'has_gps': has_gps,
        'has_sleep': has_sleep,
        'has_bb': has_bb,
        'hr_absence_reason': hr_absence
    })

df = pd.DataFrame(audit_data)
df['time_created'] = pd.to_datetime(df['time_created'])
df = df.sort_values('time_created')

df.to_csv("audit_results.csv", index=False)

# Filter after 2025-04-25
cutoff = pd.to_datetime("2025-04-25")
df_after = df[df['time_created'] >= cutoff]
df_after.to_csv("audit_after_cutoff.csv", index=False)

print("TOTAL FILES:", len(df))
print("FILES AFTER CUTOFF:", len(df_after))

# 10 Most Recent Activities
recent_act = df[df['file_type'] == 'activity'].tail(10)
print("\n--- 10 MOST RECENT ACTIVITIES ---")
print(recent_act[['filename', 'time_created', 'file_type', 'valid_hr', 'hr_absence_reason']])

# 10 Most Recent Monitoring/Sleep
recent_health = df[df['file_type'].isin(['monitoring_b', 'sleep', 'monitoring'])].tail(10)
print("\n--- 10 MOST RECENT HEALTH/SLEEP ---")
print(recent_health[['filename', 'time_created', 'file_type', 'valid_hr', 'hr_absence_reason']])

