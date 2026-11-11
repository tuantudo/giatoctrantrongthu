import getpass
import subprocess
import json
import sys

def run_nas_curl(endpoint, params, stdin_data=None):
    cmd = ["ssh", "nas", "curl", "-s", "-X", "POST", f"http://localhost:5000/webapi/{endpoint}"]
    for k, v in params.items():
        if v == "@-":
            cmd.extend(["--data-urlencode", f"{k}@-"])
        else:
            cmd.extend(["--data-urlencode", f"{k}={v}"])
    
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    out, err = proc.communicate(input=stdin_data.encode('utf-8') if stdin_data else b"")
    
    try:
        return json.loads(out.decode('utf-8'))
    except Exception as e:
        return {"success": False, "raw": out.decode('utf-8')}

def main():
    print("Dùng ACCOUNT DSM HIỆN TẠI của Human Authority (tuandzain).", file=sys.stderr)
    try:
        password = getpass.getpass("Please enter DSM password for 'tuandzain': ")
    except Exception as e:
        print(f"Failed to use getpass: {e}")
        sys.exit(1)
        
    auth_params = {
        "api": "SYNO.API.Auth",
        "version": "3",
        "method": "login",
        "account": "tuandzain",
        "passwd": "@-",
        "session": "FileStation",
        "format": "cookie"
    }
    
    auth_resp = run_nas_curl("auth.cgi", auth_params, stdin_data=password)
    
    if not auth_resp.get("success"):
        print("AUTH = FAIL")
        print(f"Details: {auth_resp}")
        sys.exit(1)
        
    sid = auth_resp.get("data", {}).get("sid")
    print("AUTH = SUCCESS")
    
    # SOURCE 1
    src1_params = {"api": "SYNO.FileStation.List", "version": "2", "method": "getinfo", "folder_path": '["/homes/tuandzain/FLASHDRIVE-TUANTUDO1"]', "_sid": sid}
    src1_resp = run_nas_curl("entry.cgi", src1_params)
    src1_ok = src1_resp.get("success", False)
    print("SOURCE 1 = " + ("ACCESSIBLE" if src1_ok else "NOT ACCESSIBLE"))
    
    # SOURCE 2
    src2_params = {"api": "SYNO.FileStation.List", "version": "2", "method": "getinfo", "folder_path": '["/homes/tuandzain/FLASHDRIVE-TUANTUDO2"]', "_sid": sid}
    src2_resp = run_nas_curl("entry.cgi", src2_params)
    src2_ok = src2_resp.get("success", False)
    print("SOURCE 2 = " + ("ACCESSIBLE" if src2_ok else "NOT ACCESSIBLE"))
    
    # DESTINATION
    dest_params = {"api": "SYNO.FileStation.List", "version": "2", "method": "getinfo", "folder_path": '["/TUAN_FORGE/01_INBOX"]', "_sid": sid}
    dest_resp = run_nas_curl("entry.cgi", dest_params)
    dest_ok = dest_resp.get("success", False)
    print("DESTINATION = " + ("ACCESSIBLE" if dest_ok else "NOT ACCESSIBLE"))
    
    # COPYMOVE READY
    if src1_ok and src2_ok and dest_ok:
        print("COPYMOVE = READY")
    else:
        print("COPYMOVE = NOT READY")

if __name__ == "__main__":
    main()
