INSERT INTO monsters (id, name, type, characteristics, base_level, next_evolution_monster_id, evolution_required_level, image_url) VALUES 
(1, '뿌공이', 'Water', '귀여운 부경대 마스코트', 1, 2, 3, 'https://webket-monster-monster-assets.s3.ap-southeast-2.amazonaws.com/1.png') ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, name = EXCLUDED.name;

INSERT INTO monsters (id, name, type, characteristics, base_level, next_evolution_monster_id, evolution_required_level, image_url) VALUES 
(2, '백경이', 'Water', '부경대 대표 마스코트', 3, 3, 5, 'https://webket-monster-monster-assets.s3.ap-southeast-2.amazonaws.com/2.png') ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, name = EXCLUDED.name;

INSERT INTO monsters (id, name, type, characteristics, base_level, next_evolution_monster_id, evolution_required_level, image_url) VALUES 
(3, '백경이와 뿌공이', 'Water', '완전체 마스코트', 5, NULL, NULL, 'https://webket-monster-monster-assets.s3.ap-southeast-2.amazonaws.com/3.png') ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, name = EXCLUDED.name;

INSERT INTO monsters (id, name, type, characteristics, base_level, next_evolution_monster_id, evolution_required_level, image_url) VALUES 
(4, '구글링', 'Google', '정보의 바다를 헤엄치는 귀여운 탐색가', 1, 5, 3, 'https://webket-monster-monster-assets.s3.ap-southeast-2.amazonaws.com/4.png') ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, name = EXCLUDED.name;

INSERT INTO monsters (id, name, type, characteristics, base_level, next_evolution_monster_id, evolution_required_level, image_url) VALUES 
(5, '구글봇', 'Google', '웹을 기어다니며 지식을 수집하는 로봇', 3, 6, 5, 'https://webket-monster-monster-assets.s3.ap-southeast-2.amazonaws.com/5.png') ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, name = EXCLUDED.name;

INSERT INTO monsters (id, name, type, characteristics, base_level, next_evolution_monster_id, evolution_required_level, image_url) VALUES 
(6, '구글신', 'Google', '세상의 모든 정보를 알고 있는 전지전능한 존재', 5, NULL, NULL, 'https://webket-monster-monster-assets.s3.ap-southeast-2.amazonaws.com/6.png') ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, name = EXCLUDED.name;

INSERT INTO monsters (id, name, type, characteristics, base_level, next_evolution_monster_id, evolution_required_level, image_url) VALUES 
(7, '초록창', 'Naver', '매일 아침 뉴스를 배달해주는 초록색 새싹', 1, 8, 3, 'https://webket-monster-monster-assets.s3.ap-southeast-2.amazonaws.com/7.png') ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, name = EXCLUDED.name;

INSERT INTO monsters (id, name, type, characteristics, base_level, next_evolution_monster_id, evolution_required_level, image_url) VALUES 
(8, '라인이', 'Naver', '친구들과의 대화를 즐거워하는 친근한 마스코트', 3, 9, 5, 'https://webket-monster-monster-assets.s3.ap-southeast-2.amazonaws.com/8.png') ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, name = EXCLUDED.name;

INSERT INTO monsters (id, name, type, characteristics, base_level, next_evolution_monster_id, evolution_required_level, image_url) VALUES 
(9, '하이퍼클로바', 'Naver', '어마어마한 언어 능력을 지닌 지혜로운 거인', 5, NULL, NULL, 'https://webket-monster-monster-assets.s3.ap-southeast-2.amazonaws.com/9.png') ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, name = EXCLUDED.name;

INSERT INTO monsters (id, name, type, characteristics, base_level, next_evolution_monster_id, evolution_required_level, image_url) VALUES 
(10, '조회수', 'YouTube', '조회수 1회를 소중히 여기는 꼬마 재생 버튼', 1, 11, 3, 'https://webket-monster-monster-assets.s3.ap-southeast-2.amazonaws.com/10.png') ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, name = EXCLUDED.name;

