import os
import json

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
CATALOG_PATH = os.path.join(BASE_DIR, "src", "data", "catalog.json")
OUTPUT_DURATIONS_PATH = os.path.join(BASE_DIR, "src", "data", "video_durations.json")

def format_duration(seconds):
    secs = int(round(seconds))
    hrs = secs // 3600
    mins = (secs % 3600) // 60
    s = secs % 60
    if hrs > 0:
        return f"{hrs:02d}:{mins:02d}:{s:02d}"
    return f"{mins:02d}:{s:02d}"

def main():
    if not os.path.exists(CATALOG_PATH):
        print(f"Catalog not found at {CATALOG_PATH}")
        return

    with open(CATALOG_PATH, "r", encoding="utf-8") as f:
        catalog_data = json.load(f)

    durations_map = {}
    total_lessons = 0
    with_duration = 0

    courses = catalog_data.get("courses", [])

    for course in courses:
        for module in course.get("modules", []):
            for lesson in module.get("lessons", []):
                total_lessons += 1
                lesson_id = lesson.get("id")
                rel_path = lesson.get("relative_path", "")
                raw_title = lesson.get("raw_title", "")
                display_title = lesson.get("display_title", "")
                drive_file_id = lesson.get("drive_file_id", "")

                dur_secs = lesson.get("duration_seconds")
                dur_fmt = lesson.get("duration_formatted")

                if dur_secs and dur_secs > 0:
                    if not dur_fmt or dur_fmt == "03:00":
                        dur_fmt = format_duration(dur_secs)

                    with_duration += 1
                    info = {
                        "duration_seconds": dur_secs,
                        "duration_formatted": dur_fmt
                    }

                    if lesson_id:
                        durations_map[lesson_id] = info
                    if rel_path:
                        durations_map[rel_path] = info
                    if drive_file_id:
                        durations_map[drive_file_id] = info
                    if raw_title:
                        durations_map[raw_title] = info
                    if display_title:
                        durations_map[display_title] = info

    print(f"Total lessons scanned: {total_lessons}")
    print(f"Lessons with duration: {with_duration}")
    print(f"Total keys created in video_durations.json: {len(durations_map)}")

    os.makedirs(os.path.dirname(OUTPUT_DURATIONS_PATH), exist_ok=True)
    with open(OUTPUT_DURATIONS_PATH, "w", encoding="utf-8") as f:
        json.dump(durations_map, f, ensure_ascii=False, indent=2)

    print(f"Successfully generated {OUTPUT_DURATIONS_PATH}")

if __name__ == "__main__":
    main()
