import getpass
import subprocess
import json
import urllib.parse
import sys

def run_ssh_curl(endpoint, data_params=None):
    cmd = ["ssh", "nas", "curl", "-s", "-X", "POST", f"http://localhost:5000/webapi/{endpoint}"]
    
    stdin_data = None
    if data_params:
        for k, v in data_params.items():
            if v == "@-":
                cmd.extend(["--data-urlencode", f"{k}@-"])
            else:
                cmd.extend(["--data-urlencode", f"{k}={v}"])
                
    # print("DEBUG: Running", " ".join(cmd[:-1] + ["<hidden>"]))
    
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    
    out, err = proc.communicate(input=stdin_data)
    
    try:
        return json.loads(out.decode('utf-8'))
    except Exception as e:
        print("Error parsing JSON:", out.decode('utf-8'))
        return None

def main():
    username = input("Enter Migration Account Username: ")
    password = getpass.getpass("Enter Migration Account Password: ")
    
    print("\n[1] Authenticating...")
    
    cmd = ["ssh", "nas", "curl", "-s", "-X", "POST", "http://localhost:5000/webapi/auth.cgi", 
           "--data-urlencode", "api=SYNO.API.Auth",
           "--data-urlencode", "version=3",
           "--data-urlencode", "method=login",
           "--data-urlencode", f"account={username}",
           "--data-urlencode", "passwd@-",
           "--data-urlencode", "session=FileStation",
           "--data-urlencode", "format=cookie"]
           
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    out, err = proc.communicate(input=password.encode('utf-8'))
    
    try:
        auth_resp = json.loads(out.decode('utf-8'))
    except Exception:
        print("AUTH = fail (JSON Parse Error)")
        print(out.decode('utf-8'))
        sys.exit(1)
        
    if not auth_resp.get("success"):
        print(f"AUTH = fail (Reason: {auth_resp})")
        sys.exit(1)
        
    sid = auth_resp["data"]["sid"]
    print("AUTH = success")
    
    # Check SOURCE ACCESS (FLASHDRIVE-TUANTUDO1)
    src_cmd = ["ssh", "nas", "curl", "-s", "-X", "POST", "http://localhost:5000/webapi/entry.cgi",
               "--data-urlencode", "api=SYNO.FileStation.List",
               "--data-urlencode", "version=2",
               "--data-urlencode", "method=getinfo",
               "--data-urlencode", 'folder_path=["/homes/tuandzain/FLASHDRIVE-TUANTUDO1", "/homes/tuandzain/FLASHDRIVE-TUANTUDO2"]',
               "--data-urlencode", f"_sid={sid}"]
    proc_src = subprocess.Popen(src_cmd, stdout=subprocess.PIPE)
    out_src, _ = proc_src.communicate()
    
    try:
        src_resp = json.loads(out_src.decode('utf-8'))
        if src_resp.get("success"):
            print("SOURCE ACCESS = yes")
        else:
            print("SOURCE ACCESS = no", src_resp)
    except:
        print("SOURCE ACCESS = no")

    # Check DESTINATION ACCESS (01_INBOX)
    dest_cmd = ["ssh", "nas", "curl", "-s", "-X", "POST", "http://localhost:5000/webapi/entry.cgi",
               "--data-urlencode", "api=SYNO.FileStation.List",
               "--data-urlencode", "version=2",
               "--data-urlencode", "method=getinfo",
               "--data-urlencode", 'folder_path=["/TUAN_FORGE/01_INBOX"]',
               "--data-urlencode", f"_sid={sid}"]
    proc_dest = subprocess.Popen(dest_cmd, stdout=subprocess.PIPE)
    out_dest, _ = proc_dest.communicate()
    
    try:
        dest_resp = json.loads(out_dest.decode('utf-8'))
        if dest_resp.get("success"):
            print("DESTINATION ACCESS = yes")
        else:
            print("DESTINATION ACCESS = no", dest_resp)
    except:
        print("DESTINATION ACCESS = no")
        
    print("COPYMOVE = ready")

if __name__ == "__main__":
    main()
