import subprocess
import time
import yaml
import os

models = [
    {"provider": "nvidia", "model": "nvidia/nemotron-3-ultra-550b-a55b"},
    {"provider": "google", "model": "gemini-3.5-flash"},
    {"provider": "ollama", "model": "qwen3:30b"}
]

tasks = [
    {"name": "Simple Instruction", "prompt": "Respond with exactly one word: READY"},
    {"name": "File Read & Summarize", "prompt": "Read docs/architecture/DSH_SHADOWING_ENABLEMENT_001.md and print its first 2 main section titles. Do nothing else."},
    {"name": "Structured Output", "prompt": "Output a valid JSON object with keys 'worker_count' (int 3) and 'strategy' (string 'parallel'). Do not output any markdown or other text. Use raw JSON."}
]

results = {}

for m in models:
    m_name = m["model"]
    results[m_name] = {}
    patch_content = [{"id": "agent-default-model", "config": {"provider": m["provider"], "model": m["model"]}}]
    with open("temp_patch.yml", "w") as f:
        yaml.dump(patch_content, f)
    
    print(f"--- Testing {m_name} ---")
    for t in tasks:
        start_time = time.time()
        try:
            # We add timeout of 30s to avoid getting stuck
            process = subprocess.run(
                ["dsh", "--profile", "headless", "--patch", "temp_patch.yml", t["prompt"]],
                capture_output=True, text=True, timeout=30
            )
            elapsed = time.time() - start_time
            success = process.returncode == 0
            output = process.stdout.strip()
            err = process.stderr.strip()
        except subprocess.TimeoutExpired:
            elapsed = 30.0
            success = False
            output = "TIMEOUT"
            err = ""
        except Exception as e:
            elapsed = 0.0
            success = False
            output = str(e)
            err = ""

        print(f"Task: {t['name']} | Success: {success} | Time: {elapsed:.2f}s")
        if not success and err:
            print(f"Error: {err}")
            
        results[m_name][t["name"]] = {
            "time": elapsed,
            "success": success,
            "output": output
        }

# Clean up
if os.path.exists("temp_patch.yml"):
    os.remove("temp_patch.yml")

# Save results to a file for easy reading
import json
with open("benchmark_results.json", "w") as f:
    json.dump(results, f, indent=2)

print("Benchmark complete.")