INSERT INTO monsters (id, name, type, characteristics, base_level, next_evolution_monster_id, evolution_required_level, image_url) VALUES 
(11, '크리에이터', 'YouTube', '밤낮으로 독창적인 콘텐츠를 만들어내는 방송인', 3, 12, 5, 'https://webket-monster-monster-assets.s3.ap-southeast-2.amazonaws.com/11.png') ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, name = EXCLUDED.name;

INSERT INTO monsters (id, name, type, characteristics, base_level, next_evolution_monster_id, evolution_required_level, image_url) VALUES 
(12, '골드버튼', 'YouTube', '구독자 100만 명을 달성한 빛나는 골드버튼', 5, NULL, NULL, 'https://webket-monster-monster-assets.s3.ap-southeast-2.amazonaws.com/12.png') ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, name = EXCLUDED.name;

INSERT INTO monsters (id, name, type, characteristics, base_level, next_evolution_monster_id, evolution_required_level, image_url) VALUES 
(13, '커밋', 'GitHub', '작은 소스코드를 수줍게 올리는 귀여운 깃린이', 1, 14, 3, 'https://webket-monster-monster-assets.s3.ap-southeast-2.amazonaws.com/13.png') ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, name = EXCLUDED.name;

INSERT INTO monsters (id, name, type, characteristics, base_level, next_evolution_monster_id, evolution_required_level, image_url) VALUES 
(14, '옥토캣', 'GitHub', '세상의 모든 소스코드를 사랑하는 고양이와 문어의 합성수', 3, 15, 5, 'https://webket-monster-monster-assets.s3.ap-southeast-2.amazonaws.com/14.png') ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, name = EXCLUDED.name;

INSERT INTO monsters (id, name, type, characteristics, base_level, next_evolution_monster_id, evolution_required_level, image_url) VALUES 
(15, '잔디밭', 'GitHub', '매일 커밋하여 초록색 잔디를 가득 채운 오픈소스 거장', 5, NULL, NULL, 'https://webket-monster-monster-assets.s3.ap-southeast-2.amazonaws.com/15.png') ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, name = EXCLUDED.name;

INSERT INTO monsters (id, name, type, characteristics, base_level, next_evolution_monster_id, evolution_required_level, image_url) VALUES 
(16, '일촌신청', 'LinkedIn', '서로의 전문 분야를 공유하기 위해 다가오는 인맥 요정', 1, 17, 3, 'https://webket-monster-monster-assets.s3.ap-southeast-2.amazonaws.com/16.png') ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, name = EXCLUDED.name;

INSERT INTO monsters (id, name, type, characteristics, base_level, next_evolution_monster_id, evolution_required_level, image_url) VALUES 
(17, '프로직장러', 'LinkedIn', '뛰어난 네트워킹 능력과 커리어를 갖춘 프로직장러', 3, 18, 5, 'https://webket-monster-monster-assets.s3.ap-southeast-2.amazonaws.com/17.png') ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, name = EXCLUDED.name;

INSERT INTO monsters (id, name, type, characteristics, base_level, next_evolution_monster_id, evolution_required_level, image_url) VALUES 
(18, '커리어킹', 'LinkedIn', '업계 전체의 채용 정보를 쥐고 흔드는 최고의 비즈니스 리더', 5, NULL, NULL, 'https://webket-monster-monster-assets.s3.ap-southeast-2.amazonaws.com/18.png') ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, name = EXCLUDED.name;

INSERT INTO monsters (id, name, type, characteristics, base_level, next_evolution_monster_id, evolution_required_level, image_url) VALUES 
(19, '작은나무', 'Namuwiki', '지식이 조금 부족하지만 무럭무럭 자라는 아기 나무', 1, 20, 3, 'https://webket-monster-monster-assets.s3.ap-southeast-2.amazonaws.com/19.png') ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, name = EXCLUDED.name;

INSERT INTO monsters (id, name, type, characteristics, base_level, next_evolution_monster_id, evolution_required_level, image_url) VALUES 
(20, '기여분', 'Namuwiki', '문서 수정을 아끼지 않고 기여하는 부지런한 편집 요정', 3, 21, 5, 'https://webket-monster-monster-assets.s3.ap-southeast-2.amazonaws.com/20.png') ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, name = EXCLUDED.name;

