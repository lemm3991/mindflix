import os
import json
import subprocess
import sys

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
CATALOG_PATH = os.path.join(BASE_DIR, "src", "data", "catalog.json")
OUTPUT_DURATIONS_PATH = os.path.join(BASE_DIR, "src", "data", "video_durations.json")

SEARCH_ROOTS = [
    "G:/Meu Drive/Cursos/Cursos Mindflix",
    "G:/Meu Drive/Cursos",
    "G:/Meu Drive",
    BASE_DIR,
    os.path.abspath(os.path.join(BASE_DIR, ".."))
]

def format_duration(seconds):
    secs = int(round(seconds))
    hrs = secs // 3600
    mins = (secs % 3600) // 60
    s = secs % 60
    if hrs > 0:
        return f"{hrs:02d}:{mins:02d}:{s:02d}"
    return f"{mins:02d}:{s:02d}"

def probe_file_duration(full_path):
    if not os.path.isfile(full_path):
        return None
    try:
        cmd = [
            "ffprobe", "-v", "error", "-show_entries",
            "format=duration", "-of", "default=noprint_wrappers=1:nokey=1",
            full_path
        ]
        res = subprocess.run(cmd, capture_output=True, text=True, timeout=5)
        if res.returncode == 0 and res.stdout.strip():
            val = float(res.stdout.strip())
            if val > 0:
                return int(round(val))
    except Exception:
        pass
    return None

def main():
    print("Loading catalog.json...", flush=True)
    if not os.path.exists(CATALOG_PATH):
        print("catalog.json not found!", flush=True)
        return

    with open(CATALOG_PATH, "r", encoding="utf-8") as f:
        catalog_data = json.load(f)

    # Load existing video_durations.json if available
    durations_map = {}
    if os.path.exists(OUTPUT_DURATIONS_PATH):
        try:
            with open(OUTPUT_DURATIONS_PATH, "r", encoding="utf-8") as f:
                durations_map = json.load(f)
        except Exception:
            durations_map = {}

    probed_count = 0
    updated_lessons = 0

    courses = catalog_data.get("courses", [])
    print(f"Scanning {len(courses)} courses...", flush=True)

    for c_idx, course in enumerate(courses, 1):
        for module in course.get("modules", []):
            for lesson in module.get("lessons", []):
                lesson_id = lesson.get("id")
                rel_path = lesson.get("relative_path", "")
                raw_title = lesson.get("raw_title", "")
                display_title = lesson.get("display_title", "")

                # Check if already probed in durations_map
                if lesson_id and lesson_id in durations_map:
                    dur_info = durations_map[lesson_id]
                    lesson["duration_seconds"] = dur_info["duration_seconds"]
                    lesson["duration_formatted"] = dur_info["duration_formatted"]
                    continue

                dur_secs = None
                if rel_path and not rel_path.startswith("drive:"):
                    for root_dir in SEARCH_ROOTS:
                        cand = os.path.normpath(os.path.join(root_dir, rel_path))
                        if os.path.isfile(cand):
                            dur_secs = probe_file_duration(cand)
                            if dur_secs:
                                break

                if dur_secs:
                    dur_fmt = format_duration(dur_secs)
                    lesson["duration_seconds"] = dur_secs
                    lesson["duration_formatted"] = dur_fmt

                    dur_info = {
                        "duration_seconds": dur_secs,
                        "duration_formatted": dur_fmt
                    }
                    if lesson_id:
                        durations_map[lesson_id] = dur_info
                    if rel_path:
                        durations_map[rel_path] = dur_info
                    if raw_title:
                        durations_map[raw_title] = dur_info
                    if display_title:
                        durations_map[display_title] = dur_info

                    probed_count += 1
                    updated_lessons += 1

        # Recalculate totals
        c_secs = sum(l.get("duration_seconds", 0) for m in course.get("modules", []) for l in m.get("lessons", []))
        c_hrs = c_secs // 3600
        c_mins = (c_secs % 3600) // 60
        course["total_duration_seconds"] = c_secs
        course["total_duration_formatted"] = f"{c_hrs}h {c_mins:02d}m" if c_hrs > 0 else f"{c_mins} min"

        # Save progress periodically every 10 courses
        if c_idx % 10 == 0:
            with open(CATALOG_PATH, "w", encoding="utf-8") as f:
                json.dump(catalog_data, f, ensure_ascii=False, indent=2)
            with open(OUTPUT_DURATIONS_PATH, "w", encoding="utf-8") as f:
                json.dump(durations_map, f, ensure_ascii=False, indent=2)
            print(f"Processed {c_idx}/{len(courses)} courses (Probed {probed_count} new video durations)...", flush=True)

    # Final save
    with open(CATALOG_PATH, "w", encoding="utf-8") as f:
        json.dump(catalog_data, f, ensure_ascii=False, indent=2)
    with open(OUTPUT_DURATIONS_PATH, "w", encoding="utf-8") as f:
        json.dump(durations_map, f, ensure_ascii=False, indent=2)

    print(f"DONE! Probed {probed_count} new durations. Total durations map size: {len(durations_map)}", flush=True)

if __name__ == "__main__":
    main()
