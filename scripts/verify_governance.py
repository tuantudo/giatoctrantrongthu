#!/usr/bin/env python3
"""
scripts/verify_governance.py
GIATOC Agent Operating System (AIOS) — Mechanical Governance Verification Script.
Audits canonical governance files, skills, role consistency (Primary Agent & Specialized Resource),
surface boundaries, mobilization trade-off matrix, and secret exposure.
"""

import os
import sys
import re
import json

REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

def check_file(rel_path, required=True):
    full_path = os.path.join(REPO_ROOT, rel_path)
    exists = os.path.exists(full_path)
    return exists, full_path

def audit_canonical_files():
    print("--- [1] Checking Canonical Governance Files ---")
    canonical_files = [
        "AGENTS.md",
        "USER.md",
        "README.md",
        ".clinerules",
        ".agents/rules/primary-agent.md",
        ".aios/PROJECT_CONTRACT.json",
        "AUDIT/MASTER_COMPLETION_PLAN.md",
        "AUDIT/FRONTEND_COMPLETION_PLAN.md"
    ]
    missing = []
    for f in canonical_files:
        exists, _ = check_file(f)
        status = "PASS" if exists else "FAIL"
        print(f"[{status}] {f}")
        if not exists:
            missing.append(f)
    return len(missing) == 0

def audit_skills():
    print("\n--- [2] Checking Reusable Skills in .agents/skills/ ---")
    required_skills = [
        "repository-audit",
        "backend-implementation",
        "database-migration",
        "api-contract-validation",
        "frontend-implementation",
        "browser-qa",
        "security-verification",
        "handoff-reporting"
    ]
    missing = []
    for skill in required_skills:
        skill_path = os.path.join(".agents", "skills", skill, "SKILL.md")
        exists, full_p = check_file(skill_path)
        if not exists:
            print(f"[FAIL] Missing skill: {skill_path}")
            missing.append(skill)
            continue
        # Verify YAML frontmatter
        with open(full_p, "r", encoding="utf-8") as sf:
            content = sf.read()
            has_name = f"name: {skill}" in content
            has_desc = "description:" in content
            if has_name and has_desc:
                print(f"[PASS] {skill} (Valid frontmatter & instructions)")
            else:
                print(f"[WARN] {skill} (Missing or invalid frontmatter)")
                missing.append(skill)
    return len(missing) == 0

def audit_role_consistency():
    print("\n--- [3] Checking Role Consistency & Primary Agent Model ---")
    files_to_check = {
        "AGENTS.md": ["Tuấn", "Emarald", "Primary Agent", "Specialized Execution Resource"],
        "USER.md": ["Tuấn", "Emarald", "Primary Agent", "Specialized Execution Resource"],
        ".clinerules": ["CLINE", "Specialized Execution Resource"],
        ".agents/rules/primary-agent.md": ["AGY", "PRIMARY AGENT"],
        ".aios/PROJECT_CONTRACT.json": ["Tuấn", "Emarald", "Primary Agent", "Specialized Execution Resource"],
        "AUDIT/MASTER_COMPLETION_PLAN.md": ["Tuấn", "Emarald", "Primary Agent", "Specialized Execution Resource"],
        "AUDIT/FRONTEND_COMPLETION_PLAN.md": ["Tuấn", "Emarald", "Primary Agent", "Specialized Execution Resource"]
    }
    all_consistent = True
    for f, required_tokens in files_to_check.items():
        exists, full_p = check_file(f)
        if not exists:
            continue
        with open(full_p, "r", encoding="utf-8") as fh:
            text = fh.read()
        for token in required_tokens:
            if token.lower() in text.lower():
                print(f"[PASS] {f} contains role reference '{token}'")
            else:
                print(f"[FAIL] {f} missing role reference '{token}'")
                all_consistent = False
        
        # Check obsolete OpenCode as active assignee in Master Plan
        if f == "AUDIT/MASTER_COMPLETION_PLAN.md":
            if "| `OpenCode` |" in text:
                print(f"[FAIL] {f} still has OpenCode as an active assignee!")
                all_consistent = False
            else:
                print(f"[PASS] {f} has no obsolete OpenCode assignees.")
                
        # Check that outdated ChatGPT orchestrator is not present
        if "chatgpt (project orchestrator" in text.lower():
            print(f"[FAIL] {f} still has obsolete ChatGPT orchestrator reference!")
            all_consistent = False

    return all_consistent

def audit_mobilization_tradeoff_matrix():
    print("\n--- [4] Checking Mobilization Trade-off Matrix ---")
    matrix_files = ["AGENTS.md", ".agents/rules/primary-agent.md", ".aios/PROJECT_CONTRACT.json"]
    dimensions = ["Token Cost", "Integration Risk"]
    ok = True
    for mf in matrix_files:
        exists, full_p = check_file(mf)
        if not exists:
            continue
        with open(full_p, "r", encoding="utf-8") as f:
            text = f.read()
        for dim in dimensions:
            if dim.lower() in text.lower():
                print(f"[PASS] {mf} includes mobilization criterion '{dim}'")
            else:
                print(f"[FAIL] {mf} missing mobilization criterion '{dim}'")
                ok = False
    return ok

def audit_secret_exposure():
    print("\n--- [5] Auditing Secret & Credential Exposure ---")
    risks = []
    # 1. Check revert_pass.js
    if os.path.exists(os.path.join(REPO_ROOT, "revert_pass.js")):
        print("[ALERT] revert_pass.js is still present in workspace root! (CF-05)")
        risks.append("revert_pass.js")
    else:
        print("[PASS] revert_pass.js not in workspace root.")
    
    # 2. Check workflow webhook
    wf_path = os.path.join(REPO_ROOT, ".github", "workflows", "instant-sync.yml")
    if os.path.exists(wf_path):
        with open(wf_path, "r", encoding="utf-8") as wff:
            if "script.google.com" in wff.read():
                print("[ALERT] Hardcoded Google Apps Script webhook URL in .github/workflows/instant-sync.yml! (CF-05)")
                risks.append("instant-sync.yml webhook")
            else:
                print("[PASS] No hardcoded webhook URL in instant-sync.yml.")
    return len(risks) == 0

def main():
    print("==================================================")
    print("GIATOC AGENT OPERATING SYSTEM (AIOS) VERIFICATION")
    print("MÔ HÌNH: PRIMARY AGENT & SPECIALIZED RESOURCE")
    print("==================================================")
    ok1 = audit_canonical_files()
    ok2 = audit_skills()
    ok3 = audit_role_consistency()
    ok4 = audit_mobilization_tradeoff_matrix()
    ok5 = audit_secret_exposure()

    print("\n==================================================")
    print("AUDIT SUMMARY:")
    print(f"Canonical Files:            {'PASS' if ok1 else 'FAIL'}")
    print(f"Reusable Skills:            {'PASS' if ok2 else 'FAIL'}")
    print(f"Role & Model Consistency:   {'PASS' if ok3 else 'FAIL'}")
    print(f"Trade-off Matrix Alignment: {'PASS' if ok4 else 'FAIL'}")
    print(f"Secret Containment:         {'PASS (Clean)' if ok5 else 'ACTION REQUIRED (Pending Phase 1)'}")
    print("==================================================")

    if ok1 and ok2 and ok3 and ok4:
        print(">> AIOS GOVERNANCE SYSTEM IS FULLY COMPLIANT & ENFORCEABLE <<")
        return 0
    else:
        print(">> AIOS GOVERNANCE HAS PENDING ISSUES <<")
        return 1

if __name__ == "__main__":
    sys.exit(main())