INSERT INTO monsters (id, name, type, characteristics, base_level, next_evolution_monster_id, evolution_required_level, image_url) VALUES 
(21, '나무위키', 'Namuwiki', '세상의 온갖 정보와 지식이 수록된 방대한 나무 백과사전', 5, NULL, NULL, 'https://webket-monster-monster-assets.s3.ap-southeast-2.amazonaws.com/21.png') ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, name = EXCLUDED.name;

INSERT INTO monsters (id, name, type, characteristics, base_level, next_evolution_monster_id, evolution_required_level, image_url) VALUES 
(22, '프롬프트', 'ChatGPT', '주문에 따라 다양한 답변을 준비하는 마법의 프롬프트 요정', 1, 23, 3, 'https://webket-monster-monster-assets.s3.ap-southeast-2.amazonaws.com/22.png') ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, name = EXCLUDED.name;

INSERT INTO monsters (id, name, type, characteristics, base_level, next_evolution_monster_id, evolution_required_level, image_url) VALUES 
(23, 'GPT-4', 'ChatGPT', '인류의 수많은 지적인 작업을 보조할 수 있는 똑똑한 인공지능', 3, 24, 5, 'https://webket-monster-monster-assets.s3.ap-southeast-2.amazonaws.com/23.png') ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, name = EXCLUDED.name;

INSERT INTO monsters (id, name, type, characteristics, base_level, next_evolution_monster_id, evolution_required_level, image_url) VALUES 
(24, '초지능', 'ChatGPT', '인간의 지능을 아득히 초월한 무한한 가능성의 미래 인공지능', 5, NULL, NULL, 'https://webket-monster-monster-assets.s3.ap-southeast-2.amazonaws.com/24.png') ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, name = EXCLUDED.name;

-- 사용자는 AuthService.registerAnonymous()를 통해 동적으로 생성됩니다.
-- users sequence를 현재 최대 id와 동기화하여 충돌 방지 (이미 데이터가 있는 경우)
SELECT setval('users_id_seq', GREATEST(1, (SELECT COALESCE(MAX(id), 0) FROM users)));

INSERT INTO quests (id, title, description, type, category, target_count, reward_exp_potions, reward_evolution_stones) VALUES 
('feed_10', '꼬꼬마 맘마 주기', '활성화된 몬스터에게 먹이를 총 10번 이상 주입하세요.', 'daily', 'count', 10, 1, 2),
('feed_100', '위대한 트레이너', '활성화된 몬스터에게 먹이를 총 100번 이상 주입하세요.', 'achievement', 'count', 100, 5, 5),
('visit_all_8', '진정한 정보 탐험가', '몬스터가 스폰되는 8가지 테마 사이트를 모두 1회씩 방문하세요.', 'daily', 'visit', 8, 0, 1),
('visit_ai_5', '인공지능 연구가', 'ChatGPT, Grok, Claude, Gemini, Perplexity 사이트를 모두 1회씩 방문하세요.', 'daily', 'visit', 5, 0, 3),
('visit_gemini_yt_google_10', '기술의 지배자', 'Gemini, YouTube, Google 사이트를 각각 10회 이상 방문하세요.', 'daily', 'visit', 3, 0, 3),
('obtain_naver_namuwiki', '한국형 정보 연맹', '네이버몬과 나무위키몬을 모두 최소 1회 이상 획득하세요.', 'achievement', 'catch', 1, 0, 1),
('obtain_all_monsters', '도감 마스터', '총 8개 종류의 마스코트 몬스터를 종류별로 최소 1회 이상 포획하세요.', 'achievement', 'catch', 8, 0, 2),
('obtain_pknu_final', '백경이와 뿌공이의 친구', '부경대 몬스터의 최종 진화형(백경이와 뿌공이)을 획득하세요.', 'achievement', 'catch', 1, 0, 1)
ON CONFLICT (id) DO UPDATE SET 
  type = EXCLUDED.type, 
  title = EXCLUDED.title, 
  description = EXCLUDED.description, 
  target_count = EXCLUDED.target_count, 
  reward_exp_potions = EXCLUDED.reward_exp_potions, 
  reward_evolution_stones = EXCLUDED.reward_evolution_stones;
