#!/usr/bin/env python3
"""배포 전 자동 점검.  python3 tools/check.py [차시ID ...]

- 빌드된 페이지의 JS 문법 (node --check)
- 화면(data-quiz)과 퀴즈(QUIZ) 번호 맞는지, 정답 위치 분포
- 메모 목록(MEMOLIST) 키가 화면의 data-memo / chips 키와 맞는지
- lesson.js 가 찾는 요소 id가 화면에 있는지
- 금지 표현: 차시 번호, 날짜, 사이트 주소 / 선택지의 극단어(항상·절대·모든)
- 질문폼 원본이 있는지
오류(✗)가 있으면 종료 코드 1.
"""
from __future__ import annotations

import json
import pathlib
import re
import subprocess
import sys
import tempfile

ROOT = pathlib.Path(__file__).resolve().parents[1]
rd = lambda p: pathlib.Path(p).read_text(encoding='utf-8')
FW_IDS = {'steps', 'score', 'prog', 'main', 'prev', 'next', 'pg', 'result', 'quizReset', 'msum', 'intro'}
errors, warns = [], []


def err(lid, msg): errors.append(f'✗ {lid}: {msg}')
def warn(lid, msg): warns.append(f'△ {lid}: {msg}')


def node_eval(js: str):
    r = subprocess.run(['node', '-e', js], capture_output=True, text=True)
    return r.returncode, r.stdout, r.stderr


