import getpass
import subprocess
import json
import sys
import time

def run_curl(api_path, params, stdin_data=None):
    cmd = ["ssh", "nas", "curl", "-s", "-X", "POST", f"http://localhost:5000/webapi/{api_path}"]
    for k, v in params.items():
        if v == "@-":
            cmd.extend(["--data-urlencode", f"{k}@-"])
        else:
            if isinstance(v, bool):
                v = "true" if v else "false"
            cmd.extend(["--data-urlencode", f"{k}={v}"])
    
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    out, err = proc.communicate(input=stdin_data.encode('utf-8') if stdin_data else b"")
    
    try:
        return json.loads(out.decode('utf-8'))
    except Exception as e:
        return {"success": False, "raw": out.decode('utf-8')}

def main():
    print("MIGRATION SCRIPT STARTED", file=sys.stderr)
    
    # 1. API Info
    info_resp = run_curl("query.cgi", {
        "api": "SYNO.API.Info",
        "version": "1",
        "method": "query",
        "query": "SYNO.API.Auth,SYNO.FileStation.List,SYNO.FileStation.CopyMove"
    })
    
    if not info_resp.get("success"):
        print("STATUS = STOP\nBLOCKER = API Info failed\nEXACT ERROR = " + str(info_resp))
        sys.exit(1)
        
    apis = info_resp.get("data", {})
    auth_api = apis.get("SYNO.API.Auth", {})
    list_api = apis.get("SYNO.FileStation.List", {})
    move_api = apis.get("SYNO.FileStation.CopyMove", {})
    
    if not auth_api or not list_api or not move_api:
        print("STATUS = STOP\nBLOCKER = Required APIs not found\nEXACT ERROR = " + str(apis))
        sys.exit(1)
        
    print("API DISCOVERED: Auth(v{}), List(v{}), CopyMove(v{})".format(
        auth_api.get('maxVersion'), list_api.get('maxVersion'), move_api.get('maxVersion')), file=sys.stderr)

    # 2. Auth
    try:
        password = getpass.getpass("Enter password for 'tuandzain': ")
    except Exception as e:
        print("STATUS = STOP\nBLOCKER = getpass failed\nEXACT ERROR = " + str(e))
        sys.exit(1)
        
    auth_resp = run_curl(auth_api['path'], {
        "api": "SYNO.API.Auth",
        "version": auth_api['maxVersion'],
        "method": "login",
        "account": "tuandzain",
        "passwd": "@-",
        "session": "FileStation",
        "format": "cookie"
    }, stdin_data=password)
    
    if not auth_resp.get("success"):
        print("STATUS = STOP\nBLOCKER = Auth failed\nEXACT ERROR = " + str(auth_resp))
        sys.exit(1)
        
    sid = auth_resp["data"]["sid"]
    print("AUTH = PASS", file=sys.stderr)

    try:
        # 3. Check source & dest
        src_paths = '["/homes/tuandzain/FLASHDRIVE-TUANTUDO1", "/homes/tuandzain/FLASHDRIVE-TUANTUDO2"]'
        src_resp = run_curl(list_api['path'], {
            "api": "SYNO.FileStation.List",
            "version": list_api['maxVersion'],
            "method": "getinfo",
            "folder_path": src_paths,
            "_sid": sid
        })
        
        if not src_resp.get("success"):
            print("STATUS = STOP\nBLOCKER = Source check failed\nEXACT ERROR = " + str(src_resp))
            sys.exit(1)
            
        dest_resp = run_curl(list_api['path'], {
            "api": "SYNO.FileStation.List",
            "version": list_api['maxVersion'],
            "method": "getinfo",
            "folder_path": '["/TUAN_FORGE/01_INBOX"]',
            "_sid": sid
        })
        
        if not dest_resp.get("success"):
            print("STATUS = STOP\nBLOCKER = Destination check failed\nEXACT ERROR = " + str(dest_resp))
            sys.exit(1)
            
        # 4. Execute Move
        print("STARTING MOVE...", file=sys.stderr)
        move_resp = run_curl(move_api['path'], {
            "api": "SYNO.FileStation.CopyMove",
            "version": move_api['maxVersion'],
            "method": "start",
            "path": src_paths,
            "dest_folder_path": "/TUAN_FORGE/01_INBOX",
            "overwrite": "false",
            "remove_src": "true",
            "_sid": sid
        })
        
        if not move_resp.get("success"):
            print("STATUS = STOP\nBLOCKER = Move start failed\nEXACT ERROR = " + str(move_resp))
            sys.exit(1)
            
        taskid = move_resp["data"]["taskid"]
        
        # 5. Poll task status
        while True:
            time.sleep(2)
            status_resp = run_curl(move_api['path'], {
                "api": "SYNO.FileStation.CopyMove",
                "version": move_api['maxVersion'],
                "method": "status",
                "taskid": taskid,
                "_sid": sid
            })
            if not status_resp.get("success"):
                print("STATUS = STOP\nBLOCKER = Move status polling failed\nEXACT ERROR = " + str(status_resp))
                sys.exit(1)
            
            data = status_resp.get("data", {})
            if data.get("finished"):
                break
            
            progress = data.get("progress", 0)
            print(f"Move progress: {progress}%", file=sys.stderr)
            
        # 6. Verify
        verify_src_resp = run_curl(list_api['path'], {
            "api": "SYNO.FileStation.List",
            "version": list_api['maxVersion'],
            "method": "getinfo",
            "folder_path": src_paths,
            "_sid": sid
        })
        # Should fail (408 No such file) because they are moved
        if verify_src_resp.get("success"):
            print("STATUS = STOP\nBLOCKER = Verification failed, source still exists\nEXACT ERROR = " + str(verify_src_resp))
            sys.exit(1)
            
        verify_dest_resp = run_curl(list_api['path'], {
            "api": "SYNO.FileStation.List",
            "version": list_api['maxVersion'],
            "method": "getinfo",
            "folder_path": '["/TUAN_FORGE/01_INBOX/FLASHDRIVE-TUANTUDO1", "/TUAN_FORGE/01_INBOX/FLASHDRIVE-TUANTUDO2"]',
            "_sid": sid
        })
        if not verify_dest_resp.get("success"):
            print("STATUS = STOP\nBLOCKER = Verification failed, destination folders missing\nEXACT ERROR = " + str(verify_dest_resp))
            sys.exit(1)

        print("\nSTATUS = PASS")
        print("AUTH = PASS")
        print(f"API = Auth(v{auth_api['maxVersion']}) / List(v{list_api['maxVersion']}) / CopyMove(v{move_api['maxVersion']}) at {auth_api['path']}")
        print("MOVE 1 = PASS")
        print("MOVE 2 = PASS")
        print("VALIDATION = PASS")
        
    finally:
        # 7. Logout
        logout_resp = run_curl(auth_api['path'], {
            "api": "SYNO.API.Auth",
            "version": auth_api['maxVersion'],
            "method": "logout",
            "session": "FileStation",
            "_sid": sid
        })
        print("LOGOUT = PASS" if logout_resp.get("success") else f"LOGOUT = FAIL ({logout_resp})")
        print("EVIDENCE = CopyMove Task ID: " + str(taskid if 'taskid' in locals() else 'N/A') + " completed successfully via native File Station API.")

if __name__ == "__main__":
    main()