def check_lesson(c, l):
    lid = l['id']
    d = ROOT / 'lessons' / lid
    screens = rd(d / 'screens.html')
    quiz = rd(d / 'quiz.js')
    ljs = rd(d / 'lesson.js')
    built = ROOT / 'site' / lid / 'index.html'
    if not built.exists():
        err(lid, '빌드된 페이지 없음 (tools/build.py 먼저)')
    else:
        page = rd(built)
        js = '\n'.join(re.findall(r'<script>(.*?)</script>', page, re.S))
        with tempfile.NamedTemporaryFile('w', suffix='.js', delete=False, encoding='utf-8') as f:
            f.write(js)
        r = subprocess.run(['node', '--check', f.name], capture_output=True, text=True)
        if r.returncode:
            err(lid, 'JS 문법 오류\n' + r.stderr[-600:])
        if 'localhost' in page:
            err(lid, '로컬 시험 주소(localhost)로 빌드됨 → DS_PEP 없이 다시 빌드')
    # 퀴즈
    code, out, e = node_eval(quiz + '\nconsole.log(JSON.stringify(QUIZ))')
    if code:
        err(lid, 'quiz.js 실행 오류 ' + e[-300:])
        return
    Q = json.loads(out)
    n_pages = len(re.findall(r'<section class="page"', screens))
    used = set(re.findall(r'data-quiz="(\d+)"', screens))
    for k in Q:
        if k not in used:
            err(lid, f'QUIZ[{k}] 가 있는데 화면에 data-quiz="{k}" 없음')
        if int(k) >= n_pages:
            err(lid, f'QUIZ[{k}] 화면 번호가 화면 수({n_pages})를 넘음')
    for k in used:
        if k not in Q:
            err(lid, f'data-quiz="{k}" 인데 QUIZ[{k}] 없음')
    pos = [0, 0, 0, 0, 0]
    for k, items in Q.items():
        for i, it in enumerate(items):
            if not (0 <= it['a'] < len(it['o'])):
                err(lid, f'QUIZ[{k}][{i}] 정답 번호가 선택지 밖')
                continue
            pos[it['a']] += 1
            for o in it['o']:
                if re.search(r'(?<![가-힣])(항상|절대|모든)', o):
                    warn(lid, f'QUIZ[{k}][{i}] 선택지 극단어: {o}')
            if re.search(r'(첫째|둘째|셋째|넷째|첫 번째|두 번째|세 번째|네 번째|앞의 두|앞의 둘|뒤의 두|마지막)(와|과)? ?(셋째 )?보기|앞의 둘|[①②③④]번 보기', it.get('w', '')):
                err(lid, f'QUIZ[{k}][{i}] 해설이 보기 위치를 가리킴(보기는 섞여 나옴): {it["w"][:40]}')
            if len(set(it['o'])) != len(it['o']):
                err(lid, f'QUIZ[{k}][{i}] 같은 선택지 중복')
    total = sum(pos)
    if total:
        spread = ' '.join(f'{"①②③④⑤"[i]}{n}' for i, n in enumerate(pos) if n or i < 3)
        print(f'  {lid}: 퀴즈 {total}문항, 정답 위치 {spread}')
        # 보기 순서는 화면에서 학생마다 섞이므로 위치 분포는 참고용
    # 메모
    memo_keys = set(re.findall(r'data-memo="([^"]+)"', screens)) | set(re.findall(r'MEMO\.(\w+)\s*=', ljs)) | set(re.findall(r"chips\('[^']+','([^']+)'", ljs)) | set(re.findall(r"vote\('[^']+','([^']+)'", ljs))
    m = re.search(r'const MEMOLIST=\[(.*?)\];', ljs, re.S)
    if m:
        for k in re.findall(r"\['([^']+)'", m.group(1)):
            if k not in memo_keys:
                err(lid, f'MEMOLIST 키 {k} 가 화면에 없음')
        listed = set(re.findall(r"\['([^']+)'", m.group(1)))
        for k in memo_keys - listed:
            warn(lid, f'메모 {k} 가 마무리 메모 모아 보기(MEMOLIST)에 없음')
    elif memo_keys:
        warn(lid, 'MEMOLIST 없음 (마무리 메모 모아 보기가 비어 보임)')
    # 요소 id
    ids = set(re.findall(r'id="([^"]+)"', screens)) | set(re.findall(r'id="([^"$]+)"', ljs)) | FW_IDS
    for x in sorted(set(re.findall(r"\$\('([A-Za-z0-9_-]+)'\)", ljs)) | set(re.findall(r"(?:sorter|flipCards|chips|vote)\('([A-Za-z0-9_-]+)'", ljs))):
        if x not in ids:
            err(lid, f'lesson.js 가 찾는 #{x} 가 화면에 없음')
    # 금지 표현 (화면에 보이는 글)
    text = re.sub(r'<[^>]+>', ' ', screens)
    for pat, what in [(r'\d+\s*차시', '차시 번호'), (r'\d{1,2}\s*월\s*\d{1,2}\s*일', '날짜'), (r'vercel\.app|https?://', '사이트 주소')]:
        for hit in re.findall(pat, text):
            err(lid, f'화면에 {what}: {hit}')
    if '{{FORM_URL}}' in screens and not l.get('form'):
        err(lid, '질문폼 버튼이 있는데 course.json 에 form 이 없음')


def main(argv):
    c = json.loads(rd(ROOT / 'course.json'))
    forms = {f['id'] for f in json.loads(rd(ROOT / 'forms' / 'forms.json'))['forms']}
    ids = []
    for u in c['units']:
        for l in u['lessons']:
            ids.append(l['id'])
            if argv and l['id'] not in argv:
                continue
            if (ROOT / 'lessons' / l['id'] / 'screens.html').exists():
                check_lesson(c, l)
                if l.get('form') and l['form'] not in forms:
                    err(l['id'], f"질문폼 {l['form']} 이 forms/forms.json 에 없음")
            elif l['status'] in ('ready', 'draft'):
                err(l['id'], f"status={l['status']} 인데 lessons/{l['id']}/ 없음")
    if len(ids) != len(set(ids)):
        err('course.json', '차시 ID 중복')
    for line in errors + warns:
        print(line)
    print(f'오류 {len(errors)} · 주의 {len(warns)}')
    sys.exit(1 if errors else 0)


if __name__ == '__main__':
    main(sys.argv[1:])
